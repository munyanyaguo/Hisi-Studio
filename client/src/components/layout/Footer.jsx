import { Link } from 'react-router-dom'
import { Facebook, Instagram, Twitter, Linkedin, Mail, Phone, MapPin } from 'lucide-react'

const Footer = ({ links, socialLinks }) => {
    const currentYear = new Date().getFullYear()

    return (
        <footer className="bg-gray-900 text-gray-300">
            {/* Main Footer */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
                    {/* Brand Column */}
                    <div className="space-y-6">
                        {/* Logo */}
                        <Link to="/" className="inline-block group">
                            <span className="text-3xl font-bold text-white group-hover:text-hisi-accent transition-colors duration-300">
                                HISI
                            </span>
                            <span className="text-3xl font-light text-gray-400">STUDIO</span>
                        </Link>

                        {/* Description */}
                        <p className="text-gray-400 leading-relaxed">
                            Adaptive fashion that combines style, comfort, and accessibility for everyone.
                        </p>

                        {/* Contact Info */}
                        <div className="space-y-3">
                            <a
                                href="mailto:hello@hisistudio.com"
                                className="flex items-center space-x-3 text-gray-400 hover:text-white transition-colors duration-300"
                            >
                                <Mail className="w-5 h-5" />
                                <span>hello@hisistudio.com</span>
                            </a>
                            <a
                                href="tel:+254700000000"
                                className="flex items-center space-x-3 text-gray-400 hover:text-white transition-colors duration-300"
                            >
                                <Phone className="w-5 h-5" />
                                <span>+254 700 000 000</span>
                            </a>
                            <div className="flex items-start space-x-3 text-gray-400">
                                <MapPin className="w-5 h-5 flex-shrink-0 mt-1" />
                                <span>Nairobi, Kenya</span>
                            </div>
                        </div>

                        {/* Social Links */}
                        <div className="flex items-center space-x-4">
                            {socialLinks?.instagram && (
                                <a
                                    href={socialLinks.instagram}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="w-10 h-10 bg-gray-800 hover:bg-gradient-to-br hover:from-purple-500 hover:to-pink-500 rounded-full flex items-center justify-center transition-all duration-300 transform hover:scale-110"
                                    aria-label="Instagram"
                                >
                                    <Instagram className="w-5 h-5" />
                                </a>
                            )}
                            {socialLinks?.facebook && (
                                <a
                                    href={socialLinks.facebook}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="w-10 h-10 bg-gray-800 hover:bg-blue-600 rounded-full flex items-center justify-center transition-all duration-300 transform hover:scale-110"
                                    aria-label="Facebook"
                                >
                                    <Facebook className="w-5 h-5" />
                                </a>
                            )}
                            {socialLinks?.twitter && (
                                <a
                                    href={socialLinks.twitter}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="w-10 h-10 bg-gray-800 hover:bg-blue-400 rounded-full flex items-center justify-center transition-all duration-300 transform hover:scale-110"
                                    aria-label="Twitter"
                                >
                                    <Twitter className="w-5 h-5" />
                                </a>
                            )}
                            {socialLinks?.linkedin && (
                                <a
                                    href={socialLinks.linkedin}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="w-10 h-10 bg-gray-800 hover:bg-blue-700 rounded-full flex items-center justify-center transition-all duration-300 transform hover:scale-110"
                                    aria-label="LinkedIn"
                                >
                                    <Linkedin className="w-5 h-5" />
                                </a>
                            )}
                        </div>
                    </div>

                    {/* Shop Links */}
                    <div>
                        <h3 className="text-white font-bold text-lg mb-6">Shop</h3>
                        <ul className="space-y-3">
                            {links?.shop?.map((link) => (
                                <li key={link.name}>
                                    <Link
                                        to={link.href}
                                        className="text-gray-400 hover:text-white transition-colors duration-300 hover:translate-x-1 inline-block"
                                    >
                                        {link.name}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* About Links */}
                    <div>
                        <h3 className="text-white font-bold text-lg mb-6">About</h3>
                        <ul className="space-y-3">
                            {links?.about?.map((link) => (
                                <li key={link.name}>
                                    <Link
                                        to={link.href}
                                        className="text-gray-400 hover:text-white transition-colors duration-300 hover:translate-x-1 inline-block"
                                    >
                                        {link.name}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Support Links */}
                    <div>
                        <h3 className="text-white font-bold text-lg mb-6">Support</h3>
                        <ul className="space-y-3">
                            {links?.support?.map((link) => (
                                <li key={link.name}>
                                    <Link
                                        to={link.href}
                                        className="text-gray-400 hover:text-white transition-colors duration-300 hover:translate-x-1 inline-block"
                                    >
                                        {link.name}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
            </div>

            {/* Bottom Bar */}
            <div className="border-t border-gray-800">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
                    <div className="flex flex-col md:flex-row items-center justify-between space-y-4 md:space-y-0">
                        {/* Copyright */}
                        <p className="text-gray-400 text-sm">
                            © {currentYear} Hisi Studio. All rights reserved.
                        </p>

                        {/* Legal Links */}
                        <div className="flex items-center space-x-6">
                            {links?.legal?.map((link) => (
                                <Link
                                    key={link.name}
                                    to={link.href}
                                    className="text-gray-400 hover:text-white text-sm transition-colors duration-300"
                                >
                                    {link.name}
                                </Link>
                            ))}
                        </div>

                        {/* Payment Methods */}
                        <div className="flex items-center space-x-3">
                            <span className="text-gray-400 text-sm">We accept:</span>
                            <div className="flex items-center space-x-2">
                                <div className="w-10 h-6 bg-gray-800 rounded flex items-center justify-center text-xs font-bold text-gray-400">
                                    MPESA
                                </div>
                                <div className="w-10 h-6 bg-gray-800 rounded flex items-center justify-center text-xs font-bold text-gray-400">
                                    VISA
                                </div>
                                <div className="w-10 h-6 bg-gray-800 rounded flex items-center justify-center text-xs font-bold text-gray-400">
                                    MC
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    )
}

export default Footer
