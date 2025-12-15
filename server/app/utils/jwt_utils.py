from flask_jwt_extended import create_access_token, create_refresh_token
from datetime import timedelta
from typing import Dict

def generate_tokens(user_id: str, role: str = 'customer') -> Dict[str, str]:
    # Additional claims (data stored in token)
    additional_claims = {
        'role': role
    }

    # Create access token (15 minutes)