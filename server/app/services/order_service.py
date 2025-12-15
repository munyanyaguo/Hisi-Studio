"""Order service - Business logic for orders"""

from app.extensions import db
from app.models import Order, OrderItem, Product, Cart
from datetime import datetime
from sqlalchemy.exc import SQLAlchemyError
import uuid
import random


class OrderService:
    """Service for managing orders"""

    @staticmethod
    def generate_order_number():
        """Generate unique order number"""
        prefix = "HS"
        timestamp = datetime.utcnow().strftime("%Y%m%d")
        random_num = random.randint(1000, 9999)
        return f"{prefix}-{timestamp}-{random_num}"

    @staticmethod
    def create_order_from_cart(cart, user, shipping_address, billing_address=None, notes=None):
        """Create order from cart items"""
        try:
            if not cart.items:
                return None, "Cart is empty"

            # Validate stock
            for item in cart.items:
                product = item.product
                if product.stock_quantity < item.quantity:
                    return None, f"{product.name} is out of stock"

            # Calculate totals
            subtotal = cart.get_total()
            shipping_cost = OrderService.calculate_shipping(shipping_address)
            tax = 0  # Implement tax calculation if needed
            discount = 0  # Implement discount logic
            total = subtotal + shipping_cost + tax - discount

            # Create order
            order = Order(
                order_number=OrderService.generate_order_number(),
                user_id=user.id,
                status='pending',
                payment_status='pending',
                subtotal=subtotal,
                shipping_cost=shipping_cost,
                tax=tax,
                discount=discount,
                total=total,
                currency='NGN',
                shipping_address=shipping_address,
                billing_address=billing_address or shipping_address,
                customer_notes=notes
            )
            db.session.add(order)
            db.session.flush()  # Get order ID

            # Create order items
            for cart_item in cart.items:
                order_item = OrderItem(
                    order_id=order.id,
                    product_id=cart_item.product_id,
                    product_name=cart_item.product.name,
                    product_sku=cart_item.product.sku,
                    product_image=cart_item.product.main_image,
                    unit_price=cart_item.price_at_addition,
                    quantity=cart_item.quantity,
                    subtotal=cart_item.get_subtotal()
                )
                db.session.add(order_item)

                # Reduce stock
                cart_item.product.stock_quantity -= cart_item.quantity

            # Clear cart
            for item in cart.items:
                db.session.delete(item)

            db.session.commit()
            return order, None
        except SQLAlchemyError as e:
            db.session.rollback()
            raise e

    @staticmethod
    def calculate_shipping(address):
        """Calculate shipping cost based on address"""
        # Simple flat rate for now
        if address.get('country', '').lower() in ['nigeria', 'kenya']:
            return 1500.00  # Local shipping
        else:
            return 5000.00  # International shipping

    @staticmethod
    def update_order_status(order_id, new_status, admin_notes=None):
        """Update order status"""
        try:
            order = Order.query.get(order_id)
            if not order:
                return None, "Order not found"

            valid_statuses = ['pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled']
            if new_status not in valid_statuses:
                return None, f"Invalid status. Must be one of: {', '.join(valid_statuses)}"

            order.status = new_status
            if admin_notes:
                order.admin_notes = admin_notes

            # Update timestamps
            if new_status == 'confirmed':
                order.confirmed_at = datetime.utcnow()
            elif new_status == 'shipped':
                order.shipped_at = datetime.utcnow()
            elif new_status == 'delivered':
                order.delivered_at = datetime.utcnow()

            db.session.commit()
            return order, None
        except SQLAlchemyError as e:
            db.session.rollback()
            raise e

    @staticmethod
    def cancel_order(order_id, reason=None):
        """Cancel order and restore stock"""
        try:
            order = Order.query.get(order_id)
            if not order:
                return None, "Order not found"

            if order.status in ['shipped', 'delivered']:
                return None, "Cannot cancel order that has been shipped or delivered"

            # Restore stock
            for item in order.items:
                product = Product.query.get(item.product_id)
                if product:
                    product.stock_quantity += item.quantity

            order.status = 'cancelled'
            if reason:
                order.admin_notes = f"Cancellation reason: {reason}"

            db.session.commit()
            return order, None
        except SQLAlchemyError as e:
            db.session.rollback()
            raise e

    @staticmethod
    def add_tracking_number(order_id, tracking_number):
        """Add tracking number to order"""
        try:
            order = Order.query.get(order_id)
            if not order:
                return None, "Order not found"

            order.tracking_number = tracking_number
            db.session.commit()
            return order, None
        except SQLAlchemyError as e:
            db.session.rollback()
            raise e
