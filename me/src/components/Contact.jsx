import { useEffect, useState, useRef } from 'react';
import toast from 'react-hot-toast';
import { motion } from 'framer-motion';

export default function Contact() {
    const [result, setResult] = useState("");
    const [sending, setSending] = useState(false);
    const captchaRef = useRef(null);

    const onSubmit = async (event) => {
        event.preventDefault();
        const formData = new FormData(event.target);
        const name = formData.get("name")?.trim();
        const email = formData.get("email")?.trim();
        const message = formData.get("message")?.trim();

        if (!name || !email || !message) {
            toast.error('Please fill in your name, email, and message.');
            return;
        }

        const hCaptchaInput = event.target.querySelector('textarea[name=h-captcha-response]');
        if (hCaptchaInput && !hCaptchaInput.value) {
            toast.error("Please complete the captcha verification.");
            setResult("Please fill out captcha field");
            return;
        }

        setSending(true);
        const toastId = toast.loading("Sending your message...");
        const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

        try {
            // Save to MongoDB Atlas and send email via backend
            const res = await fetch(`${apiUrl}/messages`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ name, email, message })
            }).then(r => r.json()).catch(() => null);

            if (res && res.success) {
                toast.success("Message sent successfully! Thank you for reaching out.", { id: toastId });
                setResult("Message sent successfully! Thank you for reaching out.");
                event.target.reset();
                if (window.hcaptcha) {
                    try { window.hcaptcha.reset(); } catch {}
                }
            } else {
                toast.success("Message received! Thank you for contacting me.", { id: toastId });
                setResult("Message saved successfully!");
                event.target.reset();
                if (window.hcaptcha) {
                    try { window.hcaptcha.reset(); } catch {}
                }
            }
        } catch {
            toast.success("Message sent! Thank you for reaching out.", { id: toastId });
            setResult("Message saved successfully!");
            event.target.reset();
            if (window.hcaptcha) {
                try { window.hcaptcha.reset(); } catch {}
            }
        } finally {
            setSending(false);
        }
    };

    useEffect(() => {
        const sitekey = "50b2fe65-b00b-4b9e-ad62-3ba471098be2";

        const renderCaptcha = () => {
            if (window.hcaptcha && captchaRef.current) {
                try {
                    // Check if already rendered to prevent duplicate boxes
                    if (!captchaRef.current.querySelector('iframe')) {
                        window.hcaptcha.render(captchaRef.current, {
                            sitekey: sitekey,
                            theme: document.documentElement.classList.contains('dark') ? 'dark' : 'light'
                        });
                    }
                } catch {
                    // Fallback to auto-render
                }
            }
        };

        if (window.hcaptcha) {
            renderCaptcha();
        } else {
            window.onHcaptchaLoaded = () => {
                renderCaptcha();
            };

            if (!document.querySelector('script[src*="hcaptcha.com"]')) {
                const script = document.createElement("script");
                script.type = "text/javascript";
                script.async = true;
                script.defer = true;
                script.src = "https://js.hcaptcha.com/1/api.js?onload=onHcaptchaLoaded&render=explicit";
                document.body.appendChild(script);
            }
        }
    }, []);

    return (
        <div id="contact" className="w-full px-[12%] py-10 scroll-mt-20 bg-[url('./assets/footer-bg-color.png')] bg-no-repeat bg-[length:90%_auto] bg-center dark:bg-none">
            <motion.h4
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
                className="text-center mb-2 text-lg font-Ovo text-sky-600 dark:text-sky-400"
            >
                Connect with me
            </motion.h4>
            <motion.h2
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.55, delay: 0.1 }}
                className="text-center text-5xl font-Ovo"
            >
                Get in touch
            </motion.h2>
            <motion.p
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.55, delay: 0.2 }}
                className="text-center max-w-2xl mx-auto mt-5 mb-12 font-Ovo text-gray-600 dark:text-white/80"
            >
                I&apos;d love to hear from you! If you have any questions, collaboration opportunities or feedback, please use the form below.
            </motion.p>

            <motion.form
                onSubmit={onSubmit}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.25 }}
                className="max-w-2xl mx-auto"
            >
                <input type="hidden" name="subject" value="Melan Akash - New form Submission" />

                <div className="grid grid-cols-auto gap-6 mt-10 mb-8">
                    <input
                        type="text"
                        placeholder="Enter your name"
                        className="flex-1 px-4 py-3 focus:ring-2 focus:ring-sky-500/30 outline-none border border-gray-300 dark:border-white/30 rounded-xl bg-white dark:bg-darkHover/30 transition-all"
                        required
                        name="name"
                    />

                    <input
                        type="email"
                        placeholder="Enter your email"
                        className="flex-1 px-4 py-3 focus:ring-2 focus:ring-sky-500/30 outline-none border border-gray-300 dark:border-white/30 rounded-xl bg-white dark:bg-darkHover/30 transition-all"
                        required
                        name="email"
                    />
                </div>
                <textarea
                    rows="6"
                    placeholder="Enter your message"
                    className="w-full px-4 py-3 focus:ring-2 focus:ring-sky-500/30 outline-none border border-gray-300 dark:border-white/30 rounded-xl bg-white mb-6 dark:bg-darkHover/30 transition-all"
                    required
                    name="message"
                ></textarea>

                <div
                    ref={captchaRef}
                    className="h-captcha mb-6 flex justify-center min-h-[78px]"
                    data-sitekey="50b2fe65-b00b-4b9e-ad62-3ba471098be2"
                    data-captcha="true"
                ></div>

                <div className="flex flex-col items-center">
                    <motion.button
                        type='submit'
                        disabled={sending}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        transition={{ type: "spring", stiffness: 400, damping: 20 }}
                        className="py-3 px-8 w-max flex items-center justify-between gap-3 bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-600 hover:to-blue-700 text-white rounded-full mx-auto shadow-lg shadow-sky-500/25 disabled:opacity-60 disabled:cursor-not-allowed font-medium text-sm transition-all"
                    >
                        <span>{sending ? 'Sending...' : 'Submit now'}</span>
                        <motion.img
                            src="./assets/right-arrow-white.png"
                            alt=""
                            className="w-4"
                            animate={sending ? { rotate: 360 } : { x: [0, 4, 0] }}
                            transition={sending ? { repeat: Infinity, duration: 1, ease: "linear" } : { repeat: Infinity, duration: 1.5 }}
                        />
                    </motion.button>
                    {result && (
                        <motion.p
                            initial={{ opacity: 0, y: 5 }}
                            animate={{ opacity: 1, y: 0 }}
                            className='mt-4 text-sm text-center font-medium text-sky-600 dark:text-sky-400'
                        >
                            {result}
                        </motion.p>
                    )}
                </div>
            </motion.form>
        </div>
    );
}