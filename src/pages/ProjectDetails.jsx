import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { getAllProjects, getProjectSlug } from '../data/projectsData';
import navLogoLight from '../assests/logo_for_navbar_lightmood.png';
import navLogoDark from '../assests/logo_for_navbar_darkmood.png';
import Footer from '../components/Footer';

export default function ProjectDetails() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [project, setProject] = useState(null);
    const [allProjects, setAllProjects] = useState([]);
    const [activeImageIndex, setActiveImageIndex] = useState(0);
    const [loading, setLoading] = useState(true);
    const [copied, setCopied] = useState(false);

    // Scroll to top whenever ID changes
    useEffect(() => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }, [id]);

    // Fetch project and list
    useEffect(() => {
        let isMounted = true;
        const load = async () => {
            setLoading(true);
            const list = await getAllProjects();
            if (!isMounted) return;
            setAllProjects(list);

            const decodedId = decodeURIComponent(id || '').toLowerCase();
            const found = list.find(p => {
                const pId = (p._id || p.id || '').toString().toLowerCase();
                const pName = (p.name || '').toLowerCase();
                const pSlug = getProjectSlug(p).toLowerCase();
                return pId === decodedId || pSlug === decodedId || pName === decodedId;
            });

            setProject(found || list[0] || null);
            setActiveImageIndex(0);
            setLoading(false);
        };

        load();
        return () => { isMounted = false; };
    }, [id]);

    const toggleTheme = () => {
        document.documentElement.classList.toggle('dark');
        localStorage.theme = document.documentElement.classList.contains('dark') ? 'dark' : 'light';
    };

    const handleCopyLink = () => {
        navigator.clipboard.writeText(window.location.href);
        setCopied(true);
        setTimeout(() => setCopied(false), 2500);
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-white dark:bg-darkTheme text-gray-700 dark:text-white font-Outfit">
                <div className="flex flex-col items-center gap-4">
                    <div className="w-12 h-12 border-4 border-sky-500 border-t-transparent rounded-full animate-spin"></div>
                    <p className="text-sm font-medium tracking-wide">Loading project details...</p>
                </div>
            </div>
        );
    }

    if (!project) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center bg-white dark:bg-darkTheme text-gray-700 dark:text-white px-4 font-Outfit">
                <h1 className="text-3xl font-bold mb-3">Project Not Found</h1>
                <p className="text-gray-500 dark:text-gray-400 mb-6 text-sm">The project you are looking for does not exist or has been removed.</p>
                <Link
                    to="/#work"
                    className="px-6 py-3 rounded-full bg-sky-500 text-white font-medium hover:bg-sky-600 transition shadow-md"
                >
                    ← Back to Portfolio
                </Link>
            </div>
        );
    }

    // Build project images list (ensuring 4 images fallback)
    const projectImages = Array.isArray(project.images) && project.images.length > 0
        ? project.images
        : [project.image || './assets/work-1.png'];

    const otherProjects = allProjects
        .filter(p => (p._id || p.id || p.name) !== (project._id || project.id || project.name))
        .slice(0, 6);

    const techList = project.tech ? project.tech.split(/[,·|•]/).map(t => t.trim()).filter(Boolean) : [];

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-darkTheme text-gray-900 dark:text-white transition-colors duration-300 font-Outfit selection:bg-sky-500 selection:text-white">
            {/* Top Navigation Bar */}
            <header className="sticky top-0 z-40 bg-white/80 dark:bg-[#071120]/80 backdrop-blur-md border-b border-gray-200/80 dark:border-white/10 px-6 sm:px-12 py-4">
                <div className="max-w-7xl mx-auto flex items-center justify-between">
                    <div className="flex items-center gap-6">
                        <Link to="/" className="flex items-center gap-2">
                            <img src={navLogoLight} alt="Melan Akash" className="w-24 dark:hidden" />
                            <img src={navLogoDark} alt="Melan Akash" className="w-24 hidden dark:block" />
                        </Link>
                        <Link
                            to="/#work"
                            className="hidden sm:inline-flex items-center gap-2 text-xs font-semibold text-gray-600 dark:text-white/70 hover:text-sky-500 dark:hover:text-sky-400 transition"
                        >
                            <span>← All Works</span>
                        </Link>
                    </div>

                    <div className="flex items-center gap-3">
                        <button
                            onClick={toggleTheme}
                            className="p-2.5 rounded-full border border-gray-200 dark:border-white/15 text-gray-700 dark:text-white/80 hover:bg-gray-100 dark:hover:bg-white/10 transition"
                            title="Toggle Theme"
                        >
                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                            </svg>
                        </button>

                        <button
                            onClick={handleCopyLink}
                            className="p-2.5 rounded-full border border-gray-200 dark:border-white/15 text-gray-700 dark:text-white/80 hover:bg-gray-100 dark:hover:bg-white/10 transition relative"
                            title="Share Project"
                        >
                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
                            </svg>
                            {copied && (
                                <span className="absolute -bottom-8 left-1/2 -translate-x-1/2 text-[10px] bg-black text-white dark:bg-white dark:text-black py-0.5 px-2 rounded-md font-semibold whitespace-nowrap shadow-md">
                                    Link Copied!
                                </span>
                            )}
                        </button>

                        {project.live && (
                            <a
                                href={project.live}
                                target="_blank"
                                rel="noreferrer"
                                className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-600 hover:to-blue-700 text-white text-xs font-semibold shadow-md shadow-sky-500/20 active:scale-95 transition-all"
                            >
                                <span>Live Demo</span>
                                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                                </svg>
                            </a>
                        )}
                    </div>
                </div>
            </header>

            {/* Main Content Area */}
            <main className="max-w-7xl mx-auto px-6 sm:px-12 py-10 sm:py-14 space-y-12">
                {/* Breadcrumbs & Navigation */}
                <div className="flex items-center gap-2 text-xs font-medium text-gray-500 dark:text-white/60">
                    <Link to="/" className="hover:text-sky-500 dark:hover:text-sky-400 transition">Home</Link>
                    <span>/</span>
                    <Link to="/#work" className="hover:text-sky-500 dark:hover:text-sky-400 transition">Portfolio</Link>
                    <span>/</span>
                    <span className="text-gray-900 dark:text-white truncate max-w-xs">{project.name}</span>
                </div>

                {/* Hero Header Section */}
                <div className="space-y-4">
                    <div className="flex flex-wrap items-center gap-2.5">
                        <span className="text-xs uppercase tracking-widest font-semibold text-sky-600 dark:text-sky-400 bg-sky-500/10 px-3 py-1 rounded-full border border-sky-500/20">
                            {project.year || '2026'} Project
                        </span>
                        <span className="text-xs uppercase tracking-widest font-semibold text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 px-3 py-1 rounded-full border border-emerald-500/20">
                            Full Stack Showcase
                        </span>
                    </div>

                    <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold font-Ovo tracking-tight text-gray-900 dark:text-white">
                        {project.name}
                    </h1>

                    <p className="text-base sm:text-xl text-gray-600 dark:text-white/80 max-w-3xl leading-relaxed">
                        {project.description}
                    </p>

                    {/* Quick Action Buttons */}
                    <div className="flex flex-wrap items-center gap-4 pt-3">
                        {project.live && (
                            <a
                                href={project.live}
                                target="_blank"
                                rel="noreferrer"
                                className="inline-flex items-center gap-2.5 px-6 py-3.5 rounded-full bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-600 hover:to-blue-700 text-white font-medium text-sm shadow-lg shadow-sky-500/25 active:scale-95 transition-all"
                            >
                                <span>Visit Live Website</span>
                                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                                </svg>
                            </a>
                        )}

                        {project.github && (
                            <a
                                href={project.github}
                                target="_blank"
                                rel="noreferrer"
                                className="inline-flex items-center gap-2.5 px-6 py-3.5 rounded-full bg-white dark:bg-[#0c182d] border border-gray-300 dark:border-white/20 text-gray-800 dark:text-white font-medium text-sm hover:bg-gray-100 dark:hover:bg-white/10 active:scale-95 transition-all shadow-sm"
                            >
                                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                                </svg>
                                <span>View GitHub Repository</span>
                            </a>
                        )}
                    </div>
                </div>

                {/* Showcase Image Gallery */}
                <div className="space-y-4">
                    {/* Main Featured Preview Frame */}
                    <div className="relative aspect-[16/10] sm:aspect-[16/9] w-full rounded-2xl sm:rounded-3xl overflow-hidden bg-slate-900 border border-gray-200 dark:border-white/10 shadow-2xl group">
                        <img
                            src={projectImages[activeImageIndex] || project.image || './assets/work-1.png'}
                            alt={project.name}
                            className="w-full h-full object-cover object-top transition-transform duration-500 group-hover:scale-[1.02]"
                        />

                        {/* Image overlay badge */}
                        <div className="absolute bottom-4 right-4 bg-black/75 backdrop-blur-md text-white text-xs px-3 py-1.5 rounded-full font-medium border border-white/20">
                            Screenshot {activeImageIndex + 1} of {projectImages.length}
                        </div>
                    </div>

                    {/* Thumbnail Switchers (4 Slots) */}
                    {projectImages.length > 1 && (
                        <div className="grid grid-cols-4 gap-3 sm:gap-4">
                            {projectImages.map((img, idx) => (
                                <button
                                    key={idx}
                                    onClick={() => setActiveImageIndex(idx)}
                                    className={`relative aspect-[16/10] rounded-xl overflow-hidden border-2 transition-all duration-300 ${
                                        activeImageIndex === idx
                                            ? 'border-sky-500 ring-2 ring-sky-500/40 scale-100'
                                            : 'border-transparent opacity-70 hover:opacity-100 hover:border-gray-300 dark:hover:border-white/30'
                                    }`}
                                >
                                    <img src={img} alt={`Preview ${idx + 1}`} className="w-full h-full object-cover object-top" />
                                    <div className="absolute inset-0 bg-black/10"></div>
                                </button>
                            ))}
                        </div>
                    )}
                </div>

                {/* Deep Dive & Specifications (2-Column Layout) */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 pt-4">
                    {/* Left Column: Overview & Highlights */}
                    <div className="lg:col-span-2 space-y-8">
                        {/* Project Overview */}
                        <section className="bg-white dark:bg-[#0c182d] border border-gray-200 dark:border-white/10 rounded-2xl p-6 sm:p-8 shadow-sm">
                            <h2 className="text-xl sm:text-2xl font-bold font-Ovo mb-4 text-gray-900 dark:text-white flex items-center gap-2">
                                <span>Overview &amp; Architecture</span>
                            </h2>
                            <p className="text-sm sm:text-base text-gray-600 dark:text-white/80 leading-relaxed whitespace-pre-line font-Outfit">
                                {project.overview || project.description}
                            </p>
                        </section>

                        {/* Core Features & Highlights */}
                        <section className="bg-white dark:bg-[#0c182d] border border-gray-200 dark:border-white/10 rounded-2xl p-6 sm:p-8 shadow-sm space-y-5">
                            <h2 className="text-xl sm:text-2xl font-bold font-Ovo text-gray-900 dark:text-white">
                                Key Technical Capabilities
                            </h2>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div className="p-4 rounded-xl bg-slate-50 dark:bg-white/5 border border-gray-100 dark:border-white/5">
                                    <h3 className="font-semibold text-sm text-gray-900 dark:text-white mb-1">Interactive UI/UX</h3>
                                    <p className="text-xs text-gray-600 dark:text-white/70 leading-normal">
                                        Engineered with smooth animations, mobile-first responsive grid layouts, and cohesive typography.
                                    </p>
                                </div>
                                <div className="p-4 rounded-xl bg-slate-50 dark:bg-white/5 border border-gray-100 dark:border-white/5">
                                    <h3 className="font-semibold text-sm text-gray-900 dark:text-white mb-1">Cloud &amp; Media Scaling</h3>
                                    <p className="text-xs text-gray-600 dark:text-white/70 leading-normal">
                                        Multi-slot media integration, CDN asset caching, and optimized payloads for rapid initial loads.
                                    </p>
                                </div>
                                <div className="p-4 rounded-xl bg-slate-50 dark:bg-white/5 border border-gray-100 dark:border-white/5">
                                    <h3 className="font-semibold text-sm text-gray-900 dark:text-white mb-1">State &amp; API Integrity</h3>
                                    <p className="text-xs text-gray-600 dark:text-white/70 leading-normal">
                                        Robust server endpoints, verified authorization, fallback caching, and error resilience.
                                    </p>
                                </div>
                                <div className="p-4 rounded-xl bg-slate-50 dark:bg-white/5 border border-gray-100 dark:border-white/5">
                                    <h3 className="font-semibold text-sm text-gray-900 dark:text-white mb-1">Production Deployment</h3>
                                    <p className="text-xs text-gray-600 dark:text-white/70 leading-normal">
                                        Deployed live with continuous integration, SEO meta validation, and cross-browser support.
                                    </p>
                                </div>
                            </div>
                        </section>

                        {/* Technologies Used */}
                        <section className="bg-white dark:bg-[#0c182d] border border-gray-200 dark:border-white/10 rounded-2xl p-6 sm:p-8 shadow-sm">
                            <h2 className="text-xl sm:text-2xl font-bold font-Ovo mb-4 text-gray-900 dark:text-white">
                                Technologies &amp; Libraries
                            </h2>
                            <div className="flex flex-wrap gap-2">
                                {techList.map((t, idx) => (
                                    <span
                                        key={idx}
                                        className="px-3.5 py-1.5 rounded-xl bg-sky-50 dark:bg-sky-500/10 border border-sky-200 dark:border-sky-500/20 text-sky-700 dark:text-sky-300 font-medium text-xs shadow-sm"
                                    >
                                        {t}
                                    </span>
                                ))}
                            </div>
                        </section>
                    </div>

                    {/* Right Column: Project Specifications Sidebar */}
                    <div className="space-y-6">
                        <div className="bg-white dark:bg-[#0c182d] border border-gray-200 dark:border-white/10 rounded-2xl p-6 shadow-sm sticky top-24 space-y-6">
                            <h3 className="text-lg font-bold font-Ovo text-gray-900 dark:text-white border-b border-gray-100 dark:border-white/10 pb-3">
                                Project Summary
                            </h3>

                            <div className="space-y-4 text-xs sm:text-sm">
                                <div>
                                    <p className="text-gray-500 dark:text-white/50 text-[11px] uppercase tracking-wider font-semibold">Author</p>
                                    <p className="font-medium text-gray-900 dark:text-white mt-0.5">Melan Akash</p>
                                </div>

                                <div>
                                    <p className="text-gray-500 dark:text-white/50 text-[11px] uppercase tracking-wider font-semibold">Role</p>
                                    <p className="font-medium text-gray-900 dark:text-white mt-0.5">Full Stack Engineer / Architecture</p>
                                </div>

                                <div>
                                    <p className="text-gray-500 dark:text-white/50 text-[11px] uppercase tracking-wider font-semibold">Release Year</p>
                                    <p className="font-medium text-gray-900 dark:text-white mt-0.5">{project.year || '2026'}</p>
                                </div>

                                <div>
                                    <p className="text-gray-500 dark:text-white/50 text-[11px] uppercase tracking-wider font-semibold">Live Site</p>
                                    {project.live ? (
                                        <a href={project.live} target="_blank" rel="noreferrer" className="text-sky-500 hover:underline break-all mt-0.5 inline-block font-medium">
                                            {project.live}
                                        </a>
                                    ) : (
                                        <p className="text-gray-400 mt-0.5">Private / In Development</p>
                                    )}
                                </div>

                                <div>
                                    <p className="text-gray-500 dark:text-white/50 text-[11px] uppercase tracking-wider font-semibold">Source Repository</p>
                                    {project.github ? (
                                        <a href={project.github} target="_blank" rel="noreferrer" className="text-sky-500 hover:underline break-all mt-0.5 inline-block font-medium">
                                            {project.github}
                                        </a>
                                    ) : (
                                        <p className="text-gray-400 mt-0.5">Private Repository</p>
                                    )}
                                </div>
                            </div>

                            <hr className="border-gray-100 dark:border-white/10" />

                            <div className="bg-sky-500/10 border border-sky-500/20 rounded-xl p-4 text-center">
                                <p className="text-xs text-gray-700 dark:text-white/80 font-medium mb-3">
                                    Have a software project or idea you want engineered?
                                </p>
                                <Link
                                    to="/#contact"
                                    className="w-full inline-block py-2.5 px-4 rounded-xl bg-gradient-to-r from-sky-500 to-blue-600 text-white font-semibold text-xs shadow-md shadow-sky-500/20 active:scale-95 transition-all"
                                >
                                    Get in Touch
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>

                {/* ========================================================= */}
                {/* EXPLORE OTHER PROJECTS (Bottom Section)                   */}
                {/* ========================================================= */}
                {otherProjects.length > 0 && (
                    <section className="pt-16 border-t border-gray-200 dark:border-white/10 space-y-8">
                        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
                            <div>
                                <span className="text-xs uppercase tracking-widest font-semibold text-sky-500">More Works</span>
                                <h2 className="text-2xl sm:text-4xl font-bold font-Ovo text-gray-900 dark:text-white mt-1">
                                    Explore Other Projects
                                </h2>
                                <p className="text-xs sm:text-sm text-gray-500 dark:text-white/60 mt-1">
                                    Discover more full-stack, AI, and cloud software engineered by Melan.
                                </p>
                            </div>
                            <Link
                                to="/#work"
                                className="inline-flex items-center gap-2 text-xs font-semibold text-sky-500 hover:underline"
                            >
                                <span>View Full Portfolio →</span>
                            </Link>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                            {otherProjects.map((other) => {
                                const otherSlug = getProjectSlug(other);
                                const otherImage = other.image || other.images?.[0] || './assets/work-1.png';
                                return (
                                    <div
                                        key={other._id || other.id || other.name}
                                        onClick={() => navigate(`/project/${otherSlug}`)}
                                        className="group bg-white dark:bg-[#0c182d] border border-gray-200 dark:border-white/10 rounded-2xl overflow-hidden shadow-sm hover:shadow-xl hover:-translate-y-1.5 transition-all duration-300 cursor-pointer flex flex-col justify-between"
                                    >
                                        <div>
                                            <div className="aspect-[16/10] overflow-hidden bg-slate-900 relative">
                                                <img
                                                    src={otherImage}
                                                    alt={other.name}
                                                    className="w-full h-full object-cover object-top transition-transform duration-500 group-hover:scale-105"
                                                />
                                                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                                                <span className="absolute bottom-3 left-3 text-[10px] font-semibold uppercase px-2.5 py-0.5 rounded-full bg-black/60 backdrop-blur-md text-white border border-white/20">
                                                    {other.year || '2026'}
                                                </span>
                                            </div>

                                            <div className="p-5">
                                                <h3 className="font-bold text-base text-gray-900 dark:text-white group-hover:text-sky-500 transition line-clamp-1">
                                                    {other.name}
                                                </h3>
                                                <p className="text-xs text-gray-600 dark:text-white/70 mt-1 line-clamp-2">
                                                    {other.description}
                                                </p>
                                                <p className="text-[11px] text-sky-600 dark:text-sky-400 font-medium mt-3 truncate">
                                                    {other.tech}
                                                </p>
                                            </div>
                                        </div>

                                        <div className="px-5 pb-5 pt-0 flex items-center justify-between border-t border-gray-100 dark:border-white/5 pt-3">
                                            <span className="text-xs font-semibold text-sky-500 group-hover:translate-x-1 transition-transform inline-flex items-center gap-1">
                                                <span>View Details</span>
                                                <span>→</span>
                                            </span>
                                            <div className="flex items-center gap-2" onClick={(e) => e.stopPropagation()}>
                                                {other.live && (
                                                    <a
                                                        href={other.live}
                                                        target="_blank"
                                                        rel="noreferrer"
                                                        className="w-7 h-7 rounded-full border border-gray-200 dark:border-white/10 flex items-center justify-center hover:bg-sky-50 dark:hover:bg-white/10 transition"
                                                        title="Live Demo"
                                                    >
                                                        <img src="./assets/send-icon.png" alt="Live" className="w-3.5 dark:invert" />
                                                    </a>
                                                )}
                                                {other.github && (
                                                    <a
                                                        href={other.github}
                                                        target="_blank"
                                                        rel="noreferrer"
                                                        className="w-7 h-7 rounded-full border border-gray-200 dark:border-white/10 flex items-center justify-center hover:bg-sky-50 dark:hover:bg-white/10 transition text-gray-700 dark:text-white"
                                                        title="GitHub"
                                                    >
                                                        <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24">
                                                            <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                                                        </svg>
                                                    </a>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </section>
                )}
            </main>

            <Footer />
        </div>
    );
}
