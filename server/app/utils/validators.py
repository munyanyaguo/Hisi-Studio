"""
Input validation utilities for API endpoints.
Provides validators and a decorator for easy route validation.
"""

import re
from functools import wraps
from typing import Dict, List, Optional, Callable
from flask import request, jsonify


def validate_request(validator_func: Callable[[Dict], Dict[str, str]]):
    """
    Decorator to validate request JSON data before processing.

    Usage:
        @bp.route('/register', methods=['POST'])
        @validate_request(validate_registration_data)
        def register():
            # Request data is already validated
            data = request.get_json()
            ...
    """
    def decorator(f):
        @wraps(f)
        def decorated_function(*args, **kwargs):
            data = request.get_json()
            if not data:
                return jsonify({
                    'success': False,
                    'message': 'Request body is required',
                    'errors': {'body': 'No JSON data provided'}
                }), 400

            errors = validator_func(data)
            if errors:
                return jsonify({
                    'success': False,
                    'message': 'Validation failed',
                    'errors': errors
                }), 400

            return f(*args, **kwargs)
        return decorated_function
    return decorator


def validate_email(email: str) -> tuple[bool, Optional[str]]:
    if not email:
        return False, "Email is required."
    
    if len(email) > 255:
        return False, "Email too long."
    
    # Email regex pattern
    pattern = r'^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$'

    if not re.match(pattern, email):
        return False, "Invalid email format."
    
    return True, None


def validate_password(password: str) -> tuple[bool, Optional[str]]:
    if not password:
        return False, "Password is required."
    
    if len(password) < 8:
        return False, "Password must be at least 8 characters long."
    
    if len(password) > 128:
        return False, "Password is too long."
    
    if not re.search(r'[A-Z]', password):
        return False, "Password must contain at least one uppercase letter"
    
    if not re.search(r'[a-z]', password):
        return False, "Password must contain at least one lowercase letter"
    
    if not re.search(r'\d', password):
        return False, "Password must contain at least one number"
    
    return True, None


def validate_name(name: str, field_name: str = "Name") -> tuple[bool, Optional[str]]:
    if not name:
        return False, f"{field_name} is required"
    
    if len(name) < 2:
        return False, f"{field_name} must be at least 2 characters"
    
    if len(name) > 100:
        return False, f"{field_name} is too long"
    
    # Only letters, spaces, hyphens, and apostrophes
    if not re.match(r"^[a-zA-Z\s\-']+$", name):
        return False, f"{field_name} contains invalid characters"
    
    return True, None

def validate_phone(phone: str) -> tuple[bool, Optional[str]]:
    if not phone:
        return True, None # Phone is optional
    
    # Remove spaces and dashes
    cleaned = re.sub(r'[\s\-]', '', phone)

    # Kenyan phone number patterns
    patterns = [
        r'^\+254[17]\d{8}$',  # +254712345678
        r'^254[17]\d{8}$',    # 254712345678
        r'^0[17]\d{8}$'       # 0712345678
    ]

    if not any(re.match(pattern, cleaned) for pattern in patterns):
        return False, "Invalid phone number format. Use: +2547XXXXXXXX, 2547XXXXXXXX, or 07XXXXXXXX."
    
    return True, None


def validate_registration_data(data: Dict) -> Dict[str, str]:
    errors = {}

    # Validate email
    email = data.get('email', '').strip()
    valid, error = validate_email(email)
    if not valid:
        errors['email'] = error

    # Validate password
    password = data.get('password', '')
    valid, error = validate_password(password)
    if not valid:
        errors['password'] = error

    # Validate first name
    first_name = data.get('first_name', '').strip()
    valid, error = validate_name(first_name, "First name")
    if not valid:
        errors['first_name'] = error

    # Validate last name
    last_name = data.get('last_name', '').strip()
    valid, error = validate_name(last_name, "Last name")
    if not valid:
        errors['last_name'] = error

    # Validate phone (optional)
    phone = data.get('phone', '').strip()
    if phone:
        valid, error = validate_phone(phone)
        if not valid:
            errors['phone'] = error

    return errors

def validate_login_data(data: Dict) -> Dict[str, str]:
    errors = {}

    # Validate email
    email = data.get('email', '').strip()
    if not email:
        errors['email'] = "Email is required"

    # Validate password
    password = data.get('password', '')
    if not password:
        errors['password'] = "Password is required"

    return errors

def validate_profile_update(data: Dict) -> Dict[str, str]:
    errors = {}

    # Validate first name (if provided)
    if 'first_name' in data:
        first_name = data['first_name'].strip()
        valid, error = validate_name(first_name, "First name")
        if not valid:
            errors['first_name'] = error

    # Validate last name (if provided)
    if 'last_name' in data:
        last_name = data['last_name'].strip()
        valid, error = validate_name(last_name, "Last name")
        if not valid:
            errors['last_name'] = error

    # Validate phone (if provided)
    if 'phone' in data:
        phone = data['phone'].strip()
        valid, error = validate_phone(phone)
        if not valid:
            errors['phone'] = error

    return errors


# ============== Product Validators ==============

def validate_price(price, field_name: str = "Price") -> tuple[bool, Optional[str]]:
    """Validate price is a positive number."""
    if price is None:
        return False, f"{field_name} is required"

    try:
        price_float = float(price)
        if price_float < 0:
            return False, f"{field_name} cannot be negative"
        if price_float > 10000000:  # 10 million limit
            return False, f"{field_name} exceeds maximum allowed value"
        return True, None
    except (TypeError, ValueError):
        return False, f"{field_name} must be a valid number"


def validate_product_data(data: Dict) -> Dict[str, str]:
    """Validate product creation/update data."""
    errors = {}

    # Required fields
    name = data.get('name', '').strip() if data.get('name') else ''
    if not name:
        errors['name'] = "Product name is required"
    elif len(name) > 255:
        errors['name'] = "Product name is too long"

    slug = data.get('slug', '').strip() if data.get('slug') else ''
    if not slug:
        errors['slug'] = "Slug is required"
    elif not re.match(r'^[a-z0-9]+(?:-[a-z0-9]+)*$', slug):
        errors['slug'] = "Slug must be lowercase letters, numbers, and hyphens only"

    # Price validation
    valid, error = validate_price(data.get('price'))
    if not valid:
        errors['price'] = error

    # SKU validation
    sku = data.get('sku', '').strip() if data.get('sku') else ''
    if not sku:
        errors['sku'] = "SKU is required"
    elif len(sku) > 50:
        errors['sku'] = "SKU is too long"

    # Stock quantity
    stock = data.get('stock_quantity')
    if stock is not None:
        try:
            stock_int = int(stock)
            if stock_int < 0:
                errors['stock_quantity'] = "Stock cannot be negative"
        except (TypeError, ValueError):
            errors['stock_quantity'] = "Stock must be a valid number"

    return errors


# ============== Contact/Message Validators ==============

def validate_contact_message(data: Dict) -> Dict[str, str]:
    """Validate contact form submission."""
    errors = {}

    # Name validation
    name = data.get('name', '').strip() if data.get('name') else ''
    valid, error = validate_name(name, "Name")
    if not valid:
        errors['name'] = error

    # Email validation
    email = data.get('email', '').strip() if data.get('email') else ''
    valid, error = validate_email(email)
    if not valid:
        errors['email'] = error

    # Message validation
    message = data.get('message', '').strip() if data.get('message') else ''
    if not message:
        errors['message'] = "Message is required"
    elif len(message) < 10:
        errors['message'] = "Message must be at least 10 characters"
    elif len(message) > 5000:
        errors['message'] = "Message is too long (max 5000 characters)"

    # Optional phone
    phone = data.get('phone', '').strip() if data.get('phone') else ''
    if phone:
        valid, error = validate_phone(phone)
        if not valid:
            errors['phone'] = error

    return errors


# ============== Order Validators ==============

def validate_order_data(data: Dict) -> Dict[str, str]:
    """Validate order creation data."""
    errors = {}

    # Shipping address validation
    shipping = data.get('shipping_address', {})
    if not shipping:
        errors['shipping_address'] = "Shipping address is required"
    else:
        if not shipping.get('street'):
            errors['shipping_address.street'] = "Street address is required"
        if not shipping.get('city'):
            errors['shipping_address.city'] = "City is required"
        if not shipping.get('country'):
            errors['shipping_address.country'] = "Country is required"

    # Payment method
    payment_method = data.get('payment_method', '').strip() if data.get('payment_method') else ''
    valid_methods = ['card', 'mpesa', 'bank_transfer', 'cash_on_delivery']
    if payment_method and payment_method not in valid_methods:
        errors['payment_method'] = f"Invalid payment method. Must be one of: {', '.join(valid_methods)}"

    return errors


# ============== Newsletter Validators ==============

def validate_newsletter_subscription(data: Dict) -> Dict[str, str]:
    """Validate newsletter subscription."""
    errors = {}

    email = data.get('email', '').strip() if data.get('email') else ''
    valid, error = validate_email(email)
    if not valid:
        errors['email'] = error

    return errors