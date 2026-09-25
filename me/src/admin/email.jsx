import { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import { getAuthHeaders } from '../utils/auth';

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
                const res = await fetch(`${apiUrl}/messages`, {
                    headers: getAuthHeaders()
                }).then(r => r.json());
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

    const handleDelete = async (id) => {
        if (!id) return;
        const updated = messages.filter(m => (m.id !== id && m._id !== id));
        setMessages(updated);
        localStorage.setItem('melan_contact_messages', JSON.stringify(updated));
        toast.success('Inquiry deleted.');

        try {
            const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
            await fetch(`${apiUrl}/messages/${id}`, {
                method: 'DELETE',
                headers: getAuthHeaders()
            });
        } catch {
            // Ignore server network errors
        }
    };

    const [replyModal, setReplyModal] = useState(null); // active message to reply to
    const [replyText, setReplyText] = useState("");
    const [replySubject, setReplySubject] = useState("");
    const [sendingReply, setSendingReply] = useState(false);

    const openReplyModal = (item) => {
        setReplyModal(item);
        setReplySubject(`Re: Inquiry from ${item.name} - Melan Akash Portfolio`);
        setReplyText(`Hi ${item.name},\n\nThank you for reaching out! I would love to connect with you regarding this.\n\nBest regards,\nMelan Akash`);
    };

    const handleSendReply = async (e) => {
        e.preventDefault();
        if (!replyText.trim() || !replyModal) return;

        setSendingReply(true);
        const toastId = toast.loading("Sending email reply...");
        const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

        try {
            const res = await fetch(`${apiUrl}/messages/reply`, {
                method: 'POST',
                headers: {
                    ...getAuthHeaders(),
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    to: replyModal.email,
                    subject: replySubject,
                    replyText: replyText.trim(),
                    originalMessage: replyModal.message
                })
            }).then(r => r.json());

            if (res && res.success) {
                toast.success(`Reply sent to ${replyModal.email}!`, { id: toastId });
                setReplyModal(null);
            } else {
                toast.error(res?.message || "Failed to send email. Check backend settings.", { id: toastId });
            }
        } catch (err) {
            toast.error("Network error while sending email reply.", { id: toastId });
        } finally {
            setSendingReply(false);
        }
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
                            key={item._id || item.id}
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
                                        onClick={() => handleDelete(item._id || item.id)}
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
                            <div className="mt-4 flex items-center justify-end gap-2.5">
                                <a
                                    href={`mailto:${item.email}?subject=Re: Portfolio Inquiry`}
                                    className="px-3.5 py-1.5 rounded-lg border border-gray-300 dark:border-white/20 text-gray-700 dark:text-white/80 text-xs font-medium hover:bg-gray-100 dark:hover:bg-white/10 transition"
                                >
                                    Open Email App ↗
                                </a>
                                <button
                                    onClick={() => openReplyModal(item)}
                                    className="px-4 py-1.5 rounded-lg bg-gradient-to-r from-sky-500 to-blue-600 text-white text-xs font-medium hover:from-sky-600 hover:to-blue-700 transition shadow-sm"
                                >
                                    Direct Reply →
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Quick Reply Modal */}
            {replyModal && (
                <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
                    <div className="bg-white dark:bg-[#0c182d] border border-gray-200 dark:border-white/15 rounded-3xl max-w-lg w-full p-6 shadow-2xl space-y-4">
                        <div className="flex items-center justify-between border-b border-gray-100 dark:border-white/10 pb-3">
                            <div>
                                <h3 className="font-bold text-base text-gray-900 dark:text-white">Reply to {replyModal.name}</h3>
                                <p className="text-xs text-gray-500 dark:text-white/60">{replyModal.email}</p>
                            </div>
                            <button
                                onClick={() => setReplyModal(null)}
                                className="w-8 h-8 rounded-full bg-gray-100 dark:bg-white/10 text-gray-500 hover:bg-gray-200 flex items-center justify-center"
                            >
                                ✕
                            </button>
                        </div>

                        <form onSubmit={handleSendReply} className="space-y-4">
                            <div>
                                <label className="block text-xs font-semibold text-gray-700 dark:text-white/80 mb-1">Subject</label>
                                <input
                                    type="text"
                                    value={replySubject}
                                    onChange={(e) => setReplySubject(e.target.value)}
                                    className="w-full px-3.5 py-2 text-xs rounded-xl border border-gray-300 dark:border-white/20 bg-white dark:bg-darkHover/40 outline-none focus:ring-2 focus:ring-sky-500/30"
                                    required
                                />
                            </div>

                            <div>
                                <label className="block text-xs font-semibold text-gray-700 dark:text-white/80 mb-1">Reply Message</label>
                                <textarea
                                    rows="6"
                                    value={replyText}
                                    onChange={(e) => setReplyText(e.target.value)}
                                    className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-gray-300 dark:border-white/20 bg-white dark:bg-darkHover/40 outline-none focus:ring-2 focus:ring-sky-500/30 font-Outfit leading-relaxed"
                                    required
                                ></textarea>
                            </div>

                            <div className="p-3 rounded-xl bg-gray-50 dark:bg-white/5 border border-gray-100 dark:border-white/5 text-[11px] text-gray-500 dark:text-white/60 max-h-20 overflow-y-auto">
                                <span className="font-semibold text-gray-700 dark:text-white/80">Original Message: </span>
                                {replyModal.message}
                            </div>

                            <div className="flex items-center justify-end gap-2.5 pt-2">
                                <button
                                    type="button"
                                    onClick={() => setReplyModal(null)}
                                    className="px-4 py-2 rounded-full border border-gray-300 dark:border-white/20 text-xs font-medium text-gray-600 dark:text-white/70 hover:bg-gray-100 dark:hover:bg-white/10"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={sendingReply}
                                    className="px-6 py-2 rounded-full bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-600 hover:to-blue-700 text-white text-xs font-semibold shadow-md shadow-sky-500/25 disabled:opacity-60"
                                >
                                    {sendingReply ? 'Sending...' : 'Send Email Reply →'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
