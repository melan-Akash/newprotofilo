import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { defaultProjects, getAllProjects, getProjectSlug } from '../data/projectsData';

export default function Work() {
    const navigate = useNavigate();
    const [projects, setProjects] = useState(defaultProjects);
    const [visibleCount, setVisibleCount] = useState(12);

    useEffect(() => {
        let isMounted = true;
        getAllProjects().then(list => {
            if (isMounted && Array.isArray(list) && list.length > 0) {
                setProjects(list);
            }
        });
        return () => { isMounted = false; };
    }, []);

    return (
        <motion.div
            id="work"
            className="w-full px-[8%] sm:px-[12%] py-16 scroll-mt-20"
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
                My portfolio
            </motion.h4>
            <motion.h2
                className="text-center text-4xl sm:text-5xl font-Ovo text-gray-900 dark:text-white"
                initial={{ opacity: 0, y: -15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.1 }}
            >
                My latest work
            </motion.h2>
            <motion.p
                className="text-center max-w-2xl mx-auto mt-4 mb-10 font-Ovo text-sm sm:text-base text-gray-600 dark:text-white/70"
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.2 }}
            >
                A collection of full-stack, AI-integrated, and mobile projects showcasing my expertise across modern software engineering stacks.
            </motion.p>

            <motion.div layout className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 my-10 gap-6">
                <AnimatePresence>
                    {projects.slice(0, visibleCount).map((project, idx) => {
                        const slug = getProjectSlug(project);
                        const bgImage = project.image || project.images?.[0] || './assets/work-1.png';

                        return (
                            <motion.div
                                layout
                                key={project._id || project.id || project.name}
                                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                                animate={{ opacity: 1, scale: 1, y: 0 }}
                                exit={{ opacity: 0, scale: 0.95 }}
                                transition={{ duration: 0.4, delay: (idx % 12) * 0.05 }}
                                whileHover={{ y: -6, scale: 1.02 }}
                                onClick={() => navigate(`/project/${slug}`)}
                                className="aspect-[4/3] sm:aspect-square bg-no-repeat bg-cover bg-top rounded-2xl relative cursor-pointer group shadow-sm hover:shadow-2xl transition-all duration-300 overflow-hidden border border-gray-200 dark:border-white/10"
                                style={{ backgroundImage: `url(${bgImage})` }}
                            >
                                {/* Overlay gradient */}
                                <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/25 to-transparent opacity-80 group-hover:opacity-95 transition-opacity duration-300"></div>

                                {/* Card Info Box */}
                                <div className="bg-white/95 dark:bg-[#0c182d]/95 backdrop-blur-md w-11/12 rounded-xl absolute bottom-3 left-1/2 -translate-x-1/2 py-2.5 px-3.5 flex items-center justify-between duration-300 group-hover:bottom-4 shadow-lg border border-gray-100 dark:border-white/10">
                                    <div className="min-w-0 pr-2">
                                        <h3 className="font-semibold text-sm truncate text-gray-900 dark:text-white">{project.name}</h3>
                                        <p className="text-xs text-gray-600 dark:text-white/70 truncate">{project.description}</p>
                                        <p className="text-[10px] text-sky-600 dark:text-sky-400 font-medium mt-0.5 truncate">{project.tech}</p>
                                    </div>
                                    <div className="flex items-center gap-1.5 shrink-0" onClick={(e) => e.stopPropagation()}>
                                        {project.live && (
                                            <a
                                                href={project.live}
                                                target="_blank"
                                                rel="noreferrer"
                                                className="border rounded-full border-gray-300 dark:border-white/20 w-7 h-7 flex items-center justify-center hover:bg-sky-100 dark:hover:bg-white/10 transition text-gray-700 dark:text-white"
                                                title="Live Demo"
                                            >
                                                <img src="./assets/send-icon.png" alt="Live" className="w-3.5 dark:invert" />
                                            </a>
                                        )}
                                        {project.github && (
                                            <a
                                                href={project.github}
                                                target="_blank"
                                                rel="noreferrer"
                                                className="border rounded-full border-gray-300 dark:border-white/20 w-7 h-7 flex items-center justify-center hover:bg-sky-100 dark:hover:bg-white/10 transition text-gray-700 dark:text-white"
                                                title="GitHub"
                                            >
                                                <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24" fill="currentColor">
                                                    <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                                                </svg>
                                            </a>
                                        )}
                                    </div>
                                </div>
                            </motion.div>
                        );
                    })}
                </AnimatePresence>
            </motion.div>

            {/* More Works / Show Less Toggle Button */}
            {projects.length > 12 && (
                <div className="flex justify-center mb-12">
                    {visibleCount < projects.length ? (
                        <motion.button
                            whileHover={{ scale: 1.04 }}
                            whileTap={{ scale: 0.96 }}
                            onClick={() => setVisibleCount(projects.length)}
                            className="w-max flex items-center justify-center gap-3 text-gray-800 dark:text-white border border-gray-400 dark:border-white/30 rounded-full py-3.5 px-8 sm:px-10 hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-black duration-300 shadow-sm hover:shadow-lg transition-all active:scale-95 group font-medium text-sm"
                        >
                            <span>More Works</span>
                            <span className="text-xs px-2.5 py-0.5 rounded-full bg-sky-500/10 text-sky-600 dark:text-sky-400 font-semibold border border-sky-500/20 group-hover:border-transparent">
                                +{projects.length - visibleCount}
                            </span>
                            <svg className="w-4 h-4 transform group-hover:translate-y-0.5 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                            </svg>
                        </motion.button>
                    ) : (
                        <motion.button
                            whileHover={{ scale: 1.04 }}
                            whileTap={{ scale: 0.96 }}
                            onClick={() => {
                                setVisibleCount(12);
                                const workEl = document.getElementById('work');
                                if (workEl) workEl.scrollIntoView({ behavior: 'smooth' });
                            }}
                            className="w-max flex items-center justify-center gap-2 text-gray-800 dark:text-white border border-gray-400 dark:border-white/30 rounded-full py-3.5 px-8 sm:px-10 hover:bg-gray-100 dark:hover:bg-white/10 duration-300 shadow-sm transition-all active:scale-95 group font-medium text-sm"
                        >
                            <span>Show Less</span>
                            <svg className="w-4 h-4 transform group-hover:-translate-y-0.5 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 15l7-7 7 7" />
                            </svg>
                        </motion.button>
                    )}
                </div>
            )}

            {/* Catamaran Surf Club - special mention */}
            <motion.div
                whileHover={{ scale: 1.01 }}
                transition={{ duration: 0.3 }}
                className="max-w-4xl mx-auto border border-gray-300 dark:border-white/20 rounded-2xl p-6 sm:p-8 hover:bg-lightHover dark:hover:bg-darkHover/50 transition-colors duration-300 dark:text-white shadow-sm"
            >
                <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4 mb-3">
                    <h3 className="text-lg font-semibold text-gray-800 dark:text-white">Catamaran Surf Club</h3>
                    <span className="text-xs font-medium px-3 py-1 rounded-full bg-sky-100 text-sky-700 dark:bg-sky-500/20 dark:text-sky-300 w-fit">Client Project</span>
                </div>
                <p className="text-sm text-gray-600 dark:text-white/75 leading-relaxed mb-4">
                    Designed and built the frontend for a 9-page marketing site for a beachfront surf school and catamaran charter business in Galle — including a live ocean/weather forecast widget and an AI-powered booking concierge chat — plus full on-page SEO for local search visibility.
                </p>
                <a href="https://www.catamaransurfclubdewata.com" target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 text-sm text-sky-600 dark:text-sky-400 hover:underline">
                    Visit Live Site <img src="./assets/send-icon.png" alt="" className="w-4 dark:invert" />
                </a>
            </motion.div>
        </motion.div>
    );
}