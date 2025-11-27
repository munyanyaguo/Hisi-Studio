#!/usr/bin/env python3
"""Test Redis connection"""

import redis

def test_redis():
    try:
        # Connect to Redis
        r = redis.Redis(
            host='localhost',
            port=6379,
            db=0,
            decode_responses=True
        )
        
        print("✅ Connected to Redis!")
        
        # Test ping
        response = r.ping()
        print(f"📡 Ping response: {response}")
        
        # Test set/get
        r.set('test_key', 'Hello from Hisi Studio!')
        value = r.get('test_key')
        print(f"💾 Test value: {value}")
        
        # Clean up
        r.delete('test_key')
        
        # Get Redis info
        info = r.info('server')
        print(f"🔧 Redis version: {info['redis_version']}")
        
        print("✅ Redis connection test successful!")
        
    except Exception as e:
        print(f"❌ Error: {e}")

if __name__ == "__main__":
    test_redis()
