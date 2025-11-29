import re
from typing import Dict, List, Optional

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