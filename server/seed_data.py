"""
Seed script to populate the database with sample data
Run with: pipenv run python seed_data.py
"""

from app import create_app
from app.extensions import db
from app.models import (
    User, Product, Category,
    Page, BlogPost, BlogCategory, SiteSetting,
    FAQ, Testimonial, SectionContent,
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



def create_blog_categories():
    """Create blog categories"""
    print("Creating blog categories...")

    categories_data = [
        {
            'name': 'Adaptive Fashion',
            'slug': 'adaptive-fashion',
            'description': 'Articles about adaptive fashion trends, designs, and innovations'
        },
        {
            'name': 'Culture & Heritage',
            'slug': 'culture',
            'description': 'Exploring African heritage and culture through fashion'
        },
        {
            'name': 'Disability Rights',
            'slug': 'disability-rights',
            'description': 'Advocacy, rights, and inclusion for people with disabilities'
        },
        {
            'name': 'Sustainability',
            'slug': 'sustainability',
            'description': 'Sustainable fashion practices and eco-friendly design'
        }
    ]

    for cat_data in categories_data:
        category = BlogCategory.query.filter_by(slug=cat_data['slug']).first()
        if category:
            print(f"  ⚠ Category '{cat_data['name']}' already exists")
            continue

        category = BlogCategory(
            id=str(uuid.uuid4()),
            name=cat_data['name'],
            slug=cat_data['slug'],
            description=cat_data['description'],
            is_active=True
        )
        db.session.add(category)
        print(f"  ✓ Created category: {category.name}")

    db.session.commit()


def create_blog_posts(admin):
    """Create sample blog posts"""
    print("Creating blog posts...")

    posts_data = [
        {
            'title': 'The Future of Adaptive Fashion in Africa',
            'slug': 'future-of-adaptive-fashion-africa',
            'excerpt': 'Exploring how adaptive fashion is transforming lives across the continent and creating new opportunities for inclusion.',
            'content': '''
                <p>Adaptive fashion is transforming the way we think about clothing design across Africa. With innovations like magnetic closures, adjustable fits, and sensory-friendly fabrics, fashion is becoming more inclusive than ever before.</p>

                <h2>The Rise of Adaptive Design</h2>
                <p>For too long, people with disabilities have been overlooked by the fashion industry. But a new wave of designers and brands are changing that narrative, creating beautiful, functional clothing that addresses real accessibility needs.</p>

                <h2>Key Innovations</h2>
                <ul>
                    <li><strong>Magnetic closures:</strong> Easy to fasten one-handed or with limited dexterity</li>
                    <li><strong>Adjustable fits:</strong> Accommodating different body shapes and mobility aids</li>
                    <li><strong>Seated-wear design:</strong> Optimized for wheelchair users</li>
                    <li><strong>Sensory-friendly fabrics:</strong> Comfortable for those with sensory sensitivities</li>
                </ul>

                <h2>Looking Ahead</h2>
                <p>As awareness grows and technology advances, we expect to see even more innovations in adaptive fashion. The future is inclusive, and we're proud to be part of this movement.</p>
            ''',
            'category': 'adaptive-fashion',
            'is_featured': True,
            'read_time': '5 min read',
            'featured_image': '/images/blog/adaptive-fashion-future.jpg'
        },
        {
            'title': 'TactART: Bridging the Gap Between Visual and Tactile Art',
            'slug': 'tactart-bridging-visual-tactile-art',
            'excerpt': 'How our TactART initiative is making visual art accessible to blind communities through innovative tactile experiences.',
            'content': '''
                <p>Art has always been considered a visual medium, but what if we could experience it through touch? Our TactART initiative is breaking down barriers and making art accessible to the blind and visually impaired community.</p>

                <h2>What is TactART?</h2>
                <p>TactART transforms two-dimensional artwork into tactile experiences. Using specialized techniques, we create raised versions of paintings and photographs that can be explored through touch.</p>

                <h2>The Impact</h2>
                <p>Since launching TactART, we've brought art to hundreds of visually impaired individuals who never thought they could experience paintings and visual art. The emotional response has been overwhelming.</p>

                <blockquote>"For the first time in my life, I could 'see' the Mona Lisa. It was a moment I'll never forget." - Sarah, TactART participant</blockquote>

                <h2>Community Partnerships</h2>
                <p>We partner with schools, museums, and community centers to bring TactART experiences to those who need them most. If you'd like to host a TactART session, get in touch with our team.</p>
            ''',
            'category': 'culture',
            'is_featured': True,
            'read_time': '7 min read',
            'featured_image': '/images/blog/tactart-initiative.jpg'
        },
        {
            'title': 'Disability Rights and Fashion: Breaking Down Barriers',
            'slug': 'disability-rights-fashion-barriers',
            'excerpt': 'Why the fashion industry must prioritize accessibility and how we\'re leading the charge for inclusive design.',
            'content': '''
                <p>The fashion industry has historically excluded people with disabilities. From runway shows to retail stores, accessibility has been an afterthought. It's time to change that.</p>

                <h2>The Problem</h2>
                <p>According to the World Health Organization, over 1 billion people live with some form of disability. That's 15% of the global population being underserved by mainstream fashion.</p>

                <h2>Our Commitment</h2>
                <p>At Hisi Studio, accessibility isn't an add-on—it's baked into everything we do. From design to delivery, we ensure our products are accessible to all.</p>

                <h2>What You Can Do</h2>
                <ul>
                    <li>Support brands that prioritize accessibility</li>
                    <li>Advocate for inclusive design in your community</li>
                    <li>Amplify the voices of disabled fashion advocates</li>
                </ul>
            ''',
            'category': 'disability-rights',
            'is_featured': False,
            'read_time': '6 min read',
            'featured_image': '/images/blog/disability-rights.jpg'
        },
        {
            'title': 'Sustainable Fashion: Our Commitment to the Planet',
            'slug': 'sustainable-fashion-commitment',
            'excerpt': 'From eco-friendly materials to ethical production, discover how we\'re building a sustainable fashion ecosystem.',
            'content': '''
                <p>Fashion is one of the most polluting industries in the world. At Hisi Studio, we believe that inclusive fashion must also be sustainable fashion.</p>

                <h2>Our Sustainability Pillars</h2>
                <ul>
                    <li><strong>Eco-friendly materials:</strong> We use organic cotton, recycled fabrics, and natural dyes</li>
                    <li><strong>Ethical production:</strong> Fair wages and safe working conditions for all artisans</li>
                    <li><strong>Minimal waste:</strong> Made-to-order production reduces overstock</li>
                    <li><strong>Local sourcing:</strong> Supporting African suppliers and reducing carbon footprint</li>
                </ul>

                <h2>The Bigger Picture</h2>
                <p>Sustainability isn't just about the environment—it's about building systems that benefit everyone, including the communities where our products are made.</p>
            ''',
            'category': 'sustainability',
            'is_featured': False,
            'read_time': '5 min read',
            'featured_image': '/images/blog/sustainable-fashion.jpg'
        },
        {
            'title': 'African Heritage in Modern Adaptive Design',
            'slug': 'african-heritage-adaptive-design',
            'excerpt': 'Celebrating African patterns, textiles, and craftsmanship in our contemporary adaptive fashion collections.',
            'content': '''
                <p>Africa has a rich textile heritage spanning thousands of years. From Kente cloth to Ankara prints, our continent's patterns tell stories of culture, identity, and resilience.</p>

                <h2>Honoring Tradition</h2>
                <p>At Hisi Studio, we incorporate traditional African textiles into our adaptive designs, creating pieces that are both culturally meaningful and functionally accessible.</p>

                <h2>Working with Artisans</h2>
                <p>We partner with local artisans who have inherited generations of textile knowledge. Their expertise helps us create truly unique pieces that honor African heritage.</p>

                <h2>Featured Techniques</h2>
                <ul>
                    <li><strong>Batik:</strong> Traditional wax-resist dyeing</li>
                    <li><strong>Kitenge patterns:</strong> Bold, colorful East African prints</li>
                    <li><strong>Hand-woven Kente:</strong> Ghanaian strip-woven fabric</li>
                </ul>
            ''',
            'category': 'culture',
            'is_featured': False,
            'read_time': '4 min read',
            'featured_image': '/images/blog/african-heritage.jpg'
        },
        {
            'title': 'Designing for Wheelchair Users: Key Considerations',
            'slug': 'designing-wheelchair-users',
            'excerpt': 'Learn about the specific design features that make clothing comfortable and functional for wheelchair users.',
            'content': '''
                <p>Designing for wheelchair users requires understanding the unique challenges of seated wear. Traditional clothing often bunches, rides up, or restricts movement when seated for extended periods.</p>

                <h2>Key Design Features</h2>
                <ul>
                    <li><strong>Shorter front rise:</strong> Prevents fabric from bunching at the waist</li>
                    <li><strong>Longer back length:</strong> Provides coverage when seated</li>
                    <li><strong>Side openings:</strong> Makes dressing easier</li>
                    <li><strong>Reinforced seams:</strong> Withstands wear in high-friction areas</li>
                </ul>

                <h2>Input from the Community</h2>
                <p>Every design decision we make is informed by feedback from wheelchair users. Their insights are invaluable in creating truly functional clothing.</p>
            ''',
            'category': 'adaptive-fashion',
            'is_featured': False,
            'read_time': '6 min read',
            'featured_image': '/images/blog/wheelchair-design.jpg'
        },
        {
            'title': 'Sensory-Friendly Fashion: Beyond the Basics',
            'slug': 'sensory-friendly-fashion-basics',
            'excerpt': 'Understanding sensory sensitivities and how thoughtful design can make fashion accessible to everyone.',
            'content': '''
                <p>For individuals with sensory processing differences, clothing can be a constant source of discomfort. Tags, seams, and certain fabrics can feel overwhelming or even painful.</p>

                <h2>What Makes Clothing Sensory-Friendly?</h2>
                <ul>
                    <li><strong>Tag-free labels:</strong> Printed labels instead of sewn tags</li>
                    <li><strong>Flat seams:</strong> No raised ridges against the skin</li>
                    <li><strong>Soft fabrics:</strong> Bamboo, modal, and organic cotton</li>
                    <li><strong>Consistent texture:</strong> No unexpected rough patches</li>
                </ul>

                <h2>Who Benefits?</h2>
                <p>While sensory-friendly clothing is essential for many autistic individuals and those with sensory processing disorder, these features benefit everyone who values comfort.</p>
            ''',
            'category': 'adaptive-fashion',
            'is_featured': False,
            'read_time': '5 min read',
            'featured_image': '/images/blog/sensory-friendly.jpg'
        },
        {
            'title': 'Community Empowerment Through Fashion',
            'slug': 'community-empowerment-fashion',
            'excerpt': 'How our partnerships with local artisans and disability organizations are creating meaningful impact.',
            'content': '''
                <p>Fashion can be a powerful tool for community empowerment. At Hisi Studio, we believe in creating opportunities that uplift entire communities.</p>

                <h2>Our Partnership Model</h2>
                <ul>
                    <li><strong>Local artisans:</strong> We employ skilled craftspeople from underserved communities</li>
                    <li><strong>Disability organizations:</strong> We collaborate with disability advocacy groups</li>
                    <li><strong>Training programs:</strong> We provide skills training to people with disabilities</li>
                </ul>

                <h2>Impact Stories</h2>
                <p>Meet Mary, a talented seamstress who learned adaptive clothing construction through our training program. Today, she runs her own small business creating adaptive clothing for her community.</p>

                <h2>Join Our Mission</h2>
                <p>Whether as a customer, partner, or volunteer, you can be part of creating meaningful change through fashion.</p>
            ''',
            'category': 'sustainability',
            'is_featured': False,
            'read_time': '7 min read',
            'featured_image': '/images/blog/community-empowerment.jpg'
        },
        {
            'title': 'The Importance of Braille in Fashion',
            'slug': 'importance-braille-fashion',
            'excerpt': 'Why integrating Braille into fashion products is more than just accessibility—it\'s about dignity and independence.',
            'content': '''
                <p>For blind and visually impaired individuals, identifying clothing can be a daily challenge. What color is this shirt? Which trousers are the formal ones? Braille integration offers a solution.</p>

                <h2>Braille in Our Products</h2>
                <p>We incorporate Braille labels into our clothing, providing information about:</p>
                <ul>
                    <li>Color description</li>
                    <li>Care instructions</li>
                    <li>Size and fit information</li>
                </ul>

                <h2>Beyond Labels</h2>
                <p>We're also exploring tactile elements in design—raised patterns and textures that help identify different garments without needing to see them.</p>

                <h2>Independence and Dignity</h2>
                <p>Being able to dress independently is about more than convenience—it's about dignity and self-determination. That's why Braille integration matters.</p>
            ''',
            'category': 'disability-rights',
            'is_featured': False,
            'read_time': '4 min read',
            'featured_image': '/images/blog/braille-fashion.jpg'
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
            category=post_data['category'],
            is_featured=post_data['is_featured'],
            read_time=post_data['read_time'],
            featured_image=post_data['featured_image'],
            meta_title=f"{post_data['title']} - Hisi Studio Blog",
            meta_description=post_data['excerpt'],
            is_published=True,
            published_at=datetime.utcnow()
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


def create_section_content():
    """Create editable section content for website pages"""
    print("Creating section content...")
    
    sections_data = [
        # Home Page - Hero Section
        {'page_name': 'home', 'section_name': 'hero', 'content_key': 'title', 
         'content_value': '2 THUKU 0 COLLECTION', 'content_type': 'text',
         'label': 'Hero Title', 'display_order': 1},
        {'page_name': 'home', 'section_name': 'hero', 'content_key': 'subtitle',
         'content_value': 'Adaptive Fashion for Everyone', 'content_type': 'text',
         'label': 'Hero Subtitle', 'display_order': 2},
        {'page_name': 'home', 'section_name': 'hero', 'content_key': 'image_url',
         'content_value': '/images/hero/slide-1.jpg', 'content_type': 'image',
         'label': 'Hero Background Image', 'display_order': 3},
        
        # Home Page - About Section
        {'page_name': 'home', 'section_name': 'about', 'content_key': 'title',
         'content_value': 'Fashion That Feels Right', 'content_type': 'text',
         'label': 'About Section Title', 'display_order': 1},
        {'page_name': 'home', 'section_name': 'about', 'content_key': 'description',
         'content_value': 'At Hisi Studio, we believe that everyone deserves to feel confident and comfortable in their clothing. Our adaptive fashion line combines cutting-edge design with practical functionality.',
         'content_type': 'richtext', 'label': 'About Section Description', 'display_order': 2},
        {'page_name': 'home', 'section_name': 'about', 'content_key': 'image_url',
         'content_value': '/images/about/mission.jpg', 'content_type': 'image',
         'label': 'About Section Image', 'display_order': 3},
        
        # Home Page - Mission Section
        {'page_name': 'home', 'section_name': 'mission', 'content_key': 'title',
         'content_value': 'Our Mission', 'content_type': 'text',
         'label': 'Mission Title', 'display_order': 1},
        {'page_name': 'home', 'section_name': 'mission', 'content_key': 'description',
         'content_value': 'To create adaptive fashion that combines cutting-edge design with practical functionality, making style accessible to everyone regardless of ability.',
         'content_type': 'richtext', 'label': 'Mission Statement', 'display_order': 2},
        
        # About Page - Hero Section  
        {'page_name': 'about', 'section_name': 'hero', 'content_key': 'title',
         'content_value': 'About Hisi Studio', 'content_type': 'text',
         'label': 'Hero Title', 'display_order': 1},
        {'page_name': 'about', 'section_name': 'hero', 'content_key': 'subtitle',
         'content_value': 'Our Story, Our Mission', 'content_type': 'text',
         'label': 'Hero Subtitle', 'display_order': 2},
        
        # About Page - Story Section
        {'page_name': 'about', 'section_name': 'story', 'content_key': 'title',
         'content_value': 'Our Story', 'content_type': 'text',
         'label': 'Story Title', 'display_order': 1},
        {'page_name': 'about', 'section_name': 'story', 'content_key': 'content',
         'content_value': 'Hisi Studio was founded with a simple yet powerful vision: to create fashion that celebrates individuality and promotes inclusivity. Our journey began when we recognized the gap in adaptive fashion that truly combines style with functionality.',
         'content_type': 'richtext', 'label': 'Story Content', 'display_order': 2},
        
        # Contact Page - Hero Section
        {'page_name': 'contact', 'section_name': 'hero', 'content_key': 'title',
         'content_value': "Let's Get in Touch", 'content_type': 'text',
         'label': 'Hero Title', 'display_order': 1},
        {'page_name': 'contact', 'section_name': 'hero', 'content_key': 'subtitle',
         'content_value': 'We would love to hear from you', 'content_type': 'text',
         'label': 'Hero Subtitle', 'display_order': 2},
        
        # Contact Page - Info Section
        {'page_name': 'contact', 'section_name': 'info', 'content_key': 'email',
         'content_value': 'hello@hisi.studio', 'content_type': 'text',
         'label': 'Contact Email', 'display_order': 1},
        {'page_name': 'contact', 'section_name': 'info', 'content_key': 'phone',
         'content_value': '+254 700 000 000', 'content_type': 'text',
         'label': 'Contact Phone', 'display_order': 2},
        {'page_name': 'contact', 'section_name': 'info', 'content_key': 'address',
         'content_value': 'Nairobi, Kenya', 'content_type': 'text',
         'label': 'Contact Address', 'display_order': 3},
        
        # Blog Page - Hero Section
        {'page_name': 'blog', 'section_name': 'hero', 'content_key': 'title',
         'content_value': 'Stories & Insights', 'content_type': 'text',
         'label': 'Blog Hero Title', 'display_order': 1},
        {'page_name': 'blog', 'section_name': 'hero', 'content_key': 'subtitle',
         'content_value': 'Our Journal', 'content_type': 'text',
         'label': 'Blog Hero Subtitle', 'display_order': 2},
        {'page_name': 'blog', 'section_name': 'hero', 'content_key': 'description',
         'content_value': 'Explore the world of adaptive fashion through stories, tips, and inspiration.',
         'content_type': 'text', 'label': 'Blog Hero Description', 'display_order': 3},
        
        # Newsletter Section
        {'page_name': 'blog', 'section_name': 'newsletter', 'content_key': 'title',
         'content_value': 'Stay in the Loop', 'content_type': 'text',
         'label': 'Newsletter Title', 'display_order': 1},
        {'page_name': 'blog', 'section_name': 'newsletter', 'content_key': 'description',
         'content_value': 'Subscribe to our newsletter for the latest stories and updates.',
         'content_type': 'text', 'label': 'Newsletter Description', 'display_order': 2},
    ]
    
    created_count = 0
    skipped_count = 0
    
    for section_data in sections_data:
        existing = SectionContent.query.filter_by(
            page_name=section_data['page_name'],
            section_name=section_data['section_name'],
            content_key=section_data['content_key']
        ).first()
        
        if not existing:
            section = SectionContent(
                id=str(uuid.uuid4()),
                page_name=section_data['page_name'],
                section_name=section_data['section_name'],
                content_key=section_data['content_key'],
                content_value=section_data['content_value'],
                content_type=section_data['content_type'],
                label=section_data.get('label'),
                display_order=section_data.get('display_order', 0)
            )
            db.session.add(section)
            created_count += 1
        else:
            skipped_count += 1
    
    db.session.commit()
    print(f"  ✓ Created {created_count} section content items")
    if skipped_count > 0:
        print(f"  ⚠ Skipped {skipped_count} existing items")


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
        create_blog_categories()
        create_blog_posts(admin)
        create_site_settings()

        # Create contact page content
        create_faqs()
        create_testimonials()
        create_contact_settings()

        # Create press page content
        create_press_content()

        # Create editable section content
        create_section_content()

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
