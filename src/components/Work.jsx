export default function Work() {
    const projects = [
        {
            name: 'FindDine',
            description: 'Restaurant Booking AI Platform',
            tech: 'MERN · TypeScript · AI',
            year: '2026',
            github: 'https://github.com/melan-Akash/Find_Dine_Restaurant',
            live: 'https://find-dine.vercel.app',
            image: './assets/work-1.png',
        },
        {
            name: 'AI Website Builder',
            description: 'NL-to-React Code Generator',
            tech: 'MERN · OpenRouter · Sandpack',
            year: '2026',
            github: 'https://github.com/melan-Akash/AI_Site_Bulder_Full_Stack',
            live: 'https://site-bulder.vercel.app',
            image: './assets/work-2.png',
        },
        {
            name: 'Meetup',
            description: 'AI Video Conferencing App',
            tech: 'PERN · WebRTC · Socket.io',
            year: '2026',
            github: 'https://github.com/melan-Akash/Meetup_FullStackVideoMeetingApp_PERN-Stack',
            live: 'https://meetup-ten-lemon.vercel.app',
            image: './assets/work-3.png',
        },
        {
            name: 'MelanCart',
            description: 'AI Grocery E-Commerce & Logistics',
            tech: 'MERN · AI Voice · GPS Tracking',
            year: '2026',
            github: 'https://github.com/melan-Akash/Glosary-Full-Stack',
            live: '',
            image: './assets/work-4.png',
        },
        {
            name: 'TecHub',
            description: 'Multi-Vendor E-Commerce',
            tech: 'Next.js · Full Stack',
            year: '2026',
            github: 'https://github.com/melan-Akash/QuickCart-main-Next.js',
            live: 'https://quickcart-steel-zeta.vercel.app',
            image: './assets/work-1.png',
        },
        {
            name: 'Sky-light',
            description: 'Movie Ticket Booking Platform',
            tech: 'Full Stack · Real-time',
            year: '2025',
            github: 'https://github.com/melan-Akash/Sky-light',
            live: 'https://sky-lightlk.vercel.app',
            image: './assets/work-2.png',
        },
        {
            name: 'AI Habit Coach',
            description: 'Habit Tracker & AI Coaching App',
            tech: 'React Native · Node.js · Llama 3.1',
            year: '2026',
            github: 'https://github.com/melan-Akash/Habit-Tracker-App',
            live: '',
            image: './assets/work-3.png',
        },
        {
            name: 'Realtime Chat App',
            description: 'Mobile Chat with WebSockets',
            tech: 'React Native · Expo · Node.js',
            year: '2026',
            github: 'https://github.com/melan-Akash/Real_Time_Chat_mobile',
            live: '',
            image: './assets/work-4.png',
        },
    ];

    return (
        <div id="work" className="w-full px-[12%] py-10 scroll-mt-20">
            <h4 className="text-center mb-2 text-lg font-Ovo">My portfolio</h4>
            <h2 className="text-center text-5xl font-Ovo">My latest work</h2>
            <p className="text-center max-w-2xl mx-auto mt-5 mb-12 font-Ovo">A collection of full-stack, AI-integrated, and mobile projects showcasing my expertise across the MERN, PERN, and Next.js ecosystems.</p>

            <div className="grid grid-cols-auto my-10 gap-5 dark:text-black">
                {projects.map((project) => (
                    <div key={project.name} className="aspect-square bg-no-repeat bg-cover bg-center rounded-lg relative cursor-pointer group" style={{ backgroundImage: `url(${project.image})` }}>
                        <div className="bg-white w-10/12 rounded-md absolute bottom-5 left-1/2 -translate-x-1/2 py-3 px-5 flex items-center justify-between duration-500 group-hover:bottom-7">
                            <div>
                                <h2 className="font-semibold">{project.name}</h2>
                                <p className="text-sm text-gray-700">{project.description}</p>
                                <p className="text-xs text-gray-400 mt-0.5">{project.tech}</p>
                            </div>
                            <div className="flex items-center gap-2">
                                {project.live && (
                                    <a href={project.live} target="_blank" rel="noreferrer" className="border rounded-full border-black w-9 aspect-square flex items-center justify-center shadow-[2px_2px_0_#000] group-hover:bg-sky-300 transition" title="Live Demo">
                                        <img src="./assets/send-icon.png" alt="Live" className="w-5" />
                                    </a>
                                )}
                                <a href={project.github} target="_blank" rel="noreferrer" className="border rounded-full border-black w-9 aspect-square flex items-center justify-center shadow-[2px_2px_0_#000] group-hover:bg-sky-300 transition" title="GitHub">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                                        <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                                    </svg>
                                </a>
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
        </div>
    )
}