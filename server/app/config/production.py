"""Production configuration"""

import os
from datetime import timedelta

class ProductionConfig:
    """Production environment configuration"""
    
    # Flask
    DEBUG = False
    TESTING = False
    SECRET_KEY = os.environ.get('SECRET_KEY')
    
    # Database
    # Render provides DATABASE_URL, but it might start with postgres:// which SQLAlchemy doesn't like anymore
    # Needs to be postgresql://
    uri = os.environ.get('DATABASE_URL', '')
    if uri and uri.startswith('postgres://'):
        uri = uri.replace('postgres://', 'postgresql://', 1)
    
    SQLALCHEMY_DATABASE_URI = uri
    SQLALCHEMY_TRACK_MODIFICATIONS = False
    
    # JWT
    JWT_SECRET_KEY = os.environ.get('JWT_SECRET_KEY')
    JWT_ACCESS_TOKEN_EXPIRES = timedelta(seconds=int(os.environ.get('JWT_ACCESS_TOKEN_EXPIRES', 900)))
    JWT_REFRESH_TOKEN_EXPIRES = timedelta(seconds=int(os.environ.get('JWT_REFRESH_TOKEN_EXPIRES', 604800)))
    JWT_TOKEN_LOCATION = ['headers', 'cookies']
    JWT_COOKIE_SECURE = True  # True in production (requires HTTPS)
    JWT_COOKIE_CSRF_PROTECT = True  # True in production
    JWT_COOKIE_SAMESITE = 'Lax'
    
    # CORS
    # In production, this should be the specific frontend URL
    CORS_ORIGINS = [os.environ.get('FRONTEND_URL')]
    
    # File uploads
    MAX_CONTENT_LENGTH = 16 * 1024 * 1024  # 16MB max file size

    # Flutterwave Payment Gateway
    FLUTTERWAVE_PUBLIC_KEY = os.environ.get('FLUTTERWAVE_PUBLIC_KEY')
    FLUTTERWAVE_SECRET_KEY = os.environ.get('FLUTTERWAVE_SECRET_KEY')
    FLUTTERWAVE_ENCRYPTION_KEY = os.environ.get('FLUTTERWAVE_ENCRYPTION_KEY')
    FLUTTERWAVE_SECRET_HASH = os.environ.get('FLUTTERWAVE_SECRET_HASH')

    # Site Configuration
    SITE_LOGO_URL = os.environ.get('SITE_LOGO_URL', 'https://hisistudio.com/logo.png')

    # Redis
    REDIS_URL = os.environ.get('REDIS_URL')

    # Email (SendGrid)
    SENDGRID_API_KEY = os.environ.get('SENDGRID_API_KEY')
    SENDGRID_FROM_EMAIL = os.environ.get('SENDGRID_FROM_EMAIL')
    MAIL_DEFAULT_SENDER = os.environ.get('MAIL_DEFAULT_SENDER')
    ADMIN_EMAIL = os.environ.get('ADMIN_EMAIL')

    # Cloudinary
    CLOUDINARY_CLOUD_NAME = os.environ.get('CLOUDINARY_CLOUD_NAME')
    CLOUDINARY_API_KEY = os.environ.get('CLOUDINARY_API_KEY')
    CLOUDINARY_API_SECRET = os.environ.get('CLOUDINARY_API_SECRET')

    # Exchange Rate API
    EXCHANGE_RATE_API_KEY = os.environ.get('EXCHANGE_RATE_API_KEY')
