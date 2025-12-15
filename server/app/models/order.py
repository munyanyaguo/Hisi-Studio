"""Order models"""

from app.extensions import db
from datetime import datetime
import uuid

class Order(db.Model):
    """Order model"""
    __tablename__ = 'orders'
    __table_args__ = {'schema': 'hisi'}

    id = db.Column(db.String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    order_number = db.Column(db.String(50), unique=True, nullable=False, index=True)
    user_id = db.Column(db.String(36), db.ForeignKey('hisi.users.id'), nullable=False)

    # Order status
    status = db.Column(db.String(20), nullable=False, default='pending')
    # Status options: 'pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled', 'refunded'

    # Payment
    payment_status = db.Column(db.String(20), nullable=False, default='pending')
    # Payment status: 'pending', 'completed', 'failed', 'refunded'
    payment_method = db.Column(db.String(50), nullable=True)
    payment_reference = db.Column(db.String(255), nullable=True)

    # Amounts
    subtotal = db.Column(db.Numeric(10, 2), nullable=False)
    shipping_cost = db.Column(db.Numeric(10, 2), nullable=False, default=0)
    tax = db.Column(db.Numeric(10, 2), nullable=False, default=0)
    discount = db.Column(db.Numeric(10, 2), nullable=False, default=0)
    total = db.Column(db.Numeric(10, 2), nullable=False)
    currency = db.Column(db.String(3), nullable=False, default='NGN')

    # Shipping details
    shipping_address = db.Column(db.JSON, nullable=True)
    # Example: {"first_name": "John", "last_name": "Doe", "address": "123 Main St", ...}

    billing_address = db.Column(db.JSON, nullable=True)
    shipping_method = db.Column(db.String(50), nullable=True)
    tracking_number = db.Column(db.String(100), nullable=True)

    # Customer notes
    customer_notes = db.Column(db.Text, nullable=True)
    admin_notes = db.Column(db.Text, nullable=True)

    # Timestamps
    created_at = db.Column(db.DateTime, nullable=False, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, nullable=False, default=datetime.utcnow, onupdate=datetime.utcnow)
    confirmed_at = db.Column(db.DateTime, nullable=True)
    shipped_at = db.Column(db.DateTime, nullable=True)
    delivered_at = db.Column(db.DateTime, nullable=True)

    # Relationships
    user = db.relationship('User', backref='orders', lazy=True)
    items = db.relationship('OrderItem', backref='order', lazy=True, cascade='all, delete-orphan')

    def to_dict(self, include_items=False):
        """Convert order to dictionary"""
        result = {
            'id': self.id,
            'order_number': self.order_number,
            'user_id': self.user_id,
            'status': self.status,
            'payment_status': self.payment_status,
            'payment_method': self.payment_method,
            'payment_reference': self.payment_reference,
            'subtotal': float(self.subtotal),
            'shipping_cost': float(self.shipping_cost),
            'tax': float(self.tax),
            'discount': float(self.discount),
            'total': float(self.total),
            'currency': self.currency,
            'shipping_address': self.shipping_address,
            'billing_address': self.billing_address,
            'shipping_method': self.shipping_method,
            'tracking_number': self.tracking_number,
            'customer_notes': self.customer_notes,
            'created_at': self.created_at.isoformat() if self.created_at else None,
            'updated_at': self.updated_at.isoformat() if self.updated_at else None,
            'confirmed_at': self.confirmed_at.isoformat() if self.confirmed_at else None,
            'shipped_at': self.shipped_at.isoformat() if self.shipped_at else None,
            'delivered_at': self.delivered_at.isoformat() if self.delivered_at else None
        }

        if include_items:
            result['items'] = [item.to_dict() for item in self.items]

        return result

    def __repr__(self):
        return f"<Order {self.order_number}>"


class OrderItem(db.Model):
    """Order items model"""
    __tablename__ = 'order_items'
    __table_args__ = {'schema': 'hisi'}

    id = db.Column(db.String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    order_id = db.Column(db.String(36), db.ForeignKey('hisi.orders.id'), nullable=False)
    product_id = db.Column(db.String(36), db.ForeignKey('hisi.products.id'), nullable=False)

    # Product details (snapshot at time of order)
    product_name = db.Column(db.String(255), nullable=False)
    product_sku = db.Column(db.String(100), nullable=False)
    product_image = db.Column(db.String(500), nullable=True)

    # Pricing
    unit_price = db.Column(db.Numeric(10, 2), nullable=False)
    quantity = db.Column(db.Integer, nullable=False)
    subtotal = db.Column(db.Numeric(10, 2), nullable=False)

    # Variant info (if applicable)
    variant = db.Column(db.JSON, nullable=True)
    # Example: {"size": "M", "color": "Blue"}

    created_at = db.Column(db.DateTime, nullable=False, default=datetime.utcnow)

    # Relationships
    product = db.relationship('Product', backref='order_items', lazy=True)

    def to_dict(self):
        """Convert order item to dictionary"""
        return {
            'id': self.id,
            'order_id': self.order_id,
            'product_id': self.product_id,
            'product_name': self.product_name,
            'product_sku': self.product_sku,
            'product_image': self.product_image,
            'unit_price': float(self.unit_price),
            'quantity': self.quantity,
            'subtotal': float(self.subtotal),
            'variant': self.variant,
            'created_at': self.created_at.isoformat() if self.created_at else None
        }

    def __repr__(self):
        return f"<OrderItem {self.product_name} x {self.quantity}>"
