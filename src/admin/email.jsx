import { useState, useEffect } from 'react';

export default function EmailInbox() {
    const [messages, setMessages] = useState([]);
    const [loading, setLoading] = useState(true);

    const defaultMessages = [
        {
            id: 'm1',
            name: 'Kasun Perera',
            email: 'kasun.perera@gmail.com',
            message: 'Hi Melan, I loved your FindDine and AI site builder projects! Are you available for a freelance full-stack web application development role?',
            date: new Date(Date.now() - 3600000 * 24).toISOString()
        },
        {
            id: 'm2',
            name: 'Sarah Jenkins',
            email: 'sarah.j@techpartners.io',
            message: 'Hello Melan Akash, we reviewed your CV and GitHub portfolio for our Associate Software Engineer vacancy. Let us schedule an interview.',
            date: new Date(Date.now() - 3600000 * 48).toISOString()
        }
    ];

    useEffect(() => {
        const fetchMessages = async () => {
            const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
            try {
                const res = await fetch(`${apiUrl}/messages`).then(r => r.json());
                if (res && res.success && res.messages && res.messages.length > 0) {
                    setMessages(res.messages);
                } else {
                    const local = JSON.parse(localStorage.getItem('melan_contact_messages') || '[]');
                    setMessages(local.length > 0 ? local : defaultMessages);
                }
            } catch {
                const local = JSON.parse(localStorage.getItem('melan_contact_messages') || '[]');
                setMessages(local.length > 0 ? local : defaultMessages);
            } finally {
                setLoading(false);
            }
        };

        fetchMessages();
    }, []);

    const handleDelete = (id) => {
        const updated = messages.filter(m => m.id !== id);
        setMessages(updated);
        localStorage.setItem('melan_contact_messages', JSON.stringify(updated));
    };

    return (
        <div className="max-w-4xl mx-auto font-Outfit">
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">Contact Inquiries</h1>
                    <p className="text-sm text-gray-500 dark:text-white/60 mt-1">
                        Messages and work inquiries submitted from the website contact section.
                    </p>
                </div>
                <span className="px-3 py-1 text-xs font-semibold rounded-full bg-sky-500/10 text-sky-600 dark:text-sky-400 border border-sky-500/20">
                    {messages.length} Messages
                </span>
            </div>

            {loading ? (
                <div className="p-12 text-center text-gray-400">Loading messages...</div>
            ) : messages.length === 0 ? (
                <div className="p-12 bg-white dark:bg-[#0c182d] border border-gray-200 dark:border-white/10 rounded-2xl text-center">
                    <p className="text-gray-500 dark:text-white/60 text-sm">No inquiries received yet.</p>
                </div>
            ) : (
                <div className="space-y-4">
                    {messages.map((item) => (
                        <div
                            key={item.id}
                            className="bg-white dark:bg-[#0c182d] border border-gray-200 dark:border-white/10 rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow"
                        >
                            <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
                                <div>
                                    <h3 className="text-base font-semibold text-gray-900 dark:text-white">{item.name}</h3>
                                    <a
                                        href={`mailto:${item.email}`}
                                        className="text-xs text-sky-500 hover:underline"
                                    >
                                        {item.email}
                                    </a>
                                </div>
                                <div className="flex items-center gap-3">
                                    <span className="text-xs text-gray-400">
                                        {new Date(item.date).toLocaleDateString(undefined, {
                                            month: 'short',
                                            day: 'numeric',
                                            year: 'numeric'
                                        })}
                                    </span>
                                    <button
                                        onClick={() => handleDelete(item.id)}
                                        className="text-xs text-red-500 hover:text-red-700 p-1 rounded hover:bg-red-50 dark:hover:bg-red-500/10"
                                        title="Delete Message"
                                    >
                                        Delete
                                    </button>
                                </div>
                            </div>
                            <p className="text-sm text-gray-600 dark:text-white/70 leading-relaxed bg-gray-50 dark:bg-white/5 p-4 rounded-xl border border-gray-100 dark:border-white/5">
                                {item.message}
                            </p>
                            <div className="mt-4 flex justify-end">
                                <a
                                    href={`mailto:${item.email}?subject=Re: Portfolio Inquiry`}
                                    className="px-4 py-1.5 rounded-lg bg-sky-500 text-white text-xs font-medium hover:bg-sky-600 transition"
                                >
                                    Reply via Email →
                                </a>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
