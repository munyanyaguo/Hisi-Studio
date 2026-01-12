"""
Script to create a super admin user for the Hisi Studio admin dashboard.
Run this script to create the initial admin account.

Usage:
    python create_admin.py
"""

import sys
import os

# Add the parent directory to the path
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from app import create_app
from app.extensions import db
from app.models import User
import uuid

def create_super_admin():
    """Create a super admin user"""
    app = create_app('development')
    
    with app.app_context():
        # Check if super admin already exists
        existing_admin = User.query.filter_by(role='super_admin').first()
        
        if existing_admin:
            print(f"Super admin already exists: {existing_admin.email}")
            response = input("Do you want to create another super admin? (y/n): ")
            if response.lower() != 'y':
                print("Aborted.")
                return
        
        # Get admin details
        print("\n=== Create Super Admin User ===\n")
        
        email = input("Email: ").strip()
        if not email:
            print("Error: Email is required")
            return
        
        # Check if email already exists
        existing_user = User.query.filter_by(email=email).first()
        if existing_user:
            print(f"Error: User with email {email} already exists")
            return
        
        first_name = input("First Name: ").strip()
        last_name = input("Last Name: ").strip()
        phone = input("Phone (optional): ").strip() or None
        password = input("Password: ").strip()
        
        if not password:
            print("Error: Password is required")
            return
        
        # Create the user
        admin_user = User(
            id=str(uuid.uuid4()),
            email=email,
            first_name=first_name,
            last_name=last_name,
            phone=phone,
            role='super_admin',
            is_verified=True,
            is_active=True
        )
        
        admin_user.set_password(password)
        
        try:
            db.session.add(admin_user)
            db.session.commit()
            
            print("\n✅ Super admin user created successfully!")
            print(f"Email: {email}")
            print(f"Role: super_admin")
            print(f"ID: {admin_user.id}")
            print("\nYou can now login to the admin dashboard at /admin")
            
        except Exception as e:
            db.session.rollback()
            print(f"\n❌ Error creating admin user: {str(e)}")

if __name__ == '__main__':
    create_super_admin()
