"""
Seed script to add Kimono products for testing
Run with: cd server && python seed_kimono_products.py
"""

from app import create_app
from app.extensions import db
from app.models import Product, Category
import uuid
from datetime import datetime

def create_kimono_category():
    """Create Kimono category if it doesn't exist"""
    print("Checking Kimono category...")

    category = Category.query.filter_by(slug='kimono-collection').first()
    if category:
        print("  ✓ Kimono Collection category already exists")
        return category

    category = Category(
        id=str(uuid.uuid4()),
        name='Kimono Collection',
        slug='kimono-collection',
        description='Beautiful kimono-inspired adaptive fashion pieces',
        is_active=True,
        display_order=1
    )
    db.session.add(category)
    db.session.commit()
    print("  ✓ Created Kimono Collection category")
    return category


def create_kimono_products(category):
    """Create Kimono Dress and Kimono Shirt products"""
    print("Creating Kimono products...")

    products_data = [
        {
            'name': 'Kimono Dress',
            'slug': 'kimono-dress',
            'description': 'Elegant magenta kimono dress with tie waist and flowing sleeves. Features easy-wear design with front button closure and adjustable belt. Perfect for both casual and formal occasions.',
            'short_description': 'Elegant magenta kimono dress with flowing sleeves',
            'price': 10.00,  # Test price in KES
            'original_price': 15.00,
            'sku': 'HSK-001',
            'stock_quantity': 100,
            'main_image': '/images/products/kimono-dress.jpg',
            'hover_image': '/images/products/kimono-dress-hover.jpg',
            'accessibility_features': [
                'Front button closure',
                'Adjustable tie waist',
                'Flowing sleeves for easy arm movement',
                'Soft, breathable fabric'
            ],
            'is_featured': True,
            'badge': 'New',
            'gender': 'women',
            'brand': 'Hisi Studio'
        },
        {
            'name': 'Kimono Shirt',
            'slug': 'kimono-shirt',
            'description': 'Stylish white t-shirt featuring braille text and abstract topographic design. Made from ultra-soft cotton with a relaxed fit. Celebrates accessibility and inclusive design.',
            'short_description': 'White t-shirt with braille text and topographic design',
            'price': 10.00,  # Test price in KES
            'original_price': 12.00,
            'sku': 'HSK-002',
            'stock_quantity': 100,
            'main_image': '/images/products/kimono-shirt.jpg',
            'hover_image': '/images/products/kimono-shirt-hover.jpg',
            'accessibility_features': [
                'Ultra-soft cotton fabric',
                'Tag-free design',
                'Relaxed fit',
                'Easy pull-on style'
            ],
            'is_featured': True,
            'badge': 'New',
            'gender': 'unisex',
            'brand': 'Hisi Studio'
        }
    ]

    created_products = []
    for product_data in products_data:
        # Check if product already exists
        existing = Product.query.filter_by(slug=product_data['slug']).first()
        if existing:
            print(f"  ⚠ Product '{product_data['name']}' already exists - updating price to 10 KES")
            existing.price = 10.00
            existing.currency = 'KES'
            existing.stock_quantity = 100
            db.session.commit()
            created_products.append(existing)
            continue

        product = Product(
            id=str(uuid.uuid4()),
            name=product_data['name'],
            slug=product_data['slug'],
            description=product_data['description'],
            short_description=product_data['short_description'],
            price=product_data['price'],
            original_price=product_data['original_price'],
            currency='KES',
            sku=product_data['sku'],
            stock_quantity=product_data['stock_quantity'],
            category_id=category.id,
            brand=product_data['brand'],
            gender=product_data['gender'],
            accessibility_features=product_data['accessibility_features'],
            main_image=product_data['main_image'],
            hover_image=product_data['hover_image'],
            is_active=True,
            is_featured=product_data['is_featured'],
            badge=product_data['badge']
        )
        db.session.add(product)
        created_products.append(product)
        print(f"  ✓ Created product: {product.name} - KES {product.price}")

    db.session.commit()
    return created_products


def main():
    """Main seed function"""
    print("\n" + "="*50)
    print("Seeding Kimono Products for Testing")
    print("="*50 + "\n")

    app = create_app()
    with app.app_context():
        # Create category
        category = create_kimono_category()

        # Create products
        products = create_kimono_products(category)

        print("\n" + "="*50)
        print("Seeding Complete!")
        print("="*50)
        print(f"\nCreated/Updated {len(products)} products:")
        for product in products:
            print(f"  - {product.name}: KES {product.price} (Stock: {product.stock_quantity})")
        print("\nYou can now test the shop with these products!")
        print("Price is set to KES 10 for testing Flutterwave payments.\n")


if __name__ == '__main__':
    main()
