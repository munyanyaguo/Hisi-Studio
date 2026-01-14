import { Link } from 'react-router-dom'
import { Facebook, Instagram, Twitter, Linkedin, Mail } from 'lucide-react'

const Footer = ({ links, socialLinks }) => {
    const currentYear = new Date().getFullYear()

    return (
        <footer className="bg-black text-white">
            {/* Main Footer */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
                <div className="grid grid-cols-1 lg:grid-cols-4 gap-12">
                    {/* Logo Column - Large White Logo taking full left side */}
                    <div className="lg:col-span-1 flex items-center justify-center lg:justify-start">
                        <Link to="/" className="block">
                            <img
                                src="/images/hisi-logo-white.png"
                                alt="Hisi Studio"
                                className="h-48 md:h-56 lg:h-64 w-auto object-contain"
                            />
                        </Link>
                    </div>

                    {/* Live Ubuntu Column */}
                    <div className="space-y-6">
                        <h3 className="text-white font-bold text-lg uppercase tracking-wide">
                            Live Ubuntu
                        </h3>
                        <p className="text-gray-300 text-sm leading-relaxed">
                            Lead a more connected, joyful life daily! Join the Ubuntu community & receive stories of inspiration, limited edition product releases and insider tips from our team.
                        </p>

                        {/* Email Input */}
                        <div className="flex items-center border-b border-gray-600 pb-2">
                            <input
                                type="email"
                                placeholder="ENTER YOUR EMAIL"
                                className="flex-1 bg-transparent text-white placeholder-gray-400 text-sm uppercase tracking-wider focus:outline-none"
                            />
                            <button
                                type="submit"
                                className="ml-4 text-white hover:text-gray-300 transition-colors"
                                aria-label="Subscribe"
                            >
                                <Mail className="w-5 h-5" />
                            </button>
                        </div>
                    </div>

                    {/* Customer Care Column */}
                    <div className="space-y-6">
                        <h3 className="text-white font-bold text-lg uppercase tracking-wide">
                            Customer Care
                        </h3>
                        <ul className="space-y-3 text-center">
                            <li>
                                <Link to="/help" className="text-gray-300 hover:text-white transition-colors text-sm">
                                    Need Help?
                                </Link>
                            </li>
                            <li>
                                <Link to="/track-order" className="text-gray-300 hover:text-white transition-colors text-sm">
                                    Track My Order
                                </Link>
                            </li>
                            <li>
                                <Link to="/shipping" className="text-gray-300 hover:text-white transition-colors text-sm">
                                    Shipping Info
                                </Link>
                            </li>
                            <li>
                                <Link to="/returns" className="text-gray-300 hover:text-white transition-colors text-sm">
                                    Easy Returns
                                </Link>
                            </li>
                            <li>
                                <Link to="/faq" className="text-gray-300 hover:text-white transition-colors text-sm">
                                    FAQ
                                </Link>
                            </li>
                            <li>
                                <Link to="/contact" className="text-gray-300 hover:text-white transition-colors text-sm">
                                    Contact Us
                                </Link>
                            </li>
                        </ul>
                    </div>

                    {/* Follow Us Column */}
                    <div className="space-y-6">
                        <h3 className="text-white font-bold text-lg uppercase tracking-wide">
                            Follow Us
                        </h3>
                        <p className="text-gray-300 text-sm leading-relaxed">
                            See our designs come to life and how our woman wears her Christie Brown.
                        </p>

                        {/* Social Links */}
                        <div className="flex items-center space-x-4">
                            <a
                                href={socialLinks?.instagram || "https://www.instagram.com/hisi_studio/"}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="w-10 h-10 border border-white rounded-full flex items-center justify-center hover:bg-white hover:text-black transition-all duration-300"
                                aria-label="Instagram"
                            >
                                <Instagram className="w-5 h-5" />
                            </a>
                            <a
                                href={socialLinks?.facebook || "#"}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="w-10 h-10 border border-white rounded-full flex items-center justify-center hover:bg-white hover:text-black transition-all duration-300"
                                aria-label="Facebook"
                            >
                                <Facebook className="w-5 h-5" />
                            </a>
                            <a
                                href={socialLinks?.whatsapp || "#"}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="w-10 h-10 border border-white rounded-full flex items-center justify-center hover:bg-white hover:text-black transition-all duration-300"
                                aria-label="WhatsApp"
                            >
                                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                                </svg>
                            </a>
                            <a
                                href={socialLinks?.twitter || "#"}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="w-10 h-10 border border-white rounded-full flex items-center justify-center hover:bg-white hover:text-black transition-all duration-300"
                                aria-label="Twitter"
                            >
                                <Twitter className="w-5 h-5" />
                            </a>
                            <a
                                href={socialLinks?.linkedin || "#"}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="w-10 h-10 border border-white rounded-full flex items-center justify-center hover:bg-white hover:text-black transition-all duration-300"
                                aria-label="LinkedIn"
                            >
                                <Linkedin className="w-5 h-5" />
                            </a>
                        </div>
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
                                <div className="px-2 py-1 border border-gray-600 text-xs font-bold text-gray-400">
                                    MPESA
                                </div>
                                <div className="px-2 py-1 border border-gray-600 text-xs font-bold text-gray-400">
                                    VISA
                                </div>
                                <div className="px-2 py-1 border border-gray-600 text-xs font-bold text-gray-400">
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
