"""Payment model"""

from app.extensions import db
from datetime import datetime
import uuid

class Payment(db.Model):
    """Payment model for order payments"""
    __tablename__ = 'payments'
    __table_args__ = {'schema': 'hisi'}

    id = db.Column(db.String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    order_id = db.Column(db.String(36), db.ForeignKey('hisi.orders.id'), nullable=False, unique=True)

    # Transaction details
    transaction_id = db.Column(db.String(255), unique=True, nullable=False, index=True)  # Our tx_ref
    flutterwave_transaction_id = db.Column(db.String(255), nullable=True, unique=True)  # Flutterwave's ID
    flutterwave_tx_ref = db.Column(db.String(255), nullable=True)

    # Payment info
    amount = db.Column(db.Numeric(10, 2), nullable=False)
    currency = db.Column(db.String(3), nullable=False, default='NGN')
    payment_method = db.Column(db.String(50), nullable=True)  # 'card', 'mpesa', 'bank_transfer', etc.
    status = db.Column(db.String(20), nullable=False, default='pending')
    # Status options: 'pending', 'processing', 'successful', 'failed', 'cancelled', 'refunded'

    # Customer details
    customer_email = db.Column(db.String(255), nullable=False)
    customer_phone = db.Column(db.String(20), nullable=True)
    customer_name = db.Column(db.String(255), nullable=True)

    # Additional data
    metadata = db.Column(db.JSON, nullable=True)  # Extra Flutterwave response data
    failure_reason = db.Column(db.Text, nullable=True)

    # Timestamps
    created_at = db.Column(db.DateTime, nullable=False, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, nullable=False, default=datetime.utcnow, onupdate=datetime.utcnow)
    completed_at = db.Column(db.DateTime, nullable=True)

    # Relationships
    order = db.relationship('Order', backref=db.backref('payment', uselist=False), lazy=True)

    def to_dict(self):
        """Convert payment to dictionary"""
        return {
            'id': self.id,
            'order_id': self.order_id,
            'transaction_id': self.transaction_id,
            'flutterwave_transaction_id': self.flutterwave_transaction_id,
            'amount': float(self.amount),
            'currency': self.currency,
            'payment_method': self.payment_method,
            'status': self.status,
            'customer_email': self.customer_email,
            'customer_phone': self.customer_phone,
            'customer_name': self.customer_name,
            'failure_reason': self.failure_reason,
            'created_at': self.created_at.isoformat() if self.created_at else None,
            'updated_at': self.updated_at.isoformat() if self.updated_at else None,
            'completed_at': self.completed_at.isoformat() if self.completed_at else None
        }

    def __repr__(self):
        return f"<Payment {self.transaction_id} - {self.status}>"
