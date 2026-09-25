import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Slidebar from './slidebar';
import AddPortfolio from './addProtofoilo';
import EmailInbox from './email';
import ProfileSetting from './profileSetting';
import EditProjectModal from './editProjectModal';
import { getAuthHeaders } from '../utils/auth';

export default function Dashboard() {
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState('dashboard');
    const [isMobileOpen, setIsMobileOpen] = useState(false);
    const [projects, setProjects] = useState([]);
    const [loading, setLoading] = useState(true);
    const [syncingGitHub, setSyncingGitHub] = useState(false);
    const [syncMsg, setSyncMsg] = useState('');
    const [editingProject, setEditingProject] = useState(null);
    const [isEditOpen, setIsEditOpen] = useState(false);

    // Verify authentication with backend
    useEffect(() => {
        const authData = localStorage.getItem('melan_admin_auth');
        if (!authData) {
            navigate('/cmsdash-login', { replace: true });
            return;
        }
        try {
            const parsed = JSON.parse(authData);
            if (!parsed?.token) {
                localStorage.removeItem('melan_admin_auth');
                navigate('/cmsdash-login', { replace: true });
                return;
            }

            const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
            fetch(`${apiUrl}/auth/verify`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${parsed.token}`
                }
            })
            .then(r => r.json())
            .then(res => {
                if (!res || !res.success) {
                    localStorage.removeItem('melan_admin_auth');
                    navigate('/cmsdash-login', { replace: true });
                }
            })
            .catch(() => {});
        } catch {
            localStorage.removeItem('melan_admin_auth');
            navigate('/cmsdash-login', { replace: true });
        }
    }, [navigate]);

    // Fetch projects from server or localStorage
    const loadProjects = async () => {
        setLoading(true);
        const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
        try {
            const res = await fetch(`${apiUrl}/projects`).then(r => r.json()).catch(() => null);
            if (res && res.success && res.projects) {
                // Merge with any custom local projects
                const localCustom = JSON.parse(localStorage.getItem('melan_custom_projects') || '[]');
                const combined = [...localCustom, ...res.projects.filter(p => !localCustom.some(lc => lc.id === p.id))];
                setProjects(combined);
            } else {
                const localCustom = JSON.parse(localStorage.getItem('melan_custom_projects') || '[]');
                setProjects(localCustom);
            }
        } catch {
            const localCustom = JSON.parse(localStorage.getItem('melan_custom_projects') || '[]');
            setProjects(localCustom);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadProjects();
    }, []);

    const handleLogout = () => {
        localStorage.removeItem('melan_admin_auth');
        navigate('/cmsdash-login');
    };

    const handleDeleteProject = async (id) => {
        if (!id) return;
        if (!window.confirm('Are you sure you want to delete this project?')) return;

        // Delete from local storage
        const localCustom = JSON.parse(localStorage.getItem('melan_custom_projects') || '[]');
        const updatedLocal = localCustom.filter(p => (p.id !== id && p._id !== id));
        localStorage.setItem('melan_custom_projects', JSON.stringify(updatedLocal));

        // Delete from server (MongoDB)
        try {
            const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
            await fetch(`${apiUrl}/projects/${id}`, {
                method: 'DELETE',
                headers: getAuthHeaders()
            });
        } catch {
            // Ignore server errors
        }

        setProjects(prev => prev.filter(p => (p.id !== id && p._id !== id)));
    };

    const handleOpenEdit = (proj) => {
        setEditingProject(proj);
        setIsEditOpen(true);
    };

    const handleCloseEdit = () => {
        setEditingProject(null);
        setIsEditOpen(false);
    };

    const handleProjectUpdated = (updatedProj) => {
        setProjects(prev => prev.map(p => {
            const matches = (p._id && updatedProj._id && p._id === updatedProj._id)
                || (p.id && updatedProj.id && p.id === updatedProj.id)
                || (p.name && updatedProj.name && p.name === updatedProj.name);
            return matches ? { ...p, ...updatedProj } : p;
        }));
    };

    const handleSyncGitHub = async () => {
        setSyncingGitHub(true);
        setSyncMsg('');
        try {
            const githubRes = await fetch('https://api.github.com/users/melan-Akash/repos?per_page=100').then(r => r.json());
            if (!Array.isArray(githubRes)) throw new Error('Could not fetch GitHub repositories');

            const liveRepos = githubRes.filter(r => r.homepage && r.homepage.trim().startsWith('http'));
            const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

            let addedCount = 0;
            for (const repo of liveRepos) {
                const alreadyExists = projects.some(p =>
                    (p.name && repo.name && p.name.toLowerCase().includes(repo.name.toLowerCase())) ||
                    (p.live && repo.homepage && p.live.toLowerCase().includes(repo.homepage.toLowerCase()))
                );

                if (!alreadyExists) {
                    const cleanName = repo.name.replace(/[-_]/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
                    const formData = new FormData();
                    formData.append('name', cleanName);
                    formData.append('description', repo.description || `${cleanName} - Live Project`);
                    formData.append('overview', repo.description || `${cleanName} - Built with modern full-stack engineering.`);
                    formData.append('tech', repo.language ? `${repo.language} · Full Stack` : 'JavaScript · React · Node.js');
                    formData.append('year', new Date(repo.updated_at || Date.now()).getFullYear().toString());
                    formData.append('live', repo.homepage);
                    formData.append('github', repo.html_url);
                    formData.append('images', JSON.stringify(['./assets/work-1.png']));

                    const res = await fetch(`${apiUrl}/projects`, {
                        method: 'POST',
                        headers: getAuthHeaders(),
                        body: formData
                    }).then(r => r.json());

                    if (res?.success) addedCount++;
                }
            }

            await loadProjects();
            setSyncMsg(addedCount > 0 ? `Successfully imported ${addedCount} live projects from GitHub!` : 'All live GitHub projects are already synced!');
            setTimeout(() => setSyncMsg(''), 5000);
        } catch (err) {
            setSyncMsg(`Sync error: ${err.message}`);
        } finally {
            setSyncingGitHub(false);
        }
    };

    return (
        <div className="min-h-screen flex bg-slate-100 dark:bg-darkTheme transition-colors duration-300 font-Outfit">
            {/* Sidebar */}
            <Slidebar
                activeTab={activeTab}
                setActiveTab={setActiveTab}
                onLogout={handleLogout}
                isMobileOpen={isMobileOpen}
                setIsMobileOpen={setIsMobileOpen}
            />

            {/* Main Content Area */}
            <div className="flex-1 flex flex-col min-w-0">
                {/* Top Bar */}
                <header className="h-16 px-6 sm:px-8 border-b border-gray-200 dark:border-white/10 bg-white/80 dark:bg-[#071120]/80 backdrop-blur-md flex items-center justify-between sticky top-0 z-30">
                    <div className="flex items-center gap-3">
                        <button
                            onClick={() => setIsMobileOpen(true)}
                            className="p-2 rounded-lg lg:hidden hover:bg-gray-100 dark:hover:bg-white/5 text-gray-600 dark:text-white"
                            title="Open menu"
                        >
                            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                            </svg>
                        </button>
                        <h2 className="text-lg font-bold text-gray-900 dark:text-white capitalize">
                            {activeTab === 'dashboard' ? 'Overview' : activeTab === 'add' ? 'Add Portfolio' : activeTab === 'manage' ? 'All Projects' : activeTab === 'profile' ? 'Profile Settings' : 'Inquiries'}
                        </h2>
                    </div>

                    {/* Admin Profile */}
                    <div className="flex items-center gap-3">
                        <div className="hidden sm:block text-right">
                            <p className="text-xs font-semibold text-gray-900 dark:text-white">Melan Akash</p>
                            <p className="text-[10px] text-sky-500 font-medium">Administrator</p>
                        </div>
                        <div className="w-9 h-9 rounded-full bg-gradient-to-r from-sky-500 to-blue-600 flex items-center justify-center text-white font-bold text-xs shadow-md shadow-sky-500/20">
                            MA
                        </div>
                    </div>
                </header>

                {/* Tab Views */}
                <main className="flex-1 p-6 sm:p-8 overflow-y-auto">
                    {activeTab === 'dashboard' && (
                        <div className="max-w-6xl mx-auto space-y-8">
                            {/* Welcome Banner */}
                            <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-sky-500/10 via-blue-500/10 to-transparent border border-sky-500/20 p-6 sm:p-8">
                                <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">
                                    Welcome back, Melan 👋
                                </h1>
                                <p className="text-sm text-gray-600 dark:text-white/70 mt-1 max-w-xl">
                                    Manage your portfolio projects with multiple showcase images, detailed overviews, tech stacks, and client messages from one centralized dashboard.
                                </p>
                                <button
                                    onClick={() => setActiveTab('add')}
                                    className="mt-5 px-5 py-2.5 rounded-xl bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-600 hover:to-blue-700 text-white text-xs font-semibold shadow-md shadow-sky-500/20 active:scale-95 transition-all inline-flex items-center gap-2"
                                >
                                    + Add New Project
                                </button>
                            </div>

                            {/* Stat Widgets */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                                <div className="bg-white dark:bg-[#0c182d] border border-gray-200 dark:border-white/10 rounded-2xl p-5 shadow-sm">
                                    <p className="text-xs font-medium text-gray-500 dark:text-white/60">Total Projects</p>
                                    <p className="text-2xl font-bold text-gray-900 dark:text-white mt-2">{projects.length}</p>
                                    <span className="text-[10px] text-emerald-500 font-semibold">Published &amp; Live</span>
                                </div>

                                <div className="bg-white dark:bg-[#0c182d] border border-gray-200 dark:border-white/10 rounded-2xl p-5 shadow-sm">
                                    <p className="text-xs font-medium text-gray-500 dark:text-white/60">Images Hosted</p>
                                    <p className="text-2xl font-bold text-gray-900 dark:text-white mt-2">{projects.length * 4}</p>
                                    <span className="text-[10px] text-sky-500 font-semibold">4 Images / Project</span>
                                </div>

                                <div className="bg-white dark:bg-[#0c182d] border border-gray-200 dark:border-white/10 rounded-2xl p-5 shadow-sm">
                                    <p className="text-xs font-medium text-gray-500 dark:text-white/60">Tech Stacks</p>
                                    <p className="text-2xl font-bold text-gray-900 dark:text-white mt-2">MERN · PERN</p>
                                    <span className="text-[10px] text-blue-500 font-semibold">AI &amp; Mobile Stacks</span>
                                </div>

                                <div className="bg-white dark:bg-[#0c182d] border border-gray-200 dark:border-white/10 rounded-2xl p-5 shadow-sm">
                                    <p className="text-xs font-medium text-gray-500 dark:text-white/60">API Server</p>
                                    <p className="text-2xl font-bold text-emerald-500 mt-2">Active</p>
                                    <span className="text-[10px] text-emerald-500 font-semibold">Port 5000 Online</span>
                                </div>
                            </div>

                            {/* Recent Projects List */}
                            <div className="bg-white dark:bg-[#0c182d] border border-gray-200 dark:border-white/10 rounded-2xl p-6 shadow-sm">
                                <div className="flex items-center justify-between mb-6">
                                    <h3 className="text-base font-semibold text-gray-900 dark:text-white">Active Portfolio Items</h3>
                                    <button
                                        onClick={() => setActiveTab('manage')}
                                        className="text-xs text-sky-500 hover:underline font-medium"
                                    >
                                        View All ({projects.length})
                                    </button>
                                </div>

                                {loading ? (
                                    <p className="text-sm text-gray-400">Loading projects...</p>
                                ) : (
                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                                        {projects.slice(0, 6).map((proj) => (
                                            <div
                                                key={proj.id || proj.name}
                                                className="rounded-xl border border-gray-200 dark:border-white/10 p-4 bg-gray-50/50 dark:bg-white/5 flex flex-col justify-between"
                                            >
                                                <div>
                                                    <img
                                                        src={proj.image || proj.images?.[0] || './assets/work-1.png'}
                                                        alt={proj.name}
                                                        className="w-full h-36 object-cover rounded-lg mb-3"
                                                    />
                                                    <h4 className="font-bold text-sm text-gray-900 dark:text-white">{proj.name}</h4>
                                                    <p className="text-xs text-gray-500 dark:text-white/60 mt-0.5 line-clamp-1">{proj.description}</p>
                                                    <p className="text-[11px] text-sky-600 dark:text-sky-400 mt-1 font-medium">{proj.tech}</p>
                                                </div>
                                                <div className="flex items-center justify-between mt-4 pt-3 border-t border-gray-200 dark:border-white/10">
                                                    <span className="text-[10px] text-gray-400">{proj.year || '2026'}</span>
                                                    <div className="flex items-center gap-2">
                                                        <button
                                                            onClick={() => handleOpenEdit(proj)}
                                                            className="text-xs text-sky-500 hover:text-sky-700 font-medium"
                                                        >
                                                            Edit
                                                        </button>
                                                        <button
                                                            onClick={() => handleDeleteProject(proj._id || proj.id)}
                                                            className="text-xs text-red-500 hover:text-red-700 font-medium"
                                                        >
                                                            Delete
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>
                    )}

                    {activeTab === 'add' && (
                        <AddPortfolio
                            onProjectAdded={(newProj) => {
                                setProjects(prev => [newProj, ...prev]);
                            }}
                        />
                    )}

                    {activeTab === 'manage' && (
                        <div className="max-w-6xl mx-auto space-y-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <h1 className="text-2xl font-bold text-gray-900 dark:text-white">All Portfolio Projects</h1>
                                    <p className="text-xs text-gray-500 dark:text-white/60 mt-0.5">Manage and organize all projects shown on your website.</p>
                                </div>
                                <div className="flex items-center gap-2">
                                    <button
                                        onClick={handleSyncGitHub}
                                        disabled={syncingGitHub}
                                        className="px-3.5 py-2 rounded-xl bg-gray-900 dark:bg-white/10 hover:bg-gray-800 text-white text-xs font-semibold flex items-center gap-1.5 transition"
                                        title="Import repositories with live sites from GitHub"
                                    >
                                        {syncingGitHub ? 'Syncing...' : '⚡ Sync from GitHub'}
                                    </button>
                                    <button
                                        onClick={() => setActiveTab('add')}
                                        className="px-4 py-2 rounded-xl bg-sky-500 hover:bg-sky-600 text-white text-xs font-semibold"
                                    >
                                        + Add New
                                    </button>
                                </div>
                            </div>

                            {syncMsg && (
                                <div className="p-3.5 rounded-xl bg-sky-500/10 border border-sky-500/30 text-sky-600 dark:text-sky-400 text-xs flex items-center justify-between">
                                    <span>{syncMsg}</span>
                                    <button onClick={() => setSyncMsg('')} className="font-bold ml-2">×</button>
                                </div>
                            )}

                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                                {projects.map((proj) => (
                                    <div
                                        key={proj.id || proj.name}
                                        className="rounded-2xl border border-gray-200 dark:border-white/10 p-5 bg-white dark:bg-[#0c182d] shadow-sm flex flex-col justify-between"
                                    >
                                        <div>
                                            <div className="grid grid-cols-4 gap-1.5 mb-3">
                                                {(proj.images && proj.images.length > 0 ? proj.images.slice(0, 4) : [proj.image, proj.image, proj.image, proj.image]).map((img, i) => (
                                                    <img
                                                        key={i}
                                                        src={img || './assets/work-1.png'}
                                                        alt={`${proj.name} ${i + 1}`}
                                                        className="w-full h-14 object-cover rounded border border-gray-200 dark:border-white/10"
                                                    />
                                                ))}
                                            </div>
                                            <h3 className="font-bold text-base text-gray-900 dark:text-white">{proj.name}</h3>
                                            <p className="text-xs text-gray-500 dark:text-white/60 mt-1 line-clamp-2">{proj.overview || proj.description}</p>
                                            <div className="mt-3 flex flex-wrap gap-1">
                                                {(proj.tech || '').split(/[·,]/).map((t, idx) => (
                                                    <span key={idx} className="text-[10px] px-2 py-0.5 rounded bg-sky-500/10 text-sky-600 dark:text-sky-400 font-medium">
                                                        {t.trim()}
                                                    </span>
                                                ))}
                                            </div>
                                        </div>

                                        <div className="mt-5 pt-3 border-t border-gray-200 dark:border-white/10 flex items-center justify-between">
                                            <div className="flex items-center gap-2">
                                                {proj.live && (
                                                    <a href={proj.live} target="_blank" rel="noreferrer" className="text-xs text-sky-500 hover:underline">
                                                        Live Demo
                                                    </a>
                                                )}
                                                {proj.github && (
                                                    <a href={proj.github} target="_blank" rel="noreferrer" className="text-xs text-gray-500 hover:underline">
                                                        GitHub
                                                    </a>
                                                )}
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <button
                                                    onClick={() => handleOpenEdit(proj)}
                                                    className="px-2.5 py-1 rounded-lg bg-sky-50 dark:bg-sky-500/10 text-sky-600 dark:text-sky-400 hover:bg-sky-100 dark:hover:bg-sky-500/20 text-xs font-semibold flex items-center gap-1 transition"
                                                    title="Edit Project Details & Images"
                                                >
                                                    <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                                    </svg>
                                                    Edit
                                                </button>
                                                <button
                                                    onClick={() => handleDeleteProject(proj._id || proj.id)}
                                                    className="text-xs text-red-500 hover:text-red-700 font-medium px-2 py-1 rounded hover:bg-red-50 dark:hover:bg-red-500/10 transition"
                                                >
                                                    Delete
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {activeTab === 'profile' && (
                        <ProfileSetting />
                    )}

                    {activeTab === 'messages' && (
                        <EmailInbox />
                    )}
                </main>
            </div>

            {/* Edit Project Modal */}
            <EditProjectModal
                project={editingProject}
                isOpen={isEditOpen}
                onClose={handleCloseEdit}
                onProjectUpdated={handleProjectUpdated}
            />
        </div>
    );
}
