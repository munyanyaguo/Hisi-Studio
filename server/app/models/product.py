"""Product model"""

from app.extensions import db
from datetime import datetime
import uuid

class Product(db.Model):
    """Product model for Hisi Studio products"""
    __tablename__ = 'products'
    __table_args__ = {'schema': 'hisi'}

    id = db.Column(db.String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    name = db.Column(db.String(255), nullable=False)
    slug = db.Column(db.String(255), unique=True, nullable=False, index=True)
    description = db.Column(db.Text, nullable=True)
    short_description = db.Column(db.String(500), nullable=True)

    # Pricing
    price = db.Column(db.Numeric(10, 2), nullable=False)
    original_price = db.Column(db.Numeric(10, 2), nullable=True)
    currency = db.Column(db.String(3), nullable=False, default='NGN')

    # Inventory
    sku = db.Column(db.String(100), unique=True, nullable=False)
    stock_quantity = db.Column(db.Integer, nullable=False, default=0)
    low_stock_threshold = db.Column(db.Integer, nullable=False, default=5)

    # Product details
    category_id = db.Column(db.String(36), db.ForeignKey('hisi.categories.id'), nullable=True)
    brand = db.Column(db.String(100), nullable=True)
    gender = db.Column(db.String(20), nullable=True)  # 'men', 'women', 'unisex', 'kids'

    # Accessibility features (JSON field)
    accessibility_features = db.Column(db.JSON, nullable=True)
    # Example: ["Magnetic closures", "Easy grip zippers", "Tag-free"]

    # Images
    main_image = db.Column(db.String(500), nullable=True)
    hover_image = db.Column(db.String(500), nullable=True)
    images = db.Column(db.JSON, nullable=True)  # Array of image URLs

    # SEO
    meta_title = db.Column(db.String(255), nullable=True)
    meta_description = db.Column(db.String(500), nullable=True)

    # Status
    is_active = db.Column(db.Boolean, default=True, nullable=False)
    is_featured = db.Column(db.Boolean, default=False, nullable=False)
    badge = db.Column(db.String(50), nullable=True)  # 'New', 'Sale', 'Best Seller', etc.

    # Timestamps
    created_at = db.Column(db.DateTime, nullable=False, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, nullable=False, default=datetime.utcnow, onupdate=datetime.utcnow)

    # Relationships
    category = db.relationship('Category', backref='products', lazy=True)

    def to_dict(self):
        """Convert product to dictionary"""
        discount = None
        if self.original_price and self.original_price > self.price:
            discount = round(((float(self.original_price) - float(self.price)) / float(self.original_price)) * 100)

        return {
            'id': self.id,
            'name': self.name,
            'slug': self.slug,
            'description': self.description,
            'short_description': self.short_description,
            'price': float(self.price),
            'original_price': float(self.original_price) if self.original_price else None,
            'discount_percentage': discount,
            'currency': self.currency,
            'sku': self.sku,
            'stock_quantity': self.stock_quantity,
            'in_stock': self.stock_quantity > 0,
            'low_stock': self.stock_quantity <= self.low_stock_threshold and self.stock_quantity > 0,
            'category_id': self.category_id,
            'brand': self.brand,
            'gender': self.gender,
            'accessibility_features': self.accessibility_features,
            'images': {
                'main': self.main_image,
                'hover': self.hover_image,
                'gallery': self.images or []
            },
            'badge': self.badge,
            'is_featured': self.is_featured,
            'is_active': self.is_active,
            'meta_title': self.meta_title,
            'meta_description': self.meta_description,
            'created_at': self.created_at.isoformat() if self.created_at else None,
            'updated_at': self.updated_at.isoformat() if self.updated_at else None
        }

    def __repr__(self):
        return f"<Product {self.name}>"


class Category(db.Model):
    """Product category model"""
    __tablename__ = 'categories'
    __table_args__ = {'schema': 'hisi'}

    id = db.Column(db.String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    name = db.Column(db.String(100), nullable=False)
    slug = db.Column(db.String(100), unique=True, nullable=False, index=True)
    description = db.Column(db.Text, nullable=True)
    image = db.Column(db.String(500), nullable=True)
    parent_id = db.Column(db.String(36), db.ForeignKey('hisi.categories.id'), nullable=True)
    is_active = db.Column(db.Boolean, default=True, nullable=False)
    display_order = db.Column(db.Integer, default=0)
    created_at = db.Column(db.DateTime, nullable=False, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, nullable=False, default=datetime.utcnow, onupdate=datetime.utcnow)

    # Self-referential relationship for parent/child categories
    children = db.relationship('Category', backref=db.backref('parent', remote_side=[id]))

    def to_dict(self):
        """Convert category to dictionary"""
        return {
            'id': self.id,
            'name': self.name,
            'slug': self.slug,
            'description': self.description,
            'image': self.image,
            'parent_id': self.parent_id,
            'is_active': self.is_active,
            'display_order': self.display_order,
            'created_at': self.created_at.isoformat() if self.created_at else None
        }

    def __repr__(self):
        return f"<Category {self.name}>"
