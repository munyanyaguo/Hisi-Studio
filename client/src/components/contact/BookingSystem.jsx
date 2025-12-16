import { useState } from 'react'
import { Calendar, Clock, Video, MapPin, CheckCircle } from 'lucide-react'

const BookingSystem = () => {
    const [selectedDate, setSelectedDate] = useState('')
    const [selectedTime, setSelectedTime] = useState('')
    const [consultationType, setConsultationType] = useState('')
    const [meetingType, setMeetingType] = useState('in-person')
    const [bookingSuccess, setBookingSuccess] = useState(false)

    const availableTimes = [
        '9:00 AM', '10:00 AM', '11:00 AM', '12:00 PM',
        '2:00 PM', '3:00 PM', '4:00 PM', '5:00 PM'
    ]

    const consultationTypes = [
        { id: 'styling', label: 'Personal Styling', duration: '30 min', icon: '👔' },
        { id: 'accessibility', label: 'Accessibility Consultation', duration: '30 min', icon: '♿' },
        { id: 'custom', label: 'Custom Order Discussion', duration: '45 min', icon: '✨' },
        { id: 'fitting', label: 'Fitting Appointment', duration: '60 min', icon: '📏' }
    ]

    const handleBooking = (e) => {
        e.preventDefault()
        // Simulate booking
        setBookingSuccess(true)
        setTimeout(() => {
            setBookingSuccess(false)
            setSelectedDate('')
            setSelectedTime('')
            setConsultationType('')
            setMeetingType('in-person')
        }, 5000)
    }

    // Get minimum date (today)
    const today = new Date().toISOString().split('T')[0]

    return (
        <section id="booking-system" className="py-16 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-hisi-primary/5 to-hisi-accent/5">
            <div className="max-w-4xl mx-auto">
                <div className="text-center mb-12">
                    <div className="inline-flex items-center space-x-2 bg-white px-4 py-2 rounded-full mb-4 shadow-md">
                        <Calendar className="w-4 h-4 text-hisi-primary" />
                        <span className="text-sm font-semibold text-hisi-primary">Free Consultation</span>
                    </div>
                    <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                        Book Your Consultation
                    </h2>
                    <p className="text-lg text-gray-600">
                        Schedule a personalized session with our team
                    </p>
                </div>

                <div className="bg-white rounded-3xl shadow-2xl overflow-hidden">
                    {bookingSuccess ? (
                        <div className="p-12 text-center animate-fadeIn">
                            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                                <CheckCircle className="w-12 h-12 text-green-600" />
                            </div>
                            <h3 className="text-2xl font-bold text-gray-900 mb-3">Consultation Booked!</h3>
                            <p className="text-gray-600 mb-2">
                                Your appointment has been confirmed for:
                            </p>
                            <p className="text-lg font-semibold text-hisi-primary mb-6">
                                {selectedDate} at {selectedTime}
                            </p>
                            <p className="text-sm text-gray-500">
                                We've sent a confirmation email with all the details.
                            </p>
                        </div>
                    ) : (
                        <form onSubmit={handleBooking} className="p-8">
                            {/* Consultation Type Selection */}
                            <div className="mb-8">
                                <label className="block text-sm font-semibold text-gray-700 mb-4">
                                    Select Consultation Type <span className="text-red-500">*</span>
                                </label>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {consultationTypes.map((type) => (
                                        <button
                                            key={type.id}
                                            type="button"
                                            onClick={() => setConsultationType(type.id)}
                                            className={`p-4 rounded-xl border-2 transition-all duration-300 text-left ${consultationType === type.id
                                                    ? 'border-hisi-primary bg-hisi-primary/5 shadow-lg'
                                                    : 'border-gray-200 hover:border-hisi-primary/50'
                                                }`}
                                        >
                                            <div className="flex items-start space-x-3">
                                                <span className="text-2xl">{type.icon}</span>
                                                <div className="flex-1">
                                                    <div className="font-semibold text-gray-900">{type.label}</div>
                                                    <div className="text-sm text-gray-500 flex items-center space-x-1 mt-1">
                                                        <Clock className="w-3 h-3" />
                                                        <span>{type.duration}</span>
                                                    </div>
                                                </div>
                                                {consultationType === type.id && (
                                                    <CheckCircle className="w-5 h-5 text-hisi-primary" />
                                                )}
                                            </div>
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Meeting Type */}
                            <div className="mb-8">
                                <label className="block text-sm font-semibold text-gray-700 mb-4">
                                    Meeting Preference <span className="text-red-500">*</span>
                                </label>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <button
                                        type="button"
                                        onClick={() => setMeetingType('in-person')}
                                        className={`p-4 rounded-xl border-2 transition-all duration-300 ${meetingType === 'in-person'
                                                ? 'border-hisi-primary bg-hisi-primary/5 shadow-lg'
                                                : 'border-gray-200 hover:border-hisi-primary/50'
                                            }`}
                                    >
                                        <div className="flex items-center space-x-3">
                                            <MapPin className="w-6 h-6 text-hisi-primary" />
                                            <div className="text-left flex-1">
                                                <div className="font-semibold text-gray-900">In-Person</div>
                                                <div className="text-sm text-gray-500">Visit our showroom</div>
                                            </div>
                                            {meetingType === 'in-person' && (
                                                <CheckCircle className="w-5 h-5 text-hisi-primary" />
                                            )}
                                        </div>
                                    </button>

                                    <button
                                        type="button"
                                        onClick={() => setMeetingType('virtual')}
                                        className={`p-4 rounded-xl border-2 transition-all duration-300 ${meetingType === 'virtual'
                                                ? 'border-hisi-primary bg-hisi-primary/5 shadow-lg'
                                                : 'border-gray-200 hover:border-hisi-primary/50'
                                            }`}
                                    >
                                        <div className="flex items-center space-x-3">
                                            <Video className="w-6 h-6 text-hisi-primary" />
                                            <div className="text-left flex-1">
                                                <div className="font-semibold text-gray-900">Virtual</div>
                                                <div className="text-sm text-gray-500">Video call (Zoom/Meet)</div>
                                            </div>
                                            {meetingType === 'virtual' && (
                                                <CheckCircle className="w-5 h-5 text-hisi-primary" />
                                            )}
                                        </div>
                                    </button>
                                </div>
                            </div>

                            {/* Date Selection */}
                            <div className="mb-8">
                                <label htmlFor="date" className="block text-sm font-semibold text-gray-700 mb-2">
                                    Select Date <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="date"
                                    id="date"
                                    required
                                    min={today}
                                    value={selectedDate}
                                    onChange={(e) => setSelectedDate(e.target.value)}
                                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-hisi-primary focus:ring-2 focus:ring-hisi-primary/20 transition-all duration-300"
                                />
                            </div>

                            {/* Time Selection */}
                            <div className="mb-8">
                                <label className="block text-sm font-semibold text-gray-700 mb-4">
                                    Select Time <span className="text-red-500">*</span>
                                </label>
                                <div className="grid grid-cols-4 gap-3">
                                    {availableTimes.map((time) => (
                                        <button
                                            key={time}
                                            type="button"
                                            onClick={() => setSelectedTime(time)}
                                            className={`py-3 px-2 rounded-lg border-2 text-sm font-medium transition-all duration-300 ${selectedTime === time
                                                    ? 'border-hisi-primary bg-hisi-primary text-white shadow-lg'
                                                    : 'border-gray-200 text-gray-700 hover:border-hisi-primary/50'
                                                }`}
                                        >
                                            {time}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Submit Button */}
                            <button
                                type="submit"
                                disabled={!consultationType || !selectedDate || !selectedTime}
                                className="w-full bg-gradient-to-r from-hisi-primary to-hisi-accent text-white font-semibold py-4 px-6 rounded-xl hover:shadow-lg transform hover:-translate-y-0.5 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center space-x-2"
                            >
                                <Calendar className="w-5 h-5" />
                                <span>Confirm Booking</span>
                            </button>

                            <p className="text-xs text-gray-500 text-center mt-4">
                                You'll receive a confirmation email with meeting details
                            </p>
                        </form>
                    )}
                </div>
            </div>
        </section>
    )
}

export default BookingSystem
