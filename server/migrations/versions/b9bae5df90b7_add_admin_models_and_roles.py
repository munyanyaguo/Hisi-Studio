"""add_admin_models_and_roles

Revision ID: b9bae5df90b7
Revises: a55e3a305587
Create Date: 2026-01-07 13:31:50.800300

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = 'b9bae5df90b7'
down_revision = 'a55e3a305587'
branch_labels = None
depends_on = None


def upgrade():
    # Add permissions column to users table
    op.add_column('users', sa.Column('permissions', sa.JSON(), nullable=True), schema='hisi')
    
    # Create notifications table
    op.create_table('notifications',
        sa.Column('id', sa.String(length=36), nullable=False),
        sa.Column('user_id', sa.String(length=36), nullable=False),
        sa.Column('type', sa.String(length=50), nullable=False),
        sa.Column('title', sa.String(length=255), nullable=False),
        sa.Column('message', sa.Text(), nullable=False),
        sa.Column('link', sa.String(length=500), nullable=True),
        sa.Column('is_read', sa.Boolean(), nullable=False, server_default='false'),
        sa.Column('is_email_sent', sa.Boolean(), nullable=False, server_default='false'),
        sa.Column('created_at', sa.DateTime(), nullable=False, server_default=sa.text('NOW()')),
        sa.Column('read_at', sa.DateTime(), nullable=True),
        sa.ForeignKeyConstraint(['user_id'], ['hisi.users.id'], ),
        sa.PrimaryKeyConstraint('id'),
        schema='hisi'
    )
    op.create_index(op.f('ix_hisi_notifications_user_id'), 'notifications', ['user_id'], unique=False, schema='hisi')
    
    # Create media_files table
    op.create_table('media_files',
        sa.Column('id', sa.String(length=36), nullable=False),
        sa.Column('filename', sa.String(length=255), nullable=False),
        sa.Column('original_filename', sa.String(length=255), nullable=False),
        sa.Column('file_path', sa.String(length=500), nullable=False),
        sa.Column('url', sa.String(length=500), nullable=False),
        sa.Column('file_type', sa.String(length=20), nullable=False),
        sa.Column('mime_type', sa.String(length=100), nullable=True),
        sa.Column('file_size', sa.BigInteger(), nullable=True),
        sa.Column('is_external', sa.Boolean(), nullable=False, server_default='false'),
        sa.Column('external_url', sa.String(length=500), nullable=True),
        sa.Column('alt_text', sa.String(length=255), nullable=True),
        sa.Column('caption', sa.Text(), nullable=True),
        sa.Column('tags', sa.JSON(), nullable=True),
        sa.Column('width', sa.Integer(), nullable=True),
        sa.Column('height', sa.Integer(), nullable=True),
        sa.Column('uploaded_by', sa.String(length=36), nullable=False),
        sa.Column('created_at', sa.DateTime(), nullable=False, server_default=sa.text('NOW()')),
        sa.Column('updated_at', sa.DateTime(), nullable=False, server_default=sa.text('NOW()')),
        sa.ForeignKeyConstraint(['uploaded_by'], ['hisi.users.id'], ),
        sa.PrimaryKeyConstraint('id'),
        schema='hisi'
    )
    op.create_index(op.f('ix_hisi_media_files_uploaded_by'), 'media_files', ['uploaded_by'], unique=False, schema='hisi')
    
    # Create messages table
    op.create_table('messages',
        sa.Column('id', sa.String(length=36), nullable=False),
        sa.Column('conversation_id', sa.String(length=36), nullable=False),
        sa.Column('sender_id', sa.String(length=36), nullable=False),
        sa.Column('recipient_id', sa.String(length=36), nullable=False),
        sa.Column('message', sa.Text(), nullable=False),
        sa.Column('is_read', sa.Boolean(), nullable=False, server_default='false'),
        sa.Column('read_at', sa.DateTime(), nullable=True),
        sa.Column('attachments', sa.JSON(), nullable=True),
        sa.Column('created_at', sa.DateTime(), nullable=False, server_default=sa.text('NOW()')),
        sa.ForeignKeyConstraint(['sender_id'], ['hisi.users.id'], ),
        sa.ForeignKeyConstraint(['recipient_id'], ['hisi.users.id'], ),
        sa.PrimaryKeyConstraint('id'),
        schema='hisi'
    )
    op.create_index(op.f('ix_hisi_messages_conversation_id'), 'messages', ['conversation_id'], unique=False, schema='hisi')
    
    # Create product_collections table
    op.create_table('product_collections',
        sa.Column('id', sa.String(length=36), nullable=False),
        sa.Column('name', sa.String(length=255), nullable=False),
        sa.Column('slug', sa.String(length=255), nullable=False),
        sa.Column('description', sa.Text(), nullable=True),
        sa.Column('featured_image_id', sa.String(length=36), nullable=True),
        sa.Column('products', sa.JSON(), nullable=True),
        sa.Column('is_published', sa.Boolean(), nullable=False, server_default='false'),
        sa.Column('display_order', sa.Integer(), nullable=False, server_default='0'),
        sa.Column('meta_title', sa.String(length=255), nullable=True),
        sa.Column('meta_description', sa.String(length=500), nullable=True),
        sa.Column('created_at', sa.DateTime(), nullable=False, server_default=sa.text('NOW()')),
        sa.Column('updated_at', sa.DateTime(), nullable=False, server_default=sa.text('NOW()')),
        sa.ForeignKeyConstraint(['featured_image_id'], ['hisi.media_files.id'], ),
        sa.PrimaryKeyConstraint('id'),
        schema='hisi'
    )
    op.create_index(op.f('ix_hisi_product_collections_slug'), 'product_collections', ['slug'], unique=True, schema='hisi')


def downgrade():
    # Drop tables in reverse order
    op.drop_index(op.f('ix_hisi_product_collections_slug'), table_name='product_collections', schema='hisi')
    op.drop_table('product_collections', schema='hisi')
    
    op.drop_index(op.f('ix_hisi_messages_conversation_id'), table_name='messages', schema='hisi')
    op.drop_table('messages', schema='hisi')
    
    op.drop_index(op.f('ix_hisi_media_files_uploaded_by'), table_name='media_files', schema='hisi')
    op.drop_table('media_files', schema='hisi')
    
    op.drop_index(op.f('ix_hisi_notifications_user_id'), table_name='notifications', schema='hisi')
    op.drop_table('notifications', schema='hisi')
    
    # Drop permissions column from users
    op.drop_column('users', 'permissions', schema='hisi')

