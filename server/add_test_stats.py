"""
Quick script to add some test data for contact stats
Run with: pipenv run python add_test_stats.py
"""

from app import create_app
from app.extensions import db
from app.models import ContactMessage, Consultation, Order
import uuid
from datetime import datetime, timedelta
import random

def add_test_data():
    """Add test contact messages and consultations"""
    print("\nAdding test data for contact stats...")
    
    app = create_app('development')
    
    with app.app_context():
        # Add some resolved contact messages
        print("\nAdding resolved contact messages...")
        for i in range(15):
            msg = ContactMessage(
                id=str(uuid.uuid4()),
                name=f"Test Customer {i+1}",
                email=f"customer{i+1}@test.com",
                phone=f"+25470012345{i}",
                category=random.choice(['general', 'custom', 'accessibility', 'partnership']),
                message=f"This is a test message {i+1}",
                status='resolved',
                is_read=True,
                replied_at=datetime.utcnow() - timedelta(days=random.randint(1, 30))
            )
            db.session.add(msg)
        
        # Add some new/in-progress messages
        print("Adding new contact messages...")
        for i in range(5):
            msg = ContactMessage(
                id=str(uuid.uuid4()),
                name=f"New Customer {i+1}",
                email=f"newcustomer{i+1}@test.com",
                phone=f"+25470098765{i}",
                category=random.choice(['general', 'custom', 'accessibility']),
                message=f"This is a new message {i+1}",
                status=random.choice(['new', 'in_progress']),
                is_read=random.choice([True, False])
            )
            db.session.add(msg)
        
        db.session.commit()
        print(f"✓ Added 20 contact messages")
        
        # Add completed consultations
        print("\nAdding completed consultations...")
        consultation_types = ['styling', 'accessibility', 'custom', 'fitting']
        for i in range(12):
            consultation = Consultation(
                id=str(uuid.uuid4()),
                name=f"Consultation Client {i+1}",
                email=f"client{i+1}@test.com",
                phone=f"+25470055544{i}",
                consultation_type=random.choice(consultation_types),
                meeting_type=random.choice(['in-person', 'virtual']),
                preferred_date=(datetime.utcnow() - timedelta(days=random.randint(1, 60))).date(),
                preferred_time=random.choice(['10:00 AM', '2:00 PM', '4:00 PM']),
                status='completed',
                confirmation_sent=True
            )
            db.session.add(consultation)
        
        # Add some pending consultations
        print("Adding pending consultations...")
        for i in range(3):
            consultation = Consultation(
                id=str(uuid.uuid4()),
                name=f"Pending Client {i+1}",
                email=f"pending{i+1}@test.com",
                phone=f"+25470033322{i}",
                consultation_type=random.choice(consultation_types),
                meeting_type=random.choice(['in-person', 'virtual']),
                preferred_date=(datetime.utcnow() + timedelta(days=random.randint(1, 14))).date(),
                preferred_time=random.choice(['10:00 AM', '2:00 PM', '4:00 PM']),
                status='pending',
                confirmation_sent=True
            )
            db.session.add(consultation)
        
        db.session.commit()
        print(f"✓ Added 15 consultations")
        
        # Calculate and display stats
        total_messages = ContactMessage.query.count()
        resolved_messages = ContactMessage.query.filter_by(status='resolved').count()
        total_consultations = Consultation.query.count()
        completed_consultations = Consultation.query.filter_by(status='completed').count()
        
        response_rate = round((resolved_messages / total_messages * 100) if total_messages > 0 else 0)
        
        print("\n" + "="*60)
        print("STATS SUMMARY")
        print("="*60)
        print(f"Total Messages: {total_messages}")
        print(f"Resolved Messages: {resolved_messages}")
        print(f"Response Rate: {response_rate}%")
        print(f"\nTotal Consultations: {total_consultations}")
        print(f"Completed Consultations: {completed_consultations}")
        print("\n✓ Test data added successfully!")
        print("="*60 + "\n")


if __name__ == '__main__':
    add_test_data()
