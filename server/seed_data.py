"""
Seed script to populate the database with sample data
Run with: pipenv run python seed_data.py
"""

from app import create_app
from app.extensions import db
from app.models import (
    User, Product, Category,
    Page, BlogPost, SiteSetting
)
from werkzeug.security import generate_password_hash
import uuid
from datetime import datetime

def create_admin_user():
    """Create an admin user"""
    print("Creating admin user...")

    # Check if admin already exists
    admin = User.query.filter_by(email='admin@hisi.com').first()
    if admin:
        print("  ⚠ Admin user already exists")
        return admin

    admin = User(
        id=str(uuid.uuid4()),
        email='admin@hisi.com',
        password_hash=generate_password_hash('Admin123!'),
        first_name='Admin',
        last_name='User',
        role='admin',
        is_active=True
    )
    db.session.add(admin)
    db.session.commit()
    print(f"  ✓ Admin created: {admin.email} / Admin123!")
    return admin


def create_customer_user():
    """Create a test customer user"""
    print("Creating customer user...")

    # Check if customer already exists
    customer = User.query.filter_by(email='customer@test.com').first()
    if customer:
        print("  ⚠ Customer user already exists")
        return customer

    customer = User(
        id=str(uuid.uuid4()),
        email='customer@test.com',
        password_hash=generate_password_hash('Test123!'),
        first_name='Test',
        last_name='Customer',
        role='customer',
        is_active=True
    )
    db.session.add(customer)
    db.session.commit()
    print(f"  ✓ Customer created: {customer.email} / Test123!")
    return customer


def create_categories():
    """Create product categories"""
    print("Creating categories...")

    categories_data = [
        {
            'name': 'Adaptive Jackets',
            'slug': 'adaptive-jackets',
            'description': 'Stylish jackets with adaptive features for easy wearing'
        },
        {
            'name': 'Easy-Wear Tops',
            'slug': 'easy-wear-tops',
            'description': 'Comfortable tops designed for effortless dressing'
        },
        {
            'name': 'Adaptive Bottoms',
            'slug': 'adaptive-bottoms',
            'description': 'Pants and skirts with adaptive closures and features'
        },
        {
            'name': 'Accessories',
            'slug': 'accessories',
            'description': 'Adaptive accessories for completing your look'
        }
    ]

    created_categories = []
    for cat_data in categories_data:
        # Check if category exists
        category = Category.query.filter_by(slug=cat_data['slug']).first()
        if category:
            print(f"  ⚠ Category '{cat_data['name']}' already exists")
            created_categories.append(category)
            continue

        category = Category(
            id=str(uuid.uuid4()),
            name=cat_data['name'],
            slug=cat_data['slug'],
            description=cat_data['description'],
            is_active=True
        )
        db.session.add(category)
        created_categories.append(category)
        print(f"  ✓ Created category: {category.name}")

    db.session.commit()
    return created_categories


def create_products(categories):
    """Create sample products"""
    print("Creating products...")

    products_data = [
        {
            'name': 'Adaptive Bomber Jacket',
            'slug': 'adaptive-bomber-jacket',
            'description': 'Classic bomber style with magnetic closures for easy wearing. Features ribbed cuffs and hem, side pockets with easy-grip zippers.',
            'price': 8999.00,
            'original_price': 12000.00,
            'sku': 'HSJ-001',
            'stock_quantity': 50,
            'category': 'adaptive-jackets',
            'accessibility_features': ['Magnetic closures', 'Easy grip zippers', 'Adjustable fit'],
            'is_featured': True,
            'badge': 'New'
        },
        {
            'name': 'Comfort Denim Jacket',
            'slug': 'comfort-denim-jacket',
            'description': 'Soft denim jacket with snap buttons instead of traditional buttons. Stretchy fabric for comfort and mobility.',
            'price': 7499.00,
            'original_price': 9500.00,
            'sku': 'HSJ-002',
            'stock_quantity': 35,
            'category': 'adaptive-jackets',
            'accessibility_features': ['Snap button closures', 'Stretch fabric', 'Easy care'],
            'is_featured': True,
            'badge': 'Popular'
        },
        {
            'name': 'Side-Zip T-Shirt',
            'slug': 'side-zip-tshirt',
            'description': 'Comfortable cotton t-shirt with side zipper for easy dressing. Available in multiple colors.',
            'price': 3499.00,
            'original_price': 4500.00,
            'sku': 'HST-001',
            'stock_quantity': 75,
            'category': 'easy-wear-tops',
            'accessibility_features': ['Side zipper', '100% soft cotton', 'Tag-free design'],
            'is_featured': True,
            'badge': None
        },
        {
            'name': 'Magnetic Button Polo',
            'slug': 'magnetic-button-polo',
            'description': 'Classic polo style with magnetic buttons for easy fastening. Perfect for any occasion.',
            'price': 4999.00,
            'original_price': None,
            'sku': 'HST-002',
            'stock_quantity': 60,
            'category': 'easy-wear-tops',
            'accessibility_features': ['Magnetic buttons', 'Moisture-wicking', 'Easy care'],
            'is_featured': False,
            'badge': None
        },
        {
            'name': 'Elastic Waist Chinos',
            'slug': 'elastic-waist-chinos',
            'description': 'Smart casual chinos with elastic waistband and easy-fasten closures. Professional look with maximum comfort.',
            'price': 6999.00,
            'original_price': 8500.00,
            'sku': 'HSB-001',
            'stock_quantity': 45,
            'category': 'adaptive-bottoms',
            'accessibility_features': ['Elastic waistband', 'Easy-fasten closures', 'Stretch fabric'],
            'is_featured': True,
            'badge': 'Best Seller'
        },
        {
            'name': 'Open-Back Blouse',
            'slug': 'open-back-blouse',
            'description': 'Elegant blouse with open back design and magnetic closures. Easy to put on while seated.',
            'price': 5499.00,
            'original_price': 7000.00,
            'sku': 'HST-003',
            'stock_quantity': 40,
            'category': 'easy-wear-tops',
            'accessibility_features': ['Open back design', 'Magnetic closures', 'Breathable fabric'],
            'is_featured': False,
            'badge': None
        }
    ]

    category_map = {cat.slug: cat for cat in categories}

    for prod_data in products_data:
        # Check if product exists
        product = Product.query.filter_by(slug=prod_data['slug']).first()
        if product:
            print(f"  ⚠ Product '{prod_data['name']}' already exists")
            continue

        category = category_map.get(prod_data['category'])

        product = Product(
            id=str(uuid.uuid4()),
            name=prod_data['name'],
            slug=prod_data['slug'],
            description=prod_data['description'],
            price=prod_data['price'],
            original_price=prod_data.get('original_price'),
            sku=prod_data['sku'],
            stock_quantity=prod_data['stock_quantity'],
            category_id=category.id if category else None,
            accessibility_features=prod_data['accessibility_features'],
            main_image=f'https://placeholder.com/600x800/{prod_data["slug"]}.jpg',
            hover_image=f'https://placeholder.com/600x800/{prod_data["slug"]}-hover.jpg',
            images=[
                f'https://placeholder.com/600x800/{prod_data["slug"]}-1.jpg',
                f'https://placeholder.com/600x800/{prod_data["slug"]}-2.jpg',
                f'https://placeholder.com/600x800/{prod_data["slug"]}-3.jpg'
            ],
            is_featured=prod_data['is_featured'],
            is_active=True,
            badge=prod_data.get('badge')
        )
        db.session.add(product)
        print(f"  ✓ Created product: {product.name} (₦{product.price:,.2f})")

    db.session.commit()


def create_cms_pages():
    """Create CMS pages"""
    print("Creating CMS pages...")

    pages_data = [
        {
            'title': 'About Us',
            'slug': 'about-us',
            'content': '''
                <h1>About Hisi Studio</h1>
                <p>Hisi Studio is dedicated to creating adaptive fashion that combines style with functionality.
                Our mission is to make fashion accessible to everyone, regardless of mobility or dexterity challenges.</p>

                <h2>Our Story</h2>
                <p>Founded in 2024, Hisi Studio was born from the belief that everyone deserves to feel confident
                and comfortable in what they wear. We specialize in adaptive clothing featuring innovative solutions
                like magnetic closures, side zippers, and easy-grip fasteners.</p>

                <h2>Our Values</h2>
                <ul>
                    <li>Accessibility first</li>
                    <li>Quality craftsmanship</li>
                    <li>Inclusive design</li>
                    <li>Customer-centered service</li>
                </ul>
            ''',
            'meta_title': 'About Us - Hisi Studio Adaptive Fashion',
            'meta_description': 'Learn about Hisi Studio and our commitment to accessible, stylish adaptive clothing.'
        },
        {
            'title': 'Size Guide',
            'slug': 'size-guide',
            'content': '''
                <h1>Size Guide</h1>
                <p>Find your perfect fit with our comprehensive size guide.</p>

                <h2>How to Measure</h2>
                <ol>
                    <li><strong>Chest:</strong> Measure around the fullest part of your chest</li>
                    <li><strong>Waist:</strong> Measure around your natural waistline</li>
                    <li><strong>Hips:</strong> Measure around the fullest part of your hips</li>
                </ol>

                <h2>Size Chart</h2>
                <table>
                    <tr>
                        <th>Size</th>
                        <th>Chest (cm)</th>
                        <th>Waist (cm)</th>
                        <th>Hips (cm)</th>
                    </tr>
                    <tr>
                        <td>S</td>
                        <td>86-91</td>
                        <td>66-71</td>
                        <td>91-96</td>
                    </tr>
                    <tr>
                        <td>M</td>
                        <td>91-96</td>
                        <td>71-76</td>
                        <td>96-101</td>
                    </tr>
                    <tr>
                        <td>L</td>
                        <td>96-101</td>
                        <td>76-81</td>
                        <td>101-106</td>
                    </tr>
                    <tr>
                        <td>XL</td>
                        <td>101-106</td>
                        <td>81-86</td>
                        <td>106-111</td>
                    </tr>
                </table>
            ''',
            'meta_title': 'Size Guide - Hisi Studio',
            'meta_description': 'Find your perfect fit with our detailed size guide and measurement instructions.'
        }
    ]

    for page_data in pages_data:
        # Check if page exists
        page = Page.query.filter_by(slug=page_data['slug']).first()
        if page:
            print(f"  ⚠ Page '{page_data['title']}' already exists")
            continue

        page = Page(
            id=str(uuid.uuid4()),
            title=page_data['title'],
            slug=page_data['slug'],
            content=page_data['content'],
            meta_title=page_data['meta_title'],
            meta_description=page_data['meta_description'],
            is_published=True
        )
        db.session.add(page)
        print(f"  ✓ Created page: {page.title}")

    db.session.commit()


def create_blog_posts():
    """Create sample blog posts"""
    print("Creating blog posts...")

    posts_data = [
        {
            'title': 'The Future of Adaptive Fashion',
            'slug': 'future-of-adaptive-fashion',
            'excerpt': 'Exploring how technology and design are revolutionizing accessible clothing.',
            'content': '''
                <p>Adaptive fashion is transforming the way we think about clothing design.
                With innovations like magnetic closures, adjustable fits, and sensory-friendly fabrics,
                fashion is becoming more inclusive than ever before.</p>

                <h2>Key Trends</h2>
                <ul>
                    <li>Smart fabrics with adaptive properties</li>
                    <li>Universal design principles in mainstream fashion</li>
                    <li>Technology-enabled customization</li>
                </ul>
            ''',
            'meta_title': 'The Future of Adaptive Fashion - Hisi Studio Blog',
            'meta_description': 'Discover the latest trends and innovations in adaptive fashion design.'
        },
        {
            'title': '5 Tips for Choosing Adaptive Clothing',
            'slug': 'choosing-adaptive-clothing',
            'excerpt': 'A practical guide to selecting the right adaptive garments for your needs.',
            'content': '''
                <p>Choosing the right adaptive clothing can make a significant difference in daily comfort and independence.</p>

                <h2>Our Top 5 Tips</h2>
                <ol>
                    <li><strong>Consider the closure type:</strong> Magnetic, velcro, or snap closures?</li>
                    <li><strong>Check the fabric:</strong> Look for stretch and easy-care materials</li>
                    <li><strong>Think about access points:</strong> Side zippers, open backs, etc.</li>
                    <li><strong>Prioritize comfort:</strong> Tag-free, soft seams, non-irritating</li>
                    <li><strong>Don't sacrifice style:</strong> Adaptive can be fashionable!</li>
                </ol>
            ''',
            'meta_title': '5 Tips for Choosing Adaptive Clothing - Hisi Studio',
            'meta_description': 'Learn how to choose the perfect adaptive clothing with our expert tips.'
        }
    ]

    for post_data in posts_data:
        # Check if post exists
        post = BlogPost.query.filter_by(slug=post_data['slug']).first()
        if post:
            print(f"  ⚠ Blog post '{post_data['title']}' already exists")
            continue

        post = BlogPost(
            id=str(uuid.uuid4()),
            title=post_data['title'],
            slug=post_data['slug'],
            excerpt=post_data['excerpt'],
            content=post_data['content'],
            featured_image=f'https://placeholder.com/1200x630/{post_data["slug"]}.jpg',
            meta_title=post_data['meta_title'],
            meta_description=post_data['meta_description'],
            is_published=True
        )
        db.session.add(post)
        print(f"  ✓ Created blog post: {post.title}")

    db.session.commit()


def create_site_settings():
    """Create site settings"""
    print("Creating site settings...")

    settings_data = [
        {'key': 'site_name', 'value': 'Hisi Studio', 'group': 'general'},
        {'key': 'tagline', 'value': 'Adaptive Fashion for Everyone', 'group': 'general'},
        {'key': 'contact_email', 'value': 'info@hisistudio.com', 'group': 'contact'},
        {'key': 'contact_phone', 'value': '+254712345678', 'group': 'contact'},
        {'key': 'facebook_url', 'value': 'https://facebook.com/hisistudio', 'group': 'social'},
        {'key': 'instagram_url', 'value': 'https://instagram.com/hisistudio', 'group': 'social'},
        {'key': 'twitter_url', 'value': 'https://twitter.com/hisistudio', 'group': 'social'},
    ]

    for setting_data in settings_data:
        # Check if setting exists
        setting = SiteSetting.query.filter_by(key=setting_data['key']).first()
        if setting:
            print(f"  ⚠ Setting '{setting_data['key']}' already exists")
            continue

        setting = SiteSetting(
            id=str(uuid.uuid4()),
            key=setting_data['key'],
            value=setting_data['value'],
            group=setting_data['group']
        )
        db.session.add(setting)
        print(f"  ✓ Created setting: {setting.key}")

    db.session.commit()


def main():
    """Main seed function"""
    print("\n" + "="*60)
    print("HISI STUDIO - DATABASE SEEDING")
    print("="*60 + "\n")

    app = create_app('development')

    with app.app_context():
        # Create users
        admin = create_admin_user()
        customer = create_customer_user()

        # Create categories
        categories = create_categories()

        # Create products
        create_products(categories)

        # Create CMS content
        create_cms_pages()
        create_blog_posts()
        create_site_settings()

        print("\n" + "="*60)
        print("✓ SEEDING COMPLETE!")
        print("="*60)
        print("\nLogin Credentials:")
        print("  Admin:")
        print("    Email: admin@hisi.com")
        print("    Password: Admin123!")
        print("\n  Customer:")
        print("    Email: customer@test.com")
        print("    Password: Test123!")
        print("\nYou can now start the server and test the API!")
        print("  cd server")
        print("  pipenv run flask run")
        print("\n")


if __name__ == '__main__':
    main()
