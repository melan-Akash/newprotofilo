import footerLogoLight from '../assests/logo_for_lightmood.png'
import footerLogoDark from '../assests/logo_fro_darkmood.png'

export default function Footer() {
    return (
        <footer className='w-full px-[12%] pt-12 pb-6 mt-14 border-t border-gray-200 dark:border-white/10 bg-slate-50 dark:bg-darkTheme transition-colors duration-300'>
            <div className='w-full max-w-6xl mx-auto'>
                <div className="flex flex-wrap justify-between gap-y-8 lg:gap-x-6">

                    {/* Column 1: Brand & Bio */}
                    <div className="w-full md:w-[45%] lg:w-[35%] flex flex-col items-center md:items-start text-center md:text-left">
                        <a href="#top" className="inline-block">
                            <img src={footerLogoLight} alt="Melan Akash" className="w-12 dark:hidden" />
                            <img src={footerLogoDark} alt="Melan Akash" className="w-12 hidden dark:block" />
                        </a>
                        <div className='w-full max-w-44 h-px mt-4 bg-gradient-to-r from-transparent via-gray-300 to-transparent dark:via-white/20'></div>
                        <p className='text-xs sm:text-sm text-gray-600 dark:text-white/70 mt-4 max-w-sm leading-relaxed'>
                            Associate Software Engineer based in Matara, Sri Lanka. Building full-stack &amp; AI-integrated web and mobile applications.
                        </p>
                    </div>

                    {/* Column 2: Important Links */}
                    <div className="w-full md:w-[45%] lg:w-[15%] flex flex-col items-center md:items-start text-center md:text-left">
                        <h3 className='text-sm text-gray-900 dark:text-white font-semibold'>Important Links</h3>
                        <div className="flex flex-col gap-2 mt-4">
                            <a href="#top" className='text-xs sm:text-sm text-gray-600 dark:text-white/70 hover:text-sky-500 dark:hover:text-sky-400 transition-colors'>Home</a>
                            <a href="#about" className='text-xs sm:text-sm text-gray-600 dark:text-white/70 hover:text-sky-500 dark:hover:text-sky-400 transition-colors'>About</a>
                            <a href="#experience" className='text-xs sm:text-sm text-gray-600 dark:text-white/70 hover:text-sky-500 dark:hover:text-sky-400 transition-colors'>Experience</a>
                            <a href="#work" className='text-xs sm:text-sm text-gray-600 dark:text-white/70 hover:text-sky-500 dark:hover:text-sky-400 transition-colors'>Portfolio</a>
                            <a href="#contact" className='text-xs sm:text-sm text-gray-600 dark:text-white/70 hover:text-sky-500 dark:hover:text-sky-400 transition-colors'>Contact</a>
                        </div>
                    </div>

                    {/* Column 3: Social Links */}
                    <div className="w-full md:w-[45%] lg:w-[15%] flex flex-col items-center md:items-start text-center md:text-left">
                        <h3 className='text-sm text-gray-900 dark:text-white font-semibold'>Social Links</h3>
                        <div className="flex flex-col gap-2 mt-4">
                            <a href="https://github.com/melan-Akash" target="_blank" rel="noreferrer" className='text-xs sm:text-sm text-gray-600 dark:text-white/70 hover:text-sky-500 dark:hover:text-sky-400 transition-colors'>GitHub</a>
                            <a href="https://linkedin.com/in/melan-akash-35558a372" target="_blank" rel="noreferrer" className='text-xs sm:text-sm text-gray-600 dark:text-white/70 hover:text-sky-500 dark:hover:text-sky-400 transition-colors'>LinkedIn</a>
                            <a href="mailto:melonakash2002@gmail.com" className='text-xs sm:text-sm text-gray-600 dark:text-white/70 hover:text-sky-500 dark:hover:text-sky-400 transition-colors'>Email</a>
                            <a href="tel:+94717602792" className='text-xs sm:text-sm text-gray-600 dark:text-white/70 hover:text-sky-500 dark:hover:text-sky-400 transition-colors'>Phone</a>
                        </div>
                    </div>

                    {/* Column 4: Newsletter Subscribe */}
                    <div className="w-full md:w-[45%] lg:w-[27%] flex flex-col items-center md:items-start text-center md:text-left">
                        <h3 className='text-sm text-gray-900 dark:text-white font-semibold'>Subscribe for news</h3>
                        <form onSubmit={(e) => e.preventDefault()} className="flex items-center border border-gray-300 dark:border-white/20 h-11 max-w-80 w-full rounded-full overflow-hidden mt-4 bg-white dark:bg-white/5 focus-within:border-sky-500 transition-colors">
                            <input
                                type="email"
                                placeholder="Enter your email.."
                                className="w-full h-full pl-4 outline-none text-xs sm:text-sm bg-transparent text-gray-800 dark:text-white placeholder-gray-400 dark:placeholder-white/60"
                                required
                            />
                            <button
                                type="submit"
                                className="bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-600 hover:to-blue-700 active:scale-95 transition-all px-4 h-8 sm:h-8.5 rounded-full text-xs font-medium text-white cursor-pointer mr-1.5 shrink-0"
                            >
                                Subscribe
                            </button>
                        </form>
                    </div>

                </div>

                {/* Bottom Divider */}
                <div className='w-full h-px mt-8 mb-4 bg-gradient-to-r from-transparent via-gray-300 to-transparent dark:via-white/20'></div>

                {/* Bottom Bar */}
                <div className="flex flex-col sm:flex-row items-center justify-between gap-3 text-center">
                    <p className='text-xs text-gray-500 dark:text-white/60'>© {new Date().getFullYear()} Melan Akash. All rights reserved.</p>
                    <div className="flex items-center gap-5">
                        <a href='https://github.com/melan-Akash' target="_blank" rel="noreferrer" className='text-xs text-gray-500 dark:text-white/60 hover:text-sky-500 dark:hover:text-white transition-colors'>GitHub</a>
                        <div className='w-px h-3.5 bg-gray-300 dark:bg-white/20'></div>
                        <a href='https://linkedin.com/in/melan-akash-35558a372' target="_blank" rel="noreferrer" className='text-xs text-gray-500 dark:text-white/60 hover:text-sky-500 dark:hover:text-white transition-colors'>LinkedIn</a>
                    </div>
                </div>
            </div>
        </footer>
    );
}