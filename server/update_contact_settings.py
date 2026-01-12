#!/usr/bin/env python3
"""Update contact settings to JSON format"""

from app import create_app
from app.models import SiteSetting
from app.extensions import db
import json

app = create_app()

with app.app_context():
    # Update phone
    phone = SiteSetting.query.filter_by(key='contact_phone').first()
    if phone:
        phone.value = json.dumps({
            "value": "+254 700 123 456",
            "action": "tel:+254700123456",
            "availability": "Mon-Fri, 9AM-6PM EAT"
        })
        phone.setting_type = 'json'
        phone.description = 'Phone contact information'
    
    # Update whatsapp
    whatsapp = SiteSetting.query.filter_by(key='contact_whatsapp').first()
    if whatsapp:
        whatsapp.value = json.dumps({
            "value": "+254 700 123 456",
            "action": "https://wa.me/254700123456",
            "availability": "Usually responds in minutes"
        })
        whatsapp.setting_type = 'json'
        whatsapp.description = 'WhatsApp contact information'
    
    # Update email
    email = SiteSetting.query.filter_by(key='contact_email').first()
    if email:
        email.value = json.dumps({
            "value": "hello@hisistudio.com",
            "action": "mailto:hello@hisistudio.com",
            "availability": "Response within 24 hours"
        })
        email.setting_type = 'json'
        email.description = 'Email contact information'
    
    # Update instagram
    instagram = SiteSetting.query.filter_by(key='contact_instagram').first()
    if instagram:
        instagram.value = json.dumps({
            "value": "@hisi_studio",
            "action": "https://www.instagram.com/hisi_studio/",
            "availability": "Active daily"
        })
        instagram.setting_type = 'json'
        instagram.description = 'Instagram contact information'
    
    db.session.commit()
    print("Contact settings updated successfully!")
    
    # Verify
    print("\nVerifying updated settings:")
    for key in ['contact_phone', 'contact_whatsapp', 'contact_email', 'contact_instagram']:
        setting = SiteSetting.query.filter_by(key=key).first()
        if setting:
            print(f"{key}: {setting.value[:50]}...")
