"""
Seed script to populate the database with sample data
Run with: pipenv run python seed_data.py
"""

from app import create_app
from app.extensions import db
from app.models import (
    User, Product, Category,
    Page, BlogPost, SiteSetting,
    FAQ, Testimonial,
    PressHero, MediaCoverage, PressRelease, Exhibition,
    SpeakingEngagement, Collaboration, MediaKitItem, MediaKitConfig, PressContact
)
from werkzeug.security import generate_password_hash
import uuid
from datetime import datetime
import json

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
        role='super_admin',
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



def create_blog_posts(admin):
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
            author_id=admin.id,
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
        {'key': 'site_name', 'value': 'Hisi Studio'},
        {'key': 'tagline', 'value': 'Adaptive Fashion for Everyone'},
        {'key': 'contact_email', 'value': 'info@hisistudio.com'},
        {'key': 'contact_phone', 'value': '+254712345678'},
        {'key': 'facebook_url', 'value': 'https://facebook.com/hisistudio'},
        {'key': 'instagram_url', 'value': 'https://instagram.com/hisistudio'},
        {'key': 'twitter_url', 'value': 'https://twitter.com/hisistudio'},
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
            value=setting_data['value']
        )
        db.session.add(setting)
        print(f"  ✓ Created setting: {setting.key}")

    db.session.commit()


def create_faqs():
    """Create FAQ entries"""
    print("Creating FAQs...")

    faqs_data = [
        {
            'category': 'orders',
            'question': 'How long does it take to process a custom order?',
            'answer': 'Custom orders typically take 2-4 weeks depending on complexity. We\'ll provide a detailed timeline after reviewing your requirements during the consultation.',
            'display_order': 1
        },
        {
            'category': 'orders',
            'question': 'Can I request modifications to existing designs?',
            'answer': 'Absolutely! We can modify any of our existing designs to include specific adaptive features or adjust sizing to meet your needs.',
            'display_order': 2
        },
        {
            'category': 'accessibility',
            'question': 'What adaptive features do you offer?',
            'answer': 'We offer magnetic closures, adjustable waistbands, wheelchair-friendly designs, sensory-friendly fabrics, easy-grip zippers, and many more features. Each piece can be customized to your specific needs.',
            'display_order': 1
        },
        {
            'category': 'accessibility',
            'question': 'Do you offer free accessibility consultations?',
            'answer': 'Yes! We offer complimentary 30-minute consultations to help you find the perfect adaptive solutions for your lifestyle and needs.',
            'display_order': 2
        },
        {
            'category': 'shipping',
            'question': 'Do you ship internationally?',
            'answer': 'Currently, we ship within Kenya. International shipping is coming soon! Join our mailing list to be notified when we expand.',
            'display_order': 1
        },
        {
            'category': 'shipping',
            'question': 'What are the shipping costs?',
            'answer': 'Shipping within Nairobi is KES 300. Outside Nairobi is KES 500-800 depending on location. Free shipping on orders over KES 15,000.',
            'display_order': 2
        },
        {
            'category': 'returns',
            'question': 'What is your return policy?',
            'answer': 'We offer 30-day returns on all standard items. Custom orders can be returned within 14 days if there\'s a manufacturing defect. We want you to be completely satisfied!',
            'display_order': 1
        },
        {
            'category': 'returns',
            'question': 'How do I initiate a return?',
            'answer': 'Contact us via email or phone with your order number. We\'ll provide a return label and guide you through the process.',
            'display_order': 2
        },
        {
            'category': 'general',
            'question': 'Do you have a physical showroom?',
            'answer': 'Yes! Visit us at Westlands, Nairobi. We recommend booking an appointment for personalized attention, but walk-ins are welcome during business hours.',
            'display_order': 1
        },
        {
            'category': 'general',
            'question': 'How can I become a wholesale partner?',
            'answer': 'We\'d love to partner with you! Fill out the Partnership inquiry form above or email us at partnerships@hisistudio.com with details about your business.',
            'display_order': 2
        }
    ]

    for faq_data in faqs_data:
        # Check if FAQ exists
        faq = FAQ.query.filter_by(
            category=faq_data['category'],
            question=faq_data['question']
        ).first()
        if faq:
            print(f"  ⚠ FAQ '{faq_data['question'][:50]}...' already exists")
            continue

        faq = FAQ(
            id=str(uuid.uuid4()),
            category=faq_data['category'],
            question=faq_data['question'],
            answer=faq_data['answer'],
            display_order=faq_data['display_order'],
            is_published=True
        )
        db.session.add(faq)
        print(f"  ✓ Created FAQ: {faq.question[:50]}...")

    db.session.commit()


def create_testimonials():
    """Create testimonial entries"""
    print("Creating testimonials...")

    testimonials_data = [
        {
            'name': 'Grace Wanjiku',
            'role': 'Custom Order Client',
            'image_url': 'https://ui-avatars.com/api/?name=Grace+Wanjiku&background=8B5CF6&color=fff&size=200',
            'story': 'I reached out to Hisi Studio for a custom wheelchair-friendly dress for my sister\'s wedding. The team was incredibly patient, understanding my needs perfectly. The final piece was stunning and made me feel confident and beautiful.',
            'result': 'Perfect custom dress delivered in 3 weeks',
            'rating': 5,
            'is_featured': True,
            'display_order': 1
        },
        {
            'name': 'David Kimani',
            'role': 'Accessibility Consultation',
            'image_url': 'https://ui-avatars.com/api/?name=David+Kimani&background=3B82F6&color=fff&size=200',
            'story': 'As someone with limited dexterity, finding stylish clothing was always frustrating. The accessibility consultation changed everything. They introduced me to magnetic closures and adaptive features I didn\'t know existed.',
            'result': 'Found 5 perfect pieces in one consultation',
            'rating': 5,
            'is_featured': True,
            'display_order': 2
        },
        {
            'name': 'Amina Hassan',
            'role': 'Partnership Inquiry',
            'image_url': 'https://ui-avatars.com/api/?name=Amina+Hassan&background=EC4899&color=fff&size=200',
            'story': 'I contacted Hisi Studio about a wholesale partnership for my boutique. Their response was professional and welcoming. We now stock their adaptive collection and our customers love it!',
            'result': 'Successful wholesale partnership established',
            'rating': 5,
            'is_featured': True,
            'display_order': 3
        },
        {
            'name': 'James Omondi',
            'role': 'General Inquiry',
            'image_url': 'https://ui-avatars.com/api/?name=James+Omondi&background=10B981&color=fff&size=200',
            'story': 'I had questions about sensory-friendly fabrics for my son. The team responded within hours with detailed information and product recommendations. Their knowledge and care were exceptional.',
            'result': 'Found perfect sensory-friendly options',
            'rating': 5,
            'is_featured': True,
            'display_order': 4
        }
    ]

    for testimonial_data in testimonials_data:
        # Check if testimonial exists
        testimonial = Testimonial.query.filter_by(
            name=testimonial_data['name'],
            role=testimonial_data['role']
        ).first()
        if testimonial:
            print(f"  ⚠ Testimonial from '{testimonial_data['name']}' already exists")
            continue

        testimonial = Testimonial(
            id=str(uuid.uuid4()),
            name=testimonial_data['name'],
            role=testimonial_data['role'],
            image_url=testimonial_data['image_url'],
            story=testimonial_data['story'],
            result=testimonial_data['result'],
            rating=testimonial_data['rating'],
            is_featured=testimonial_data['is_featured'],
            display_order=testimonial_data['display_order'],
            is_published=True
        )
        db.session.add(testimonial)
        print(f"  ✓ Created testimonial: {testimonial.name}")

    db.session.commit()


def create_contact_settings():
    """Create contact and location settings"""
    print("Creating contact/location settings...")

    import json

    contact_settings = [
        # Contact Methods
        {
            'key': 'contact_phone',
            'value': '+254 700 123 456',
            'setting_type': 'text',
            'description': 'Main contact phone number'
        },
        {
            'key': 'contact_email',
            'value': 'hello@hisistudio.com',
            'setting_type': 'text',
            'description': 'Main contact email'
        },
        {
            'key': 'contact_whatsapp',
            'value': '+254700123456',
            'setting_type': 'text',
            'description': 'WhatsApp number (no spaces)'
        },
        {
            'key': 'contact_instagram',
            'value': '@hisi_studio',
            'setting_type': 'text',
            'description': 'Instagram handle'
        },
        {
            'key': 'contact_instagram_url',
            'value': 'https://www.instagram.com/hisi_studio/',
            'setting_type': 'text',
            'description': 'Instagram profile URL'
        },
        
        # Location Details
        {
            'key': 'showroom_address',
            'value': json.dumps({
                'line1': 'Hisi Studio Showroom',
                'line2': 'Westlands, Ring Road Parklands',
                'city': 'Nairobi',
                'country': 'Kenya'
            }),
            'setting_type': 'json',
            'description': 'Showroom address details'
        },
        {
            'key': 'showroom_hours',
            'value': json.dumps({
                'monday_friday': '9:00 AM - 6:00 PM',
                'saturday': '10:00 AM - 4:00 PM',
                'sunday': 'Closed'
            }),
            'setting_type': 'json',
            'description': 'Showroom operating hours'
        },
        {
            'key': 'showroom_accessibility',
            'value': json.dumps([
                'Wheelchair accessible entrance',
                'Accessible parking available',
                'Spacious fitting rooms',
                'Assistance available upon request'
            ]),
            'setting_type': 'json',
            'description': 'Showroom accessibility features'
        },
        {
            'key': 'showroom_map_url',
            'value': 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3988.819799384!2d36.80611731475394!3d-1.2833879359915!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x182f10d6d3b3b3b3%3A0x1234567890abcdef!2sWestlands%2C%20Nairobi!5e0!3m2!1sen!2ske!4v1234567890123!5m2!1sen!2ske',
            'setting_type': 'text',
            'description': 'Google Maps embed URL'
        },
        {
            'key': 'showroom_directions_url',
            'value': 'https://www.google.com/maps/dir//Westlands,+Nairobi',
            'setting_type': 'text',
            'description': 'Google Maps directions URL'
        }
    ]

    for setting_data in contact_settings:
        # Check if setting exists
        setting = SiteSetting.query.filter_by(key=setting_data['key']).first()
        if setting:
            print(f"  ⚠ Setting '{setting_data['key']}' already exists")
            continue

        setting = SiteSetting(
            id=str(uuid.uuid4()),
            key=setting_data['key'],
            value=setting_data['value'],
            setting_type=setting_data['setting_type'],
            description=setting_data['description']
        )
        db.session.add(setting)
        print(f"  ✓ Created setting: {setting.key}")

    db.session.commit()


def create_press_content():
    """Create press page content"""
    print("Creating press page content...")

    # Press Hero
    hero = PressHero.query.first()
    if not hero:
        hero = PressHero(
            id=str(uuid.uuid4()),
            title="Press & Media",
            subtitle="In the Spotlight",
            description="Discover how Hisi Studio is making waves in adaptive fashion, disability inclusion, and sustainable design across global media.",
            image="/images/press/hero-bg.jpg"
        )
        db.session.add(hero)
        print("  ✓ Created Press Hero")
    else:
        print("  ⚠ Press Hero already exists")

    # Media Coverage
    media_coverage_data = [
        {
            'title': 'Deutsche Welle Feature: Pioneering Adaptive Fashion in Africa',
            'outlet': 'Deutsche Welle (DW)',
            'date': '2023-08-15',
            'category': 'Feature Article',
            'description': 'An in-depth look at how Hisi Studio is revolutionizing fashion accessibility and championing disability inclusion across Africa.',
            'image': '/images/press/dw-feature.png',
            'link': 'https://www.dw.com/hisi-studio-feature',
            'is_featured': True
        },
        {
            'title': 'Global Social Media Entrepreneurs Spotlight',
            'outlet': 'GSME',
            'date': '2023-10-22',
            'category': 'Entrepreneur Profile',
            'description': 'Featured as a leading social entrepreneur using fashion as a tool for disability advocacy and community empowerment.',
            'image': '/images/press/gsme-feature.png',
            'link': 'https://gsme.org/hisi-studio',
            'is_featured': True
        },
        {
            'title': 'The Future of Inclusive Fashion',
            'outlet': 'Fashion Forward Africa',
            'date': '2024-03-10',
            'category': 'Industry Analysis',
            'description': 'How Hisi Studio is setting new standards for adaptive design and accessibility in the African fashion industry.',
            'image': '/images/press/fashion-forward.png',
            'link': '#',
            'is_featured': False
        },
        {
            'title': 'TactART: Making Art Accessible',
            'outlet': 'Art & Culture Magazine',
            'date': '2024-05-18',
            'category': 'Innovation',
            'description': 'Exploring the groundbreaking TactART initiative that brings visual art to blind and visually impaired communities.',
            'image': '/images/press/tactart-article.png',
            'link': '#',
            'is_featured': False
        },
        {
            'title': 'Sustainable Fashion Meets Social Impact',
            'outlet': 'EcoStyle Journal',
            'date': '2024-07-25',
            'category': 'Sustainability',
            'description': 'A deep dive into Hisi Studio\'s commitment to eco-friendly practices and community empowerment.',
            'image': '/images/press/ecostyle.png',
            'link': '#',
            'is_featured': False
        },
        {
            'title': 'Breaking Barriers in Fashion',
            'outlet': 'Disability Rights Today',
            'date': '2024-09-12',
            'category': 'Advocacy',
            'description': 'How adaptive fashion is changing lives and challenging industry norms.',
            'image': '/images/press/disability-rights.png',
            'link': '#',
            'is_featured': False
        }
    ]

    for idx, data in enumerate(media_coverage_data):
        existing = MediaCoverage.query.filter_by(title=data['title']).first()
        if existing:
            print(f"  ⚠ Media coverage '{data['title'][:40]}...' already exists")
            continue

        item = MediaCoverage(
            id=str(uuid.uuid4()),
            title=data['title'],
            outlet=data['outlet'],
            date=datetime.strptime(data['date'], '%Y-%m-%d').date(),
            category=data['category'],
            description=data['description'],
            image=data['image'],
            link=data['link'],
            is_featured=data['is_featured'],
            is_published=True,
            display_order=idx
        )
        db.session.add(item)
        print(f"  ✓ Created media coverage: {data['title'][:40]}...")

    # Press Releases
    press_releases_data = [
        {
            'title': 'Hisi Studio Launches New Braille-Branded Collection',
            'date': '2024-11-01',
            'excerpt': 'Introducing our latest line of products featuring integrated Braille branding, making fashion truly inclusive for blind communities.'
        },
        {
            'title': 'Partnership Announcement: Collaborating with Disability Advocacy Organizations',
            'date': '2024-08-15',
            'excerpt': 'Hisi Studio partners with leading disability rights organizations to expand adaptive fashion access across Africa.'
        },
        {
            'title': 'TactART Exhibition Opens in Nairobi',
            'date': '2024-06-20',
            'excerpt': 'Our groundbreaking tactile art exhibition brings visual art to blind communities through multi-sensory experiences.'
        }
    ]

    for idx, data in enumerate(press_releases_data):
        existing = PressRelease.query.filter_by(title=data['title']).first()
        if existing:
            print(f"  ⚠ Press release '{data['title'][:40]}...' already exists")
            continue

        item = PressRelease(
            id=str(uuid.uuid4()),
            title=data['title'],
            date=datetime.strptime(data['date'], '%Y-%m-%d').date(),
            excerpt=data['excerpt'],
            is_published=True,
            display_order=idx
        )
        db.session.add(item)
        print(f"  ✓ Created press release: {data['title'][:40]}...")

    # Exhibitions
    exhibitions_data = [
        {
            'title': 'Adaptive Fashion Showcase 2024',
            'location': 'Nairobi Fashion Week',
            'date': '2024-10-15',
            'description': 'Presented our latest adaptive outerwear collection featuring magnetic closures and sensory-friendly fabrics.',
            'image': '/images/press/exhibition-nairobi.png',
            'gallery': [
                '/images/press/exhibition-nairobi.png',
                '/images/press/exhibition-nairobi.png',
                '/images/press/exhibition-nairobi.png'
            ]
        },
        {
            'title': 'TactART: Touch & See Exhibition',
            'location': 'National Museum, Kampala',
            'date': '2024-06-20',
            'description': 'Interactive tactile art exhibition making visual art accessible to blind and visually impaired visitors.',
            'image': '/images/press/exhibition-tactart.png',
            'gallery': [
                '/images/press/exhibition-tactart.png',
                '/images/press/exhibition-tactart.png',
                '/images/press/exhibition-tactart.png'
            ]
        },
        {
            'title': 'Inclusive Design Summit',
            'location': 'Kigali Convention Centre',
            'date': '2024-04-08',
            'description': 'Showcased adaptive fashion innovations and led workshops on inclusive design methodologies.',
            'image': '/images/press/exhibition-kigali.png',
            'gallery': [
                '/images/press/exhibition-kigali.png',
                '/images/press/exhibition-kigali.png',
                '/images/press/exhibition-kigali.png'
            ]
        }
    ]

    for idx, data in enumerate(exhibitions_data):
        existing = Exhibition.query.filter_by(title=data['title']).first()
        if existing:
            print(f"  ⚠ Exhibition '{data['title'][:40]}...' already exists")
            continue

        item = Exhibition(
            id=str(uuid.uuid4()),
            title=data['title'],
            location=data['location'],
            date=datetime.strptime(data['date'], '%Y-%m-%d').date(),
            description=data['description'],
            image=data['image'],
            gallery=json.dumps(data['gallery']),
            is_published=True,
            display_order=idx
        )
        db.session.add(item)
        print(f"  ✓ Created exhibition: {data['title'][:40]}...")

    # Speaking Engagements
    speaking_data = [
        {
            'title': 'Keynote: The Future of Adaptive Fashion',
            'event': 'African Fashion Innovation Summit',
            'location': 'Lagos, Nigeria',
            'date': '2024-11-20',
            'description': 'Delivered keynote address on the intersection of fashion, disability inclusion, and African heritage.',
            'type': 'Keynote'
        },
        {
            'title': 'Panel: Disability Inclusion in Creative Industries',
            'event': 'Global Accessibility Conference',
            'location': 'Virtual',
            'date': '2024-09-05',
            'description': 'Participated in panel discussion on breaking barriers and creating opportunities for people with disabilities in fashion and art.',
            'type': 'Panel'
        },
        {
            'title': 'Workshop: Designing for Accessibility',
            'event': 'Design Thinking Workshop Series',
            'location': 'Nairobi Design Institute',
            'date': '2024-07-12',
            'description': 'Led hands-on workshop teaching designers how to incorporate adaptive features and inclusive design principles.',
            'type': 'Workshop'
        },
        {
            'title': 'TEDx Talk: Fashion Without Barriers',
            'event': 'TEDxNairobi',
            'location': 'Nairobi, Kenya',
            'date': '2024-05-18',
            'description': 'Shared the vision and journey of Hisi Studio in creating fashion that celebrates diversity and empowers all people.',
            'type': 'TEDx'
        }
    ]

    for idx, data in enumerate(speaking_data):
        existing = SpeakingEngagement.query.filter_by(title=data['title']).first()
        if existing:
            print(f"  ⚠ Speaking engagement '{data['title'][:40]}...' already exists")
            continue

        item = SpeakingEngagement(
            id=str(uuid.uuid4()),
            title=data['title'],
            event=data['event'],
            location=data['location'],
            date=datetime.strptime(data['date'], '%Y-%m-%d').date(),
            description=data['description'],
            engagement_type=data['type'],
            is_published=True,
            display_order=idx
        )
        db.session.add(item)
        print(f"  ✓ Created speaking engagement: {data['title'][:40]}...")

    # Collaborations
    collaborations_data = [
        {
            'title': 'Partnership with Local Artisan Cooperatives',
            'partner': 'Kenya Artisan Collective',
            'description': 'Collaborating with local artisans to create adaptive fashion pieces that celebrate African craftsmanship and heritage.',
            'image': '/images/press/ecostyle.png',
            'year': '2024'
        },
        {
            'title': 'Disability Advocacy Partnership',
            'partner': 'African Disability Forum',
            'description': 'Working together to advocate for disability rights and create employment opportunities in the fashion industry.',
            'image': '/images/press/disability-rights.png',
            'year': '2024'
        },
        {
            'title': 'Sustainable Materials Initiative',
            'partner': 'EcoFabrics Africa',
            'description': 'Sourcing eco-friendly, sustainable fabrics for our adaptive fashion collections.',
            'image': '/images/press/ecostyle.png',
            'year': '2023'
        },
        {
            'title': 'Braille Literacy Program',
            'partner': 'Kenya Society for the Blind',
            'description': 'Supporting Braille literacy through our Braille-branded products and educational initiatives.',
            'image': '/images/press/tactart-article.png',
            'year': '2023'
        }
    ]

    for idx, data in enumerate(collaborations_data):
        existing = Collaboration.query.filter_by(title=data['title']).first()
        if existing:
            print(f"  ⚠ Collaboration '{data['title'][:40]}...' already exists")
            continue

        item = Collaboration(
            id=str(uuid.uuid4()),
            title=data['title'],
            partner=data['partner'],
            description=data['description'],
            image=data['image'],
            year=data['year'],
            is_published=True,
            display_order=idx
        )
        db.session.add(item)
        print(f"  ✓ Created collaboration: {data['title'][:40]}...")

    # Media Kit Config
    kit_config = MediaKitConfig.query.first()
    if not kit_config:
        kit_config = MediaKitConfig(
            id=str(uuid.uuid4()),
            title="Media Kit",
            description="Download our press kit for high-resolution images, brand assets, and company information."
        )
        db.session.add(kit_config)
        print("  ✓ Created Media Kit Config")
    else:
        print("  ⚠ Media Kit Config already exists")

    # Media Kit Items
    media_kit_items_data = [
        {'name': 'Brand Guidelines', 'type': 'PDF', 'size': '2.5 MB'},
        {'name': 'High-Res Logos', 'type': 'ZIP', 'size': '5.1 MB'},
        {'name': 'Product Images', 'type': 'ZIP', 'size': '45 MB'},
        {'name': 'Founder Bio & Photos', 'type': 'PDF', 'size': '3.2 MB'}
    ]

    for idx, data in enumerate(media_kit_items_data):
        existing = MediaKitItem.query.filter_by(name=data['name']).first()
        if existing:
            print(f"  ⚠ Media kit item '{data['name']}' already exists")
            continue

        item = MediaKitItem(
            id=str(uuid.uuid4()),
            name=data['name'],
            file_type=data['type'],
            file_size=data['size'],
            display_order=idx
        )
        db.session.add(item)
        print(f"  ✓ Created media kit item: {data['name']}")

    # Press Contact
    contact = PressContact.query.first()
    if not contact:
        contact = PressContact(
            id=str(uuid.uuid4()),
            title="Media Inquiries",
            description="For press inquiries, interviews, or collaboration opportunities, please contact our media team.",
            email="press@hisistudio.com",
            phone="+254 XXX XXX XXX"
        )
        db.session.add(contact)
        print("  ✓ Created Press Contact")
    else:
        print("  ⚠ Press Contact already exists")

    db.session.commit()
    print("  ✓ Press content seeding complete!")


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
        create_blog_posts(admin)
        create_site_settings()

        # Create contact page content
        create_faqs()
        create_testimonials()
        create_contact_settings()

        # Create press page content
        create_press_content()

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
