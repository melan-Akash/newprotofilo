import { motion } from 'framer-motion';
import { useProfile } from '../context/ProfileContext';
import defaultProfileImg from '../assests/melanakash.png';

export default function Header() {
    const { profile } = useProfile();
    const avatarSrc = profile?.avatar || defaultProfileImg;

    return (
        <div id="top" className="w-11/12 max-w-3xl text-center mx-auto min-h-screen pt-24 pb-12 flex flex-col items-center justify-center gap-4">
            {/* Avatar with subtle float and spring entrance */}
            <motion.div
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ type: 'spring', stiffness: 200, damping: 20 }}
                className="relative"
            >
                <motion.img
                    src={avatarSrc}
                    alt={profile?.name || "Melan Akash"}
                    className="rounded-full w-32 object-cover aspect-square shadow-xl border-2 border-sky-500/30 dark:border-white/20"
                    animate={{ y: [0, -6, 0] }}
                    transition={{ repeat: Infinity, duration: 4, ease: 'easeInOut' }}
                />
                <motion.div
                    className="absolute -bottom-1 -right-1 w-7 h-7 bg-emerald-500 border-2 border-white dark:border-[#060d1a] rounded-full flex items-center justify-center text-[10px] text-white shadow-md"
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.4 }}
                    title="Available for Opportunities"
                >
                    ●
                </motion.div>
            </motion.div>

            {/* Greeting */}
            <motion.h3
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.2, duration: 0.6 }}
                className="flex items-center gap-2 text-xl md:text-2xl mb-1 font-Ovo text-gray-800 dark:text-white"
            >
                <span>Hi! I&apos;m {profile?.name || "Melan Akash"}</span>
                <motion.img
                    src="./assets/hand-icon.png"
                    alt="Wave"
                    className="w-6 inline-block"
                    animate={{ rotate: [0, 18, -10, 18, 0] }}
                    transition={{ repeat: Infinity, repeatDelay: 3, duration: 1.2, ease: 'easeInOut' }}
                />
            </motion.h3>

            {/* Hero Headline */}
            <motion.h1
                initial={{ y: 25, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.35, duration: 0.7 }}
                className="text-3xl sm:text-6xl lg:text-[66px] font-Ovo tracking-tight text-gray-900 dark:text-white leading-[1.15]"
            >
                {profile?.tagline || "full stack developer based in Sri Lanka."}
            </motion.h1>

            {/* About Blurb */}
            <motion.p
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.5, duration: 0.7 }}
                className="max-w-2xl mx-auto font-Ovo leading-relaxed text-gray-600 dark:text-white/80 text-sm sm:text-base"
            >
                {profile?.about || "Associate Software Engineer with hands-on experience across the MERN and PERN stacks, Spring Boot, and .NET — shipping full-stack and AI-integrated web & mobile applications."}
            </motion.p>

            {/* CTA Buttons */}
            <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.65, duration: 0.7 }}
                className="flex flex-col sm:flex-row items-center gap-4 mt-4"
            >
                <motion.a
                    href="#contact"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="px-10 py-3 rounded-full bg-gradient-to-r from-[#0ea5e9] to-[#2563eb] text-white flex items-center gap-2 shadow-lg shadow-sky-500/25 transition-shadow font-medium text-sm"
                >
                    <span>contact me</span>
                    <img src="./assets/right-arrow-white.png" alt="" className="w-4" />
                </motion.a>

                <motion.a
                    href={profile?.resumeUrl || "#contact"}
                    download={profile?.resumeUrl ? true : undefined}
                    target={profile?.resumeUrl ? "_blank" : undefined}
                    rel="noreferrer"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="px-10 py-3 rounded-full border border-gray-300 dark:border-white/25 hover:bg-slate-100/70 dark:hover:bg-darkHover flex items-center gap-2 bg-white dark:bg-transparent text-gray-800 dark:text-white transition-all shadow-sm font-medium text-sm"
                >
                    <span>my resume</span>
                    <img src="./assets/download-icon.png" alt="" className="w-4 dark:invert" />
                </motion.a>
            </motion.div>
        </div>
    );
}