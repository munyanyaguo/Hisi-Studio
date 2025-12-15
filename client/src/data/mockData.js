// Mock data for Hisi Studio landing page
// This will be replaced with API data later

import { placeholders } from '../utils/placeholders'

export const heroSlides = [
    {
        id: 1,
        image: '/images/hero/slide-1.jpg',
        title: 'Adaptive Fashion',
        subtitle: 'Style Meets Accessibility',
        cta: 'Shop Now',
        ctaLink: '/shop',
    },
    {
        id: 2,
        image: '/images/hero/slide-2.jpg',
        title: 'New Collection',
        subtitle: 'Designed for Everyone',
        cta: 'Explore',
        ctaLink: '/shop',
    },
    {
        id: 3,
        image: '/images/hero/slide-3.jpg',
        title: 'Inclusive Design',
        subtitle: 'Fashion Without Barriers',
        cta: 'Learn More',
        ctaLink: '/about',
    },
]

export const featuredProducts = [
    {
        id: 1,
        name: 'Adaptive Bomber Jacket',
        price: 89000,
        originalPrice: 120000,
        images: {
            main: '/images/products/jacket-main.jpg',
            hover: placeholders.productJacketHover,
        },
        badge: 'New',
        accessibilityFeatures: ['Magnetic closures', 'Easy grip zippers'],
    },
    {
        id: 2,
        name: 'Inclusive Wrap Dress',
        price: 65000,
        images: {
            main: placeholders.productDress,
            hover: placeholders.productDressHover,
        },
        badge: 'Best Seller',
        accessibilityFeatures: ['Adjustable waist', 'Side openings'],
    },
    {
        id: 3,
        name: 'Adaptive Trousers',
        price: 55000,
        originalPrice: 75000,
        images: {
            main: placeholders.productTrousers,
            hover: placeholders.productTrousersHover,
        },
        badge: 'Sale',
        accessibilityFeatures: ['Elastic waistband', 'Seated comfort'],
    },
    {
        id: 4,
        name: 'Sensory-Friendly Top',
        price: 42000,
        images: {
            main: '/images/products/top-main.jpg',
            hover: placeholders.productTopHover,
        },
        badge: 'Featured',
        accessibilityFeatures: ['Tag-free', 'Soft fabric', 'Flat seams'],
    },
]

export const categories = [
    {
        id: 1,
        name: 'Adaptive Outerwear',
        slug: 'adaptive-outerwear',
        image: placeholders.categoryOuterwear,
        description: 'Jackets and coats with easy closures',
        productCount: 24,
    },
    {
        id: 2,
        name: 'Sensory-Friendly',
        slug: 'sensory-friendly',
        image: placeholders.categorySensory,
        description: 'Soft fabrics, tag-free, flat seams',
        productCount: 18,
    },
    {
        id: 3,
        name: 'Seated Comfort',
        slug: 'seated-comfort',
        image: placeholders.categorySeated,
        description: 'Designed for wheelchair users',
        productCount: 32,
    },
    {
        id: 4,
        name: 'Easy Dressing',
        slug: 'easy-dressing',
        image: placeholders.categoryEasyDressing,
        description: 'Magnetic closures, wide openings',
        productCount: 28,
    },
]

export const adaptiveFeatures = [
    {
        id: 1,
        icon: 'Magnet',
        title: 'Magnetic Closures',
        description: 'Easy-to-use magnetic fasteners replace traditional buttons and zippers for effortless dressing.',
    },
    {
        id: 2,
        icon: 'Accessibility',
        title: 'Wheelchair Friendly',
        description: 'Designed with seated comfort in mind, featuring reinforced seams and strategic pocket placement.',
    },
    {
        id: 3,
        icon: 'Sparkles',
        title: 'Sensory-Friendly',
        description: 'Tag-free labels, soft fabrics, and flat seams for those with sensory sensitivities.',
    },
    {
        id: 4,
        icon: 'Maximize2',
        title: 'Adjustable Fit',
        description: 'Elastic waistbands, adjustable straps, and flexible sizing for diverse body types.',
    },
    {
        id: 5,
        icon: 'Zap',
        title: 'Easy Grip',
        description: 'Large zipper pulls and easy-grip fasteners designed for limited dexterity.',
    },
    {
        id: 6,
        icon: 'Heart',
        title: 'Inclusive Sizing',
        description: 'Extended size range with adaptive features across all sizes, not just select ones.',
    },
]

export const testimonials = [
    {
        id: 1,
        name: 'Sarah Mwangi',
        role: 'Customer',
        content: 'Hisi Studio has transformed my wardrobe. The magnetic closures make getting dressed so much easier, and I finally feel stylish and independent.',
        rating: 5,
        image: placeholders.testimonial1,
    },
    {
        id: 2,
        name: 'James Ochieng',
        role: 'Customer',
        content: 'As a wheelchair user, finding comfortable and stylish clothing was always a challenge. Hisi Studio\'s seated comfort collection is a game-changer.',
        rating: 5,
        image: placeholders.testimonial2,
    },
    {
        id: 3,
        name: 'Amina Hassan',
        role: 'Customer',
        content: 'The sensory-friendly fabrics are perfect for my son. No more morning struggles with tags and scratchy seams. Thank you, Hisi Studio!',
        rating: 5,
        image: placeholders.testimonial3,
    },
    {
        id: 4,
        name: 'David Kamau',
        role: 'Customer',
        content: 'Quality, style, and accessibility all in one place. Hisi Studio proves that adaptive fashion doesn\'t mean compromising on design.',
        rating: 5,
        image: placeholders.testimonial4,
    },
]

export const instagramPosts = [
    {
        id: 1,
        image: placeholders.instagram1,
        link: 'https://instagram.com/hisistudio',
        alt: 'Customer wearing adaptive bomber jacket',
    },
    {
        id: 2,
        image: placeholders.instagram2,
        link: 'https://instagram.com/hisistudio',
        alt: 'Close-up of magnetic closure detail',
    },
    {
        id: 3,
        image: placeholders.instagram3,
        link: 'https://instagram.com/hisistudio',
        alt: 'Inclusive wrap dress on model',
    },
    {
        id: 4,
        image: placeholders.instagram4,
        link: 'https://instagram.com/hisistudio',
        alt: 'Behind the scenes at Hisi Studio',
    },
    {
        id: 5,
        image: placeholders.instagram5,
        link: 'https://instagram.com/hisistudio',
        alt: 'Sensory-friendly fabric swatches',
    },
    {
        id: 6,
        image: placeholders.instagram6,
        link: 'https://instagram.com/hisistudio',
        alt: 'Customer testimonial feature',
    },
]

export const aboutContent = {
    title: 'Fashion That Feels Right',
    subtitle: 'Our Mission',
    description: 'At Hisi Studio, we believe that everyone deserves to feel confident and comfortable in what they wear. We create adaptive fashion that combines cutting-edge design with thoughtful accessibility features, ensuring that style is truly inclusive.',
    highlights: [
        'Designed with input from the disability community',
        'Sustainable and ethically sourced materials',
        'Inclusive sizing from XS to 5XL',
        'Adaptive features across all collections',
    ],
    image: placeholders.aboutMission,
    cta: 'Learn Our Story',
    ctaLink: '/about',
}

export const socialLinks = {
    instagram: 'https://instagram.com/hisistudio',
    facebook: 'https://facebook.com/hisistudio',
    twitter: 'https://twitter.com/hisistudio',
    linkedin: 'https://linkedin.com/company/hisistudio',
}

export const footerLinks = {
    shop: [
        { name: 'New Arrivals', href: '/shop/new' },
        { name: 'Best Sellers', href: '/shop/best-sellers' },
        { name: 'All Products', href: '/shop' },
        { name: 'Gift Cards', href: '/gift-cards' },
    ],
    about: [
        { name: 'Our Story', href: '/about' },
        { name: 'Adaptive Features', href: '/accessibility' },
        { name: 'Sustainability', href: '/sustainability' },
        { name: 'Blog', href: '/blog' },
    ],
    support: [
        { name: 'Contact Us', href: '/contact' },
        { name: 'Shipping & Returns', href: '/shipping' },
        { name: 'Size Guide', href: '/size-guide' },
        { name: 'FAQ', href: '/faq' },
    ],
    legal: [
        { name: 'Privacy Policy', href: '/privacy' },
        { name: 'Terms of Service', href: '/terms' },
        { name: 'Accessibility Statement', href: '/accessibility-statement' },
    ],
}
