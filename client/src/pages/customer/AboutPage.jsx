import { useState, useEffect } from 'react'
import Navbar from '../../components/layout/Navbar'
import Footer from '../../components/layout/Footer'
import StorySection from '../../components/about/StorySection'
import MissionValuesSection from '../../components/about/MissionValuesSection'
import DisabilityVisionSection from '../../components/about/DisabilityVisionSection'
import TimelineSection from '../../components/about/TimelineSection'
import ScrollAnimationWrapper from '../../components/ui/ScrollAnimationWrapper'
import { Loader2 } from 'lucide-react'

// Import fallback data
import {
    founderStory as fallbackFounderStory,
    mission as fallbackMission,
    values as fallbackValues,
    disabilityVision as fallbackDisabilityVision,
    timeline as fallbackTimeline,
    callToAction as fallbackCallToAction
} from '../../data/aboutData'

import { footerLinks, socialLinks } from '../../data/mockData'
import { getAboutContent } from '../../services/cmsApi'

const AboutPage = () => {
    const [content, setContent] = useState({
        founderStory: fallbackFounderStory,
        mission: fallbackMission,
        values: fallbackValues,
        disabilityVision: fallbackDisabilityVision,
        timeline: fallbackTimeline,
        callToAction: fallbackCallToAction
    })
    const [loading, setLoading] = useState(true)

    // Fetch about page content from API
    useEffect(() => {
        const fetchContent = async () => {
            setLoading(true)
            try {
                const data = await getAboutContent()
                const aboutData = data.data || data

                if (aboutData) {
                    setContent({
                        founderStory: aboutData.founder_story || aboutData.founderStory || fallbackFounderStory,
                        mission: aboutData.mission || fallbackMission,
                        values: aboutData.values || fallbackValues,
                        disabilityVision: aboutData.disability_vision || aboutData.disabilityVision || fallbackDisabilityVision,
                        timeline: aboutData.timeline || fallbackTimeline,
                        callToAction: aboutData.call_to_action || aboutData.callToAction || fallbackCallToAction
                    })
                }
            } catch (error) {
                console.error('Failed to fetch about content:', error)
                // Keep fallback data
            } finally {
                setLoading(false)
            }
        }

        fetchContent()
    }, [])

    const { founderStory, mission, values, disabilityVision, timeline, callToAction } = content

    return (
        <div className="min-h-screen">
            <Navbar isHeroDark={false} />

            {/* Hero Section */}
            <div className="relative pt-24">
                {/* Hero Image as Full Background */}
                <div className="w-full bg-white">
                    <img
                        src="/images/about-hero.png"
                        alt="We Are Kind - displayed in text and Braille"
                        className="w-full h-auto object-contain max-h-[60vh] mx-auto"
                    />
                </div>

                {/* Title Bar Below Image */}
                <div className="py-8 bg-gradient-to-r from-hisi-primary to-hisi-accent">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                        <h1 className="text-4xl md:text-5xl font-bold text-white mb-3">
                            About Hisi Studio
                        </h1>
                        <p className="text-lg md:text-xl text-white/90 max-w-3xl mx-auto">
                            Inclusive Design. African Roots. Global Future.
                        </p>
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <main id="main-content">
                {loading ? (
                    <div className="py-20 flex flex-col items-center justify-center">
                        <Loader2 className="w-12 h-12 text-hisi-primary animate-spin mb-4" />
                        <p className="text-gray-600">Loading content...</p>
                    </div>
                ) : (
                    <>
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
                                        {callToAction.buttons?.map((button, index) => (
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
                    </>
                )}
            </main>

            {/* Footer */}
            <Footer links={footerLinks} socialLinks={socialLinks} />
        </div>
    )
}

export default AboutPage
