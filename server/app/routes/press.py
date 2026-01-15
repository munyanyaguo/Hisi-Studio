"""Press API routes - Public and Admin endpoints for Press page content"""

from flask import Blueprint, request
from flask_jwt_extended import jwt_required, get_jwt_identity
from app.extensions import db
from app.models import (
    User, PressHero, MediaCoverage, PressRelease, Exhibition,
    SpeakingEngagement, Collaboration, MediaKitItem, MediaKitConfig, PressContact
)
from app.utils.responses import (
    success_response, error_response, created_response,
    not_found_response, forbidden_response
)
from datetime import datetime
import json
import uuid

bp = Blueprint('press', __name__, url_prefix='/api/v1')


# ========== HELPER FUNCTIONS ==========

def verify_admin_access():
    """Verify current user has admin access"""
    user_id = get_jwt_identity()
    user = User.query.get(user_id)
    if not user or not user.is_admin():
        return None
    return user


# ========== PUBLIC ROUTES ==========

@bp.route('/press', methods=['GET'])
def get_press_page_content():
    """Get all press page content (public)"""
    try:
        # Get hero section
        hero = PressHero.query.first()
        hero_data = hero.to_dict() if hero else {
            'title': 'Press & Media',
            'subtitle': 'In the Spotlight',
            'description': 'Discover our media coverage and press releases.'
        }
        
        # Get featured media
        featured_media = MediaCoverage.query.filter_by(
            is_published=True
        ).order_by(
            MediaCoverage.is_featured.desc(),
            MediaCoverage.date.desc()
        ).all()
        
        # Get press releases
        press_releases = PressRelease.query.filter_by(
            is_published=True
        ).order_by(PressRelease.date.desc()).all()
        
        # Get exhibitions
        exhibitions = Exhibition.query.filter_by(
            is_published=True
        ).order_by(Exhibition.date.desc()).all()
        
        # Get speaking engagements
        speaking_engagements = SpeakingEngagement.query.filter_by(
            is_published=True
        ).order_by(SpeakingEngagement.date.desc()).all()
        
        # Get collaborations
        collaborations = Collaboration.query.filter_by(
            is_published=True
        ).order_by(Collaboration.display_order).all()
        
        # Get media kit config and items
        media_kit_config = MediaKitConfig.query.first()
        media_kit_items = MediaKitItem.query.order_by(MediaKitItem.display_order).all()
        
        # Get press contact
        press_contact = PressContact.query.first()
        
        return success_response(data={
            'hero': hero_data,
            'featuredMedia': [m.to_dict() for m in featured_media],
            'pressReleases': [r.to_dict() for r in press_releases],
            'exhibitions': [e.to_dict() for e in exhibitions],
            'speakingEngagements': [s.to_dict() for s in speaking_engagements],
            'collaborations': [c.to_dict() for c in collaborations],
            'mediaKit': {
                'title': media_kit_config.title if media_kit_config else 'Media Kit',
                'description': media_kit_config.description if media_kit_config else 'Download our press kit.',
                'items': [i.to_dict() for i in media_kit_items]
            },
            'contactPress': press_contact.to_dict() if press_contact else {
                'title': 'Media Inquiries',
                'description': 'For press inquiries, please contact us.',
                'email': 'press@hisistudio.com',
                'phone': '+254 XXX XXX XXX'
            }
        })
    except Exception as e:
        return error_response(str(e), status_code=500)


@bp.route('/press/media-coverage', methods=['GET'])
def get_media_coverage():
    """Get all media coverage items (public)"""
    try:
        items = MediaCoverage.query.filter_by(
            is_published=True
        ).order_by(
            MediaCoverage.is_featured.desc(),
            MediaCoverage.date.desc()
        ).all()
        return success_response(data=[item.to_dict() for item in items])
    except Exception as e:
        return error_response(str(e), status_code=500)


@bp.route('/press/exhibitions', methods=['GET'])
def get_exhibitions():
    """Get all exhibitions (public)"""
    try:
        items = Exhibition.query.filter_by(
            is_published=True
        ).order_by(Exhibition.date.desc()).all()
        return success_response(data=[item.to_dict() for item in items])
    except Exception as e:
        return error_response(str(e), status_code=500)


@bp.route('/press/releases', methods=['GET'])
def get_press_releases():
    """Get all press releases (public)"""
    try:
        items = PressRelease.query.filter_by(
            is_published=True
        ).order_by(PressRelease.date.desc()).all()
        return success_response(data=[item.to_dict() for item in items])
    except Exception as e:
        return error_response(str(e), status_code=500)


# ========== ADMIN ROUTES ==========

# ----- Hero Section -----

@bp.route('/admin/press/hero', methods=['GET'])
@jwt_required()
def admin_get_press_hero():
    """Get press hero section (admin)"""
    user = verify_admin_access()
    if not user:
        return forbidden_response("Admin access required")
    
    try:
        hero = PressHero.query.first()
        return success_response(data=hero.to_dict() if hero else None)
    except Exception as e:
        return error_response(str(e), status_code=500)


@bp.route('/admin/press/hero', methods=['PUT'])
@jwt_required()
def admin_update_press_hero():
    """Update press hero section (admin)"""
    user = verify_admin_access()
    if not user:
        return forbidden_response("Admin access required")
    
    try:
        data = request.get_json()
        hero = PressHero.query.first()
        
        if not hero:
            hero = PressHero(id=str(uuid.uuid4()))
            db.session.add(hero)
        
        if 'title' in data:
            hero.title = data['title']
        if 'subtitle' in data:
            hero.subtitle = data['subtitle']
        if 'description' in data:
            hero.description = data['description']
        if 'image' in data:
            hero.image = data['image']
        
        db.session.commit()
        return success_response(data=hero.to_dict(), message="Press hero updated")
    except Exception as e:
        db.session.rollback()
        return error_response(str(e), status_code=500)


# ----- Media Coverage -----

@bp.route('/admin/press/media-coverage', methods=['GET'])
@jwt_required()
def admin_get_media_coverage():
    """Get all media coverage (admin)"""
    user = verify_admin_access()
    if not user:
        return forbidden_response("Admin access required")
    
    try:
        items = MediaCoverage.query.order_by(
            MediaCoverage.is_featured.desc(),
            MediaCoverage.date.desc()
        ).all()
        return success_response(data=[item.to_dict() for item in items])
    except Exception as e:
        return error_response(str(e), status_code=500)


@bp.route('/admin/press/media-coverage', methods=['POST'])
@jwt_required()
def admin_create_media_coverage():
    """Create media coverage item (admin)"""
    user = verify_admin_access()
    if not user:
        return forbidden_response("Admin access required")
    
    try:
        data = request.get_json()
        
        # Validation
        required = ['title', 'outlet', 'date', 'category']
        for field in required:
            if not data.get(field):
                return error_response(f"{field} is required", status_code=400)
        
        item = MediaCoverage(
            id=str(uuid.uuid4()),
            title=data['title'],
            outlet=data['outlet'],
            date=datetime.strptime(data['date'], '%Y-%m-%d').date(),
            category=data['category'],
            description=data.get('description'),
            image=data.get('image'),
            link=data.get('link'),
            is_featured=data.get('is_featured', False),
            is_published=data.get('is_published', True),
            display_order=data.get('display_order', 0)
        )
        
        db.session.add(item)
        db.session.commit()
        
        return created_response(data=item.to_dict(), message="Media coverage created")
    except Exception as e:
        db.session.rollback()
        return error_response(str(e), status_code=500)


@bp.route('/admin/press/media-coverage/<item_id>', methods=['PUT'])
@jwt_required()
def admin_update_media_coverage(item_id):
    """Update media coverage item (admin)"""
    user = verify_admin_access()
    if not user:
        return forbidden_response("Admin access required")
    
    try:
        item = MediaCoverage.query.get(item_id)
        if not item:
            return not_found_response("Media coverage not found")
        
        data = request.get_json()
        
        if 'title' in data:
            item.title = data['title']
        if 'outlet' in data:
            item.outlet = data['outlet']
        if 'date' in data:
            item.date = datetime.strptime(data['date'], '%Y-%m-%d').date()
        if 'category' in data:
            item.category = data['category']
        if 'description' in data:
            item.description = data['description']
        if 'image' in data:
            item.image = data['image']
        if 'link' in data:
            item.link = data['link']
        if 'is_featured' in data:
            item.is_featured = data['is_featured']
        if 'is_published' in data:
            item.is_published = data['is_published']
        if 'display_order' in data:
            item.display_order = data['display_order']
        
        db.session.commit()
        return success_response(data=item.to_dict(), message="Media coverage updated")
    except Exception as e:
        db.session.rollback()
        return error_response(str(e), status_code=500)


@bp.route('/admin/press/media-coverage/<item_id>', methods=['DELETE'])
@jwt_required()
def admin_delete_media_coverage(item_id):
    """Delete media coverage item (admin)"""
    user = verify_admin_access()
    if not user:
        return forbidden_response("Admin access required")
    
    try:
        item = MediaCoverage.query.get(item_id)
        if not item:
            return not_found_response("Media coverage not found")
        
        db.session.delete(item)
        db.session.commit()
        return success_response(message="Media coverage deleted")
    except Exception as e:
        db.session.rollback()
        return error_response(str(e), status_code=500)


# ----- Press Releases -----

@bp.route('/admin/press/releases', methods=['GET'])
@jwt_required()
def admin_get_press_releases():
    """Get all press releases (admin)"""
    user = verify_admin_access()
    if not user:
        return forbidden_response("Admin access required")
    
    try:
        items = PressRelease.query.order_by(PressRelease.date.desc()).all()
        return success_response(data=[item.to_dict() for item in items])
    except Exception as e:
        return error_response(str(e), status_code=500)


@bp.route('/admin/press/releases', methods=['POST'])
@jwt_required()
def admin_create_press_release():
    """Create press release (admin)"""
    user = verify_admin_access()
    if not user:
        return forbidden_response("Admin access required")
    
    try:
        data = request.get_json()
        
        required = ['title', 'date']
        for field in required:
            if not data.get(field):
                return error_response(f"{field} is required", status_code=400)
        
        item = PressRelease(
            id=str(uuid.uuid4()),
            title=data['title'],
            date=datetime.strptime(data['date'], '%Y-%m-%d').date(),
            excerpt=data.get('excerpt'),
            content=data.get('content'),
            link=data.get('link'),
            is_published=data.get('is_published', True),
            display_order=data.get('display_order', 0)
        )
        
        db.session.add(item)
        db.session.commit()
        
        return created_response(data=item.to_dict(), message="Press release created")
    except Exception as e:
        db.session.rollback()
        return error_response(str(e), status_code=500)


@bp.route('/admin/press/releases/<item_id>', methods=['PUT'])
@jwt_required()
def admin_update_press_release(item_id):
    """Update press release (admin)"""
    user = verify_admin_access()
    if not user:
        return forbidden_response("Admin access required")
    
    try:
        item = PressRelease.query.get(item_id)
        if not item:
            return not_found_response("Press release not found")
        
        data = request.get_json()
        
        if 'title' in data:
            item.title = data['title']
        if 'date' in data:
            item.date = datetime.strptime(data['date'], '%Y-%m-%d').date()
        if 'excerpt' in data:
            item.excerpt = data['excerpt']
        if 'content' in data:
            item.content = data['content']
        if 'link' in data:
            item.link = data['link']
        if 'is_published' in data:
            item.is_published = data['is_published']
        if 'display_order' in data:
            item.display_order = data['display_order']
        
        db.session.commit()
        return success_response(data=item.to_dict(), message="Press release updated")
    except Exception as e:
        db.session.rollback()
        return error_response(str(e), status_code=500)


@bp.route('/admin/press/releases/<item_id>', methods=['DELETE'])
@jwt_required()
def admin_delete_press_release(item_id):
    """Delete press release (admin)"""
    user = verify_admin_access()
    if not user:
        return forbidden_response("Admin access required")
    
    try:
        item = PressRelease.query.get(item_id)
        if not item:
            return not_found_response("Press release not found")
        
        db.session.delete(item)
        db.session.commit()
        return success_response(message="Press release deleted")
    except Exception as e:
        db.session.rollback()
        return error_response(str(e), status_code=500)


# ----- Exhibitions -----

@bp.route('/admin/press/exhibitions', methods=['GET'])
@jwt_required()
def admin_get_exhibitions():
    """Get all exhibitions (admin)"""
    user = verify_admin_access()
    if not user:
        return forbidden_response("Admin access required")
    
    try:
        items = Exhibition.query.order_by(Exhibition.date.desc()).all()
        return success_response(data=[item.to_dict() for item in items])
    except Exception as e:
        return error_response(str(e), status_code=500)


@bp.route('/admin/press/exhibitions', methods=['POST'])
@jwt_required()
def admin_create_exhibition():
    """Create exhibition (admin)"""
    user = verify_admin_access()
    if not user:
        return forbidden_response("Admin access required")
    
    try:
        data = request.get_json()
        
        required = ['title', 'location', 'date']
        for field in required:
            if not data.get(field):
                return error_response(f"{field} is required", status_code=400)
        
        gallery = data.get('gallery', [])
        if isinstance(gallery, list):
            gallery = json.dumps(gallery)
        
        item = Exhibition(
            id=str(uuid.uuid4()),
            title=data['title'],
            location=data['location'],
            date=datetime.strptime(data['date'], '%Y-%m-%d').date(),
            description=data.get('description'),
            image=data.get('image'),
            gallery=gallery,
            is_published=data.get('is_published', True),
            display_order=data.get('display_order', 0)
        )
        
        db.session.add(item)
        db.session.commit()
        
        return created_response(data=item.to_dict(), message="Exhibition created")
    except Exception as e:
        db.session.rollback()
        return error_response(str(e), status_code=500)


@bp.route('/admin/press/exhibitions/<item_id>', methods=['PUT'])
@jwt_required()
def admin_update_exhibition(item_id):
    """Update exhibition (admin)"""
    user = verify_admin_access()
    if not user:
        return forbidden_response("Admin access required")
    
    try:
        item = Exhibition.query.get(item_id)
        if not item:
            return not_found_response("Exhibition not found")
        
        data = request.get_json()
        
        if 'title' in data:
            item.title = data['title']
        if 'location' in data:
            item.location = data['location']
        if 'date' in data:
            item.date = datetime.strptime(data['date'], '%Y-%m-%d').date()
        if 'description' in data:
            item.description = data['description']
        if 'image' in data:
            item.image = data['image']
        if 'gallery' in data:
            gallery = data['gallery']
            if isinstance(gallery, list):
                gallery = json.dumps(gallery)
            item.gallery = gallery
        if 'is_published' in data:
            item.is_published = data['is_published']
        if 'display_order' in data:
            item.display_order = data['display_order']
        
        db.session.commit()
        return success_response(data=item.to_dict(), message="Exhibition updated")
    except Exception as e:
        db.session.rollback()
        return error_response(str(e), status_code=500)


@bp.route('/admin/press/exhibitions/<item_id>', methods=['DELETE'])
@jwt_required()
def admin_delete_exhibition(item_id):
    """Delete exhibition (admin)"""
    user = verify_admin_access()
    if not user:
        return forbidden_response("Admin access required")
    
    try:
        item = Exhibition.query.get(item_id)
        if not item:
            return not_found_response("Exhibition not found")
        
        db.session.delete(item)
        db.session.commit()
        return success_response(message="Exhibition deleted")
    except Exception as e:
        db.session.rollback()
        return error_response(str(e), status_code=500)


# ----- Speaking Engagements -----

@bp.route('/admin/press/speaking-engagements', methods=['GET'])
@jwt_required()
def admin_get_speaking_engagements():
    """Get all speaking engagements (admin)"""
    user = verify_admin_access()
    if not user:
        return forbidden_response("Admin access required")
    
    try:
        items = SpeakingEngagement.query.order_by(SpeakingEngagement.date.desc()).all()
        return success_response(data=[item.to_dict() for item in items])
    except Exception as e:
        return error_response(str(e), status_code=500)


@bp.route('/admin/press/speaking-engagements', methods=['POST'])
@jwt_required()
def admin_create_speaking_engagement():
    """Create speaking engagement (admin)"""
    user = verify_admin_access()
    if not user:
        return forbidden_response("Admin access required")
    
    try:
        data = request.get_json()
        
        required = ['title', 'event', 'location', 'date', 'type']
        for field in required:
            if not data.get(field):
                return error_response(f"{field} is required", status_code=400)
        
        item = SpeakingEngagement(
            id=str(uuid.uuid4()),
            title=data['title'],
            event=data['event'],
            location=data['location'],
            date=datetime.strptime(data['date'], '%Y-%m-%d').date(),
            description=data.get('description'),
            engagement_type=data['type'],
            is_published=data.get('is_published', True),
            display_order=data.get('display_order', 0)
        )
        
        db.session.add(item)
        db.session.commit()
        
        return created_response(data=item.to_dict(), message="Speaking engagement created")
    except Exception as e:
        db.session.rollback()
        return error_response(str(e), status_code=500)


@bp.route('/admin/press/speaking-engagements/<item_id>', methods=['PUT'])
@jwt_required()
def admin_update_speaking_engagement(item_id):
    """Update speaking engagement (admin)"""
    user = verify_admin_access()
    if not user:
        return forbidden_response("Admin access required")
    
    try:
        item = SpeakingEngagement.query.get(item_id)
        if not item:
            return not_found_response("Speaking engagement not found")
        
        data = request.get_json()
        
        if 'title' in data:
            item.title = data['title']
        if 'event' in data:
            item.event = data['event']
        if 'location' in data:
            item.location = data['location']
        if 'date' in data:
            item.date = datetime.strptime(data['date'], '%Y-%m-%d').date()
        if 'description' in data:
            item.description = data['description']
        if 'type' in data:
            item.engagement_type = data['type']
        if 'is_published' in data:
            item.is_published = data['is_published']
        if 'display_order' in data:
            item.display_order = data['display_order']
        
        db.session.commit()
        return success_response(data=item.to_dict(), message="Speaking engagement updated")
    except Exception as e:
        db.session.rollback()
        return error_response(str(e), status_code=500)


@bp.route('/admin/press/speaking-engagements/<item_id>', methods=['DELETE'])
@jwt_required()
def admin_delete_speaking_engagement(item_id):
    """Delete speaking engagement (admin)"""
    user = verify_admin_access()
    if not user:
        return forbidden_response("Admin access required")
    
    try:
        item = SpeakingEngagement.query.get(item_id)
        if not item:
            return not_found_response("Speaking engagement not found")
        
        db.session.delete(item)
        db.session.commit()
        return success_response(message="Speaking engagement deleted")
    except Exception as e:
        db.session.rollback()
        return error_response(str(e), status_code=500)


# ----- Collaborations -----

@bp.route('/admin/press/collaborations', methods=['GET'])
@jwt_required()
def admin_get_collaborations():
    """Get all collaborations (admin)"""
    user = verify_admin_access()
    if not user:
        return forbidden_response("Admin access required")
    
    try:
        items = Collaboration.query.order_by(Collaboration.display_order).all()
        return success_response(data=[item.to_dict() for item in items])
    except Exception as e:
        return error_response(str(e), status_code=500)


@bp.route('/admin/press/collaborations', methods=['POST'])
@jwt_required()
def admin_create_collaboration():
    """Create collaboration (admin)"""
    user = verify_admin_access()
    if not user:
        return forbidden_response("Admin access required")
    
    try:
        data = request.get_json()
        
        required = ['title', 'partner', 'year']
        for field in required:
            if not data.get(field):
                return error_response(f"{field} is required", status_code=400)
        
        item = Collaboration(
            id=str(uuid.uuid4()),
            title=data['title'],
            partner=data['partner'],
            description=data.get('description'),
            image=data.get('image'),
            year=data['year'],
            is_published=data.get('is_published', True),
            display_order=data.get('display_order', 0)
        )
        
        db.session.add(item)
        db.session.commit()
        
        return created_response(data=item.to_dict(), message="Collaboration created")
    except Exception as e:
        db.session.rollback()
        return error_response(str(e), status_code=500)


@bp.route('/admin/press/collaborations/<item_id>', methods=['PUT'])
@jwt_required()
def admin_update_collaboration(item_id):
    """Update collaboration (admin)"""
    user = verify_admin_access()
    if not user:
        return forbidden_response("Admin access required")
    
    try:
        item = Collaboration.query.get(item_id)
        if not item:
            return not_found_response("Collaboration not found")
        
        data = request.get_json()
        
        if 'title' in data:
            item.title = data['title']
        if 'partner' in data:
            item.partner = data['partner']
        if 'description' in data:
            item.description = data['description']
        if 'image' in data:
            item.image = data['image']
        if 'year' in data:
            item.year = data['year']
        if 'is_published' in data:
            item.is_published = data['is_published']
        if 'display_order' in data:
            item.display_order = data['display_order']
        
        db.session.commit()
        return success_response(data=item.to_dict(), message="Collaboration updated")
    except Exception as e:
        db.session.rollback()
        return error_response(str(e), status_code=500)


@bp.route('/admin/press/collaborations/<item_id>', methods=['DELETE'])
@jwt_required()
def admin_delete_collaboration(item_id):
    """Delete collaboration (admin)"""
    user = verify_admin_access()
    if not user:
        return forbidden_response("Admin access required")
    
    try:
        item = Collaboration.query.get(item_id)
        if not item:
            return not_found_response("Collaboration not found")
        
        db.session.delete(item)
        db.session.commit()
        return success_response(message="Collaboration deleted")
    except Exception as e:
        db.session.rollback()
        return error_response(str(e), status_code=500)


# ----- Media Kit -----

@bp.route('/admin/press/media-kit', methods=['GET'])
@jwt_required()
def admin_get_media_kit():
    """Get media kit config and items (admin)"""
    user = verify_admin_access()
    if not user:
        return forbidden_response("Admin access required")
    
    try:
        config = MediaKitConfig.query.first()
        items = MediaKitItem.query.order_by(MediaKitItem.display_order).all()
        
        return success_response(data={
            'config': config.to_dict() if config else None,
            'items': [item.to_dict() for item in items]
        })
    except Exception as e:
        return error_response(str(e), status_code=500)


@bp.route('/admin/press/media-kit/config', methods=['PUT'])
@jwt_required()
def admin_update_media_kit_config():
    """Update media kit config (admin)"""
    user = verify_admin_access()
    if not user:
        return forbidden_response("Admin access required")
    
    try:
        data = request.get_json()
        config = MediaKitConfig.query.first()
        
        if not config:
            config = MediaKitConfig(id=str(uuid.uuid4()))
            db.session.add(config)
        
        if 'title' in data:
            config.title = data['title']
        if 'description' in data:
            config.description = data['description']
        
        db.session.commit()
        return success_response(data=config.to_dict(), message="Media kit config updated")
    except Exception as e:
        db.session.rollback()
        return error_response(str(e), status_code=500)


@bp.route('/admin/press/media-kit/items', methods=['POST'])
@jwt_required()
def admin_create_media_kit_item():
    """Create media kit item (admin)"""
    user = verify_admin_access()
    if not user:
        return forbidden_response("Admin access required")
    
    try:
        data = request.get_json()
        
        if not data.get('name'):
            return error_response("name is required", status_code=400)
        
        item = MediaKitItem(
            id=str(uuid.uuid4()),
            name=data['name'],
            file_type=data.get('type', 'PDF'),
            file_size=data.get('size'),
            file_url=data.get('url'),
            display_order=data.get('display_order', 0)
        )
        
        db.session.add(item)
        db.session.commit()
        
        return created_response(data=item.to_dict(), message="Media kit item created")
    except Exception as e:
        db.session.rollback()
        return error_response(str(e), status_code=500)


@bp.route('/admin/press/media-kit/items/<item_id>', methods=['PUT'])
@jwt_required()
def admin_update_media_kit_item(item_id):
    """Update media kit item (admin)"""
    user = verify_admin_access()
    if not user:
        return forbidden_response("Admin access required")
    
    try:
        item = MediaKitItem.query.get(item_id)
        if not item:
            return not_found_response("Media kit item not found")
        
        data = request.get_json()
        
        if 'name' in data:
            item.name = data['name']
        if 'type' in data:
            item.file_type = data['type']
        if 'size' in data:
            item.file_size = data['size']
        if 'url' in data:
            item.file_url = data['url']
        if 'display_order' in data:
            item.display_order = data['display_order']
        
        db.session.commit()
        return success_response(data=item.to_dict(), message="Media kit item updated")
    except Exception as e:
        db.session.rollback()
        return error_response(str(e), status_code=500)


@bp.route('/admin/press/media-kit/items/<item_id>', methods=['DELETE'])
@jwt_required()
def admin_delete_media_kit_item(item_id):
    """Delete media kit item (admin)"""
    user = verify_admin_access()
    if not user:
        return forbidden_response("Admin access required")
    
    try:
        item = MediaKitItem.query.get(item_id)
        if not item:
            return not_found_response("Media kit item not found")
        
        db.session.delete(item)
        db.session.commit()
        return success_response(message="Media kit item deleted")
    except Exception as e:
        db.session.rollback()
        return error_response(str(e), status_code=500)


# ----- Press Contact -----

@bp.route('/admin/press/contact', methods=['GET'])
@jwt_required()
def admin_get_press_contact():
    """Get press contact info (admin)"""
    user = verify_admin_access()
    if not user:
        return forbidden_response("Admin access required")
    
    try:
        contact = PressContact.query.first()
        return success_response(data=contact.to_dict() if contact else None)
    except Exception as e:
        return error_response(str(e), status_code=500)


@bp.route('/admin/press/contact', methods=['PUT'])
@jwt_required()
def admin_update_press_contact():
    """Update press contact info (admin)"""
    user = verify_admin_access()
    if not user:
        return forbidden_response("Admin access required")
    
    try:
        data = request.get_json()
        contact = PressContact.query.first()
        
        if not contact:
            contact = PressContact(id=str(uuid.uuid4()))
            db.session.add(contact)
        
        if 'title' in data:
            contact.title = data['title']
        if 'description' in data:
            contact.description = data['description']
        if 'email' in data:
            contact.email = data['email']
        if 'phone' in data:
            contact.phone = data['phone']
        
        db.session.commit()
        return success_response(data=contact.to_dict(), message="Press contact updated")
    except Exception as e:
        db.session.rollback()
        return error_response(str(e), status_code=500)
