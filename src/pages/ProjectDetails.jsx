import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { motion, AnimatePresence } from 'framer-motion';
import { getAllProjects, getProjectSlug } from '../data/projectsData';
import { useProfile } from '../context/ProfileContext';
import defaultProfileImg from '../assests/melanakash.png';
import navLogoLight from '../assests/logo_for_navbar_lightmood.png';
import navLogoDark from '../assests/logo_for_navbar_darkmood.png';
import Footer from '../components/Footer';

export default function ProjectDetails() {
    const { id } = useParams();
    const navigate = useNavigate();
    const { profile } = useProfile();
    const [project, setProject] = useState(null);
    const [allProjects, setAllProjects] = useState([]);
    const [activeImageIndex, setActiveImageIndex] = useState(0);
    const [loading, setLoading] = useState(true);
    const [copied, setCopied] = useState(false);

    // Scroll to top whenever ID changes
    useEffect(() => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }, [id]);

    // Fetch project and projects list
    useEffect(() => {
        let isMounted = true;
        const load = async () => {
            setLoading(true);
            const list = await getAllProjects();
            if (!isMounted) return;
            setAllProjects(list);

            const decodedId = decodeURIComponent(id || '').toLowerCase().trim();
            const found = list.find(p => {
                const pId = (p._id || p.id || '').toString().toLowerCase().trim();
                const pName = (p.name || '').toLowerCase().trim();
                const pSlug = getProjectSlug(p).toLowerCase().trim();
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
        toast.success('Project link copied to clipboard!');
        setTimeout(() => setCopied(false), 2500);
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-darkTheme text-gray-700 dark:text-white font-Outfit transition-colors">
                <div className="flex flex-col items-center gap-4">
                    <div className="relative w-14 h-14">
                        <div className="w-14 h-14 rounded-full border-4 border-sky-500/20"></div>
                        <div className="w-14 h-14 rounded-full border-4 border-sky-500 border-t-transparent animate-spin absolute inset-0"></div>
                    </div>
                    <p className="text-xs uppercase tracking-widest text-gray-500 dark:text-white/60 font-semibold font-Outfit">Loading project details...</p>
                </div>
            </div>
        );
    }

    if (!project) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50 dark:bg-darkTheme text-gray-700 dark:text-white px-4 font-Outfit transition-colors">
                <div className="max-w-md w-full bg-white dark:bg-[#0c182d] border border-gray-200 dark:border-white/10 rounded-3xl p-8 text-center shadow-xl">
                    <div className="w-16 h-16 rounded-2xl bg-sky-500/10 text-sky-500 flex items-center justify-center mx-auto mb-4 text-2xl font-bold">
                        🔍
                    </div>
                    <h1 className="text-2xl font-bold font-Ovo mb-2 text-gray-900 dark:text-white">Project Not Found</h1>
                    <p className="text-gray-500 dark:text-white/60 mb-6 text-sm">The project you are looking for does not exist or has been removed from the catalog.</p>
                    <Link
                        to="/#work"
                        className="inline-flex items-center gap-2 px-8 py-3 rounded-full bg-gradient-to-r from-sky-500 to-blue-600 text-white font-medium text-sm shadow-md shadow-sky-500/20 hover:from-sky-600 hover:to-blue-700 active:scale-95 transition-all"
                    >
                        <span>← Back to Portfolio</span>
                    </Link>
                </div>
            </div>
        );
    }

    // Build project images list (ensuring clean 4 fallback images)
    const projectImages = Array.isArray(project.images) && project.images.length > 0
        ? project.images
        : [project.image || './assets/work-1.png'];

    const otherProjects = allProjects
        .filter(p => (p._id || p.id || p.name) !== (project._id || project.id || project.name))
        .slice(0, 6);

    const techList = project.tech
        ? project.tech.split(/[,·|•]/).map(t => t.trim()).filter(Boolean)
        : ['Full Stack', 'JavaScript', 'React', 'Node.js'];

    const avatarSrc = profile?.avatar || defaultProfileImg;

    const handlePrevImage = () => {
        setActiveImageIndex(prev => (prev === 0 ? projectImages.length - 1 : prev - 1));
    };

    const handleNextImage = () => {
        setActiveImageIndex(prev => (prev === projectImages.length - 1 ? 0 : prev + 1));
    };

    return (
        <div className="min-h-screen bg-[#fcfdff] dark:bg-darkTheme text-gray-900 dark:text-white transition-colors duration-300 font-Outfit selection:bg-sky-500 selection:text-white relative overflow-x-hidden">
            {/* Ambient Background Glows */}
            <div className="fixed top-0 right-0 w-11/12 -z-10 translate-y-[-80%] dark:hidden pointer-events-none">
                <img src="./assets/header-bg-color.png" alt="" className="w-full opacity-60" />
            </div>
            <div className="fixed -top-40 -right-40 w-96 h-96 bg-sky-500/10 rounded-full blur-[140px] pointer-events-none -z-10"></div>
            <div className="fixed top-1/3 -left-40 w-96 h-96 bg-blue-600/10 rounded-full blur-[140px] pointer-events-none -z-10"></div>

            {/* Top Navigation Bar */}
            <header className="sticky top-0 z-40 bg-white/80 dark:bg-[#060d1a]/85 backdrop-blur-xl border-b border-gray-200/70 dark:border-white/10 px-5 sm:px-12 py-3.5 transition-colors">
                <div className="max-w-7xl mx-auto flex items-center justify-between">
                    <div className="flex items-center gap-4 sm:gap-6">
                        <Link to="/" className="flex items-center gap-2">
                            <img src={navLogoLight} alt="Melan Akash" className="w-24 sm:w-28 dark:hidden" />
                            <img src={navLogoDark} alt="Melan Akash" className="w-24 sm:w-28 hidden dark:block" />
                        </Link>
                        <span className="hidden md:inline-block w-px h-5 bg-gray-200 dark:bg-white/10"></span>
                        <Link
                            to="/#work"
                            className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-gray-100/80 dark:bg-white/5 border border-gray-200/80 dark:border-white/10 text-xs font-medium text-gray-700 dark:text-white/80 hover:border-sky-500 dark:hover:border-sky-400 hover:text-sky-600 dark:hover:text-sky-400 transition-all"
                        >
                            <span>←</span>
                            <span>Back to Works</span>
                        </Link>
                    </div>

                    <div className="flex items-center gap-2 sm:gap-3">
                        <button
                            onClick={toggleTheme}
                            className="w-9 h-9 rounded-full border border-gray-200 dark:border-white/15 text-gray-700 dark:text-white/80 hover:bg-gray-100 dark:hover:bg-white/10 flex items-center justify-center transition"
                            title="Toggle Theme"
                        >
                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                            </svg>
                        </button>

                        <button
                            onClick={handleCopyLink}
                            className="w-9 h-9 rounded-full border border-gray-200 dark:border-white/15 text-gray-700 dark:text-white/80 hover:bg-gray-100 dark:hover:bg-white/10 flex items-center justify-center transition relative"
                            title="Share Project"
                        >
                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
                            </svg>
                            {copied && (
                                <span className="absolute -bottom-9 left-1/2 -translate-x-1/2 text-[10px] bg-gray-900 text-white dark:bg-white dark:text-black py-1 px-2.5 rounded-md font-semibold whitespace-nowrap shadow-xl">
                                    Link Copied!
                                </span>
                            )}
                        </button>

                        {project.live && (
                            <a
                                href={project.live}
                                target="_blank"
                                rel="noreferrer"
                                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-600 hover:to-blue-700 text-white text-xs font-semibold shadow-md shadow-sky-500/20 active:scale-95 transition-all ml-1"
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

            {/* Main Project Details Body */}
            <main className="max-w-7xl mx-auto px-5 sm:px-12 py-8 sm:py-12 space-y-12">
                {/* Breadcrumbs */}
                <nav className="flex items-center gap-2 text-xs font-medium text-gray-500 dark:text-white/60">
                    <Link to="/" className="hover:text-sky-500 dark:hover:text-sky-400 transition">Home</Link>
                    <span>/</span>
                    <Link to="/#work" className="hover:text-sky-500 dark:hover:text-sky-400 transition">Works</Link>
                    <span>/</span>
                    <span className="text-gray-900 dark:text-white font-semibold truncate max-w-xs">{project.name}</span>
                </nav>

                {/* Hero Header Section */}
                <motion.div
                    initial={{ opacity: 0, y: 25 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                    className="space-y-5"
                >
                    <div className="flex flex-wrap items-center gap-3">
                        <span className="text-xs uppercase tracking-widest font-semibold text-sky-600 dark:text-sky-400 bg-sky-500/10 px-3 py-1 rounded-full border border-sky-500/20">
                            {project.year || '2026'} Project
                        </span>
                        <span className="text-xs uppercase tracking-widest font-semibold text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 px-3 py-1 rounded-full border border-emerald-500/20 flex items-center gap-1.5">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                            Production Ready
                        </span>
                    </div>

                    <h1 className="text-4xl sm:text-6xl lg:text-7xl font-Ovo tracking-tight text-gray-900 dark:text-white leading-[1.12]">
                        {project.name}
                    </h1>

                    <p className="text-base sm:text-xl font-Outfit text-gray-600 dark:text-gray-300 max-w-3xl leading-relaxed font-light">
                        {project.description}
                    </p>

                    {/* Quick Metadata Bar */}
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 pt-2">
                        <div className="p-3.5 rounded-2xl bg-white dark:bg-[#0c182d] border border-gray-200/80 dark:border-white/10 shadow-sm">
                            <p className="text-[11px] font-semibold uppercase tracking-wider text-gray-500 dark:text-white/50">Primary Role</p>
                            <p className="text-sm font-semibold text-gray-900 dark:text-white mt-1">Full Stack Engineer</p>
                        </div>
                        <div className="p-3.5 rounded-2xl bg-white dark:bg-[#0c182d] border border-gray-200/80 dark:border-white/10 shadow-sm">
                            <p className="text-[11px] font-semibold uppercase tracking-wider text-gray-500 dark:text-white/50">Architecture</p>
                            <p className="text-sm font-semibold text-gray-900 dark:text-white mt-1">Responsive Web App</p>
                        </div>
                        <div className="p-3.5 rounded-2xl bg-white dark:bg-[#0c182d] border border-gray-200/80 dark:border-white/10 shadow-sm">
                            <p className="text-[11px] font-semibold uppercase tracking-wider text-gray-500 dark:text-white/50">Timeline</p>
                            <p className="text-sm font-semibold text-gray-900 dark:text-white mt-1">{project.year || '2026'}</p>
                        </div>
                        <div className="p-3.5 rounded-2xl bg-white dark:bg-[#0c182d] border border-gray-200/80 dark:border-white/10 shadow-sm">
                            <p className="text-[11px] font-semibold uppercase tracking-wider text-gray-500 dark:text-white/50">Deployment</p>
                            <p className="text-sm font-semibold text-emerald-600 dark:text-emerald-400 mt-1">Live Online ●</p>
                        </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex flex-wrap items-center gap-3.5 pt-2">
                        {project.live && (
                            <motion.a
                                href={project.live}
                                target="_blank"
                                rel="noreferrer"
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                className="inline-flex items-center gap-2.5 px-7 py-3 rounded-full bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-600 hover:to-blue-700 text-white font-medium text-sm shadow-lg shadow-sky-500/25 transition-all"
                            >
                                <span>Visit Live Application</span>
                                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                                </svg>
                            </motion.a>
                        )}

                        {project.github && (
                            <motion.a
                                href={project.github}
                                target="_blank"
                                rel="noreferrer"
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                className="inline-flex items-center gap-2.5 px-6 py-3 rounded-full bg-white dark:bg-[#0c182d] border border-gray-300 dark:border-white/20 text-gray-800 dark:text-white font-medium text-sm hover:bg-gray-100 dark:hover:bg-white/10 transition-all shadow-sm"
                            >
                                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                                </svg>
                                <span>GitHub Repository</span>
                            </motion.a>
                        )}
                    </div>
                </motion.div>

                {/* macOS / Chrome Style Showcase Gallery Frame */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.65, delay: 0.2 }}
                    className="space-y-4"
                >
                    <div className="bg-white dark:bg-[#0c182d] border border-gray-200 dark:border-white/10 rounded-2xl sm:rounded-3xl shadow-xl overflow-hidden">
                        {/* Browser Window Header Mockup */}
                        <div className="h-10 sm:h-12 bg-slate-100 dark:bg-[#071120] border-b border-gray-200 dark:border-white/10 px-4 sm:px-6 flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                <span className="w-3 h-3 rounded-full bg-rose-500/80 inline-block"></span>
                                <span className="w-3 h-3 rounded-full bg-amber-500/80 inline-block"></span>
                                <span className="w-3 h-3 rounded-full bg-emerald-500/80 inline-block"></span>
                            </div>

                            {/* Center URL Bar */}
                            <div className="hidden sm:flex items-center gap-2 px-4 py-1 rounded-lg bg-white/80 dark:bg-white/5 border border-gray-200 dark:border-white/10 text-xs text-gray-500 dark:text-white/60 font-mono max-w-sm w-full justify-center">
                                <svg className="w-3 h-3 text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                                </svg>
                                <span className="truncate">{project.live || `https://melanakash.dev/project/${getProjectSlug(project)}`}</span>
                            </div>

                            <span className="text-[11px] text-gray-500 dark:text-white/60 font-medium">
                                {activeImageIndex + 1} / {projectImages.length}
                            </span>
                        </div>

                        {/* Main Featured Image Container */}
                        <div className="relative aspect-[16/10] sm:aspect-[16/9] w-full bg-slate-950 overflow-hidden group">
                            <AnimatePresence mode="wait">
                                <motion.img
                                    key={activeImageIndex}
                                    src={projectImages[activeImageIndex] || project.image || './assets/work-1.png'}
                                    alt={`${project.name} view ${activeImageIndex + 1}`}
                                    initial={{ opacity: 0, scale: 1.02 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    exit={{ opacity: 0, scale: 0.98 }}
                                    transition={{ duration: 0.35, ease: "easeInOut" }}
                                    className="w-full h-full object-cover object-top"
                                />
                            </AnimatePresence>

                            {/* Arrow Buttons for quick image navigation */}
                            {projectImages.length > 1 && (
                                <>
                                    <motion.button
                                        whileHover={{ scale: 1.1 }}
                                        whileTap={{ scale: 0.9 }}
                                        onClick={handlePrevImage}
                                        className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-black/60 hover:bg-black/85 text-white flex items-center justify-center backdrop-blur-md opacity-80 hover:opacity-100 transition shadow-lg border border-white/20"
                                        title="Previous Image"
                                    >
                                        ‹
                                    </motion.button>
                                    <motion.button
                                        whileHover={{ scale: 1.1 }}
                                        whileTap={{ scale: 0.9 }}
                                        onClick={handleNextImage}
                                        className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-black/60 hover:bg-black/85 text-white flex items-center justify-center backdrop-blur-md opacity-80 hover:opacity-100 transition shadow-lg border border-white/20"
                                        title="Next Image"
                                    >
                                        ›
                                    </motion.button>
                                </>
                            )}
                        </div>
                    </div>

                    {/* 4 Thumbnails Gallery Strip */}
                    {projectImages.length > 1 && (
                        <div className="grid grid-cols-4 gap-2.5 sm:gap-4">
                            {projectImages.map((img, idx) => (
                                <motion.button
                                    key={idx}
                                    whileHover={{ scale: 1.03 }}
                                    whileTap={{ scale: 0.97 }}
                                    onClick={() => setActiveImageIndex(idx)}
                                    className={`relative aspect-[16/10] rounded-xl sm:rounded-2xl overflow-hidden border-2 transition-all duration-300 ${
                                        activeImageIndex === idx
                                            ? 'border-sky-500 ring-2 ring-sky-500/40 shadow-md scale-100'
                                            : 'border-transparent opacity-65 hover:opacity-100 hover:border-gray-300 dark:hover:border-white/30'
                                    }`}
                                >
                                    <img src={img} alt={`Preview ${idx + 1}`} className="w-full h-full object-cover object-top" />
                                    <span className="absolute bottom-1.5 left-2 text-[10px] font-semibold text-white bg-black/70 px-1.5 py-0.5 rounded backdrop-blur-sm">
                                        Slot {idx + 1}
                                    </span>
                                </motion.button>
                            ))}
                        </div>
                    )}
                </motion.div>

                {/* Deep Dive & Architecture Specifications (2-Column Studio Grid) */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 pt-4">
                    {/* Left 2 Columns: Overview, Highlights, Technologies */}
                    <div className="lg:col-span-2 space-y-8">
                        {/* Section 1: Overview */}
                        <section className="bg-white dark:bg-[#0c182d] border border-gray-200/80 dark:border-white/10 rounded-3xl p-6 sm:p-9 shadow-sm space-y-4">
                            <h2 className="text-2xl sm:text-3xl font-bold font-Ovo text-gray-900 dark:text-white">
                                Project Overview &amp; Architecture
                            </h2>
                            <div className="border-l-2 border-sky-500 pl-4 sm:pl-6 py-1">
                                <p className="text-sm sm:text-base text-gray-700 dark:text-white/85 leading-relaxed font-Outfit whitespace-pre-line">
                                    {project.overview || project.description}
                                </p>
                            </div>
                        </section>

                        {/* Section 2: Core Engineering Pillars */}
                        <section className="bg-white dark:bg-[#0c182d] border border-gray-200/80 dark:border-white/10 rounded-3xl p-6 sm:p-9 shadow-sm space-y-6">
                            <div>
                                <span className="text-xs uppercase tracking-widest font-semibold text-sky-500">Engineering Excellence</span>
                                <h2 className="text-2xl sm:text-3xl font-bold font-Ovo text-gray-900 dark:text-white mt-1">
                                    Core Architectural Pillars
                                </h2>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div className="p-5 rounded-2xl bg-slate-50 dark:bg-white/5 border border-gray-200/60 dark:border-white/5 space-y-2 hover:border-sky-500/40 transition">
                                    <div className="w-8 h-8 rounded-xl bg-sky-500/10 text-sky-600 dark:text-sky-400 flex items-center justify-center font-bold text-sm">
                                        ⚡
                                    </div>
                                    <h3 className="font-semibold text-sm text-gray-900 dark:text-white">Reactive UX &amp; Micro-Interactions</h3>
                                    <p className="text-xs text-gray-600 dark:text-white/70 leading-relaxed">
                                        Engineered with instant state response, smooth route transitions, and responsive fluid layouts for mobile, tablet, and widescreen.
                                    </p>
                                </div>

                                <div className="p-5 rounded-2xl bg-slate-50 dark:bg-white/5 border border-gray-200/60 dark:border-white/5 space-y-2 hover:border-sky-500/40 transition">
                                    <div className="w-8 h-8 rounded-xl bg-blue-500/10 text-blue-600 dark:text-blue-400 flex items-center justify-center font-bold text-sm">
                                        ☁️
                                    </div>
                                    <h3 className="font-semibold text-sm text-gray-900 dark:text-white">Cloud Media &amp; Asset CDN</h3>
                                    <p className="text-xs text-gray-600 dark:text-white/70 leading-relaxed">
                                        Multi-slot image pipeline backed by Cloudinary CDN streaming, automatic format delivery, and responsive image optimizations.
                                    </p>
                                </div>

                                <div className="p-5 rounded-2xl bg-slate-50 dark:bg-white/5 border border-gray-200/60 dark:border-white/5 space-y-2 hover:border-sky-500/40 transition">
                                    <div className="w-8 h-8 rounded-xl bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 flex items-center justify-center font-bold text-sm">
                                        🔒
                                    </div>
                                    <h3 className="font-semibold text-sm text-gray-900 dark:text-white">Secure Data &amp; Protected APIs</h3>
                                    <p className="text-xs text-gray-600 dark:text-white/70 leading-relaxed">
                                        Strict token-based verification, sanitized endpoints, database transactions, and persistent local fallback synchronization.
                                    </p>
                                </div>

                                <div className="p-5 rounded-2xl bg-slate-50 dark:bg-white/5 border border-gray-200/60 dark:border-white/5 space-y-2 hover:border-sky-500/40 transition">
                                    <div className="w-8 h-8 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center font-bold text-sm">
                                        🚀
                                    </div>
                                    <h3 className="font-semibold text-sm text-gray-900 dark:text-white">Production Deployment &amp; SEO</h3>
                                    <p className="text-xs text-gray-600 dark:text-white/70 leading-relaxed">
                                        Integrated structured JSON-LD schema, open graph previews, cross-browser support, and fast sub-second bundle load times.
                                    </p>
                                </div>
                            </div>
                        </section>

                        {/* Section 3: Technologies Used */}
                        <section className="bg-white dark:bg-[#0c182d] border border-gray-200/80 dark:border-white/10 rounded-3xl p-6 sm:p-9 shadow-sm space-y-4">
                            <h2 className="text-2xl sm:text-3xl font-bold font-Ovo text-gray-900 dark:text-white">
                                Technologies &amp; Libraries
                            </h2>
                            <p className="text-xs sm:text-sm text-gray-500 dark:text-white/60">
                                Modern frameworks, libraries, and protocols utilized across the development lifecycle of this project:
                            </p>
                            <div className="flex flex-wrap gap-2.5 pt-2">
                                {techList.map((t, idx) => (
                                    <span
                                        key={idx}
                                        className="px-4 py-2 rounded-xl bg-sky-500/10 border border-sky-500/20 text-sky-700 dark:text-sky-300 font-medium text-xs tracking-wide shadow-sm"
                                    >
                                        {t}
                                    </span>
                                ))}
                            </div>
                        </section>
                    </div>

                    {/* Right Column: Sticky Technical Summary & Contact Card */}
                    <div className="space-y-6">
                        <div className="bg-white dark:bg-[#0c182d] border border-gray-200/80 dark:border-white/10 rounded-3xl p-6 sm:p-7 shadow-sm sticky top-24 space-y-6">
                            <h3 className="text-lg font-bold font-Ovo text-gray-900 dark:text-white border-b border-gray-100 dark:border-white/10 pb-3">
                                Project Specifications
                            </h3>

                            <div className="space-y-4 text-xs sm:text-sm">
                                <div>
                                    <p className="text-gray-500 dark:text-white/50 text-[10px] uppercase tracking-wider font-semibold">Lead Developer</p>
                                    <p className="font-semibold text-gray-900 dark:text-white mt-0.5">Melan Akash</p>
                                </div>

                                <div>
                                    <p className="text-gray-500 dark:text-white/50 text-[10px] uppercase tracking-wider font-semibold">Role</p>
                                    <p className="font-semibold text-gray-900 dark:text-white mt-0.5">Associate Software Engineer</p>
                                </div>

                                <div>
                                    <p className="text-gray-500 dark:text-white/50 text-[10px] uppercase tracking-wider font-semibold">Release Year</p>
                                    <p className="font-semibold text-gray-900 dark:text-white mt-0.5">{project.year || '2026'}</p>
                                </div>

                                <div>
                                    <p className="text-gray-500 dark:text-white/50 text-[10px] uppercase tracking-wider font-semibold">Live Site</p>
                                    {project.live ? (
                                        <a href={project.live} target="_blank" rel="noreferrer" className="text-sky-500 hover:underline break-all mt-0.5 inline-block font-medium">
                                            {project.live}
                                        </a>
                                    ) : (
                                        <p className="text-gray-400 mt-0.5">Under Active Development</p>
                                    )}
                                </div>

                                <div>
                                    <p className="text-gray-500 dark:text-white/50 text-[10px] uppercase tracking-wider font-semibold">Source Repository</p>
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

                            {/* Author / Hire Card */}
                            <div className="bg-gradient-to-br from-sky-500/10 via-blue-500/5 to-transparent border border-sky-500/20 rounded-2xl p-5 text-center space-y-3">
                                <img
                                    src={avatarSrc}
                                    alt="Melan Akash"
                                    className="w-14 h-14 rounded-full mx-auto object-cover border-2 border-sky-500/40 shadow-md"
                                />
                                <div>
                                    <h4 className="font-bold text-sm text-gray-900 dark:text-white">Melan Akash</h4>
                                    <p className="text-xs text-gray-500 dark:text-white/60">Full Stack &amp; AI Developer</p>
                                </div>
                                <p className="text-xs text-gray-600 dark:text-white/70 leading-relaxed font-light">
                                    Interested in collaborating or building a production-grade software solution together?
                                </p>
                                <Link
                                    to="/#contact"
                                    className="w-full inline-block py-2.5 px-4 rounded-full bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-600 hover:to-blue-700 text-white font-semibold text-xs shadow-md shadow-sky-500/20 active:scale-95 transition-all"
                                >
                                    Let&apos;s Build Together →
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>

                {/* ========================================================= */}
                {/* EXPLORE OTHER PROJECTS (Signature Portfolio Grid)         */}
                {/* ========================================================= */}
                {otherProjects.length > 0 && (
                    <motion.section
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6 }}
                        className="pt-16 border-t border-gray-200 dark:border-white/10 space-y-8"
                    >
                        <div className="text-center max-w-2xl mx-auto space-y-2">
                            <h4 className="text-lg font-Ovo text-sky-600 dark:text-sky-400">Portfolio</h4>
                            <h2 className="text-3xl sm:text-5xl font-Ovo text-gray-900 dark:text-white">
                                Explore Other Projects
                            </h2>
                            <p className="text-sm font-Ovo text-gray-600 dark:text-white/70">
                                Discover more full-stack web applications, AI tools, and production software engineered by Melan.
                            </p>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-6 pt-4">
                            {otherProjects.map((other, idx) => {
                                const otherSlug = getProjectSlug(other);
                                const otherImage = other.image || other.images?.[0] || './assets/work-1.png';

                                return (
                                    <motion.div
                                        key={other._id || other.id || other.name}
                                        initial={{ opacity: 0, y: 20 }}
                                        whileInView={{ opacity: 1, y: 0 }}
                                        viewport={{ once: true }}
                                        transition={{ duration: 0.45, delay: idx * 0.1 }}
                                        whileHover={{ y: -8, scale: 1.02 }}
                                        onClick={() => navigate(`/project/${otherSlug}`)}
                                        className="aspect-[4/3] sm:aspect-square bg-no-repeat bg-cover bg-top rounded-2xl relative cursor-pointer group shadow-sm hover:shadow-2xl transition-all duration-300 overflow-hidden border border-gray-200 dark:border-white/10"
                                        style={{ backgroundImage: `url(${otherImage})` }}
                                    >
                                        {/* Overlay gradient */}
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/25 to-transparent opacity-80 group-hover:opacity-95 transition-opacity duration-300"></div>

                                        {/* Card Info Box */}
                                        <div className="bg-white/95 dark:bg-[#0c182d]/95 backdrop-blur-md w-11/12 rounded-xl absolute bottom-3 left-1/2 -translate-x-1/2 py-2.5 px-3.5 flex items-center justify-between duration-300 group-hover:bottom-4 shadow-lg border border-gray-100 dark:border-white/10">
                                            <div className="min-w-0 pr-2">
                                                <h3 className="font-semibold text-sm truncate text-gray-900 dark:text-white">{other.name}</h3>
                                                <p className="text-xs text-gray-600 dark:text-white/70 truncate">{other.description}</p>
                                                <p className="text-[10px] text-sky-600 dark:text-sky-400 font-medium mt-0.5 truncate">{other.tech}</p>
                                            </div>
                                            <div className="flex items-center gap-1.5 shrink-0" onClick={(e) => e.stopPropagation()}>
                                                {other.live && (
                                                    <a
                                                        href={other.live}
                                                        target="_blank"
                                                        rel="noreferrer"
                                                        className="border rounded-full border-gray-300 dark:border-white/20 w-7 h-7 flex items-center justify-center hover:bg-sky-100 dark:hover:bg-white/10 transition text-gray-700 dark:text-white"
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
                        </div>

                        <div className="flex justify-center pt-6">
                            <motion.div
                                whileHover={{ scale: 1.04 }}
                                whileTap={{ scale: 0.96 }}
                            >
                                <Link
                                    to="/#work"
                                    className="w-max flex items-center justify-center gap-3 text-gray-800 dark:text-white border border-gray-400 dark:border-white/30 rounded-full py-3.5 px-10 hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-black duration-300 shadow-sm hover:shadow-lg transition-all group font-medium text-sm"
                                >
                                    <span>View All Portfolio Works</span>
                                    <span className="text-sm group-hover:translate-x-1 transition-transform">→</span>
                                </Link>
                            </motion.div>
                        </div>
                    </motion.section>
                )}
            </main>

            <Footer />
        </div>
    );
}
