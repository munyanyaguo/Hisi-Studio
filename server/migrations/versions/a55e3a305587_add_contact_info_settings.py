"""add_contact_info_settings

Revision ID: a55e3a305587
Revises: 1be635fce785
Create Date: 2026-01-06 16:24:16.645440

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = 'a55e3a305587'
down_revision = '1be635fce785'
branch_labels = None
depends_on = None


def upgrade():
    # Insert contact information settings
    op.execute("""
        INSERT INTO hisi.site_settings (id, key, value, setting_type, description, updated_at)
        VALUES 
        (
            gen_random_uuid()::text,
            'contact_phone',
            '{"value": "+254 700 123 456", "action": "tel:+254700123456", "availability": "Mon-Fri, 9AM-6PM EAT"}',
            'json',
            'Phone contact information',
            NOW()
        ),
        (
            gen_random_uuid()::text,
            'contact_whatsapp',
            '{"value": "+254 700 123 456", "action": "https://wa.me/254700123456", "availability": "Usually responds in minutes"}',
            'json',
            'WhatsApp contact information',
            NOW()
        ),
        (
            gen_random_uuid()::text,
            'contact_email',
            '{"value": "hello@hisistudio.com", "action": "mailto:hello@hisistudio.com", "availability": "Response within 24 hours"}',
            'json',
            'Email contact information',
            NOW()
        ),
        (
            gen_random_uuid()::text,
            'contact_instagram',
            '{"value": "@hisi_studio", "action": "https://www.instagram.com/hisi_studio/", "availability": "Active daily"}',
            'json',
            'Instagram contact information',
            NOW()
        )
        ON CONFLICT (key) DO NOTHING;
    """)


def downgrade():
    # Remove contact information settings
    op.execute("""
        DELETE FROM hisi.site_settings 
        WHERE key IN ('contact_phone', 'contact_whatsapp', 'contact_email', 'contact_instagram');
    """)
