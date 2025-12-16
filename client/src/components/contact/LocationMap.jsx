import { MapPin, Clock, Navigation, Accessibility } from 'lucide-react'

const LocationMap = () => {
    return (
        <section className="py-16 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-gray-50 to-white">
            <div className="max-w-7xl mx-auto">
                <div className="text-center mb-12">
                    <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                        Visit Our Showroom
                    </h2>
                    <p className="text-lg text-gray-600">
                        Experience our adaptive fashion collection in person
                    </p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* Map */}
                    <div className="relative rounded-2xl overflow-hidden shadow-2xl h-[400px] lg:h-[500px]">
                        <iframe
                            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3988.819799384!2d36.80611731475394!3d-1.2833879359915!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x182f10d6d3b3b3b3%3A0x1234567890abcdef!2sWestlands%2C%20Nairobi!5e0!3m2!1sen!2ske!4v1234567890123!5m2!1sen!2ske"
                            width="100%"
                            height="100%"
                            style={{ border: 0 }}
                            allowFullScreen=""
                            loading="lazy"
                            referrerPolicy="no-referrer-when-downgrade"
                            title="Hisi Studio Location"
                            className="grayscale hover:grayscale-0 transition-all duration-500"
                        />

                        {/* Overlay with Get Directions button */}
                        <div className="absolute bottom-4 left-4 right-4">
                            <a
                                href="https://www.google.com/maps/dir//Westlands,+Nairobi"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center justify-center space-x-2 bg-white hover:bg-hisi-primary text-gray-900 hover:text-white font-semibold px-6 py-3 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 w-full"
                            >
                                <Navigation className="w-5 h-5" />
                                <span>Get Directions</span>
                            </a>
                        </div>
                    </div>

                    {/* Location Details */}
                    <div className="space-y-6">
                        {/* Address Card */}
                        <div className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-shadow duration-300">
                            <div className="flex items-start space-x-4">
                                <div className="w-12 h-12 bg-hisi-primary/10 rounded-xl flex items-center justify-center flex-shrink-0">
                                    <MapPin className="w-6 h-6 text-hisi-primary" />
                                </div>
                                <div>
                                    <h3 className="text-lg font-bold text-gray-900 mb-2">Address</h3>
                                    <p className="text-gray-600 leading-relaxed">
                                        Hisi Studio Showroom<br />
                                        Westlands, Ring Road Parklands<br />
                                        Nairobi, Kenya
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Hours Card */}
                        <div className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-shadow duration-300">
                            <div className="flex items-start space-x-4">
                                <div className="w-12 h-12 bg-blue-500/10 rounded-xl flex items-center justify-center flex-shrink-0">
                                    <Clock className="w-6 h-6 text-blue-600" />
                                </div>
                                <div className="flex-1">
                                    <h3 className="text-lg font-bold text-gray-900 mb-3">Showroom Hours</h3>
                                    <div className="space-y-2 text-sm">
                                        <div className="flex justify-between">
                                            <span className="text-gray-600">Monday - Friday</span>
                                            <span className="font-semibold text-gray-900">9:00 AM - 6:00 PM</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-gray-600">Saturday</span>
                                            <span className="font-semibold text-gray-900">10:00 AM - 4:00 PM</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-gray-600">Sunday</span>
                                            <span className="font-semibold text-gray-900">Closed</span>
                                        </div>
                                    </div>
                                    <div className="mt-4 pt-4 border-t border-gray-100">
                                        <p className="text-xs text-gray-500">
                                            💡 We recommend booking an appointment for personalized attention
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Accessibility Features Card */}
                        <div className="bg-gradient-to-br from-hisi-primary/5 to-hisi-accent/5 rounded-2xl p-6 border-2 border-hisi-primary/20">
                            <div className="flex items-start space-x-4">
                                <div className="w-12 h-12 bg-hisi-primary rounded-xl flex items-center justify-center flex-shrink-0">
                                    <Accessibility className="w-6 h-6 text-white" />
                                </div>
                                <div>
                                    <h3 className="text-lg font-bold text-gray-900 mb-3">Accessibility Features</h3>
                                    <ul className="space-y-2 text-sm text-gray-700">
                                        <li className="flex items-center space-x-2">
                                            <span className="w-1.5 h-1.5 bg-hisi-primary rounded-full"></span>
                                            <span>Wheelchair accessible entrance</span>
                                        </li>
                                        <li className="flex items-center space-x-2">
                                            <span className="w-1.5 h-1.5 bg-hisi-primary rounded-full"></span>
                                            <span>Accessible parking available</span>
                                        </li>
                                        <li className="flex items-center space-x-2">
                                            <span className="w-1.5 h-1.5 bg-hisi-primary rounded-full"></span>
                                            <span>Spacious fitting rooms</span>
                                        </li>
                                        <li className="flex items-center space-x-2">
                                            <span className="w-1.5 h-1.5 bg-hisi-primary rounded-full"></span>
                                            <span>Assistance available upon request</span>
                                        </li>
                                    </ul>
                                </div>
                            </div>
                        </div>

                        {/* Book Appointment CTA */}
                        <button
                            onClick={() => {
                                const bookingSection = document.getElementById('booking-system')
                                bookingSection?.scrollIntoView({ behavior: 'smooth' })
                            }}
                            className="w-full bg-gradient-to-r from-hisi-primary to-hisi-accent text-white font-semibold py-4 px-6 rounded-xl hover:shadow-lg transform hover:-translate-y-0.5 transition-all duration-300"
                        >
                            Book an Appointment
                        </button>
                    </div>
                </div>
            </div>
        </section>
    )
}

export default LocationMap
