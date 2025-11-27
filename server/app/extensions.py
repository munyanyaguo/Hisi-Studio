"""
Flask extensions initialization
All extensions are initialized here and imported by the app factory
"""

from flask_sqlalchemy import SQLAlchemy
from flask_migrate import Migrate
from flask_jwt_extended import JWTManager

# Initialize extensions (without app)
db = SQLAlchemy()
migrate = Migrate()
jwt = JWTManager()

def init_extensions(app):
    """Initialize all Flask extensions with app context"""
    db.init_app(app)
    migrate.init_app(app, db)
    jwt.init_app(app)
    
    return app
