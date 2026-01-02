import { getPlaceholderImage } from '../utils/placeholders'

export const collectionsHero = {
    title: "Our Collections",
    subtitle: "Curated Adaptive Fashion",
    description: "Explore our thoughtfully designed collections that blend style, comfort, and accessibility for every body and every ability."
}

export const collections = [
    {
        id: 1,
        name: "Adaptive Outerwear",
        slug: "adaptive-outerwear",
        description: "Stylish jackets, coats, and blazers designed with magnetic closures, easy-access pockets, and wheelchair-friendly features.",
        image: getPlaceholderImage(600, 750, 'Adaptive Outerwear', '#1a365d'),
        productCount: 12,
        featured: true,
        features: ["Magnetic Closures", "Easy Access Pockets", "Seated Comfort Design"]
    },
    {
        id: 2,
        name: "Sensory-Friendly Essentials",
        slug: "sensory-friendly",
        description: "Ultra-soft, tagless clothing with flat seams designed for people with sensory sensitivities and autism.",
        image: getPlaceholderImage(600, 750, 'Sensory-Friendly', '#8B9D83'),
        productCount: 18,
        featured: true,
        features: ["Tag-Free Design", "Flat Seams", "Soft Fabrics"]
    },
    {
        id: 3,
        name: "Seated Comfort Collection",
        slug: "seated-comfort",
        description: "Specially tailored for wheelchair users with longer backs, shorter fronts, and strategic seam placement.",
        image: getPlaceholderImage(600, 750, 'Seated Comfort', '#4A5D5E'),
        productCount: 15,
        featured: true,
        features: ["Extended Back Length", "Pressure-Free Zones", "Breathable Materials"]
    },
    {
        id: 4,
        name: "Easy Dressing Solutions",
        slug: "easy-dressing",
        description: "Clothing with side openings, magnetic closures, and adaptive features for independent dressing or caregiver assistance.",
        image: getPlaceholderImage(600, 600, 'Easy Dressing', '#E8B44C'),
        productCount: 20,
        featured: false,
        features: ["Side Openings", "Magnetic Fasteners", "Dignified Dressing"]
    },
    {
        id: 5,
        name: "Braille-Branded Collection",
        slug: "braille-branded",
        description: "Exclusive pieces featuring integrated Braille branding, celebrating inclusive design and empowering blind communities.",
        image: getPlaceholderImage(600, 600, 'Braille Collection', '#2c5282'),
        productCount: 10,
        featured: false,
        features: ["Braille Integration", "Tactile Elements", "Inclusive Design"]
    },
    {
        id: 6,
        name: "African Heritage Line",
        slug: "african-heritage",
        description: "Contemporary adaptive fashion celebrating African patterns, textiles, and craftsmanship with modern accessibility features.",
        image: getPlaceholderImage(600, 600, 'African Heritage', '#D4703C'),
        productCount: 14,
        featured: false,
        features: ["African Patterns", "Artisan Crafted", "Cultural Pride"]
    },
    {
        id: 7,
        name: "Accessories & Essentials",
        slug: "accessories",
        description: "Adaptive bags, scarves, and accessories with Braille labels, tactile identifiers, and easy-use features.",
        image: getPlaceholderImage(600, 600, 'Accessories', '#6B6B6B'),
        productCount: 25,
        featured: false,
        features: ["Braille Labels", "Easy-Use Closures", "Tactile Identifiers"]
    },
    {
        id: 8,
        name: "Limited Edition",
        slug: "limited-edition",
        description: "Exclusive, small-batch collections featuring innovative adaptive designs and unique collaborations.",
        image: getPlaceholderImage(600, 600, 'Limited Edition', '#833AB4'),
        productCount: 8,
        featured: false,
        features: ["Exclusive Designs", "Limited Quantities", "Collector's Items"]
    }
]

export const collectionCategories = [
    {
        id: 1,
        name: "By Feature",
        items: ["Magnetic Closures", "Sensory-Friendly", "Seated Comfort", "Easy Dressing"]
    },
    {
        id: 2,
        name: "By Style",
        items: ["Outerwear", "Tops & Shirts", "Bottoms", "Dresses", "Accessories"]
    },
    {
        id: 3,
        name: "By Collection",
        items: ["African Heritage", "Braille-Branded", "Limited Edition", "New Arrivals"]
    }
]

export const featuredProducts = [
    {
        id: 1,
        name: "Adaptive Bomber Jacket",
        price: 89000,
        image: getPlaceholderImage(400, 500, 'Bomber Jacket', '#1a365d'),
        collection: "Adaptive Outerwear",
        badge: "Best Seller"
    },
    {
        id: 2,
        name: "Sensory-Friendly Top",
        price: 42000,
        image: getPlaceholderImage(400, 500, 'Soft Top', '#8B9D83'),
        collection: "Sensory-Friendly Essentials",
        badge: "New"
    },
    {
        id: 3,
        name: "Wheelchair-Friendly Trousers",
        price: 56000,
        image: getPlaceholderImage(400, 500, 'Trousers', '#4A5D5E'),
        collection: "Seated Comfort Collection",
        badge: null
    },
    {
        id: 4,
        name: "Braille Logo Tote Bag",
        price: 28000,
        image: getPlaceholderImage(400, 500, 'Tote Bag', '#2c5282'),
        collection: "Braille-Branded Collection",
        badge: "Exclusive"
    }
]

export const collectionsCTA = {
    title: "Can't Find What You're Looking For?",
    description: "We offer custom adaptive fashion solutions tailored to your specific needs. Contact us to discuss your requirements.",
    buttonText: "Request Custom Design",
    buttonLink: "/contact?type=custom-design"
}
