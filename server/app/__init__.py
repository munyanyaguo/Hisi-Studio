"""
Flask application factory
Creates and configures the Flask app
"""

from flask import Flask
from flask_cors import CORS
from dotenv import load_dotenv
import os

# Load environment variables
load_dotenv()

def create_app(config_name='development'):
    """
    Application factory pattern
    
    Args:
        config_name: Configuration to use (development, production, testing)
    
    Returns:
        Flask app instance
    """
    
    # Create Flask app
    app = Flask(__name__)
    
    # Load configuration
    if config_name == 'development':
        from app.config.development import DevelopmentConfig
        app.config.from_object(DevelopmentConfig)
    
    # Initialize extensions
    from app.extensions import init_extensions
    init_extensions(app)
    
    # Import models (IMPORTANT: must be after db init)
    with app.app_context():
        from app.models import (
            User, Product, Category, Order, OrderItem,
            Cart, CartItem, UserAddress, Payment,
            Page, BlogPost, SiteSetting, NewsletterSubscriber, ContactMessage
        )

    # Register blueprints
    from app.routes import auth, products, cart, addresses, orders, cms, newsletter, payments
    app.register_blueprint(auth.bp)
    app.register_blueprint(products.bp)
    app.register_blueprint(cart.bp)
    app.register_blueprint(addresses.bp)
    app.register_blueprint(orders.bp)
    app.register_blueprint(cms.bp)
    app.register_blueprint(newsletter.bp)
    app.register_blueprint(payments.bp)

    # Configure CORS
    CORS(app, resources={
        r"/api/*": {
            "origins": app.config['CORS_ORIGINS'],
            "methods": ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
            "allow_headers": ["Content-Type", "Authorization"],
            "expose_headers": ["Content-Type", "Authorization"],
            "supports_credentials": True,
            "max_age": 3600
        }
    })
    
    # Health check endpoint
    @app.route('/health')
    def health_check():
        """Simple health check endpoint"""
        return {
            'status': 'healthy',
            'message': 'Hisi Studio API is running'
        }, 200
    
    @app.route('/')
    def index():
        """Root endpoint"""
        return {
            'message': 'Welcome to Hisi Studio API',
            'version': '1.0.0',
            'endpoints': {
                'health': '/health',
                'api': '/api/v1'
            }
        }, 200
    
    return app
