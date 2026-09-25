import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import navLogoLight from '../assests/logo_for_navbar_lightmood.png';
import navLogoDark from '../assests/logo_for_navbar_darkmood.png';

export default function Login() {
    const navigate = useNavigate();
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const authData = localStorage.getItem('melan_admin_auth');
        if (authData) {
            try {
                const parsed = JSON.parse(authData);
                if (parsed?.token) {
                    navigate('/admin', { replace: true });
                }
            } catch {
                localStorage.removeItem('melan_admin_auth');
            }
        }
    }, [navigate]);

    const handleLogin = async (e) => {
        e.preventDefault();
        setError('');

        if (!username.trim() || !password.trim()) {
            const msg = 'Please enter both your admin username/email and password.';
            setError(msg);
            toast.error(msg);
            return;
        }

        setLoading(true);
        const toastId = toast.loading('Verifying admin credentials...');

        try {
            const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

            // Attempt strict backend authentication against .env credentials
            const res = await fetch(`${apiUrl}/auth/login`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username: username.trim(), password: password.trim() })
            }).then(r => r.json()).catch(() => null);

            if (res && res.success && res.token) {
                localStorage.setItem('melan_admin_auth', JSON.stringify({
                    token: res.token,
                    user: res.user
                }));
                toast.success('Welcome back, Melan!', { id: toastId });
                navigate('/admin', { replace: true });
                return;
            }

            const errorMsg = res?.message || 'Access Denied: Invalid admin username or password.';
            setError(errorMsg);
            toast.error(errorMsg, { id: toastId });
        } catch {
            const errorMsg = 'Unable to connect to backend server. Make sure server is running on port 5000.';
            setError(errorMsg);
            toast.error(errorMsg, { id: toastId });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-slate-100 dark:bg-darkTheme px-4 py-12 transition-colors duration-300 font-Outfit">
            <div className="w-full max-w-md bg-white dark:bg-[#0c182d] border border-gray-200 dark:border-white/10 rounded-2xl shadow-xl p-8 sm:p-10 relative overflow-hidden">
                {/* Background glow accent */}
                <div className="absolute -top-24 -right-24 w-48 h-48 bg-sky-500/10 rounded-full blur-3xl pointer-events-none"></div>
                <div className="absolute -bottom-24 -left-24 w-48 h-48 bg-blue-500/10 rounded-full blur-3xl pointer-events-none"></div>

                {/* Header with Logo */}
                <div className="text-center mb-8">
                    <Link to="/" className="inline-block mb-4">
                        <img src={navLogoLight} alt="Melan Akash" className="w-28 mx-auto dark:hidden" />
                        <img src={navLogoDark} alt="Melan Akash" className="w-28 mx-auto hidden dark:block" />
                    </Link>
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Admin Access</h2>
                    <p className="text-xs sm:text-sm text-gray-500 dark:text-white/60 mt-1">
                        Enter your authorized administrator credentials to continue.
                    </p>
                </div>

                {/* Error Banner */}
                {error && (
                    <div className="mb-6 p-3 rounded-lg bg-red-500/10 border border-red-500/30 text-red-600 dark:text-red-400 text-xs sm:text-sm text-center">
                        {error}
                    </div>
                )}

                {/* Form */}
                <form onSubmit={handleLogin} className="space-y-5">
                    <div>
                        <label className="block text-xs font-semibold uppercase tracking-wider text-gray-700 dark:text-white/80 mb-1.5">
                            Admin Username or Email
                        </label>
                        <input
                            type="text"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            className="w-full px-4 py-2.5 rounded-xl border border-gray-300 dark:border-white/15 bg-gray-50 dark:bg-white/5 text-gray-900 dark:text-white text-sm outline-none focus:border-sky-500 transition-colors"
                            placeholder="Enter username or email"
                            autoComplete="username"
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-xs font-semibold uppercase tracking-wider text-gray-700 dark:text-white/80 mb-1.5">
                            Admin Password
                        </label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full px-4 py-2.5 rounded-xl border border-gray-300 dark:border-white/15 bg-gray-50 dark:bg-white/5 text-gray-900 dark:text-white text-sm outline-none focus:border-sky-500 transition-colors"
                            placeholder="Enter password"
                            autoComplete="current-password"
                            required
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-600 hover:to-blue-700 text-white font-medium text-sm shadow-lg shadow-sky-500/20 active:scale-[0.98] transition-all cursor-pointer flex items-center justify-center gap-2"
                    >
                        {loading ? (
                            <>
                                <span className="inline-block w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                                Verifying Credentials...
                            </>
                        ) : (
                            'Sign In to Dashboard'
                        )}
                    </button>
                </form>

                {/* Footer Link */}
                <div className="mt-8 text-center pt-6 border-t border-gray-200 dark:border-white/10">
                    <Link
                        to="/"
                        className="text-xs text-gray-500 dark:text-white/60 hover:text-sky-500 dark:hover:text-sky-400 transition-colors inline-flex items-center gap-1.5"
                    >
                        ← Back to Melan Akash Portfolio
                    </Link>
                </div>
            </div>
        </div>
    );
}
