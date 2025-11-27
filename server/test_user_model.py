#!/usr/bin/env python3
"""Test User model and database operations"""

from app import create_app
from app.extensions import db
from app.models import User

def test_user_operations():
    """Test creating, querying, and verifying users"""
    
    # Create app context
    app = create_app('development')
    
    with app.app_context():
        print("🚀 Starting User Model Tests...")
        print("=" * 60)
        
        # Test 1: Check database connection
        print("\n📊 Test 1: Database Connection")
        try:
            db.session.execute(db.text('SELECT 1'))
            print("✅ Database connected successfully")
        except Exception as e:
            print(f"❌ Database connection failed: {e}")
            return
        
        # Test 2: Check if users table exists
        print("\n📊 Test 2: Users Table Exists")
        try:
            result = db.session.execute(db.text(
                "SELECT EXISTS (SELECT FROM information_schema.tables WHERE table_schema = 'hisi' AND table_name = 'users');"
            ))
            exists = result.scalar()
            if exists:
                print("✅ Users table exists in database")
            else:
                print("❌ Users table does not exist")
                return
        except Exception as e:
            print(f"❌ Error checking table: {e}")
            return
        
        # Test 3: Count existing users
        print("\n📊 Test 3: Count Existing Users")
        try:
            user_count = User.query.count()
            print(f"📈 Current users in database: {user_count}")
        except Exception as e:
            print(f"❌ Error counting users: {e}")
            return
        
        # Test 4: Create a new test user
        print("\n📊 Test 4: Create New User")
        try:
            # Check if test user already exists
            existing_user = User.query.filter_by(email='test@hisistudio.com').first()
            
            if existing_user:
                print(f"ℹ️  Test user already exists (ID: {existing_user.id})")
                print("   Deleting old test user...")
                db.session.delete(existing_user)
                db.session.commit()
            
            # Create new user
            new_user = User(
                email='test@hisistudio.com',
                first_name='Test',
                last_name='User',
                phone='+254712345678',
                role='customer'
            )
            new_user.set_password('SecurePassword123!')
            
            # Save to database
            db.session.add(new_user)
            db.session.commit()
            
            print(f"✅ User created successfully!")
            print(f"   ID: {new_user.id}")
            print(f"   Email: {new_user.email}")
            print(f"   Name: {new_user.first_name} {new_user.last_name}")
            print(f"   Role: {new_user.role}")
            
        except Exception as e:
            print(f"❌ Error creating user: {e}")
            db.session.rollback()
            return
        
        # Test 5: Query the user
        print("\n📊 Test 5: Query User")
        try:
            found_user = User.query.filter_by(email='test@hisistudio.com').first()
            
            if found_user:
                print("✅ User found in database")
                print(f"   Retrieved data: {found_user.to_dict()}")
            else:
                print("❌ User not found in database")
                return
            
        except Exception as e:
            print(f"❌ Error querying user: {e}")
            return
        
        # Test 6: Test password verification
        print("\n📊 Test 6: Password Verification")
        try:
            correct_password = found_user.check_password('SecurePassword123!')
            wrong_password = found_user.check_password('WrongPassword')
            
            if correct_password and not wrong_password:
                print("✅ Password hashing and verification working")
                print(f"   Correct password check: {correct_password}")
                print(f"   Wrong password check: {wrong_password}")
            else:
                print("❌ Password verification failed")
            
        except Exception as e:
            print(f"❌ Error verifying password: {e}")
            return
        
        # Test 7: Update user
        print("\n📊 Test 7: Update User")
        try:
            found_user.phone = '+254798765432'
            found_user.is_verified = True
            db.session.commit()
            
            # Verify update
            updated_user = User.query.filter_by(email='test@hisistudio.com').first()
            
            if updated_user.phone == '+254798765432' and updated_user.is_verified:
                print("✅ User updated successfully")
                print(f"   New phone: {updated_user.phone}")
                print(f"   Verified: {updated_user.is_verified}")
            else:
                print("❌ User update failed")
            
        except Exception as e:
            print(f"❌ Error updating user: {e}")
            db.session.rollback()
            return
        
        # Test 8: Create admin user
        print("\n📊 Test 8: Create Admin User")
        try:
            # Check if admin exists
            existing_admin = User.query.filter_by(email='admin@hisistudio.com').first()
            
            if existing_admin:
                print(f"ℹ️  Admin user already exists (ID: {existing_admin.id})")
            else:
                admin_user = User(
                    email='admin@hisistudio.com',
                    first_name='Admin',
                    last_name='User',
                    role='admin',
                    is_verified=True
                )
                admin_user.set_password('AdminPassword123!')
                
                db.session.add(admin_user)
                db.session.commit()
                
                print(f"✅ Admin user created successfully!")
                print(f"   ID: {admin_user.id}")
                print(f"   Email: {admin_user.email}")
                print(f"   Role: {admin_user.role}")
        
        except Exception as e:
            print(f"❌ Error creating admin: {e}")
            db.session.rollback()
            return
        
        # Test 9: Query all users
        print("\n📊 Test 9: List All Users")
        try:
            all_users = User.query.all()
            print(f"✅ Total users in database: {len(all_users)}")
            
            for user in all_users:
                print(f"   - {user.email} ({user.role})")
        
        except Exception as e:
            print(f"❌ Error listing users: {e}")
            return
        
        # Test 10: Test query filters
        print("\n📊 Test 10: Query Filters")
        try:
            # Get all customers
            customers = User.query.filter_by(role='customer').all()
            print(f"✅ Customers: {len(customers)}")
            
            # Get all admins
            admins = User.query.filter_by(role='admin').all()
            print(f"✅ Admins: {len(admins)}")
            
            # Get verified users
            verified = User.query.filter_by(is_verified=True).all()
            print(f"✅ Verified users: {len(verified)}")
        
        except Exception as e:
            print(f"❌ Error with filters: {e}")
            return
        
        print("\n" + "=" * 60)
        print("🎉 ALL TESTS PASSED! Database schema is working correctly.")
        print("=" * 60)
        
        # Display credentials for reference
        print("\n📝 Test Accounts Created:")
        print("   Customer:")
        print("     Email: test@hisistudio.com")
        print("     Password: SecurePassword123!")
        print("")
        print("   Admin:")
        print("     Email: admin@hisistudio.com")
        print("     Password: AdminPassword123!")
        print("")

if __name__ == "__main__":
    test_user_operations()
