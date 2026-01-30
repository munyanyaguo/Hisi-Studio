"""consolidate_contact_entries_models

Revision ID: 5a06137b9c37
Revises: 4b083b4eb32e
Create Date: 2026-01-30 17:33:59.603259

"""
from alembic import op
import sqlalchemy as sa
from sqlalchemy.sql import text


# revision identifiers, used by Alembic.
revision = '5a06137b9c37'
down_revision = '4b083b4eb32e'
branch_labels = None
depends_on = None


def upgrade():
    # Create the unified contact_entries table
    op.create_table('contact_entries',
        sa.Column('id', sa.String(36), primary_key=True),
        sa.Column('entry_type', sa.String(20), nullable=False),
        sa.Column('created_at', sa.DateTime, nullable=False, server_default=sa.func.now()),
        sa.Column('updated_at', sa.DateTime, nullable=False, server_default=sa.func.now()),

        # Shared display fields (FAQ, Testimonial)
        sa.Column('display_order', sa.Integer, nullable=True, default=0),
        sa.Column('is_published', sa.Boolean, nullable=True, default=True),

        # Consultation-specific fields
        sa.Column('name', sa.String(200), nullable=True),
        sa.Column('email', sa.String(255), nullable=True),
        sa.Column('phone', sa.String(20), nullable=True),
        sa.Column('consultation_type', sa.String(50), nullable=True),
        sa.Column('meeting_type', sa.String(20), nullable=True),
        sa.Column('preferred_date', sa.Date, nullable=True),
        sa.Column('preferred_time', sa.String(20), nullable=True),
        sa.Column('status', sa.String(20), nullable=True),
        sa.Column('notes', sa.Text, nullable=True),
        sa.Column('admin_notes', sa.Text, nullable=True),
        sa.Column('confirmation_sent', sa.Boolean, nullable=True, default=False),

        # FAQ-specific fields
        sa.Column('category', sa.String(50), nullable=True),
        sa.Column('question', sa.Text, nullable=True),
        sa.Column('answer', sa.Text, nullable=True),

        # Testimonial-specific fields
        sa.Column('role', sa.String(200), nullable=True),
        sa.Column('image_url', sa.String(500), nullable=True),
        sa.Column('story', sa.Text, nullable=True),
        sa.Column('result', sa.String(500), nullable=True),
        sa.Column('rating', sa.Integer, nullable=True),
        sa.Column('is_featured', sa.Boolean, nullable=True, default=False),

        schema='hisi'
    )

    # Create index on entry_type for faster filtering
    op.create_index('ix_contact_entries_entry_type', 'contact_entries', ['entry_type'], schema='hisi')

    # Migrate data from consultations
    op.execute(text("""
        INSERT INTO hisi.contact_entries (
            id, entry_type, name, email, phone, consultation_type, meeting_type,
            preferred_date, preferred_time, status, notes, admin_notes,
            confirmation_sent, created_at, updated_at
        )
        SELECT
            id, 'consultation', name, email, phone, consultation_type, meeting_type,
            preferred_date, preferred_time, status, notes, admin_notes,
            confirmation_sent, created_at, updated_at
        FROM hisi.consultations
    """))

    # Migrate data from faqs
    op.execute(text("""
        INSERT INTO hisi.contact_entries (
            id, entry_type, category, question, answer, display_order,
            is_published, created_at, updated_at
        )
        SELECT
            id, 'faq', category, question, answer, display_order,
            is_published, created_at, updated_at
        FROM hisi.faqs
    """))

    # Migrate data from testimonials
    op.execute(text("""
        INSERT INTO hisi.contact_entries (
            id, entry_type, name, role, image_url, story, result, rating,
            is_featured, display_order, is_published, created_at, updated_at
        )
        SELECT
            id, 'testimonial', name, role, image_url, story, result, rating,
            is_featured, display_order, is_published, created_at, updated_at
        FROM hisi.testimonials
    """))

    # Drop the old tables
    op.drop_table('consultations', schema='hisi')
    op.drop_table('faqs', schema='hisi')
    op.drop_table('testimonials', schema='hisi')


def downgrade():
    # Recreate consultations table
    op.create_table('consultations',
        sa.Column('id', sa.String(36), primary_key=True),
        sa.Column('name', sa.String(200), nullable=False),
        sa.Column('email', sa.String(255), nullable=False),
        sa.Column('phone', sa.String(20), nullable=True),
        sa.Column('consultation_type', sa.String(50), nullable=False),
        sa.Column('meeting_type', sa.String(20), nullable=False),
        sa.Column('preferred_date', sa.Date, nullable=False),
        sa.Column('preferred_time', sa.String(20), nullable=False),
        sa.Column('status', sa.String(20), nullable=False, server_default='pending'),
        sa.Column('notes', sa.Text, nullable=True),
        sa.Column('admin_notes', sa.Text, nullable=True),
        sa.Column('confirmation_sent', sa.Boolean, nullable=False, server_default='false'),
        sa.Column('created_at', sa.DateTime, nullable=False),
        sa.Column('updated_at', sa.DateTime, nullable=False),
        schema='hisi'
    )

    # Recreate faqs table
    op.create_table('faqs',
        sa.Column('id', sa.String(36), primary_key=True),
        sa.Column('category', sa.String(50), nullable=False),
        sa.Column('question', sa.Text, nullable=False),
        sa.Column('answer', sa.Text, nullable=False),
        sa.Column('display_order', sa.Integer, nullable=False, server_default='0'),
        sa.Column('is_published', sa.Boolean, nullable=False, server_default='true'),
        sa.Column('created_at', sa.DateTime, nullable=False),
        sa.Column('updated_at', sa.DateTime, nullable=False),
        schema='hisi'
    )

    # Recreate testimonials table
    op.create_table('testimonials',
        sa.Column('id', sa.String(36), primary_key=True),
        sa.Column('name', sa.String(200), nullable=False),
        sa.Column('role', sa.String(200), nullable=True),
        sa.Column('image_url', sa.String(500), nullable=True),
        sa.Column('story', sa.Text, nullable=False),
        sa.Column('result', sa.String(500), nullable=True),
        sa.Column('rating', sa.Integer, nullable=False, server_default='5'),
        sa.Column('is_featured', sa.Boolean, nullable=False, server_default='false'),
        sa.Column('display_order', sa.Integer, nullable=False, server_default='0'),
        sa.Column('is_published', sa.Boolean, nullable=False, server_default='true'),
        sa.Column('created_at', sa.DateTime, nullable=False),
        sa.Column('updated_at', sa.DateTime, nullable=False),
        schema='hisi'
    )

    # Migrate data back to consultations
    op.execute(text("""
        INSERT INTO hisi.consultations (
            id, name, email, phone, consultation_type, meeting_type,
            preferred_date, preferred_time, status, notes, admin_notes,
            confirmation_sent, created_at, updated_at
        )
        SELECT
            id, name, email, phone, consultation_type, meeting_type,
            preferred_date, preferred_time, COALESCE(status, 'pending'), notes, admin_notes,
            COALESCE(confirmation_sent, false), created_at, updated_at
        FROM hisi.contact_entries
        WHERE entry_type = 'consultation'
    """))

    # Migrate data back to faqs
    op.execute(text("""
        INSERT INTO hisi.faqs (
            id, category, question, answer, display_order, is_published, created_at, updated_at
        )
        SELECT
            id, category, question, answer, COALESCE(display_order, 0),
            COALESCE(is_published, true), created_at, updated_at
        FROM hisi.contact_entries
        WHERE entry_type = 'faq'
    """))

    # Migrate data back to testimonials
    op.execute(text("""
        INSERT INTO hisi.testimonials (
            id, name, role, image_url, story, result, rating,
            is_featured, display_order, is_published, created_at, updated_at
        )
        SELECT
            id, name, role, image_url, story, result, COALESCE(rating, 5),
            COALESCE(is_featured, false), COALESCE(display_order, 0),
            COALESCE(is_published, true), created_at, updated_at
        FROM hisi.contact_entries
        WHERE entry_type = 'testimonial'
    """))

    # Drop the contact_entries table
    op.drop_index('ix_contact_entries_entry_type', 'contact_entries', schema='hisi')
    op.drop_table('contact_entries', schema='hisi')
