"""
Script to update the existing admin user's role from 'admin' to 'super_admin'
Run with: python fix_admin_role.py
"""

import sys
import os

# Add the parent directory to the path
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from app import create_app
from app.extensions import db
from app.models import User

def fix_admin_role():
    """Update admin user role"""
    app = create_app('development')
    
    with app.app_context():
        # Find the admin user
        admin = User.query.filter_by(email='admin@hisi.com').first()
        
        if not admin:
            print("❌ Admin user not found")
            return
        
        print(f"Found admin user: {admin.email}")
        print(f"Current role: {admin.role}")
        
        if admin.role == 'super_admin':
            print("✅ Admin role is already correct!")
            return
        
        # Update the role
        admin.role = 'super_admin'
        db.session.commit()
        
        print(f"✅ Admin role updated to: {admin.role}")
        print("\nYou can now login to the admin dashboard!")

if __name__ == '__main__':
    fix_admin_role()
