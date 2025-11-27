#!/usr/bin/env python3
"""Test database connection"""

import psycopg2
from psycopg2 import sql

def test_connection():
    try:
        # Connection parameters
        conn = psycopg2.connect(
            host="localhost",
            port="5432",
            database="hisi_studio_dev",
            user="hisi_admin",
            password="hisi_password_dev"
        )
        
        print("✅ Connected to PostgreSQL!")
        
        # Create cursor
        cur = conn.cursor()
        
        # Get PostgreSQL version
        cur.execute("SELECT version();")
        version = cur.fetchone()
        print(f"📊 PostgreSQL version: {version[0][:50]}...")
        
        # Test health check function
        cur.execute("SELECT * FROM hisi.health_check();")
        health = cur.fetchone()
        print(f"💚 Health check: {health[0]} at {health[1]}")
        
        # Close connection
        cur.close()
        conn.close()
        
        print("✅ Database connection test successful!")
        
    except Exception as e:
        print(f"❌ Error: {e}")

if __name__ == "__main__":
    test_connection()
