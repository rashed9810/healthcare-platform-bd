import React from 'react';
import { Loader2, Heart, Stethoscope } from 'lucide-react';
import { cn } from '@/lib/utils';

interface LoadingProps {
  size?: 'sm' | 'md' | 'lg';
  variant?: 'spinner' | 'pulse' | 'healthcare';
  text?: string;
  className?: string;
}

export function Loading({ 
  size = 'md', 
  variant = 'spinner', 
  text = 'Loading...', 
  className 
}: LoadingProps) {
  const sizeClasses = {
    sm: 'h-4 w-4',
    md: 'h-8 w-8',
    lg: 'h-12 w-12'
  };

  const textSizeClasses = {
    sm: 'text-sm',
    md: 'text-base',
    lg: 'text-lg'
  };

  if (variant === 'healthcare') {
    return (
      <div className={cn('flex flex-col items-center justify-center py-8', className)}>
        <div className="relative">
          <div className="absolute inset-0 animate-ping">
            <Heart className={cn(sizeClasses[size], 'text-red-400')} />
          </div>
          <Heart className={cn(sizeClasses[size], 'text-red-500')} />
        </div>
        <div className="mt-4 flex items-center space-x-2">
          <Stethoscope className="h-4 w-4 text-blue-500 animate-pulse" />
          <span className={cn(textSizeClasses[size], 'text-gray-600 animate-pulse')}>
            {text}
          </span>
        </div>
      </div>
    );
  }

  if (variant === 'pulse') {
    return (
      <div className={cn('flex flex-col items-center justify-center py-8', className)}>
        <div className={cn(
          'rounded-full bg-blue-500 animate-pulse',
          sizeClasses[size]
        )} />
        <span className={cn(
          'mt-4 text-gray-600 animate-pulse',
          textSizeClasses[size]
        )}>
          {text}
        </span>
      </div>
    );
  }

  return (
    <div className={cn('flex flex-col items-center justify-center py-8', className)}>
      <Loader2 className={cn(
        'animate-spin text-blue-600',
        sizeClasses[size]
      )} />
      <span className={cn(
        'mt-4 text-gray-600',
        textSizeClasses[size]
      )}>
        {text}
      </span>
    </div>
  );
}

export function LoadingCard({ className }: { className?: string }) {
  return (
    <div className={cn(
      'bg-white rounded-lg border border-gray-200 p-6 animate-pulse',
      className
    )}>
      <div className="flex items-center space-x-4">
        <div className="rounded-full bg-gray-300 h-12 w-12"></div>
        <div className="flex-1 space-y-2">
          <div className="h-4 bg-gray-300 rounded w-3/4"></div>
          <div className="h-3 bg-gray-300 rounded w-1/2"></div>
        </div>
      </div>
      <div className="mt-4 space-y-2">
        <div className="h-3 bg-gray-300 rounded"></div>
        <div className="h-3 bg-gray-300 rounded w-5/6"></div>
      </div>
    </div>
  );
}

export function LoadingGrid({ count = 3, className }: { count?: number; className?: string }) {
  return (
    <div className={cn('grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6', className)}>
      {Array.from({ length: count }).map((_, i) => (
        <LoadingCard key={i} />
      ))}
    </div>
  );
}
