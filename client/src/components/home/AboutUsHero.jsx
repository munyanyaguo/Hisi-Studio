import { Link } from 'react-router-dom'

const AboutUsHero = () => {
    return (
        <section className="relative h-[600px] md:h-[700px] overflow-hidden">
            {/* Background Image */}
            <div className="absolute inset-0">
                <img
                    src="/images/about-hero.jpg"
                    alt="Model wearing Hisi Studio designs"
                    className="w-full h-full object-cover"
                />
                {/* Subtle overlay for text readability */}
                <div className="absolute inset-0 bg-black/20" />
            </div>

            {/* Content */}
            <div className="relative z-10 h-full flex flex-col items-center justify-center text-center px-4 sm:px-6 lg:px-8">
                {/* Title */}
                <h2 className="text-4xl md:text-5xl lg:text-6xl text-white font-serif italic mb-8">
                    About Hisi Studio
                </h2>

                {/* Description */}
                <p className="text-white text-sm md:text-base uppercase tracking-widest leading-relaxed max-w-2xl mb-10">
                    While we've been in the jewelry business since 2011,
                    it was 2015 when we truly found our niche in
                    customized jewelry. The happiness in our clients'
                    eyes when they see creations made just for them
                    prompted us to switch gears and focus on quality
                    handcrafted pieces instead.
                </p>

                {/* CTA Button */}
                <Link
                    to="/about"
                    className="inline-block bg-gray-900 text-white px-12 py-4 text-sm font-medium uppercase tracking-widest hover:bg-gray-800 transition-all duration-300 rounded-full"
                >
                    Our Story
                </Link>
            </div>
        </section>
    )
}

export default AboutUsHero
