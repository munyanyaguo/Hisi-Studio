import Navbar from '../../components/layout/Navbar'
import Footer from '../../components/layout/Footer'
import ImpactMetrics from '../../components/accessibility/ImpactMetrics'

// Import mock data
import {
    accessibilityHero,
    adaptiveMethods,
    tactArtProject,
    brailleProducts,
    impactSustainability,
    partnershipCTA
} from '../../data/accessibilityData'

import { footerLinks, socialLinks } from '../../data/mockData'
import { Hand, Type, Headphones, Users, Check } from 'lucide-react'

const iconMap = {
    hand: Hand,
    type: Type,
    headphones: Headphones,
    users: Users
}

const AccessibilityPage = () => {
    return (
        <div className="min-h-screen">
            <Navbar isHeroDark={false} />

            {/* Hero Section */}
            <div className="relative pt-32 pb-20 bg-gradient-to-br from-hisi-primary via-hisi-accent to-hisi-primary overflow-hidden">
                <div className="absolute inset-0 opacity-10">
                    <div className="absolute inset-0 bg-[url('/images/patterns/african-pattern.svg')] bg-repeat"></div>
                </div>
                <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <p className="text-white/90 font-semibold text-sm uppercase tracking-wider mb-4">
                        {accessibilityHero.subtitle}
                    </p>
                    <h1 className="text-5xl md:text-6xl font-bold text-white mb-6">
                        {accessibilityHero.title}
                    </h1>
                    <p className="text-xl md:text-2xl text-white/90 max-w-3xl mx-auto">
                        {accessibilityHero.description}
                    </p>
                </div>
            </div>

            {/* Main Content */}
            <main id="main-content">
                {/* Adaptive Fashion Methods */}
                <section className="py-20 bg-white">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="text-center mb-16">
                            <p className="text-hisi-primary font-semibold text-sm uppercase tracking-wider mb-2">
                                {adaptiveMethods.subtitle}
                            </p>
                            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
                                {adaptiveMethods.title}
                            </h2>
                            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                                {adaptiveMethods.description}
                            </p>
                        </div>

                        {/* Methods Grid */}
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                            {adaptiveMethods.methods.map((method) => (
                                <div
                                    key={method.id}
                                    className="group bg-gray-50 rounded-2xl overflow-hidden hover:shadow-2xl transition-all duration-500"
                                >
                                    {/* Image */}
                                    <div className="aspect-[16/10] overflow-hidden">
                                        <img
                                            src={method.image}
                                            alt={method.title}
                                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                                        />
                                    </div>

                                    {/* Content */}
                                    <div className="p-8">
                                        <h3 className="text-2xl font-bold text-gray-900 mb-4 group-hover:text-hisi-primary transition-colors duration-300">
                                            {method.title}
                                        </h3>
                                        <p className="text-gray-600 leading-relaxed mb-6">
                                            {method.description}
                                        </p>

                                        {/* Features */}
                                        <ul className="space-y-2">
                                            {method.features.map((feature, index) => (
                                                <li key={index} className="flex items-center text-sm text-gray-700">
                                                    <Check className="w-5 h-5 text-hisi-primary mr-2 flex-shrink-0" />
                                                    <span>{feature}</span>
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* TactART Project */}
                <section className="py-20 bg-gradient-to-b from-gray-50 to-white">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="text-center mb-16">
                            <p className="text-hisi-primary font-semibold text-sm uppercase tracking-wider mb-2">
                                {tactArtProject.subtitle}
                            </p>
                            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
                                {tactArtProject.title}
                            </h2>
                            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                                {tactArtProject.description}
                            </p>
                        </div>

                        {/* Features Grid */}
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
                            {tactArtProject.features.map((feature) => {
                                const IconComponent = iconMap[feature.icon] || Hand
                                return (
                                    <div
                                        key={feature.id}
                                        className="bg-white rounded-xl p-6 shadow-lg hover:shadow-2xl transition-all duration-300 border-2 border-transparent hover:border-hisi-primary"
                                    >
                                        <div className="w-12 h-12 bg-hisi-primary/10 rounded-lg flex items-center justify-center mb-4">
                                            <IconComponent className="w-6 h-6 text-hisi-primary" />
                                        </div>
                                        <h3 className="text-lg font-bold text-gray-900 mb-2">
                                            {feature.title}
                                        </h3>
                                        <p className="text-sm text-gray-600">
                                            {feature.description}
                                        </p>
                                    </div>
                                )
                            })}
                        </div>

                        {/* Gallery */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                            {tactArtProject.gallery.map((item) => (
                                <div
                                    key={item.id}
                                    className="group relative rounded-2xl overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-500"
                                >
                                    <div className="aspect-square">
                                        <img
                                            src={item.image}
                                            alt={item.title}
                                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                                        />
                                    </div>
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end">
                                        <div className="p-6 text-white">
                                            <h4 className="text-lg font-bold mb-2">{item.title}</h4>
                                            <p className="text-sm text-white/90">{item.description}</p>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* Braille Products */}
                <section className="py-20 bg-white">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="text-center mb-16">
                            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
                                {brailleProducts.title}
                            </h2>
                            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                                {brailleProducts.description}
                            </p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                            {brailleProducts.products.map((product) => (
                                <div
                                    key={product.id}
                                    className="group bg-gray-50 rounded-2xl overflow-hidden hover:shadow-2xl transition-all duration-500"
                                >
                                    <div className="aspect-square overflow-hidden">
                                        <img
                                            src={product.image}
                                            alt={product.title}
                                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                                        />
                                    </div>
                                    <div className="p-6">
                                        <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-hisi-primary transition-colors duration-300">
                                            {product.title}
                                        </h3>
                                        <p className="text-gray-600">
                                            {product.description}
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* Impact & Sustainability */}
                <section className="py-20 bg-gradient-to-b from-gray-50 to-white">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="text-center mb-16">
                            <p className="text-hisi-primary font-semibold text-sm uppercase tracking-wider mb-2">
                                {impactSustainability.subtitle}
                            </p>
                            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
                                {impactSustainability.title}
                            </h2>
                            <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-12">
                                {impactSustainability.description}
                            </p>
                        </div>

                        {/* Metrics */}
                        <div className="mb-20">
                            <ImpactMetrics metrics={impactSustainability.metrics} />
                        </div>

                        {/* Initiatives */}
                        <div className="space-y-12">
                            {impactSustainability.initiatives.map((initiative, index) => (
                                <div
                                    key={initiative.id}
                                    className={`flex flex-col ${index % 2 === 0 ? 'lg:flex-row' : 'lg:flex-row-reverse'
                                        } gap-12 items-center`}
                                >
                                    <div className="w-full lg:w-1/2">
                                        <div className="aspect-[4/3] rounded-2xl overflow-hidden shadow-xl">
                                            <img
                                                src={initiative.image}
                                                alt={initiative.title}
                                                className="w-full h-full object-cover hover:scale-105 transition-transform duration-700"
                                            />
                                        </div>
                                    </div>
                                    <div className="w-full lg:w-1/2">
                                        <h3 className="text-3xl font-bold text-gray-900 mb-4">
                                            {initiative.title}
                                        </h3>
                                        <p className="text-lg text-gray-600 leading-relaxed">
                                            {initiative.description}
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* Partnership CTA */}
                <section className="py-20 bg-gradient-to-br from-hisi-primary to-hisi-accent">
                    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                        <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
                            {partnershipCTA.title}
                        </h2>
                        <p className="text-xl text-white/90 mb-10">
                            {partnershipCTA.description}
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                            {partnershipCTA.buttons.map((button, index) => (
                                <a
                                    key={index}
                                    href={button.href}
                                    className={`px-8 py-4 rounded-lg font-semibold transition-all duration-300 shadow-lg hover:shadow-xl ${button.primary
                                            ? 'bg-white text-hisi-primary hover:bg-gray-100'
                                            : 'bg-transparent text-white border-2 border-white hover:bg-white hover:text-hisi-primary'
                                        }`}
                                >
                                    {button.text}
                                </a>
                            ))}
                        </div>
                    </div>
                </section>
            </main>

            {/* Footer */}
            <Footer links={footerLinks} socialLinks={socialLinks} />
        </div>
    )
}

export default AccessibilityPage
