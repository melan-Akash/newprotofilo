import { useState } from 'react';

export default function AddPortfolio({ onProjectAdded }) {
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [overview, setOverview] = useState('');
    const [tech, setTech] = useState('');
    const [year, setYear] = useState(new Date().getFullYear().toString());
    const [github, setGithub] = useState('');
    const [live, setLive] = useState('');

    // 4 project images state
    const [images, setImages] = useState(['', '', '', '']);
    const [imageFiles, setImageFiles] = useState([null, null, null, null]);

    const [loading, setLoading] = useState(false);
    const [successMsg, setSuccessMsg] = useState('');
    const [errorMsg, setErrorMsg] = useState('');

    // Handle file selection for a specific index (0, 1, 2, 3)
    const handleFileChange = (index, file) => {
        if (!file) return;
        const newFiles = [...imageFiles];
        newFiles[index] = file;
        setImageFiles(newFiles);

        // Create preview URL
        const reader = new FileReader();
        reader.onload = () => {
            const newImages = [...images];
            newImages[index] = reader.result;
            setImages(newImages);
        };
        reader.readAsDataURL(file);
    };

    // Handle manual URL entry
    const handleUrlChange = (index, url) => {
        const newImages = [...images];
        newImages[index] = url;
        setImages(newImages);
    };

    // Remove image at index
    const handleRemoveImage = (index) => {
        const newImages = [...images];
        const newFiles = [...imageFiles];
        newImages[index] = '';
        newFiles[index] = null;
        setImages(newImages);
        setImageFiles(newFiles);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setErrorMsg('');
        setSuccessMsg('');

        if (!name.trim()) {
            setErrorMsg('Project name is required');
            return;
        }

        setLoading(true);

        try {
            // Filter out empty images or fallback to default
            const activeImages = images.filter(img => img && img.trim() !== '');
            const finalImages = activeImages.length > 0 ? activeImages : ['./assets/work-1.png'];

            const newProjectData = {
                id: 'proj_' + Date.now(),
                name,
                description: description || 'Full Stack Application',
                overview: overview || description,
                tech: tech || 'React · Node.js · Tailwind CSS',
                year: year || new Date().getFullYear().toString(),
                github,
                live,
                images: finalImages,
                image: finalImages[0],
                createdAt: new Date().toISOString()
            };

            // 1. Send multipart/form-data to server for Cloudinary & MongoDB saving
            const formData = new FormData();
            formData.append('name', name);
            formData.append('description', description);
            formData.append('overview', overview);
            formData.append('tech', tech);
            formData.append('year', year);
            formData.append('github', github);
            formData.append('live', live);

            // Add images as JSON string for base64 / URL fallbacks
            formData.append('images', JSON.stringify(finalImages));

            // Append any actual File objects
            imageFiles.forEach((file) => {
                if (file) {
                    formData.append('imageFiles', file);
                }
            });

            const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
            const res = await fetch(`${apiUrl}/projects`, {
                method: 'POST',
                body: formData
            }).then(r => r.json());

            if (!res || !res.success) {
                throw new Error(res?.message || 'Server failed to save project.');
            }

            const savedProject = res.project || newProjectData;

            // 2. Safely sync locally without crashing on quota limits
            try {
                const existingLocal = JSON.parse(localStorage.getItem('melan_custom_projects') || '[]');
                existingLocal.unshift(savedProject);
                localStorage.setItem('melan_custom_projects', JSON.stringify(existingLocal));
            } catch (storageErr) {
                console.warn('LocalStorage quota reached, project safely stored in MongoDB Atlas:', storageErr);
            }

            setSuccessMsg(`Project "${name}" added successfully to MongoDB Atlas & Cloudinary!`);

            // Reset form
            setName('');
            setDescription('');
            setOverview('');
            setTech('');
            setGithub('');
            setLive('');
            setImages(['', '', '', '']);
            setImageFiles([null, null, null, null]);

            if (onProjectAdded) {
                onProjectAdded(savedProject);
            }
        } catch (err) {
            setErrorMsg(err.message || 'Failed to save project. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-4xl mx-auto font-Outfit">
            {/* Header */}
            <div className="mb-8">
                <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">Add New Portfolio Project</h1>
                <p className="text-sm text-gray-500 dark:text-white/60 mt-1">
                    Upload 4 project showcase images, detailed overview, and tech stack.
                </p>
            </div>

            {/* Notification messages */}
            {successMsg && (
                <div className="mb-6 p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-600 dark:text-emerald-400 text-sm flex items-center justify-between">
                    <span>✓ {successMsg}</span>
                    <button onClick={() => setSuccessMsg('')} className="text-emerald-500 hover:text-emerald-700 font-bold">×</button>
                </div>
            )}
            {errorMsg && (
                <div className="mb-6 p-4 rounded-xl bg-red-500/10 border border-red-500/30 text-red-600 dark:text-red-400 text-sm flex items-center justify-between">
                    <span>✕ {errorMsg}</span>
                    <button onClick={() => setErrorMsg('')} className="text-red-500 hover:text-red-700 font-bold">×</button>
                </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-8">
                {/* 1. Project Images Section (4 Images) */}
                <div className="bg-white dark:bg-[#0c182d] border border-gray-200 dark:border-white/10 rounded-2xl p-6 shadow-sm">
                    <div className="flex items-center justify-between mb-4">
                        <div>
                            <h2 className="text-base font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                                <span>Project Images</span>
                                <span className="text-xs font-normal text-sky-500 bg-sky-500/10 px-2 py-0.5 rounded-full">4 Images Required</span>
                            </h2>
                            <p className="text-xs text-gray-500 dark:text-white/60 mt-0.5">
                                Image 1 is the main card thumbnail; Images 2-4 appear in the modal gallery.
                            </p>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                        {[0, 1, 2, 3].map((idx) => {
                            const hasImage = Boolean(images[idx]);
                            const label = idx === 0 ? 'Main Cover' : `Screenshot ${idx}`;

                            return (
                                <div
                                    key={idx}
                                    className="border-2 border-dashed border-gray-200 dark:border-white/15 rounded-xl p-3 bg-gray-50 dark:bg-white/5 flex flex-col items-center justify-between text-center relative min-h-[220px] transition-colors hover:border-sky-500/50"
                                >
                                    <span className="text-[11px] font-semibold text-gray-500 dark:text-white/60 uppercase tracking-wider mb-2">
                                        {label}
                                    </span>

                                    {hasImage ? (
                                        <div className="w-full relative group">
                                            <img
                                                src={images[idx]}
                                                alt={`Preview ${idx + 1}`}
                                                className="w-full h-28 object-cover rounded-lg border border-gray-200 dark:border-white/10"
                                            />
                                            <button
                                                type="button"
                                                onClick={() => handleRemoveImage(idx)}
                                                className="absolute top-1 right-1 bg-red-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs opacity-90 hover:opacity-100 shadow"
                                                title="Remove Image"
                                            >
                                                ✕
                                            </button>
                                        </div>
                                    ) : (
                                        <label className="w-full flex-1 flex flex-col items-center justify-center cursor-pointer py-4">
                                            <svg className="w-8 h-8 text-gray-400 dark:text-white/40 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                            </svg>
                                            <span className="text-xs text-sky-500 font-medium hover:underline">Choose File</span>
                                            <span className="text-[10px] text-gray-400 mt-1">PNG, JPG, WebP</span>
                                            <input
                                                type="file"
                                                accept="image/*"
                                                className="hidden"
                                                onChange={(e) => handleFileChange(idx, e.target.files[0])}
                                            />
                                        </label>
                                    )}

                                    {/* Optional URL Input */}
                                    <div className="w-full mt-2 pt-2 border-t border-gray-200 dark:border-white/10">
                                        <input
                                            type="text"
                                            placeholder="Or paste URL.."
                                            value={images[idx]}
                                            onChange={(e) => handleUrlChange(idx, e.target.value)}
                                            className="w-full px-2 py-1 text-[11px] rounded border border-gray-200 dark:border-white/10 bg-white dark:bg-[#071120] text-gray-800 dark:text-white outline-none focus:border-sky-500"
                                        />
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* 2. Core Project Information */}
                <div className="bg-white dark:bg-[#0c182d] border border-gray-200 dark:border-white/10 rounded-2xl p-6 shadow-sm space-y-5">
                    <h2 className="text-base font-semibold text-gray-900 dark:text-white mb-2">Project Details</h2>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                        <div>
                            <label className="block text-xs font-semibold uppercase tracking-wider text-gray-700 dark:text-white/80 mb-1.5">
                                Project Name *
                            </label>
                            <input
                                type="text"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                placeholder="e.g. FindDine"
                                className="w-full px-4 py-2.5 rounded-xl border border-gray-300 dark:border-white/15 bg-gray-50 dark:bg-white/5 text-gray-900 dark:text-white text-sm outline-none focus:border-sky-500"
                                required
                            />
                        </div>

                        <div>
                            <label className="block text-xs font-semibold uppercase tracking-wider text-gray-700 dark:text-white/80 mb-1.5">
                                Short Subtitle / Tagline *
                            </label>
                            <input
                                type="text"
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                placeholder="e.g. Restaurant Booking AI Platform"
                                className="w-full px-4 py-2.5 rounded-xl border border-gray-300 dark:border-white/15 bg-gray-50 dark:bg-white/5 text-gray-900 dark:text-white text-sm outline-none focus:border-sky-500"
                                required
                            />
                        </div>
                    </div>

                    {/* Tech Stack */}
                    <div>
                        <div className="flex items-center justify-between mb-1.5">
                            <label className="block text-xs font-semibold uppercase tracking-wider text-gray-700 dark:text-white/80">
                                Tech Stack Used *
                            </label>
                            <span className="text-xs text-gray-400">Separate with · or commas</span>
                        </div>
                        <input
                            type="text"
                            value={tech}
                            onChange={(e) => setTech(e.target.value)}
                            placeholder="e.g. MERN · TypeScript · Tailwind CSS · OpenAI API"
                            className="w-full px-4 py-2.5 rounded-xl border border-gray-300 dark:border-white/15 bg-gray-50 dark:bg-white/5 text-gray-900 dark:text-white text-sm outline-none focus:border-sky-500"
                            required
                        />
                    </div>

                    {/* Project Overview (Textarea) */}
                    <div>
                        <label className="block text-xs font-semibold uppercase tracking-wider text-gray-700 dark:text-white/80 mb-1.5">
                            Project Overview &amp; Description *
                        </label>
                        <textarea
                            rows="5"
                            value={overview}
                            onChange={(e) => setOverview(e.target.value)}
                            placeholder="Describe what the project does, key features, architecture, and problems it solves..."
                            className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-white/15 bg-gray-50 dark:bg-white/5 text-gray-900 dark:text-white text-sm outline-none focus:border-sky-500 leading-relaxed"
                            required
                        ></textarea>
                    </div>

                    {/* Links & Metadata */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 pt-2">
                        <div>
                            <label className="block text-xs font-semibold uppercase tracking-wider text-gray-700 dark:text-white/80 mb-1.5">
                                Year
                            </label>
                            <input
                                type="text"
                                value={year}
                                onChange={(e) => setYear(e.target.value)}
                                placeholder="2026"
                                className="w-full px-4 py-2.5 rounded-xl border border-gray-300 dark:border-white/15 bg-gray-50 dark:bg-white/5 text-gray-900 dark:text-white text-sm outline-none focus:border-sky-500"
                            />
                        </div>

                        <div>
                            <label className="block text-xs font-semibold uppercase tracking-wider text-gray-700 dark:text-white/80 mb-1.5">
                                GitHub Repository URL
                            </label>
                            <input
                                type="url"
                                value={github}
                                onChange={(e) => setGithub(e.target.value)}
                                placeholder="https://github.com/melan-Akash/..."
                                className="w-full px-4 py-2.5 rounded-xl border border-gray-300 dark:border-white/15 bg-gray-50 dark:bg-white/5 text-gray-900 dark:text-white text-sm outline-none focus:border-sky-500"
                            />
                        </div>

                        <div>
                            <label className="block text-xs font-semibold uppercase tracking-wider text-gray-700 dark:text-white/80 mb-1.5">
                                Live Demo URL (Optional)
                            </label>
                            <input
                                type="url"
                                value={live}
                                onChange={(e) => setLive(e.target.value)}
                                placeholder="https://myproject.vercel.app"
                                className="w-full px-4 py-2.5 rounded-xl border border-gray-300 dark:border-white/15 bg-gray-50 dark:bg-white/5 text-gray-900 dark:text-white text-sm outline-none focus:border-sky-500"
                            />
                        </div>
                    </div>
                </div>

                {/* Submit Action */}
                <div className="flex items-center justify-end gap-4">
                    <button
                        type="submit"
                        disabled={loading}
                        className="px-8 py-3.5 rounded-xl bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-600 hover:to-blue-700 text-white font-medium text-sm shadow-lg shadow-sky-500/25 active:scale-95 transition-all cursor-pointer flex items-center gap-2"
                    >
                        {loading ? (
                            <>
                                <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                                Saving Project...
                            </>
                        ) : (
                            <>
                                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                                </svg>
                                Publish to Portfolio
                            </>
                        )}
                    </button>
                </div>
            </form>
        </div>
    );
}
