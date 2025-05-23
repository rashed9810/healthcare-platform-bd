"""
Database configuration and connection management
"""

from sqlalchemy import create_engine, MetaData
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
from motor.motor_asyncio import AsyncIOMotorClient
import redis.asyncio as redis
from typing import Optional
import logging

from .config import settings

logger = logging.getLogger(__name__)

# SQLAlchemy setup (for relational data)
engine = create_engine(
    settings.DATABASE_URL,
    connect_args={"check_same_thread": False} if "sqlite" in settings.DATABASE_URL else {}
)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()

# MongoDB setup (for document data)
mongodb_client: Optional[AsyncIOMotorClient] = None
mongodb_db = None

# Redis setup (for caching)
redis_client: Optional[redis.Redis] = None

async def init_db():
    """Initialize all database connections"""
    global mongodb_client, mongodb_db, redis_client
    
    try:
        # Initialize MongoDB
        mongodb_client = AsyncIOMotorClient(settings.MONGODB_URL)
        mongodb_db = mongodb_client[settings.MONGODB_DB_NAME]
        
        # Test MongoDB connection
        await mongodb_client.admin.command('ping')
        logger.info("✅ MongoDB connected successfully")
        
        # Initialize collections
        await init_mongodb_collections()
        
    except Exception as e:
        logger.warning(f"⚠️ MongoDB connection failed: {e}")
        logger.info("📝 Using SQLite as fallback database")
    
    try:
        # Initialize Redis
        redis_client = redis.from_url(settings.REDIS_URL)
        await redis_client.ping()
        logger.info("✅ Redis connected successfully")
        
    except Exception as e:
        logger.warning(f"⚠️ Redis connection failed: {e}")
        logger.info("📝 Caching disabled")
    
    # Create SQLAlchemy tables
    Base.metadata.create_all(bind=engine)
    logger.info("✅ SQLAlchemy tables created")

async def close_db():
    """Close all database connections"""
    global mongodb_client, redis_client
    
    if mongodb_client:
        mongodb_client.close()
        logger.info("✅ MongoDB connection closed")
    
    if redis_client:
        await redis_client.close()
        logger.info("✅ Redis connection closed")

async def init_mongodb_collections():
    """Initialize MongoDB collections with indexes"""
    if not mongodb_db:
        return
    
    try:
        # Users collection
        await mongodb_db.users.create_index("email", unique=True)
        await mongodb_db.users.create_index("phone", unique=True)
        
        # Doctors collection
        await mongodb_db.doctors.create_index("email", unique=True)
        await mongodb_db.doctors.create_index("specialty")
        await mongodb_db.doctors.create_index("location.coordinates", "2dsphere")
        
        # Appointments collection
        await mongodb_db.appointments.create_index([("doctorId", 1), ("date", 1), ("time", 1)])
        await mongodb_db.appointments.create_index("patientId")
        await mongodb_db.appointments.create_index("status")
        
        # Medical records collection
        await mongodb_db.medical_records.create_index("patientId")
        await mongodb_db.medical_records.create_index("createdAt")
        
        # Symptoms collection
        await mongodb_db.symptoms.create_index("patientId")
        await mongodb_db.symptoms.create_index("symptoms")
        await mongodb_db.symptoms.create_index("createdAt")
        
        # Prescriptions collection
        await mongodb_db.prescriptions.create_index("patientId")
        await mongodb_db.prescriptions.create_index("doctorId")
        await mongodb_db.prescriptions.create_index("createdAt")
        
        # Analytics collection
        await mongodb_db.analytics.create_index("eventType")
        await mongodb_db.analytics.create_index("timestamp")
        await mongodb_db.analytics.create_index("userId")
        
        logger.info("✅ MongoDB indexes created successfully")
        
    except Exception as e:
        logger.error(f"❌ Error creating MongoDB indexes: {e}")

# Dependency to get database session
def get_db():
    """Get SQLAlchemy database session"""
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

async def get_mongodb():
    """Get MongoDB database instance"""
    return mongodb_db

async def get_redis():
    """Get Redis client instance"""
    return redis_client

# Database utilities
class DatabaseManager:
    """Database management utilities"""
    
    @staticmethod
    async def health_check():
        """Check health of all database connections"""
        health_status = {
            "sqlite": False,
            "mongodb": False,
            "redis": False
        }
        
        # Check SQLite
        try:
            db = SessionLocal()
            db.execute("SELECT 1")
            db.close()
            health_status["sqlite"] = True
        except Exception as e:
            logger.error(f"SQLite health check failed: {e}")
        
        # Check MongoDB
        if mongodb_client:
            try:
                await mongodb_client.admin.command('ping')
                health_status["mongodb"] = True
            except Exception as e:
                logger.error(f"MongoDB health check failed: {e}")
        
        # Check Redis
        if redis_client:
            try:
                await redis_client.ping()
                health_status["redis"] = True
            except Exception as e:
                logger.error(f"Redis health check failed: {e}")
        
        return health_status
    
    @staticmethod
    async def get_stats():
        """Get database statistics"""
        stats = {}
        
        if mongodb_db:
            try:
                # Get collection stats
                collections = await mongodb_db.list_collection_names()
                for collection_name in collections:
                    collection = mongodb_db[collection_name]
                    count = await collection.count_documents({})
                    stats[collection_name] = count
                    
            except Exception as e:
                logger.error(f"Error getting MongoDB stats: {e}")
        
        return stats

# Export database instances
__all__ = [
    "engine",
    "SessionLocal", 
    "Base",
    "mongodb_client",
    "mongodb_db",
    "redis_client",
    "init_db",
    "close_db",
    "get_db",
    "get_mongodb",
    "get_redis",
    "DatabaseManager"
]
