"""consolidate_press_events_models

Revision ID: 4b083b4eb32e
Revises: 3c16ba1a75a1
Create Date: 2026-01-30 17:03:10.902124

"""
from alembic import op
import sqlalchemy as sa
from sqlalchemy.sql import text


# revision identifiers, used by Alembic.
revision = '4b083b4eb32e'
down_revision = '3c16ba1a75a1'
branch_labels = None
depends_on = None


def upgrade():
    # Create the unified press_events table
    op.create_table('press_events',
        sa.Column('id', sa.String(36), primary_key=True),
        sa.Column('event_type', sa.String(20), nullable=False),
        sa.Column('title', sa.String(255), nullable=False),
        sa.Column('description', sa.Text, nullable=True),
        sa.Column('is_published', sa.Boolean, default=True, nullable=False),
        sa.Column('display_order', sa.Integer, nullable=False, default=0),
        sa.Column('date', sa.Date, nullable=True),
        sa.Column('location', sa.String(255), nullable=True),
        sa.Column('image', sa.String(500), nullable=True),
        sa.Column('gallery', sa.Text, nullable=True),
        sa.Column('event_name', sa.String(255), nullable=True),
        sa.Column('engagement_type', sa.String(50), nullable=True),
        sa.Column('partner', sa.String(255), nullable=True),
        sa.Column('year', sa.String(4), nullable=True),
        sa.Column('created_at', sa.DateTime, nullable=False, server_default=sa.func.now()),
        sa.Column('updated_at', sa.DateTime, nullable=False, server_default=sa.func.now()),
        schema='hisi'
    )

    # Create index on event_type for faster filtering
    op.create_index('ix_press_events_event_type', 'press_events', ['event_type'], schema='hisi')

    # Migrate data from exhibitions
    op.execute(text("""
        INSERT INTO hisi.press_events (id, event_type, title, description, is_published, display_order, date, location, image, gallery, created_at, updated_at)
        SELECT id, 'exhibition', title, description, is_published, display_order, date, location, image, gallery, created_at, updated_at
        FROM hisi.exhibitions
    """))

    # Migrate data from speaking_engagements
    op.execute(text("""
        INSERT INTO hisi.press_events (id, event_type, title, description, is_published, display_order, date, location, event_name, engagement_type, created_at, updated_at)
        SELECT id, 'speaking', title, description, is_published, display_order, date, location, event, engagement_type, created_at, updated_at
        FROM hisi.speaking_engagements
    """))

    # Migrate data from collaborations
    op.execute(text("""
        INSERT INTO hisi.press_events (id, event_type, title, description, is_published, display_order, image, partner, year, created_at, updated_at)
        SELECT id, 'collaboration', title, description, is_published, display_order, image, partner, year, created_at, updated_at
        FROM hisi.collaborations
    """))

    # Drop the old tables
    op.drop_table('exhibitions', schema='hisi')
    op.drop_table('speaking_engagements', schema='hisi')
    op.drop_table('collaborations', schema='hisi')


def downgrade():
    # Recreate exhibitions table
    op.create_table('exhibitions',
        sa.Column('id', sa.String(36), primary_key=True),
        sa.Column('title', sa.String(255), nullable=False),
        sa.Column('location', sa.String(255), nullable=False),
        sa.Column('date', sa.Date, nullable=False),
        sa.Column('description', sa.Text, nullable=True),
        sa.Column('image', sa.String(500), nullable=True),
        sa.Column('gallery', sa.Text, nullable=True),
        sa.Column('is_published', sa.Boolean, default=True, nullable=False),
        sa.Column('display_order', sa.Integer, nullable=False, default=0),
        sa.Column('created_at', sa.DateTime, nullable=False),
        sa.Column('updated_at', sa.DateTime, nullable=False),
        schema='hisi'
    )

    # Recreate speaking_engagements table
    op.create_table('speaking_engagements',
        sa.Column('id', sa.String(36), primary_key=True),
        sa.Column('title', sa.String(255), nullable=False),
        sa.Column('event', sa.String(255), nullable=False),
        sa.Column('location', sa.String(255), nullable=False),
        sa.Column('date', sa.Date, nullable=False),
        sa.Column('description', sa.Text, nullable=True),
        sa.Column('engagement_type', sa.String(50), nullable=False),
        sa.Column('is_published', sa.Boolean, default=True, nullable=False),
        sa.Column('display_order', sa.Integer, nullable=False, default=0),
        sa.Column('created_at', sa.DateTime, nullable=False),
        sa.Column('updated_at', sa.DateTime, nullable=False),
        schema='hisi'
    )

    # Recreate collaborations table
    op.create_table('collaborations',
        sa.Column('id', sa.String(36), primary_key=True),
        sa.Column('title', sa.String(255), nullable=False),
        sa.Column('partner', sa.String(255), nullable=False),
        sa.Column('description', sa.Text, nullable=True),
        sa.Column('image', sa.String(500), nullable=True),
        sa.Column('year', sa.String(4), nullable=False),
        sa.Column('is_published', sa.Boolean, default=True, nullable=False),
        sa.Column('display_order', sa.Integer, nullable=False, default=0),
        sa.Column('created_at', sa.DateTime, nullable=False),
        sa.Column('updated_at', sa.DateTime, nullable=False),
        schema='hisi'
    )

    # Migrate data back from press_events to exhibitions
    op.execute(text("""
        INSERT INTO hisi.exhibitions (id, title, location, date, description, image, gallery, is_published, display_order, created_at, updated_at)
        SELECT id, title, location, date, description, image, gallery, is_published, display_order, created_at, updated_at
        FROM hisi.press_events
        WHERE event_type = 'exhibition'
    """))

    # Migrate data back from press_events to speaking_engagements
    op.execute(text("""
        INSERT INTO hisi.speaking_engagements (id, title, event, location, date, description, engagement_type, is_published, display_order, created_at, updated_at)
        SELECT id, title, event_name, location, date, description, engagement_type, is_published, display_order, created_at, updated_at
        FROM hisi.press_events
        WHERE event_type = 'speaking'
    """))

    # Migrate data back from press_events to collaborations
    op.execute(text("""
        INSERT INTO hisi.collaborations (id, title, partner, description, image, year, is_published, display_order, created_at, updated_at)
        SELECT id, title, partner, description, image, year, is_published, display_order, created_at, updated_at
        FROM hisi.press_events
        WHERE event_type = 'collaboration'
    """))

    # Drop the press_events table
    op.drop_index('ix_press_events_event_type', 'press_events', schema='hisi')
    op.drop_table('press_events', schema='hisi')
