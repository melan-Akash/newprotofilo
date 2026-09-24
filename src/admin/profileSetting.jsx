import { useState, useEffect } from 'react';
import { useProfile } from '../context/ProfileContext';

export default function ProfileSetting() {
    const { profile, updateProfile, loading } = useProfile();

    const [name, setName] = useState('');
    const [role, setRole] = useState('');
    const [title, setTitle] = useState('');
    const [tagline, setTagline] = useState('');
    const [about, setAbout] = useState('');
    const [location, setLocation] = useState('');
    const [email, setEmail] = useState('');
    const [phone, setPhone] = useState('');
    const [resumeUrl, setResumeUrl] = useState('');
    const [github, setGithub] = useState('');
    const [linkedin, setLinkedin] = useState('');

    const [avatarPreview, setAvatarPreview] = useState('');
    const [avatarFile, setAvatarFile] = useState(null);

    const [statusMsg, setStatusMsg] = useState({ type: '', text: '' });
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        if (profile) {
            setName(profile.name || '');
            setRole(profile.role || '');
            setTitle(profile.title || '');
            setTagline(profile.tagline || '');
            setAbout(profile.about || '');
            setLocation(profile.location || '');
            setEmail(profile.email || '');
            setPhone(profile.phone || '');
            setResumeUrl(profile.resumeUrl || '');
            setGithub(profile.github || '');
            setLinkedin(profile.linkedin || '');
            setAvatarPreview(profile.avatar || './assets/melanakash.png');
        }
    }, [profile]);

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (!file) return;
        setAvatarFile(file);

        const reader = new FileReader();
        reader.onload = () => {
            setAvatarPreview(reader.result);
        };
        reader.readAsDataURL(file);
    };

    const handleSave = async (e) => {
        e.preventDefault();
        setSaving(true);
        setStatusMsg({ type: '', text: '' });

        try {
            const formData = new FormData();
            formData.append('name', name);
            formData.append('role', role);
            formData.append('title', title);
            formData.append('tagline', tagline);
            formData.append('about', about);
            formData.append('location', location);
            formData.append('email', email);
            formData.append('phone', phone);
            formData.append('resumeUrl', resumeUrl);
            formData.append('github', github);
            formData.append('linkedin', linkedin);

            if (avatarFile) {
                formData.append('avatarFile', avatarFile);
            } else if (avatarPreview) {
                formData.append('avatar', avatarPreview);
            }

            const res = await updateProfile(formData);
            if (res && res.success) {
                setStatusMsg({ type: 'success', text: 'Profile updated and saved to MongoDB Atlas & Cloudinary successfully!' });
            } else {
                setStatusMsg({ type: 'error', text: res?.error || 'Failed to update profile.' });
            }
        } catch (err) {
            setStatusMsg({ type: 'error', text: err.message || 'An error occurred.' });
        } finally {
            setSaving(false);
        }
    };

    return (
        <div className="max-w-4xl mx-auto font-Outfit">
            <div className="mb-8">
                <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">Profile Settings</h1>
                <p className="text-sm text-gray-500 dark:text-white/60 mt-1">
                    Manage your personal bio, role, contact information, and profile avatar stored in MongoDB.
                </p>
            </div>

            {statusMsg.text && (
                <div
                    className={`mb-6 p-4 rounded-xl text-sm flex items-center justify-between ${
                        statusMsg.type === 'success'
                            ? 'bg-emerald-500/10 border border-emerald-500/30 text-emerald-600 dark:text-emerald-400'
                            : 'bg-red-500/10 border border-red-500/30 text-red-600 dark:text-red-400'
                    }`}
                >
                    <span>{statusMsg.type === 'success' ? '✓' : '✕'} {statusMsg.text}</span>
                    <button onClick={() => setStatusMsg({ type: '', text: '' })} className="font-bold">×</button>
                </div>
            )}

            <form onSubmit={handleSave} className="space-y-6">
                {/* Avatar & Photo Card */}
                <div className="bg-white dark:bg-[#0c182d] border border-gray-200 dark:border-white/10 rounded-2xl p-6 shadow-sm">
                    <h2 className="text-base font-semibold text-gray-900 dark:text-white mb-4">Profile Avatar</h2>
                    <div className="flex flex-col sm:flex-row items-center gap-6">
                        <div className="relative group">
                            <img
                                src={avatarPreview || './assets/melanakash.png'}
                                alt="Avatar preview"
                                className="w-28 h-28 rounded-full object-cover border-2 border-sky-500 shadow-md"
                            />
                            {avatarFile && (
                                <span className="absolute bottom-0 right-0 bg-sky-500 text-white text-[10px] px-2 py-0.5 rounded-full font-bold">
                                    New
                                </span>
                            )}
                        </div>
                        <div className="flex-1 text-center sm:text-left">
                            <label className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-sky-500/10 hover:bg-sky-500/20 text-sky-600 dark:text-sky-400 border border-sky-500/30 text-xs font-semibold cursor-pointer transition">
                                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                                </svg>
                                Upload New Avatar to Cloudinary
                                <input type="file" accept="image/*" className="hidden" onChange={handleFileChange} />
                            </label>
                            <p className="text-xs text-gray-400 mt-2">
                                Recommended: Square PNG or JPG. Automatically uploaded to Cloudinary CDN.
                            </p>
                        </div>
                    </div>
                </div>

                {/* Identity Information */}
                <div className="bg-white dark:bg-[#0c182d] border border-gray-200 dark:border-white/10 rounded-2xl p-6 shadow-sm space-y-5">
                    <h2 className="text-base font-semibold text-gray-900 dark:text-white">Personal Information</h2>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                        <div>
                            <label className="block text-xs font-semibold uppercase tracking-wider text-gray-700 dark:text-white/80 mb-1.5">
                                Full Name *
                            </label>
                            <input
                                type="text"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                className="w-full px-4 py-2.5 rounded-xl border border-gray-300 dark:border-white/15 bg-gray-50 dark:bg-white/5 text-gray-900 dark:text-white text-sm outline-none focus:border-sky-500"
                                required
                            />
                        </div>

                        <div>
                            <label className="block text-xs font-semibold uppercase tracking-wider text-gray-700 dark:text-white/80 mb-1.5">
                                Role / Title *
                            </label>
                            <input
                                type="text"
                                value={role}
                                onChange={(e) => setRole(e.target.value)}
                                placeholder="e.g. Associate Software Engineer / Full Stack Developer"
                                className="w-full px-4 py-2.5 rounded-xl border border-gray-300 dark:border-white/15 bg-gray-50 dark:bg-white/5 text-gray-900 dark:text-white text-sm outline-none focus:border-sky-500"
                                required
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-xs font-semibold uppercase tracking-wider text-gray-700 dark:text-white/80 mb-1.5">
                            Hero Tagline *
                        </label>
                        <input
                            type="text"
                            value={tagline}
                            onChange={(e) => setTagline(e.target.value)}
                            placeholder="e.g. full stack developer based in Sri Lanka."
                            className="w-full px-4 py-2.5 rounded-xl border border-gray-300 dark:border-white/15 bg-gray-50 dark:bg-white/5 text-gray-900 dark:text-white text-sm outline-none focus:border-sky-500"
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-xs font-semibold uppercase tracking-wider text-gray-700 dark:text-white/80 mb-1.5">
                            About Me / Professional Summary *
                        </label>
                        <textarea
                            rows="5"
                            value={about}
                            onChange={(e) => setAbout(e.target.value)}
                            className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-white/15 bg-gray-50 dark:bg-white/5 text-gray-900 dark:text-white text-sm outline-none focus:border-sky-500 leading-relaxed"
                            required
                        ></textarea>
                    </div>
                </div>

                {/* Contact & Social Links */}
                <div className="bg-white dark:bg-[#0c182d] border border-gray-200 dark:border-white/10 rounded-2xl p-6 shadow-sm space-y-5">
                    <h2 className="text-base font-semibold text-gray-900 dark:text-white">Contact &amp; Social Links</h2>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                        <div>
                            <label className="block text-xs font-semibold uppercase tracking-wider text-gray-700 dark:text-white/80 mb-1.5">
                                Email Address
                            </label>
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full px-4 py-2.5 rounded-xl border border-gray-300 dark:border-white/15 bg-gray-50 dark:bg-white/5 text-gray-900 dark:text-white text-sm outline-none focus:border-sky-500"
                            />
                        </div>

                        <div>
                            <label className="block text-xs font-semibold uppercase tracking-wider text-gray-700 dark:text-white/80 mb-1.5">
                                Phone Number
                            </label>
                            <input
                                type="text"
                                value={phone}
                                onChange={(e) => setPhone(e.target.value)}
                                className="w-full px-4 py-2.5 rounded-xl border border-gray-300 dark:border-white/15 bg-gray-50 dark:bg-white/5 text-gray-900 dark:text-white text-sm outline-none focus:border-sky-500"
                            />
                        </div>

                        <div>
                            <label className="block text-xs font-semibold uppercase tracking-wider text-gray-700 dark:text-white/80 mb-1.5">
                                Location
                            </label>
                            <input
                                type="text"
                                value={location}
                                onChange={(e) => setLocation(e.target.value)}
                                className="w-full px-4 py-2.5 rounded-xl border border-gray-300 dark:border-white/15 bg-gray-50 dark:bg-white/5 text-gray-900 dark:text-white text-sm outline-none focus:border-sky-500"
                            />
                        </div>

                        <div>
                            <label className="block text-xs font-semibold uppercase tracking-wider text-gray-700 dark:text-white/80 mb-1.5">
                                Resume / CV Download Link
                            </label>
                            <input
                                type="text"
                                value={resumeUrl}
                                onChange={(e) => setResumeUrl(e.target.value)}
                                placeholder="https://..."
                                className="w-full px-4 py-2.5 rounded-xl border border-gray-300 dark:border-white/15 bg-gray-50 dark:bg-white/5 text-gray-900 dark:text-white text-sm outline-none focus:border-sky-500"
                            />
                        </div>

                        <div>
                            <label className="block text-xs font-semibold uppercase tracking-wider text-gray-700 dark:text-white/80 mb-1.5">
                                GitHub Profile URL
                            </label>
                            <input
                                type="url"
                                value={github}
                                onChange={(e) => setGithub(e.target.value)}
                                className="w-full px-4 py-2.5 rounded-xl border border-gray-300 dark:border-white/15 bg-gray-50 dark:bg-white/5 text-gray-900 dark:text-white text-sm outline-none focus:border-sky-500"
                            />
                        </div>

                        <div>
                            <label className="block text-xs font-semibold uppercase tracking-wider text-gray-700 dark:text-white/80 mb-1.5">
                                LinkedIn Profile URL
                            </label>
                            <input
                                type="url"
                                value={linkedin}
                                onChange={(e) => setLinkedin(e.target.value)}
                                className="w-full px-4 py-2.5 rounded-xl border border-gray-300 dark:border-white/15 bg-gray-50 dark:bg-white/5 text-gray-900 dark:text-white text-sm outline-none focus:border-sky-500"
                            />
                        </div>
                    </div>
                </div>

                {/* Save Button */}
                <div className="flex justify-end">
                    <button
                        type="submit"
                        disabled={saving}
                        className="px-8 py-3.5 rounded-xl bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-600 hover:to-blue-700 text-white font-medium text-sm shadow-lg shadow-sky-500/25 active:scale-95 transition-all flex items-center gap-2 cursor-pointer"
                    >
                        {saving ? (
                            <>
                                <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                                Saving Profile to Database...
                            </>
                        ) : (
                            <>
                                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                                </svg>
                                Save &amp; Update Live Profile
                            </>
                        )}
                    </button>
                </div>
            </form>
        </div>
    );
}
