"""Development configuration"""

import os
from datetime import timedelta

class DevelopmentConfig:
    """Development environment configuration"""
    
    # Flask
    DEBUG = True
    TESTING = False
    SECRET_KEY = os.getenv('SECRET_KEY', 'dev-secret-key')
    
    # Database
    SQLALCHEMY_DATABASE_URI = os.getenv('DATABASE_URL')
    SQLALCHEMY_TRACK_MODIFICATIONS = False
    SQLALCHEMY_ECHO = False  # Set to True to log SQL queries for debugging
    
    # JWT
    JWT_SECRET_KEY = os.getenv('JWT_SECRET_KEY', 'jwt-secret-key')
    JWT_ACCESS_TOKEN_EXPIRES = timedelta(seconds=int(os.getenv('JWT_ACCESS_TOKEN_EXPIRES', 900)))
    JWT_REFRESH_TOKEN_EXPIRES = timedelta(seconds=int(os.getenv('JWT_REFRESH_TOKEN_EXPIRES', 604800)))
    JWT_TOKEN_LOCATION = ['headers', 'cookies']
    JWT_COOKIE_SECURE = False  # True in production
    JWT_COOKIE_CSRF_PROTECT = False  # True in production
    
    # CORS
    CORS_ORIGINS = [os.getenv('FRONTEND_URL', 'http://localhost:5173')]
    
    # File uploads (we'll add Cloudinary later)
    MAX_CONTENT_LENGTH = 16 * 1024 * 1024  # 16MB max file size

    # Flutterwave Payment Gateway
    FLUTTERWAVE_PUBLIC_KEY = os.getenv('FLUTTERWAVE_PUBLIC_KEY', '')
    FLUTTERWAVE_SECRET_KEY = os.getenv('FLUTTERWAVE_SECRET_KEY', '')
    FLUTTERWAVE_ENCRYPTION_KEY = os.getenv('FLUTTERWAVE_ENCRYPTION_KEY', '')
    FLUTTERWAVE_SECRET_HASH = os.getenv('FLUTTERWAVE_SECRET_HASH', '')  # For webhook verification

    # Site Configuration
    SITE_LOGO_URL = os.getenv('SITE_LOGO_URL', 'https://hisistudio.com/logo.png')
