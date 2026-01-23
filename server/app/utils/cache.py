"""
Redis cache utility for caching frequently accessed data
Improves API performance by reducing database queries
"""

import json
import redis
from functools import wraps
from flask import current_app, request
import hashlib


class RedisCache:
    """Redis cache manager"""

    def __init__(self):
        self.redis_client = None

    def init_app(self, app):
        """Initialize Redis with Flask app"""
        redis_url = app.config.get('REDIS_URL')

        if redis_url:
            try:
                self.redis_client = redis.from_url(
                    redis_url,
                    decode_responses=True,
                    socket_connect_timeout=5,
                    socket_timeout=5
                )
                # Test connection
                self.redis_client.ping()
                app.logger.info("Redis cache connected successfully")
            except Exception as e:
                app.logger.warning(f"Redis connection failed: {e}. Caching disabled.")
                self.redis_client = None
        else:
            app.logger.warning("REDIS_URL not configured. Caching disabled.")

    def get(self, key):
        """Get value from cache"""
        if not self.redis_client:
            return None

        try:
            value = self.redis_client.get(key)
            if value:
                return json.loads(value)
            return None
        except Exception as e:
            current_app.logger.error(f"Cache get error: {e}")
            return None

    def set(self, key, value, ttl=300):
        """
        Set value in cache

        Args:
            key: Cache key
            value: Value to cache (must be JSON serializable)
            ttl: Time to live in seconds (default: 5 minutes)
        """
        if not self.redis_client:
            return False

        try:
            serialized = json.dumps(value)
            self.redis_client.setex(key, ttl, serialized)
            return True
        except Exception as e:
            current_app.logger.error(f"Cache set error: {e}")
            return False

    def delete(self, key):
        """Delete key from cache"""
        if not self.redis_client:
            return False

        try:
            self.redis_client.delete(key)
            return True
        except Exception as e:
            current_app.logger.error(f"Cache delete error: {e}")
            return False

    def delete_pattern(self, pattern):
        """
        Delete all keys matching pattern

        Args:
            pattern: Redis key pattern (e.g., 'products:*')
        """
        if not self.redis_client:
            return False

        try:
            keys = self.redis_client.keys(pattern)
            if keys:
                self.redis_client.delete(*keys)
            return True
        except Exception as e:
            current_app.logger.error(f"Cache delete pattern error: {e}")
            return False

    def clear_all(self):
        """Clear entire cache (use with caution)"""
        if not self.redis_client:
            return False

        try:
            self.redis_client.flushdb()
            return True
        except Exception as e:
            current_app.logger.error(f"Cache clear error: {e}")
            return False


# Global cache instance
cache = RedisCache()


def cached(key_prefix, ttl=300):
    """
    Decorator for caching route responses

    Args:
        key_prefix: Prefix for cache key (e.g., 'products')
        ttl: Time to live in seconds (default: 5 minutes)

    Usage:
        @bp.route('/products')
        @cached('products:list', ttl=600)
        def get_products():
            # ... your route logic
    """
    def decorator(f):
        @wraps(f)
        def decorated_function(*args, **kwargs):
            # Build cache key from prefix + query params
            query_string = request.query_string.decode('utf-8')
            cache_key = f"{key_prefix}:{hashlib.md5(query_string.encode()).hexdigest()}" if query_string else key_prefix

            # Try to get from cache
            cached_response = cache.get(cache_key)
            if cached_response is not None:
                current_app.logger.debug(f"Cache HIT: {cache_key}")
                return cached_response

            # Cache miss - execute function
            current_app.logger.debug(f"Cache MISS: {cache_key}")
            response = f(*args, **kwargs)

            # Cache the response if it's successful (status code 200)
            if isinstance(response, tuple):
                data, status_code = response
                if status_code == 200:
                    cache.set(cache_key, (data, status_code), ttl)
            else:
                cache.set(cache_key, response, ttl)

            return response

        return decorated_function
    return decorator


def invalidate_cache(pattern):
    """
    Helper function to invalidate cache by pattern

    Args:
        pattern: Redis key pattern (e.g., 'products:*')

    Usage:
        invalidate_cache('products:*')  # Clear all product caches
    """
    cache.delete_pattern(pattern)
    current_app.logger.info(f"Cache invalidated: {pattern}")
