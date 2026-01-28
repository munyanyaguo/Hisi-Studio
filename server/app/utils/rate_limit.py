"""
Simple in-memory rate limiting for API endpoints.
For production with multiple instances, use Redis-based rate limiting.
"""

import time
from functools import wraps
from collections import defaultdict
from threading import Lock
from flask import request, jsonify


class RateLimiter:
    """
    In-memory rate limiter using sliding window algorithm.

    Note: This is suitable for single-instance deployments.
    For multi-instance deployments, use Redis-based rate limiting.
    """

    def __init__(self):
        self.requests = defaultdict(list)
        self.lock = Lock()

    def is_allowed(self, key: str, max_requests: int, window_seconds: int) -> tuple[bool, int]:
        """
        Check if request is allowed under rate limit.

        Args:
            key: Unique identifier (e.g., IP address, user ID)
            max_requests: Maximum requests allowed in window
            window_seconds: Time window in seconds

        Returns:
            Tuple of (is_allowed, retry_after_seconds)
        """
        now = time.time()
        window_start = now - window_seconds

        with self.lock:
            # Clean old requests outside the window
            self.requests[key] = [
                req_time for req_time in self.requests[key]
                if req_time > window_start
            ]

            # Check if under limit
            if len(self.requests[key]) < max_requests:
                self.requests[key].append(now)
                return True, 0

            # Calculate retry after
            oldest_in_window = min(self.requests[key]) if self.requests[key] else now
            retry_after = int(oldest_in_window + window_seconds - now) + 1

            return False, retry_after

    def cleanup(self, max_age_seconds: int = 3600):
        """Remove entries older than max_age_seconds to prevent memory leak."""
        now = time.time()
        cutoff = now - max_age_seconds

        with self.lock:
            keys_to_remove = []
            for key, times in self.requests.items():
                # Keep only recent requests
                self.requests[key] = [t for t in times if t > cutoff]
                if not self.requests[key]:
                    keys_to_remove.append(key)

            for key in keys_to_remove:
                del self.requests[key]


# Global rate limiter instance
limiter = RateLimiter()


def rate_limit(max_requests: int = 5, window_seconds: int = 60, key_func=None):
    """
    Decorator to rate limit an endpoint.

    Args:
        max_requests: Maximum requests allowed in window (default: 5)
        window_seconds: Time window in seconds (default: 60)
        key_func: Function to generate rate limit key (default: uses IP address)

    Usage:
        @bp.route('/login', methods=['POST'])
        @rate_limit(max_requests=5, window_seconds=60)
        def login():
            ...
    """
    def decorator(f):
        @wraps(f)
        def decorated_function(*args, **kwargs):
            # Get rate limit key
            if key_func:
                key = key_func()
            else:
                # Default: use IP address
                key = request.headers.get('X-Forwarded-For', request.remote_addr)
                # Add endpoint to key to have per-endpoint limits
                key = f"{key}:{request.endpoint}"

            # Check rate limit
            allowed, retry_after = limiter.is_allowed(key, max_requests, window_seconds)

            if not allowed:
                response = jsonify({
                    'success': False,
                    'message': 'Too many requests',
                    'error': f'Rate limit exceeded. Try again in {retry_after} seconds.'
                })
                response.headers['Retry-After'] = str(retry_after)
                response.headers['X-RateLimit-Limit'] = str(max_requests)
                response.headers['X-RateLimit-Remaining'] = '0'
                response.headers['X-RateLimit-Reset'] = str(int(time.time()) + retry_after)
                return response, 429

            return f(*args, **kwargs)
        return decorated_function
    return decorator


def get_client_ip():
    """Get client IP address, handling proxies."""
    if request.headers.get('X-Forwarded-For'):
        return request.headers.get('X-Forwarded-For').split(',')[0].strip()
    return request.remote_addr
