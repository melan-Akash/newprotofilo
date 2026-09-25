import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useProfile } from '../context/ProfileContext';
import melanPhoto from '../assests/melanakash.png';
import {
    AntigravityIcon,
    OpenAIIcon,
    GeminiIcon,
    ClaudeIcon,
    ReactIcon,
    NextIcon,
    TypeScriptIcon,
    NodeIcon,
    TailwindIcon,
    PostgresIcon,
    SpringBootIcon,
    DotNetIcon,
    DockerIcon,
    PostmanIcon,
    GitHubIcon
} from './TechIcons';

export default function About() {
    const { profile } = useProfile();
    const [selectedCategory, setSelectedCategory] = useState('All');
    const avatarSrc = profile?.avatar || melanPhoto;

    const tools = [
        // AI & Agentic Tools
        { name: 'Google Antigravity', category: 'AI & Agentic', isSvg: true, icon: <AntigravityIcon /> },
        { name: 'OpenAI / GPT', category: 'AI & Agentic', isSvg: true, icon: <OpenAIIcon /> },
        { name: 'Google Gemini', category: 'AI & Agentic', isSvg: true, icon: <GeminiIcon /> },
        { name: 'Anthropic Claude', category: 'AI & Agentic', isSvg: true, icon: <ClaudeIcon /> },

        // Full Stack & Core Tech
        { name: 'React', category: 'Full Stack', isSvg: true, icon: <ReactIcon /> },
        { name: 'Next.js', category: 'Full Stack', isSvg: true, icon: <NextIcon /> },
        { name: 'TypeScript', category: 'Full Stack', isSvg: true, icon: <TypeScriptIcon /> },
        { name: 'Node.js', category: 'Full Stack', isSvg: true, icon: <NodeIcon /> },
        { name: 'Spring Boot', category: 'Full Stack', isSvg: true, icon: <SpringBootIcon /> },
        { name: '.NET', category: 'Full Stack', isSvg: true, icon: <DotNetIcon /> },
        { name: 'Tailwind CSS', category: 'Full Stack', isSvg: true, icon: <TailwindIcon /> },

        // Databases & Cloud
        { name: 'PostgreSQL', category: 'Database & Cloud', isSvg: true, icon: <PostgresIcon /> },
        { name: 'MongoDB', category: 'Database & Cloud', isSvg: false, icon: './assets/mongodb.png' },
        { name: 'Firebase', category: 'Database & Cloud', isSvg: false, icon: './assets/firebase.png' },
        { name: 'Docker', category: 'Database & Cloud', isSvg: true, icon: <DockerIcon /> },

        // Dev Tools & Workflow
        { name: 'VS Code', category: 'Dev Tools', isSvg: false, icon: './assets/vscode.png' },
        { name: 'Git', category: 'Dev Tools', isSvg: false, icon: './assets/git.png' },
        { name: 'GitHub', category: 'Dev Tools', isSvg: true, icon: <GitHubIcon /> },
        { name: 'Postman', category: 'Dev Tools', isSvg: true, icon: <PostmanIcon /> },
        { name: 'Figma', category: 'Dev Tools', isSvg: false, icon: './assets/figma.png' },
    ];

    const categories = ['All', 'AI & Agentic', 'Full Stack', 'Database & Cloud', 'Dev Tools'];

    const filteredTools = selectedCategory === 'All'
        ? tools
        : tools.filter(t => t.category === selectedCategory);

    const data = [
        {
            name: 'Languages',
            icon1: './assets/code-icon.png',
            icon2: './assets/code-icon-dark.png',
            description: 'JavaScript, Java, C#, PHP, Python, Go, HTML, CSS',
        },
        {
            name: 'Education',
            icon1: './assets/edu-icon.png',
            icon2: './assets/edu-icon-dark.png',
            description: 'BSc (Hons) Software Engineering — Cardiff Met University',
        },
        {
            name: 'Projects',
            icon1: './assets/project-icon.png',
            icon2: './assets/project-icon-dark.png',
            description: 'Built 9+ full-stack & AI-integrated projects',
        },
    ];

    const skills = [
        { category: 'Frontend', items: 'React, Next.js, Tailwind CSS, JavaScript (ES6+), TypeScript, HTML5, CSS3' },
        { category: 'Backend & APIs', items: 'Node.js, Express.js, Spring Boot, .NET, RESTful APIs, WebSockets' },
        { category: 'Mobile Engineering', items: 'React Native, Expo, Android SDK' },
        { category: 'Databases & ORM', items: 'PostgreSQL, MongoDB, MySQL, Firebase, Supabase, NeonDB' },
        { category: 'AI & LLM Integration', items: 'Google Antigravity, OpenAI, Gemini, Claude, OpenRouter, Vercel AI SDK, Meta Llama' },
        { category: 'Tools & DevOps', items: 'Git, GitHub, Docker, Postman, Figma, VS Code, CI/CD, SEO' },
    ];

    return (
        <motion.div
            id="about"
            className="w-full px-[12%] py-16 scroll-mt-20"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true, amount: 0.1 }}
            transition={{ duration: 0.8 }}
        >
            <motion.h4
                className="text-center mb-2 text-lg font-Ovo text-sky-600 dark:text-sky-400"
                initial={{ opacity: 0, y: -10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
            >
                Introduction
            </motion.h4>
            <motion.h2
                className="text-center text-4xl sm:text-5xl font-Ovo text-gray-900 dark:text-white"
                initial={{ opacity: 0, y: -15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.1 }}
            >
                About me
            </motion.h2>

            <div className="flex w-full flex-col lg:flex-row items-center gap-16 lg:gap-20 my-16">
                <motion.div
                    className="max-w-max mx-auto relative shrink-0"
                    initial={{ scale: 0.9, opacity: 0 }}
                    whileInView={{ scale: 1, opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                >
                    <img src={avatarSrc} alt={profile?.name || "Melan Akash"} className="w-64 sm:w-80 rounded-3xl max-w-none object-cover shadow-2xl border border-gray-200 dark:border-white/10" />

                    <motion.div
                        className="bg-white w-1/2 aspect-square absolute right-0 bottom-0 rounded-full translate-x-1/4 translate-y-1/3 shadow-[0_4px_55px_rgba(14,165,233,0.22)] flex items-center justify-center border border-gray-100"
                        animate={{ rotate: 360 }}
                        transition={{ repeat: Infinity, duration: 20, ease: 'linear' }}
                    >
                        <img src="./assets/circular-text.png" alt="" className="w-full" />
                        <img src="./assets/favicon.svg" alt="Melan Akash Developer" className="w-[34%] rounded-xl absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 shadow-sm" />
                    </motion.div>
                </motion.div>

                <div className="flex-1">
                    <motion.p
                        className="mb-8 max-w-2xl font-Ovo leading-relaxed text-gray-700 dark:text-white/85 text-sm sm:text-base"
                        initial={{ opacity: 0, y: 15 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6, delay: 0.2 }}
                    >
                        {profile?.about || "Associate Software Engineer with hands-on experience across the MERN and PERN stacks, Spring Boot, and .NET, having shipped full-stack and AI-integrated web and mobile applications including an AI-powered website builder, a real-time video conferencing app, and an AI habit-coaching app. Comfortable working across frontend and backend layers, with growing experience integrating LLM APIs into production apps. Also active as a startup co-founder leading frontend development and on-page SEO."}
                    </motion.p>

                    <ul className="grid grid-cols-1 sm:grid-cols-3 gap-5 max-w-2xl">
                        {data.map((item, idx) => (
                            <motion.li
                                key={item.name}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.5, delay: idx * 0.1 }}
                                whileHover={{ y: -6, scale: 1.02 }}
                                className="border border-gray-300 dark:border-white/20 rounded-2xl p-5 cursor-pointer hover:bg-lightHover duration-300 hover:shadow-lg dark:hover:shadow-sky-500/10 dark:hover:bg-darkHover/60 bg-white/50 dark:bg-white/5 backdrop-blur-sm"
                            >
                                <img src={item.icon1} alt="" className="w-7 mt-2 dark:hidden" />
                                <img src={item.icon2} alt="" className="w-7 mt-2 hidden dark:block" />
                                <h3 className="my-3 font-semibold text-gray-800 dark:text-white text-base">{item.name}</h3>
                                <p className="text-gray-600 text-xs dark:text-white/75 leading-relaxed">{item.description}</p>
                            </motion.li>
                        ))}
                    </ul>

                    {/* Tools I Use Section */}
                    <div className="mt-10">
                        <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
                            <h4 className="text-gray-800 font-Ovo dark:text-white font-semibold text-base sm:text-lg">
                                Tools &amp; Technologies I use
                            </h4>

                            {/* Category Filter Chips */}
                            <div className="flex flex-wrap gap-1.5">
                                {categories.map((cat) => (
                                    <button
                                        key={cat}
                                        onClick={() => setSelectedCategory(cat)}
                                        className={`text-[11px] px-3 py-1 rounded-full font-medium transition-all ${
                                            selectedCategory === cat
                                                ? 'bg-sky-500 text-white shadow-md shadow-sky-500/25 scale-105'
                                                : 'bg-gray-100 dark:bg-white/10 text-gray-600 dark:text-white/70 hover:bg-gray-200 dark:hover:bg-white/20'
                                        }`}
                                    >
                                        {cat}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Interactive Tools Grid with AnimatePresence */}
                        <motion.div layout className="flex flex-wrap items-center gap-3">
                            <AnimatePresence>
                                {filteredTools.map((tool) => (
                                    <motion.div
                                        layout
                                        key={tool.name}
                                        initial={{ scale: 0.8, opacity: 0 }}
                                        animate={{ scale: 1, opacity: 1 }}
                                        exit={{ scale: 0.8, opacity: 0 }}
                                        transition={{ duration: 0.2 }}
                                        whileHover={{ y: -4, scale: 1.08 }}
                                        className="group relative flex items-center justify-center w-12 sm:w-14 aspect-square border border-gray-300 dark:border-white/25 rounded-2xl cursor-pointer duration-300 hover:shadow-lg hover:border-sky-500 bg-white dark:bg-[#0c182d] transition-colors"
                                        title={tool.name}
                                    >
                                        {tool.isSvg ? (
                                            tool.icon
                                        ) : (
                                            <img src={tool.icon} alt={tool.name} className="w-5 sm:w-7 object-contain" />
                                        )}

                                        {/* Hover Tooltip */}
                                        <span className="pointer-events-none absolute -bottom-8 opacity-0 group-hover:opacity-100 transition-opacity duration-200 bg-gray-900 text-white text-[10px] px-2.5 py-0.5 rounded-md shadow-xl whitespace-nowrap z-30 font-medium">
                                            {tool.name}
                                        </span>
                                    </motion.div>
                                ))}
                            </AnimatePresence>
                        </motion.div>
                    </div>
                </div>
            </div>

            {/* Technical Skills Grid */}
            <div className="mt-14">
                <h4 className="text-center mb-2 text-lg font-Ovo text-sky-600 dark:text-sky-400">What I know</h4>
                <h2 className="text-center text-4xl sm:text-5xl font-Ovo mb-12 text-gray-900 dark:text-white">Technical Skills</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 max-w-5xl mx-auto">
                    {skills.map((skill, idx) => (
                        <motion.div
                            key={skill.category}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.5, delay: idx * 0.08 }}
                            whileHover={{ y: -5 }}
                            className="border border-gray-300 dark:border-white/20 rounded-2xl px-6 py-5 hover:bg-lightHover duration-300 hover:shadow-lg dark:hover:shadow-sky-500/10 dark:hover:bg-darkHover/60 bg-white/50 dark:bg-white/5 backdrop-blur-sm"
                        >
                            <h3 className="font-semibold text-gray-900 dark:text-white mb-2 text-base">{skill.category}</h3>
                            <p className="text-xs sm:text-sm text-gray-600 dark:text-white/70 leading-relaxed font-Outfit">{skill.items}</p>
                        </motion.div>
                    ))}
                </div>
            </div>
        </motion.div>
    );
}