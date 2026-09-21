import footerLogoLight from '../assests/logo_for_lightmood.png'
import footerLogoDark from '../assests/logo_fro_darkmood.png'

export default function Footer() {
    return (
        <>
            <style>{`
                @import url("https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&display=swap");
                .footer-font {
                    font-family: "Poppins", sans-serif;
                }
            `}</style>
            <footer className='footer-font bg-slate-100 border-t border-gray-200 dark:bg-black dark:border-white/10 py-12 px-4 sm:px-6 lg:px-8 mt-20 transition-colors duration-300'>
                <div className='w-full max-w-7xl mx-auto'>
                    <div className="flex flex-wrap justify-between gap-y-12 lg:gap-x-8">

                        {/* Column 1: Brand & Bio */}
                        <div className="w-full md:w-[45%] lg:w-[35%] flex flex-col items-center md:items-start text-center md:text-left">
                            <a href="#top" className="inline-block">
                                <img src={footerLogoLight} alt="Melan Akash" className="w-14 dark:hidden" />
                                <img src={footerLogoDark} alt="Melan Akash" className="w-14 hidden dark:block" />
                            </a>
                            <div className='w-full max-w-52 h-px mt-8 bg-gradient-to-r from-transparent via-gray-400 to-transparent dark:via-white/25'></div>
                            <p className='text-sm text-gray-600 dark:text-white/60 mt-6 max-w-sm leading-relaxed'>
                                Associate Software Engineer based in Matara, Sri Lanka. Building full-stack &amp; AI-integrated web and mobile applications.
                            </p>
                        </div>

                        {/* Column 2: Important Links */}
                        <div className="w-full md:w-[45%] lg:w-[15%] flex flex-col items-center md:items-start text-center md:text-left">
                            <h3 className='text-sm text-gray-900 dark:text-white font-medium'>Important Links</h3>
                            <div className="flex flex-col gap-2 mt-6">
                                <a href="#top" className='text-sm text-gray-600 dark:text-white/60 hover:text-gray-900 dark:hover:text-white transition-colors'>Home</a>
                                <a href="#about" className='text-sm text-gray-600 dark:text-white/60 hover:text-gray-900 dark:hover:text-white transition-colors'>About</a>
                                <a href="#experience" className='text-sm text-gray-600 dark:text-white/60 hover:text-gray-900 dark:hover:text-white transition-colors'>Experience</a>
                                <a href="#work" className='text-sm text-gray-600 dark:text-white/60 hover:text-gray-900 dark:hover:text-white transition-colors'>Portfolio</a>
                                <a href="#contact" className='text-sm text-gray-600 dark:text-white/60 hover:text-gray-900 dark:hover:text-white transition-colors'>Contact</a>
                            </div>
                        </div>

                        {/* Column 3: Social Links */}
                        <div className="w-full md:w-[45%] lg:w-[15%] flex flex-col items-center md:items-start text-center md:text-left">
                            <h3 className='text-sm text-gray-900 dark:text-white font-medium'>Social Links</h3>
                            <div className="flex flex-col gap-2 mt-6">
                                <a href="https://github.com/melan-Akash" target="_blank" rel="noreferrer" className='text-sm text-gray-600 dark:text-white/60 hover:text-gray-900 dark:hover:text-white transition-colors'>GitHub</a>
                                <a href="https://linkedin.com/in/melan-akash-35558a372" target="_blank" rel="noreferrer" className='text-sm text-gray-600 dark:text-white/60 hover:text-gray-900 dark:hover:text-white transition-colors'>LinkedIn</a>
                                <a href="mailto:melonakash2002@gmail.com" className='text-sm text-gray-600 dark:text-white/60 hover:text-gray-900 dark:hover:text-white transition-colors'>Email</a>
                                <a href="tel:+94717602792" className='text-sm text-gray-600 dark:text-white/60 hover:text-gray-900 dark:hover:text-white transition-colors'>Phone</a>
                            </div>
                        </div>

                        {/* Column 4: Newsletter Subscribe */}
                        <div className="w-full md:w-[45%] lg:w-[25%] flex flex-col items-center md:items-start text-center md:text-left">
                            <h3 className='text-sm text-gray-900 dark:text-white font-medium'>Subscribe for news</h3>
                            <form onSubmit={(e) => e.preventDefault()} className="flex items-center border gap-2 border-gray-300 dark:border-white/20 h-12 max-w-80 w-full rounded-full overflow-hidden mt-4 bg-white dark:bg-transparent focus-within:border-sky-500 transition-colors">
                                <input
                                    type="email"
                                    placeholder="Enter your email.."
                                    className="w-full h-full pl-6 outline-none text-sm bg-transparent text-gray-800 dark:text-white placeholder-gray-400 dark:placeholder-white/60 placeholder:text-xs"
                                    required
                                />
                                <button
                                    type="submit"
                                    className="bg-gradient-to-r from-[#0ea5e9] to-[#2563eb] hover:from-[#0284c7] hover:to-[#1d4ed8] active:scale-95 transition-all px-5 h-9 rounded-full text-xs font-medium text-white cursor-pointer mr-1.5 shrink-0"
                                >
                                    Subscribe
                                </button>
                            </form>
                        </div>

                    </div>

                    <div className='w-full h-px mt-16 mb-4 bg-gradient-to-r from-transparent via-gray-300 to-transparent dark:via-white/25'></div>

                    <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                        <p className='text-xs text-gray-500 dark:text-white/60'>© {new Date().getFullYear()} Melan Akash. All rights reserved.</p>
                        <div className="flex items-center gap-6">
                            <a href='https://github.com/melan-Akash' target="_blank" rel="noreferrer" className='text-xs text-gray-500 dark:text-white/60 hover:text-gray-900 dark:hover:text-white transition-colors'>GitHub</a>
                            <div className='w-px h-4 bg-gray-300 dark:bg-white/20'></div>
                            <a href='https://linkedin.com/in/melan-akash-35558a372' target="_blank" rel="noreferrer" className='text-xs text-gray-500 dark:text-white/60 hover:text-gray-900 dark:hover:text-white transition-colors'>LinkedIn</a>
                        </div>
                    </div>
                </div>
            </footer>
        </>
    );
}