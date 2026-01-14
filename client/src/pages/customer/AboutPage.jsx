import Navbar from '../../components/layout/Navbar'
import Footer from '../../components/layout/Footer'
import StorySection from '../../components/about/StorySection'
import MissionValuesSection from '../../components/about/MissionValuesSection'
import DisabilityVisionSection from '../../components/about/DisabilityVisionSection'
import TimelineSection from '../../components/about/TimelineSection'
import ScrollAnimationWrapper from '../../components/ui/ScrollAnimationWrapper'

// Import mock data
import {
    founderStory,
    mission,
    values,
    disabilityVision,
    timeline,
    callToAction
} from '../../data/aboutData'

import { footerLinks, socialLinks } from '../../data/mockData'

const AboutPage = () => {
    return (
        <div className="min-h-screen">
            <Navbar isHeroDark={false} />

            {/* Page Header */}
            <div className="pt-32 pb-12 bg-gradient-to-b from-hisi-primary to-hisi-accent">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <h1 className="text-5xl md:text-6xl font-bold text-white mb-6">
                        About Hisi Studio
                    </h1>
                    <p className="text-xl md:text-2xl text-white/90 max-w-3xl mx-auto">
                        Inclusive Design. African Roots. Global Future.
                    </p>
                </div>
            </div>

            {/* Main Content */}
            <main id="main-content">
                {/* Founder Story */}
                <ScrollAnimationWrapper>
                    <StorySection story={founderStory} />
                </ScrollAnimationWrapper>

                {/* Mission & Values */}
                <ScrollAnimationWrapper>
                    <MissionValuesSection mission={mission} values={values} />
                </ScrollAnimationWrapper>

                {/* Disability Inclusion Vision */}
                <ScrollAnimationWrapper>
                    <DisabilityVisionSection vision={disabilityVision} />
                </ScrollAnimationWrapper>

                {/* Timeline */}
                <ScrollAnimationWrapper>
                    <TimelineSection timeline={timeline} />
                </ScrollAnimationWrapper>

                {/* Call to Action */}
                <ScrollAnimationWrapper>
                    <section className="py-20 bg-gradient-to-b from-white to-gray-50">
                        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
                                {callToAction.title}
                            </h2>
                            <p className="text-xl text-gray-600 mb-10">
                                {callToAction.description}
                            </p>
                            <div className="flex flex-col sm:flex-row gap-4 justify-center">
                                {callToAction.buttons.map((button, index) => (
                                    <a
                                        key={index}
                                        href={button.href}
                                        className={`px-8 py-4 font-semibold transition-all duration-300 shadow-lg hover:shadow-xl ${button.primary
                                            ? 'bg-hisi-primary text-white hover:bg-hisi-accent'
                                            : 'bg-white text-hisi-primary border-2 border-hisi-primary hover:bg-hisi-primary hover:text-white'
                                            }`}
                                    >
                                        {button.text}
                                    </a>
                                ))}
                            </div>
                        </div>
                    </section>
                </ScrollAnimationWrapper>
            </main>

            {/* Footer */}
            <Footer links={footerLinks} socialLinks={socialLinks} />
        </div>
    )
}

export default AboutPage
