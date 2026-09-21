import profileImg from '../assests/melanakash.png'

export default function Header() {
    return (
        <div id="top" className="w-11/12 max-w-3xl text-center mx-auto h-screen flex flex-col items-center justify-center gap-4">
            <img src={profileImg} alt="Melan Akash" className="rounded-full w-32 object-cover aspect-square" />
            <h3 className="flex items-end gap-2 text-xl md:text-2xl mb-3 font-Ovo">
                Hi! I&apos;m Melan Akash
                <img src="./assets/hand-icon.png" alt="" className="w-6 mb-1" />
            </h3>
            <h1 className="text-3xl sm:text-6xl lg:text-[66px] font-Ovo">full stack developer based in Sri Lanka.</h1>
            <p className="max-w-2xl mx-auto font-Ovo">Associate Software Engineer with hands-on experience across the MERN and PERN stacks, Spring Boot, and .NET — shipping full-stack and AI-integrated web &amp; mobile applications.</p>

            <div className="flex flex-col sm:flex-row items-center gap-4 mt-4">
                <a href="#contact"
                    className="px-10 py-2.5 border rounded-full bg-gradient-to-r from-[#0ea5e9] to-[#2563eb] text-white flex items-center gap-2 dark:border-transparent">
                    contact me <img src="./assets/right-arrow-white.png" alt="" className="w-4" />
                </a>

                <a href="./assets/dev-icon.png" download
                    className="px-10 py-2.5 rounded-full border border-gray-300 dark:border-white/25 hover:bg-slate-100/70 dark:hover:bg-darkHover flex items-center gap-2 bg-white dark:bg-transparent dark:text-white">
                    my resume <img src="./assets/download-icon.png" alt="" className="w-4 dark:invert" />
                </a>
            </div>
        </div>
    )
}