export const defaultProjects = [
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
    }
];

export async function getAllProjects() {
    const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
    let serverProjects = [];
    try {
        const res = await fetch(`${apiUrl}/projects`).then(r => r.json()).catch(() => null);
        if (res && res.success && Array.isArray(res.projects)) {
            serverProjects = res.projects;
        }
    } catch {
        // Continue with local
    }

    const localCustom = JSON.parse(localStorage.getItem('melan_custom_projects') || '[]');
    const customProjects = [...serverProjects];
    localCustom.forEach(lp => {
        const id = lp._id || lp.id;
        const exists = customProjects.some(cp => (cp._id || cp.id) === id || cp.name === lp.name);
        if (!exists) customProjects.push(lp);
    });

    const customNames = new Set(customProjects.map(p => p.name?.toLowerCase().trim()));
    const customIds = new Set(customProjects.map(p => (p._id || p.id)?.toString()));
    const filteredDefault = defaultProjects.filter(dp =>
        !customIds.has(dp.id) && !customNames.has(dp.name?.toLowerCase().trim())
    );

    return [...customProjects, ...filteredDefault];
}

export function getProjectSlug(project) {
    if (!project) return '';
    return (project._id || project.id || project.name.toLowerCase().replace(/[^a-z0-9]+/g, '-')).toString();
}
