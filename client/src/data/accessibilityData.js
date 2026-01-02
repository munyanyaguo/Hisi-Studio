export const accessibilityHero = {
    title: "Accessibility & Inclusion",
    subtitle: "Fashion Without Barriers",
    description: "At Hisi Studio, we believe fashion should be accessible to everyone. Our adaptive designs, inclusive art projects, and sustainable practices are transforming the industry—one innovative solution at a time.",
    image: "/images/accessibility/hero-bg.jpg"
}

export const adaptiveMethods = {
    title: "Adaptive Fashion Methods",
    subtitle: "Innovation Meets Inclusivity",
    description: "Our adaptive fashion techniques prioritize comfort, dignity, and independence for people with disabilities.",
    methods: [
        {
            id: 1,
            title: "Magnetic Closures",
            description: "Easy-to-use magnetic fasteners replace traditional buttons and zippers, making dressing effortless for people with limited dexterity.",
            image: "/images/accessibility/magnetic-closures.jpg",
            features: ["One-handed operation", "Strong hold", "Invisible design", "Washable"]
        },
        {
            id: 2,
            title: "Seated Comfort Design",
            description: "Specially tailored for wheelchair users with longer backs, shorter fronts, and strategic seam placement to prevent pressure sores.",
            image: "/images/accessibility/seated-comfort.jpg",
            features: ["Extended back length", "Reinforced seams", "Breathable fabrics", "Pressure-free zones"]
        },
        {
            id: 3,
            title: "Sensory-Friendly Fabrics",
            description: "Ultra-soft, tagless materials with flat seams designed for people with sensory sensitivities and autism.",
            image: "/images/accessibility/sensory-friendly.jpg",
            features: ["Tag-free design", "Flat seams", "Soft textures", "Non-irritating materials"]
        },
        {
            id: 4,
            title: "Easy Side Openings",
            description: "Side-opening garments that allow caregivers to dress individuals without causing discomfort or requiring complex movements.",
            image: "/images/accessibility/side-openings.jpg",
            features: ["Full-length openings", "Secure closures", "Dignified dressing", "Caregiver-friendly"]
        }
    ]
}

export const tactArtProject = {
    title: "TactART",
    subtitle: "Making Visual Art Accessible",
    description: "TactART is our groundbreaking initiative that transforms visual art into tactile experiences, making art accessible to blind and visually impaired communities through raised textures, Braille descriptions, and multi-sensory engagement.",
    image: "/images/accessibility/tactart-hero.jpg",
    features: [
        {
            id: 1,
            title: "Tactile Art Pieces",
            description: "Original artworks created with raised textures and materials that can be experienced through touch.",
            icon: "hand"
        },
        {
            id: 2,
            title: "Braille Integration",
            description: "Every piece includes Braille descriptions, artist statements, and contextual information.",
            icon: "type"
        },
        {
            id: 3,
            title: "Audio Guides",
            description: "Complementary audio descriptions provide rich context and enhance the tactile experience.",
            icon: "headphones"
        },
        {
            id: 4,
            title: "Workshops & Exhibitions",
            description: "Interactive sessions where blind and sighted communities experience art together.",
            icon: "users"
        }
    ],
    gallery: [
        {
            id: 1,
            image: "/images/accessibility/tactart-1.jpg",
            title: "African Patterns in Relief",
            description: "Traditional African patterns recreated with raised textures"
        },
        {
            id: 2,
            image: "/images/accessibility/tactart-2.jpg",
            title: "Portrait Series",
            description: "Tactile portraits celebrating diversity and inclusion"
        },
        {
            id: 3,
            image: "/images/accessibility/tactart-3.jpg",
            title: "Nature & Heritage",
            description: "Multi-textured pieces exploring African landscapes"
        }
    ]
}

export const brailleProducts = {
    title: "Braille-Branded Products",
    description: "Our exclusive line of products featuring integrated Braille branding, making fashion truly inclusive and empowering for blind communities.",
    products: [
        {
            id: 1,
            title: "Braille Logo Apparel",
            description: "Clothing with our logo embossed in Braille, celebrating inclusive design.",
            image: "/images/accessibility/braille-apparel.jpg"
        },
        {
            id: 2,
            title: "Tactile Accessories",
            description: "Bags, scarves, and accessories with Braille labels and tactile identifiers.",
            image: "/images/accessibility/braille-accessories.jpg"
        },
        {
            id: 3,
            title: "Braille Care Labels",
            description: "All our garments include Braille care instructions for independent clothing management.",
            image: "/images/accessibility/braille-labels.jpg"
        }
    ]
}

export const impactSustainability = {
    title: "Impact & Sustainability",
    subtitle: "Responsible Fashion for a Better Future",
    description: "Our commitment to sustainability goes hand-in-hand with our mission for inclusion. We believe in creating fashion that's good for people and the planet.",
    metrics: [
        {
            id: 1,
            label: "Artisans Employed",
            value: "50+",
            description: "Local artisans and craftspeople supported",
            icon: "users"
        },
        {
            id: 2,
            label: "Eco-Friendly Materials",
            value: "85%",
            description: "Of our fabrics are sustainable or recycled",
            icon: "leaf"
        },
        {
            id: 3,
            label: "Community Programs",
            value: "12",
            description: "Disability inclusion and skills training programs",
            icon: "heart"
        },
        {
            id: 4,
            label: "Carbon Neutral",
            value: "100%",
            description: "All production processes are carbon-offset",
            icon: "globe"
        }
    ],
    initiatives: [
        {
            id: 1,
            title: "Responsible Sourcing",
            description: "We partner with ethical suppliers who share our values of fair wages, safe working conditions, and environmental stewardship. Our fabrics are sourced from certified sustainable producers.",
            image: "/images/accessibility/responsible-sourcing.jpg"
        },
        {
            id: 2,
            title: "Eco-Friendly Practices",
            description: "From natural dyes to water-saving production techniques, we minimize our environmental footprint at every stage. Our packaging is 100% recyclable and biodegradable.",
            image: "/images/accessibility/eco-friendly.jpg"
        },
        {
            id: 3,
            title: "Community Empowerment",
            description: "We invest in local communities through skills training, employment opportunities, and partnerships with disability advocacy organizations. Every purchase supports these programs.",
            image: "/images/accessibility/community-empowerment.jpg"
        }
    ]
}

export const partnershipCTA = {
    title: "Partner With Us",
    description: "Are you an organization, brand, or advocate passionate about accessibility and inclusion? Let's collaborate to create meaningful change in the fashion industry.",
    buttons: [
        {
            text: "Corporate Partnerships",
            href: "/contact?type=partnership",
            primary: true
        },
        {
            text: "Collaborate on Projects",
            href: "/contact?type=collaboration",
            primary: false
        }
    ]
}
