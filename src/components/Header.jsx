import { useProfile } from '../context/ProfileContext';
import defaultProfileImg from '../assests/melanakash.png';

export default function Header() {
    const { profile } = useProfile();
    const avatarSrc = profile?.avatar || defaultProfileImg;

    return (
        <div id="top" className="w-11/12 max-w-3xl text-center mx-auto h-screen flex flex-col items-center justify-center gap-4">
            <img src={avatarSrc} alt={profile?.name || "Melan Akash"} className="rounded-full w-32 object-cover aspect-square shadow-lg border border-gray-200 dark:border-white/20" />
            <h3 className="flex items-end gap-2 text-xl md:text-2xl mb-3 font-Ovo">
                Hi! I&apos;m {profile?.name || "Melan Akash"}
                <img src="./assets/hand-icon.png" alt="" className="w-6 mb-1" />
            </h3>
            <h1 className="text-3xl sm:text-6xl lg:text-[66px] font-Ovo">{profile?.tagline || "full stack developer based in Sri Lanka."}</h1>
            <p className="max-w-2xl mx-auto font-Ovo leading-relaxed">{profile?.about || "Associate Software Engineer with hands-on experience across the MERN and PERN stacks, Spring Boot, and .NET — shipping full-stack and AI-integrated web & mobile applications."}</p>

            <div className="flex flex-col sm:flex-row items-center gap-4 mt-4">
                <a href="#contact"
                    className="px-10 py-2.5 border rounded-full bg-gradient-to-r from-[#0ea5e9] to-[#2563eb] text-white flex items-center gap-2 dark:border-transparent">
                    contact me <img src="./assets/right-arrow-white.png" alt="" className="w-4" />
                </a>

                <a href={profile?.resumeUrl || "./assets/dev-icon.png"} download target="_blank" rel="noreferrer"
                    className="px-10 py-2.5 rounded-full border border-gray-300 dark:border-white/25 hover:bg-slate-100/70 dark:hover:bg-darkHover flex items-center gap-2 bg-white dark:bg-transparent dark:text-white">
                    my resume <img src="./assets/download-icon.png" alt="" className="w-4 dark:invert" />
                </a>
            </div>
        </div>
    );
}