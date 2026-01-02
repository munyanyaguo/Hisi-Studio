import { useState } from 'react'
import Navbar from '../../components/layout/Navbar'
import Footer from '../../components/layout/Footer'
import FlipProductCard from '../../components/product/FlipProductCard'
import { footerLinks, socialLinks } from '../../data/mockData'

const ShopPage = () => {
    const products = [
        {
            id: '1',
            image: '/images/products/jacket-main.jpg',
            name: 'Adaptive Bomber Jacket',
            price: 89000,
            description: 'Stylish bomber jacket with magnetic closures and easy-access pockets for wheelchair users',
            category: 'Outerwear'
        },
        {
            id: '2',
            image: '/images/products/top-main.jpg',
            name: 'Sensory-Friendly Top',
            price: 42000,
            description: 'Ultra-soft, tagless top with flat seams designed for sensory sensitivities',
            category: 'Tops'
        },
        {
            id: '3',
            image: '/images/products/jacket-main.jpg',
            name: 'Wheelchair-Friendly Blazer',
            price: 95000,
            description: 'Professional blazer with extended back panel and seated fit for comfort',
            category: 'Outerwear'
        },
        {
            id: '4',
            image: '/images/products/top-main.jpg',
            name: 'Magnetic Closure Shirt',
            price: 48000,
            description: 'Button-down shirt with hidden magnetic closures for easy dressing',
            category: 'Tops'
        },
        {
            id: '5',
            image: '/images/products/jacket-main.jpg',
            name: 'Adaptive Winter Coat',
            price: 125000,
            description: 'Warm winter coat with side-zip access and wheelchair-friendly design',
            category: 'Outerwear'
        },
        {
            id: '6',
            image: '/images/products/top-main.jpg',
            name: 'Braille Label Tee',
            price: 35000,
            description: 'Comfortable tee with tactile braille labels for easy identification',
            category: 'Tops'
        },
        {
            id: '7',
            image: '/images/products/jacket-main.jpg',
            name: 'Easy-Access Hoodie',
            price: 58000,
            description: 'Cozy hoodie with large zipper pulls and sensory-friendly fabric',
            category: 'Outerwear'
        },
        {
            id: '8',
            image: '/images/products/top-main.jpg',
            name: 'Adaptive Polo Shirt',
            price: 45000,
            description: 'Classic polo with magnetic buttons and extended back length',
            category: 'Tops'
        },
    ]

    return (
        <>
            <Navbar />
            <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white">
                {/* Hero Section */}
                <section className="relative py-20 px-4 sm:px-6 lg:px-8 mt-20 bg-gradient-to-r from-hisi-primary to-hisi-accent">
                    <div className="max-w-7xl mx-auto text-center">
                        <h1 className="text-5xl md:text-6xl font-bold text-white mb-6">
                            Shop Adaptive Fashion
                        </h1>
                        <p className="text-xl text-white/90 max-w-3xl mx-auto">
                            Discover our collection of inclusive, stylish clothing designed for everyone
                        </p>
                    </div>
                </section>

                {/* Products Grid */}
                <section className="py-16 px-4 sm:px-6 lg:px-8">
                    <div className="max-w-7xl mx-auto">
                        <div className="flex items-center justify-between mb-8">
                            <h2 className="text-3xl font-bold text-gray-900">
                                All Products
                            </h2>
                            <p className="text-gray-600">
                                {products.length} products
                            </p>
                        </div>

                        {/* Product Grid with Flip Cards */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                            {products.map((product) => (
                                <FlipProductCard
                                    key={product.id}
                                    id={product.id}
                                    image={product.image}
                                    name={product.name}
                                    price={product.price}
                                    description={product.description}
                                    category={product.category}
                                />
                            ))}
                        </div>
                    </div>
                </section>
            </div>
            <Footer links={footerLinks} socialLinks={socialLinks} />
        </>
    )
}

export default ShopPage
