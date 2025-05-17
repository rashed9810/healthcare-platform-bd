import re
import string
import logging
import nltk
from nltk.corpus import stopwords
from nltk.tokenize import word_tokenize
from nltk.stem import PorterStemmer

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

class TextProcessor:
    def __init__(self):
        """Initialize the text processor."""
        # Download NLTK resources if not already downloaded
        try:
            nltk.data.find('tokenizers/punkt')
            nltk.data.find('corpora/stopwords')
        except LookupError:
            nltk.download('punkt')
            nltk.download('stopwords')
        
        self.stemmer = PorterStemmer()
        self.stop_words = set(stopwords.words('english'))
        
        # Add medical stop words that shouldn't be removed
        self.medical_terms = {
            'pain', 'ache', 'sore', 'hurt', 'fever', 'cough', 'cold',
            'nausea', 'vomit', 'dizzy', 'tired', 'weak', 'fatigue'
        }
        self.stop_words = self.stop_words - self.medical_terms
    
    def preprocess(self, text):
        """
        Preprocess text for analysis.
        
        Args:
            text (str): Input text
            
        Returns:
            str: Preprocessed text
        """
        # Convert to lowercase
        text = text.lower()
        
        # Remove punctuation
        text = re.sub(f'[{string.punctuation}]', ' ', text)
        
        # Remove extra whitespace
        text = re.sub(r'\s+', ' ', text).strip()
        
        return text
    
    def tokenize(self, text):
        """
        Tokenize text into words.
        
        Args:
            text (str): Input text
            
        Returns:
            list: List of tokens
        """
        return word_tokenize(text)
    
    def remove_stopwords(self, tokens):
        """
        Remove stopwords from tokens.
        
        Args:
            tokens (list): List of tokens
            
        Returns:
            list: Filtered tokens
        """
        return [token for token in tokens if token not in self.stop_words]
    
    def stem_tokens(self, tokens):
        """
        Stem tokens.
        
        Args:
            tokens (list): List of tokens
            
        Returns:
            list: Stemmed tokens
        """
        return [self.stemmer.stem(token) for token in tokens]
    
    def extract_features(self, text):
        """
        Extract features from text for ML models.
        
        Args:
            text (str): Input text
            
        Returns:
            dict: Features extracted from text
        """
        # Tokenize
        tokens = self.tokenize(text)
        
        # Remove stopwords
        filtered_tokens = self.remove_stopwords(tokens)
        
        # Count tokens
        token_count = len(filtered_tokens)
        
        # Extract symptom duration indicators
        duration_indicators = {
            'today': ['today', 'just', 'now', 'recent', 'hour', 'morning'],
            'days': ['day', 'days', 'yesterday', 'few days', 'since monday'],
            'weeks': ['week', 'weeks', 'fortnight', 'several days'],
            'months': ['month', 'months', 'long time', 'chronic', 'years', 'year']
        }
        
        duration = 'unknown'
        for dur, indicators in duration_indicators.items():
            if any(ind in text for ind in indicators):
                duration = dur
                break
        
        # Extract symptom severity indicators
        severity_indicators = {
            'mild': ['mild', 'slight', 'little', 'minor', 'barely', 'somewhat'],
            'moderate': ['moderate', 'medium', 'average', 'noticeable'],
            'severe': ['severe', 'intense', 'extreme', 'worst', 'unbearable', 'terrible', 'very bad']
        }
        
        severity = 'unknown'
        for sev, indicators in severity_indicators.items():
            if any(ind in text for ind in indicators):
                severity = sev
                break
        
        # Return features
        return {
            'token_count': token_count,
            'duration': duration,
            'severity': severity,
            'tokens': filtered_tokens
        }
