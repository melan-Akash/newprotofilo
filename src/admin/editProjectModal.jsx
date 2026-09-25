import { useState, useEffect } from 'react';
import { getAuthHeaders } from '../utils/auth';

export default function EditProjectModal({ project, isOpen, onClose, onProjectUpdated }) {
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [overview, setOverview] = useState('');
    const [tech, setTech] = useState('');
    const [year, setYear] = useState('2026');
    const [github, setGithub] = useState('');
    const [live, setLive] = useState('');

    // 4 Project Image slots
    const [images, setImages] = useState(['', '', '', '']);
    const [imageFiles, setImageFiles] = useState([null, null, null, null]);

    const [loading, setLoading] = useState(false);
    const [errorMsg, setErrorMsg] = useState('');
    const [successMsg, setSuccessMsg] = useState('');

    useEffect(() => {
        if (project) {
            setName(project.name || '');
            setDescription(project.description || '');
            setOverview(project.overview || project.description || '');
            setTech(project.tech || '');
            setYear(project.year || new Date().getFullYear().toString());
            setGithub(project.github || '');
            setLive(project.live || '');

            // Prepare 4 image slots
            const currentImgs = Array.isArray(project.images) && project.images.length > 0
                ? project.images
                : [project.image || './assets/work-1.png'];

            const slots = ['', '', '', ''];
            for (let i = 0; i < 4; i++) {
                slots[i] = currentImgs[i] || '';
            }
            setImages(slots);
            setImageFiles([null, null, null, null]);
            setErrorMsg('');
            setSuccessMsg('');
        }
    }, [project]);

    if (!isOpen || !project) return null;

    // Handle selecting a new file for a slot
    const handleFileChange = (index, file) => {
        if (!file) return;
        const newFiles = [...imageFiles];
        newFiles[index] = file;
        setImageFiles(newFiles);

        // Instant local preview
        const reader = new FileReader();
        reader.onload = () => {
            const newImages = [...images];
            newImages[index] = reader.result;
            setImages(newImages);
        };
        reader.readAsDataURL(file);
    };

    // Remove an image slot
    const handleRemoveImage = (index) => {
        const newImages = [...images];
        const newFiles = [...imageFiles];
        newImages[index] = '';
        newFiles[index] = null;
        setImages(newImages);
        setImageFiles(newFiles);
    };

    const handleSave = async (e) => {
        e.preventDefault();
        setErrorMsg('');
        setSuccessMsg('');

        if (!name.trim()) {
            setErrorMsg('Project name is required');
            return;
        }

        setLoading(true);

        try {
            const formData = new FormData();
            formData.append('name', name.trim());
            formData.append('description', description.trim());
            formData.append('overview', overview.trim() || description.trim());
            formData.append('tech', tech.trim());
            formData.append('year', year.trim());
            formData.append('github', github.trim());
            formData.append('live', live.trim());

            // Only pass URL strings (not huge base64 data URLs) in the text images field
            const externalOrAssetUrls = images.filter(img => img && !img.startsWith('data:image'));
            formData.append('images', JSON.stringify(externalOrAssetUrls));

            // Append any newly selected File objects for Cloudinary upload
            imageFiles.forEach((file) => {
                if (file) {
                    formData.append('imageFiles', file);
                }
            });

            const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
            const projectId = project._id || project.id;

            const response = await fetch(`${apiUrl}/projects/${projectId}`, {
                method: 'PUT',
                headers: getAuthHeaders(),
                body: formData
            });

            const responseText = await response.text();
            let res;
            try {
                res = JSON.parse(responseText);
            } catch {
                throw new Error(`Server returned error (${response.status}): ${responseText.slice(0, 120)}`);
            }

            if (!response.ok || !res || !res.success) {
                throw new Error(res?.message || `Failed to update project (HTTP ${response.status})`);
            }

            const updatedProject = res.project || {
                ...project,
                name,
                description,
                overview,
                tech,
                year,
                github,
                live,
                images: images.filter(Boolean),
                image: images[0] || './assets/work-1.png'
            };

            // Update local storage cache
            try {
                const localCustom = JSON.parse(localStorage.getItem('melan_custom_projects') || '[]');
                const idx = localCustom.findIndex(p => (p._id === projectId || p.id === projectId));
                if (idx !== -1) {
                    localCustom[idx] = updatedProject;
                } else {
                    localCustom.unshift(updatedProject);
                }
                localStorage.setItem('melan_custom_projects', JSON.stringify(localCustom));
            } catch {
                // Ignore storage quota
            }

            setSuccessMsg('Project updated successfully!');
            if (onProjectUpdated) {
                onProjectUpdated(updatedProject);
            }

            setTimeout(() => {
                onClose();
            }, 800);
        } catch (err) {
            setErrorMsg(err.message || 'Failed to update project. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
            <div
                className="bg-white dark:bg-[#0c182d] border border-gray-200 dark:border-white/15 rounded-3xl max-w-3xl w-full max-h-[92vh] overflow-y-auto p-6 sm:p-8 shadow-2xl relative font-Outfit"
                onClick={(e) => e.stopPropagation()}
            >
                {/* Header */}
                <div className="flex items-center justify-between pb-4 border-b border-gray-200 dark:border-white/10 mb-6">
                    <div>
                        <span className="text-xs uppercase tracking-wider font-semibold text-sky-500 bg-sky-500/10 px-2.5 py-1 rounded-md">
                            Edit Project
                        </span>
                        <h2 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white mt-1">
                            {name || 'Edit Portfolio Project'}
                        </h2>
                    </div>
                    <button
                        onClick={onClose}
                        className="w-9 h-9 rounded-full bg-gray-100 dark:bg-white/10 text-gray-600 dark:text-white hover:bg-gray-200 dark:hover:bg-white/20 flex items-center justify-center text-sm transition"
                    >
                        ✕
                    </button>
                </div>

                {/* Notifications */}
                {successMsg && (
                    <div className="mb-4 p-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-600 dark:text-emerald-400 text-xs font-semibold flex items-center justify-between">
                        <span>✓ {successMsg}</span>
                    </div>
                )}
                {errorMsg && (
                    <div className="mb-4 p-3.5 rounded-xl bg-red-500/10 border border-red-500/30 text-red-600 dark:text-red-400 text-xs font-semibold flex items-center justify-between">
                        <span>✕ {errorMsg}</span>
                        <button onClick={() => setErrorMsg('')} className="font-bold">×</button>
                    </div>
                )}

                <form onSubmit={handleSave} className="space-y-6">
                    {/* 4 Project Images Showcase */}
                    <div className="bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-2xl p-5">
                        <div className="flex items-center justify-between mb-3">
                            <h3 className="text-xs font-bold uppercase tracking-wider text-gray-700 dark:text-white/80">
                                Project Images (4 Slots)
                            </h3>
                            <span className="text-[11px] text-gray-400">Click slot to upload new image to Cloudinary</span>
                        </div>

                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                            {images.map((img, index) => (
                                <div
                                    key={index}
                                    className="border border-dashed border-gray-300 dark:border-white/20 rounded-xl p-2.5 bg-white dark:bg-[#071120] flex flex-col items-center justify-between relative group hover:border-sky-500 transition-colors"
                                >
                                    <div className="w-full aspect-[4/3] rounded-lg overflow-hidden bg-gray-100 dark:bg-white/5 relative mb-2 flex items-center justify-center">
                                        {img ? (
                                            <>
                                                <img
                                                    src={img}
                                                    alt={`Slot ${index + 1}`}
                                                    className="w-full h-full object-cover object-top"
                                                />
                                                <button
                                                    type="button"
                                                    onClick={() => handleRemoveImage(index)}
                                                    className="absolute top-1 right-1 w-6 h-6 rounded-full bg-red-500 text-white text-xs flex items-center justify-center opacity-80 hover:opacity-100 shadow transition"
                                                    title="Remove Image"
                                                >
                                                    ✕
                                                </button>
                                                {imageFiles[index] && (
                                                    <span className="absolute bottom-1 left-1 bg-sky-500 text-white text-[9px] px-1.5 py-0.5 rounded font-bold">
                                                        New File
                                                    </span>
                                                )}
                                            </>
                                        ) : (
                                            <div className="text-center p-2 text-gray-400">
                                                <svg className="w-6 h-6 mx-auto mb-1 opacity-50" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                                </svg>
                                                <span className="text-[10px]">Empty Slot</span>
                                            </div>
                                        )}
                                    </div>

                                    <span className="text-[10px] font-semibold text-gray-500 dark:text-white/60 mb-2">
                                        {index === 0 ? 'Main Cover' : `Screenshot ${index}`}
                                    </span>

                                    <label className="w-full text-center py-1.5 px-2 rounded-lg bg-sky-500/10 hover:bg-sky-500/20 text-sky-600 dark:text-sky-400 border border-sky-500/30 text-[11px] font-semibold cursor-pointer transition">
                                        Upload Image
                                        <input
                                            type="file"
                                            accept="image/*"
                                            className="hidden"
                                            onChange={(e) => handleFileChange(index, e.target.files[0])}
                                        />
                                    </label>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Details Form Grid */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-xs font-semibold uppercase tracking-wider text-gray-700 dark:text-white/80 mb-1.5">
                                Project Name *
                            </label>
                            <input
                                type="text"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 dark:border-white/15 bg-white dark:bg-white/5 text-gray-900 dark:text-white text-sm outline-none focus:border-sky-500 transition-colors"
                                required
                            />
                        </div>

                        <div>
                            <label className="block text-xs font-semibold uppercase tracking-wider text-gray-700 dark:text-white/80 mb-1.5">
                                Short Subtitle / Tagline
                            </label>
                            <input
                                type="text"
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 dark:border-white/15 bg-white dark:bg-white/5 text-gray-900 dark:text-white text-sm outline-none focus:border-sky-500 transition-colors"
                            />
                        </div>

                        <div className="sm:col-span-2">
                            <label className="block text-xs font-semibold uppercase tracking-wider text-gray-700 dark:text-white/80 mb-1.5">
                                Detailed Overview / Summary
                            </label>
                            <textarea
                                rows={3}
                                value={overview}
                                onChange={(e) => setOverview(e.target.value)}
                                className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 dark:border-white/15 bg-white dark:bg-white/5 text-gray-900 dark:text-white text-sm outline-none focus:border-sky-500 transition-colors"
                            />
                        </div>

                        <div>
                            <label className="block text-xs font-semibold uppercase tracking-wider text-gray-700 dark:text-white/80 mb-1.5">
                                Tech Stack
                            </label>
                            <input
                                type="text"
                                value={tech}
                                onChange={(e) => setTech(e.target.value)}
                                placeholder="React · Node.js · Express · AI"
                                className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 dark:border-white/15 bg-white dark:bg-white/5 text-gray-900 dark:text-white text-sm outline-none focus:border-sky-500 transition-colors"
                            />
                        </div>

                        <div>
                            <label className="block text-xs font-semibold uppercase tracking-wider text-gray-700 dark:text-white/80 mb-1.5">
                                Year
                            </label>
                            <input
                                type="text"
                                value={year}
                                onChange={(e) => setYear(e.target.value)}
                                className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 dark:border-white/15 bg-white dark:bg-white/5 text-gray-900 dark:text-white text-sm outline-none focus:border-sky-500 transition-colors"
                            />
                        </div>

                        <div>
                            <label className="block text-xs font-semibold uppercase tracking-wider text-gray-700 dark:text-white/80 mb-1.5">
                                Live Demo URL
                            </label>
                            <input
                                type="url"
                                value={live}
                                onChange={(e) => setLive(e.target.value)}
                                placeholder="https://example.vercel.app"
                                className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 dark:border-white/15 bg-white dark:bg-white/5 text-gray-900 dark:text-white text-sm outline-none focus:border-sky-500 transition-colors"
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
                                className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 dark:border-white/15 bg-white dark:bg-white/5 text-gray-900 dark:text-white text-sm outline-none focus:border-sky-500 transition-colors"
                            />
                        </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-200 dark:border-white/10">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-5 py-2.5 rounded-xl border border-gray-300 dark:border-white/15 text-gray-700 dark:text-white hover:bg-gray-100 dark:hover:bg-white/5 text-xs font-semibold transition"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={loading}
                            className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-600 hover:to-blue-700 text-white text-xs font-semibold shadow-md shadow-sky-500/20 disabled:opacity-50 transition flex items-center gap-2"
                        >
                            {loading ? (
                                <>
                                    <svg className="animate-spin w-4 h-4 text-white" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                    Saving to Cloudinary & Atlas...
                                </>
                            ) : (
                                'Save Changes'
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
