"""Cart models"""

from app.extensions import db
from datetime import datetime
import uuid

class Cart(db.Model):
    """Shopping cart model"""
    __tablename__ = 'carts'
    __table_args__ = {'schema': 'hisi'}

    id = db.Column(db.String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    user_id = db.Column(db.String(36), db.ForeignKey('hisi.users.id'), nullable=True)
    session_id = db.Column(db.String(255), nullable=True, index=True)  # For guest carts
    created_at = db.Column(db.DateTime, nullable=False, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, nullable=False, default=datetime.utcnow, onupdate=datetime.utcnow)

    # Relationships
    user = db.relationship('User', backref='carts', lazy=True)
    items = db.relationship('CartItem', backref='cart', lazy=True, cascade='all, delete-orphan')

    def get_total(self):
        """Calculate cart total"""
        return sum(item.get_subtotal() for item in self.items)

    def get_item_count(self):
        """Get total number of items"""
        return sum(item.quantity for item in self.items)

    def to_dict(self, include_items=True):
        """Convert cart to dictionary"""
        result = {
            'id': self.id,
            'user_id': self.user_id,
            'item_count': self.get_item_count(),
            'total': float(self.get_total()),
            'created_at': self.created_at.isoformat() if self.created_at else None,
            'updated_at': self.updated_at.isoformat() if self.updated_at else None
        }

        if include_items:
            result['items'] = [item.to_dict() for item in self.items]

        return result

    def __repr__(self):
        return f"<Cart {self.id}>"


class CartItem(db.Model):
    """Cart item model"""
    __tablename__ = 'cart_items'
    __table_args__ = {'schema': 'hisi'}

    id = db.Column(db.String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    cart_id = db.Column(db.String(36), db.ForeignKey('hisi.carts.id'), nullable=False)
    product_id = db.Column(db.String(36), db.ForeignKey('hisi.products.id'), nullable=False)
    quantity = db.Column(db.Integer, nullable=False, default=1)
    price_at_addition = db.Column(db.Numeric(10, 2), nullable=False)  # Price snapshot
    created_at = db.Column(db.DateTime, nullable=False, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, nullable=False, default=datetime.utcnow, onupdate=datetime.utcnow)

    # Relationships
    product = db.relationship('Product', backref='cart_items', lazy=True)

    def get_subtotal(self):
        """Calculate item subtotal"""
        return self.price_at_addition * self.quantity

    def to_dict(self):
        """Convert cart item to dictionary"""
        product_data = None
        if self.product:
            product_data = {
                'id': self.product.id,
                'name': self.product.name,
                'slug': self.product.slug,
                'main_image': self.product.main_image,
                'current_price': float(self.product.price),
                'stock_quantity': self.product.stock_quantity,
                'accessibility_features': self.product.accessibility_features
            }

        return {
            'id': self.id,
            'cart_id': self.cart_id,
            'product_id': self.product_id,
            'product': product_data,
            'quantity': self.quantity,
            'price': float(self.price_at_addition),
            'subtotal': float(self.get_subtotal()),
            'created_at': self.created_at.isoformat() if self.created_at else None
        }

    def __repr__(self):
        return f"<CartItem {self.product_id} x {self.quantity}>"
