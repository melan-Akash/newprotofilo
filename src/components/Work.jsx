import { useState, useEffect } from 'react';

export default function Work() {
    const initialProjects = [
        {
            id: 'p1',
            name: 'FindDine',
            description: 'Restaurant Booking AI Platform',
            overview: 'FindDine is an intelligent AI-powered restaurant reservation and table management platform. It features smart seating recommendation algorithms, real-time availability tracking, dynamic customer reviews, and integrated online ordering to streamline dining experiences.',
            tech: 'MERN · TypeScript · AI · Tailwind CSS',
            year: '2026',
            github: 'https://github.com/melan-Akash/Find_Dine_Restaurant',
            live: 'https://find-dine.vercel.app',
            image: './assets/work-1.png',
            images: ['./assets/work-1.png', './assets/work-1.png', './assets/work-1.png', './assets/work-1.png']
        },
        {
            id: 'p2',
            name: 'AI Website Builder',
            description: 'NL-to-React Code Generator',
            overview: 'A state-of-the-art developer platform that turns natural language instructions into fully functional React web applications in seconds. Features real-time AI streaming, Sandpack browser code execution sandbox, live interactive previews, and code download.',
            tech: 'MERN · OpenRouter · Sandpack · Vite',
            year: '2026',
            github: 'https://github.com/melan-Akash/AI_Site_Bulder_Full_Stack',
            live: 'https://site-bulder.vercel.app',
            image: './assets/work-2.png',
            images: ['./assets/work-2.png', './assets/work-2.png', './assets/work-2.png', './assets/work-2.png']
        },
        {
            id: 'p3',
            name: 'Meetup',
            description: 'AI Video Conferencing App',
            overview: 'Enterprise-grade real-time video meeting and collaboration application engineered with WebRTC peer mesh networking, low-latency Socket.io signaling, high-definition screen sharing, interactive digital whiteboards, and AI transcription.',
            tech: 'PERN · WebRTC · Socket.io · PostgreSQL',
            year: '2026',
            github: 'https://github.com/melan-Akash/Meetup_FullStackVideoMeetingApp_PERN-Stack',
            live: 'https://meetup-ten-lemon.vercel.app',
            image: './assets/work-3.png',
            images: ['./assets/work-3.png', './assets/work-3.png', './assets/work-3.png', './assets/work-3.png']
        },
        {
            id: 'p4',
            name: 'MelanCart',
            description: 'AI Grocery E-Commerce & Logistics',
            overview: 'Next-generation e-commerce grocery delivery system featuring conversational AI voice ordering, smart cart replenishment, live delivery driver GPS tracking, and real-time inventory management.',
            tech: 'MERN · AI Voice · GPS Tracking · Redux',
            year: '2026',
            github: 'https://github.com/melan-Akash/Glosary-Full-Stack',
            live: '',
            image: './assets/work-4.png',
            images: ['./assets/work-4.png', './assets/work-4.png', './assets/work-4.png', './assets/work-4.png']
        },
        {
            id: 'p5',
            name: 'TecHub',
            description: 'Multi-Vendor E-Commerce',
            overview: 'High-performance multi-vendor marketplace built with Next.js App Router, Stripe checkout, vendor analytics dashboards, server-side caching, and search filtering.',
            tech: 'Next.js · Full Stack · Stripe · Tailwind',
            year: '2026',
            github: 'https://github.com/melan-Akash/QuickCart-main-Next.js',
            live: 'https://quickcart-steel-zeta.vercel.app',
            image: './assets/work-1.png',
            images: ['./assets/work-1.png', './assets/work-1.png', './assets/work-1.png', './assets/work-1.png']
        },
        {
            id: 'p6',
            name: 'Sky-light',
            description: 'Movie Ticket Booking Platform',
            overview: 'A full-stack cinema ticketing solution with real-time seat reservation maps, QR code digital tickets, movie trailer previews, and instant booking confirmations.',
            tech: 'Full Stack · Real-time · Node.js · Express',
            year: '2025',
            github: 'https://github.com/melan-Akash/Sky-light',
            live: 'https://sky-lightlk.vercel.app',
            image: './assets/work-2.png',
            images: ['./assets/work-2.png', './assets/work-2.png', './assets/work-2.png', './assets/work-2.png']
        },
        {
            id: 'p7',
            name: 'AI Habit Coach',
            description: 'Habit Tracker & AI Coaching App',
            overview: 'Cross-platform mobile application combining daily habit tracking streaks with contextual AI motivation and progress analytics powered by Meta Llama 3.1.',
            tech: 'React Native · Node.js · Llama 3.1 · Expo',
            year: '2026',
            github: 'https://github.com/melan-Akash/Habit-Tracker-App',
            live: '',
            image: './assets/work-3.png',
            images: ['./assets/work-3.png', './assets/work-3.png', './assets/work-3.png', './assets/work-3.png']
        },
        {
            id: 'p8',
            name: 'Realtime Chat App',
            description: 'Mobile Chat with WebSockets',
            overview: 'Responsive mobile communication app with instant 1-on-1 and group messaging, typing indicators, online status indicators, and encrypted chat storage.',
            tech: 'React Native · Expo · WebSockets · Node.js',
            year: '2026',
            github: 'https://github.com/melan-Akash/Real_Time_Chat_mobile',
            live: '',
            image: './assets/work-4.png',
            images: ['./assets/work-4.png', './assets/work-4.png', './assets/work-4.png', './assets/work-4.png']
        },
    ];

    const [projects, setProjects] = useState(initialProjects);
    const [selectedProject, setSelectedProject] = useState(null);
    const [activeImageIndex, setActiveImageIndex] = useState(0);

    // Fetch projects from server or localStorage
    useEffect(() => {
        const load = async () => {
            const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
            try {
                const res = await fetch(`${apiUrl}/projects`).then(r => r.json()).catch(() => null);
                const localCustom = JSON.parse(localStorage.getItem('melan_custom_projects') || '[]');

                const serverList = (res && res.success && Array.isArray(res.projects)) ? res.projects : [];

                // Combine server projects with local custom projects
                const customProjects = [...serverList];
                localCustom.forEach(lp => {
                    const id = lp._id || lp.id;
                    const exists = customProjects.some(cp => (cp._id || cp.id) === id || cp.name === lp.name);
                    if (!exists) customProjects.push(lp);
                });

                // Preserve initialProjects, avoiding duplicates
                const customNames = new Set(customProjects.map(p => p.name?.toLowerCase().trim()));
                const customIds = new Set(customProjects.map(p => (p._id || p.id)?.toString()));
                const filteredInitial = initialProjects.filter(ip =>
                    !customIds.has(ip.id) && !customNames.has(ip.name?.toLowerCase().trim())
                );

                // Show added projects on top, followed by existing portfolio projects
                setProjects([...customProjects, ...filteredInitial]);
            } catch {
                const localCustom = JSON.parse(localStorage.getItem('melan_custom_projects') || '[]');
                const customNames = new Set(localCustom.map(p => p.name?.toLowerCase().trim()));
                const filteredInitial = initialProjects.filter(ip => !customNames.has(ip.name?.toLowerCase().trim()));
                setProjects([...localCustom, ...filteredInitial]);
            }
        };

        load();
    }, []);

    // Handle opening modal
    const openModal = (proj) => {
        setSelectedProject(proj);
        setActiveImageIndex(0);
    };

    // Close modal
    const closeModal = () => {
        setSelectedProject(null);
    };

    return (
        <div id="work" className="w-full px-[8%] sm:px-[12%] py-10 scroll-mt-20">
            <h4 className="text-center mb-2 text-lg font-Ovo">My portfolio</h4>
            <h2 className="text-center text-4xl sm:text-5xl font-Ovo">My latest work</h2>
            <p className="text-center max-w-2xl mx-auto mt-4 mb-10 font-Ovo text-sm sm:text-base text-gray-600 dark:text-white/70">
                A collection of full-stack, AI-integrated, and mobile projects showcasing my expertise across modern software engineering stacks.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 my-10 gap-6">
                {projects.map((project) => (
                    <div
                        key={project._id || project.id || project.name}
                        onClick={() => openModal(project)}
                        className="aspect-[4/3] sm:aspect-square bg-no-repeat bg-cover bg-top rounded-2xl relative cursor-pointer group shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 overflow-hidden border border-gray-200 dark:border-white/10"
                        style={{ backgroundImage: `url(${project.image || project.images?.[0] || './assets/work-1.png'})` }}
                    >
                        {/* Overlay gradient */}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/25 to-transparent opacity-80 group-hover:opacity-95 transition-opacity duration-300"></div>

                        {/* Card Info Box */}
                        <div className="bg-white/95 dark:bg-[#0c182d]/95 backdrop-blur-md w-11/12 rounded-xl absolute bottom-3 left-1/2 -translate-x-1/2 py-2.5 px-3.5 flex items-center justify-between duration-300 group-hover:bottom-4 shadow-lg border border-gray-100 dark:border-white/10">
                            <div className="min-w-0 pr-2">
                                <h2 className="font-semibold text-sm truncate text-gray-900 dark:text-white">{project.name}</h2>
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
                    </div>
                ))}
            </div>

            {/* Catamaran Surf Club - special mention */}
            <div className="max-w-4xl mx-auto border border-gray-300 dark:border-white/20 rounded-xl p-6 sm:p-8 hover:bg-lightHover dark:hover:bg-darkHover/50 transition-colors duration-300 dark:text-white">
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
            </div>

            {/* ========================================================= */}
            {/* PROJECT DETAILS MODAL (4 Images, Overview, Tech Stack)    */}
            {/* ========================================================= */}
            {selectedProject && (
                <div
                    className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 sm:p-6 overflow-y-auto"
                    onClick={closeModal}
                >
                    <div
                        className="bg-white dark:bg-[#0c182d] border border-gray-200 dark:border-white/15 rounded-3xl max-w-3xl w-full max-h-[90vh] overflow-y-auto p-6 sm:p-8 shadow-2xl relative animate-in fade-in zoom-in duration-200"
                        onClick={(e) => e.stopPropagation()}
                    >
                        {/* Close button */}
                        <button
                            onClick={closeModal}
                            className="absolute top-5 right-5 w-9 h-9 rounded-full bg-gray-100 dark:bg-white/10 text-gray-700 dark:text-white hover:bg-gray-200 dark:hover:bg-white/20 flex items-center justify-center text-sm transition"
                        >
                            ✕
                        </button>

                        {/* Title & Tagline */}
                        <div className="pr-10 mb-6">
                            <span className="text-xs uppercase tracking-widest font-semibold text-sky-500 bg-sky-500/10 px-2.5 py-1 rounded-md">
                                {selectedProject.year || '2026'} Project
                            </span>
                            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mt-2 font-Outfit">
                                {selectedProject.name}
                            </h2>
                            <p className="text-sm text-gray-500 dark:text-white/60 mt-1">
                                {selectedProject.description}
                            </p>
                        </div>

                        {/* 4 Images Showcase */}
                        <div className="space-y-3 mb-6">
                            {/* Main Active Image Display */}
                            {(() => {
                                const projectImages = selectedProject.images && selectedProject.images.length > 0
                                    ? selectedProject.images
                                    : [selectedProject.image, selectedProject.image, selectedProject.image, selectedProject.image];
                                const activeImg = projectImages[activeImageIndex] || projectImages[0];

                                return (
                                    <>
                                        <div className="w-full h-64 sm:h-80 rounded-2xl overflow-hidden bg-gray-100 dark:bg-white/5 border border-gray-200 dark:border-white/10 relative">
                                            <img
                                                src={activeImg}
                                                alt={`${selectedProject.name} showcase`}
                                                className="w-full h-full object-cover"
                                            />
                                        </div>

                                        {/* 4 Image Thumbnails Bar */}
                                        <div className="grid grid-cols-4 gap-2.5">
                                            {projectImages.slice(0, 4).map((img, i) => (
                                                <button
                                                    key={i}
                                                    type="button"
                                                    onClick={() => setActiveImageIndex(i)}
                                                    className={`h-16 sm:h-20 rounded-xl overflow-hidden border-2 transition-all ${
                                                        activeImageIndex === i
                                                            ? 'border-sky-500 ring-2 ring-sky-500/30 scale-95'
                                                            : 'border-transparent opacity-60 hover:opacity-100'
                                                    }`}
                                                >
                                                    <img
                                                        src={img || './assets/work-1.png'}
                                                        alt={`Thumbnail ${i + 1}`}
                                                        className="w-full h-full object-cover"
                                                    />
                                                </button>
                                            ))}
                                        </div>
                                    </>
                                );
                            })()}
                        </div>

                        {/* Project Overview */}
                        <div className="mb-6">
                            <h3 className="text-xs uppercase tracking-wider font-bold text-gray-900 dark:text-white mb-2">
                                Project Overview
                            </h3>
                            <p className="text-sm text-gray-600 dark:text-white/75 leading-relaxed bg-gray-50 dark:bg-white/5 p-4 rounded-xl border border-gray-100 dark:border-white/5">
                                {selectedProject.overview || selectedProject.description}
                            </p>
                        </div>

                        {/* Tech Stack Badges */}
                        <div className="mb-8">
                            <h3 className="text-xs uppercase tracking-wider font-bold text-gray-900 dark:text-white mb-2">
                                Technologies Used
                            </h3>
                            <div className="flex flex-wrap gap-2">
                                {(selectedProject.tech || '').split(/[·,]/).map((t, idx) => {
                                    const trimmed = t.trim();
                                    if (!trimmed) return null;
                                    return (
                                        <span
                                            key={idx}
                                            className="px-3 py-1 rounded-lg text-xs font-medium bg-sky-500/10 text-sky-600 dark:text-sky-400 border border-sky-500/20"
                                        >
                                            {trimmed}
                                        </span>
                                    );
                                })}
                            </div>
                        </div>

                        {/* Action Links */}
                        <div className="flex flex-wrap items-center justify-end gap-3 pt-4 border-t border-gray-200 dark:border-white/10">
                            {selectedProject.github && (
                                <a
                                    href={selectedProject.github}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="px-5 py-2.5 rounded-xl border border-gray-300 dark:border-white/20 text-xs font-medium text-gray-700 dark:text-white hover:bg-gray-100 dark:hover:bg-white/5 transition flex items-center gap-2"
                                >
                                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                                        <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                                    </svg>
                                    View on GitHub
                                </a>
                            )}
                            {selectedProject.live && (
                                <a
                                    href={selectedProject.live}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-600 hover:to-blue-700 text-white text-xs font-semibold shadow-md shadow-sky-500/20 active:scale-95 transition flex items-center gap-2"
                                >
                                    Live Preview →
                                </a>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}