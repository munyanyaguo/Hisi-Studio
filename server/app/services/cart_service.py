"""Cart service - Business logic for shopping cart"""

from app.extensions import db
from app.models import Cart, CartItem, Product
from sqlalchemy.exc import SQLAlchemyError


class CartService:
    """Service for managing shopping carts"""

    @staticmethod
    def get_or_create_cart(user_id=None, session_id=None):
        """Get existing cart or create new one"""
        try:
            if user_id:
                cart = Cart.query.filter_by(user_id=user_id).first()
            elif session_id:
                cart = Cart.query.filter_by(session_id=session_id).first()
            else:
                return None

            if not cart:
                cart = Cart(user_id=user_id, session_id=session_id)
                db.session.add(cart)
                db.session.commit()

            return cart
        except SQLAlchemyError as e:
            db.session.rollback()
            raise e

    @staticmethod
    def add_to_cart(cart, product_id, quantity=1):
        """Add product to cart or update quantity"""
        try:
            # Get product
            product = Product.query.get(product_id)
            if not product:
                return None, "Product not found"

            if not product.is_active:
                return None, "Product is not available"

            # Check stock
            if product.stock_quantity < quantity:
                return None, f"Only {product.stock_quantity} items available"

            # Check if item already in cart
            cart_item = CartItem.query.filter_by(
                cart_id=cart.id,
                product_id=product_id
            ).first()

            if cart_item:
                # Update quantity
                new_quantity = cart_item.quantity + quantity
                if product.stock_quantity < new_quantity:
                    return None, f"Cannot add more. Only {product.stock_quantity} items available"
                cart_item.quantity = new_quantity
            else:
                # Create new cart item
                cart_item = CartItem(
                    cart_id=cart.id,
                    product_id=product_id,
                    quantity=quantity,
                    price_at_addition=product.price
                )
                db.session.add(cart_item)

            db.session.commit()
            return cart_item, None
        except SQLAlchemyError as e:
            db.session.rollback()
            raise e

    @staticmethod
    def update_cart_item(cart_item_id, quantity):
        """Update cart item quantity"""
        try:
            cart_item = CartItem.query.get(cart_item_id)
            if not cart_item:
                return None, "Cart item not found"

            if quantity <= 0:
                return None, "Quantity must be greater than 0"

            # Check stock
            product = cart_item.product
            if product.stock_quantity < quantity:
                return None, f"Only {product.stock_quantity} items available"

            cart_item.quantity = quantity
            db.session.commit()
            return cart_item, None
        except SQLAlchemyError as e:
            db.session.rollback()
            raise e

    @staticmethod
    def remove_from_cart(cart_item_id):
        """Remove item from cart"""
        try:
            cart_item = CartItem.query.get(cart_item_id)
            if not cart_item:
                return False, "Cart item not found"

            db.session.delete(cart_item)
            db.session.commit()
            return True, None
        except SQLAlchemyError as e:
            db.session.rollback()
            raise e

    @staticmethod
    def clear_cart(cart_id):
        """Clear all items from cart"""
        try:
            CartItem.query.filter_by(cart_id=cart_id).delete()
            db.session.commit()
            return True, None
        except SQLAlchemyError as e:
            db.session.rollback()
            raise e

    @staticmethod
    def merge_guest_cart_to_user(session_id, user_id):
        """Merge guest cart into user cart after login"""
        try:
            # Get guest cart
            guest_cart = Cart.query.filter_by(session_id=session_id).first()
            if not guest_cart or not guest_cart.items:
                return True, None

            # Get or create user cart
            user_cart = CartService.get_or_create_cart(user_id=user_id)

            # Merge items
            for guest_item in guest_cart.items:
                # Check if product already in user cart
                existing_item = CartItem.query.filter_by(
                    cart_id=user_cart.id,
                    product_id=guest_item.product_id
                ).first()

                if existing_item:
                    # Update quantity
                    existing_item.quantity += guest_item.quantity
                else:
                    # Move item to user cart
                    guest_item.cart_id = user_cart.id

            # Delete guest cart
            db.session.delete(guest_cart)
            db.session.commit()
            return True, None
        except SQLAlchemyError as e:
            db.session.rollback()
            raise e

    @staticmethod
    def validate_cart_stock(cart):
        """Validate that all cart items are in stock"""
        errors = []
        for item in cart.items:
            product = item.product
            if not product.is_active:
                errors.append(f"{product.name} is no longer available")
            elif product.stock_quantity < item.quantity:
                errors.append(
                    f"{product.name}: Only {product.stock_quantity} available, "
                    f"but {item.quantity} in cart"
                )

        return len(errors) == 0, errors
