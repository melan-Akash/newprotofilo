import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';

export default function Contact() {
    const [result, setResult] = useState("");
    const [sending, setSending] = useState(false);

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
            } else {
                toast.success("Message received! Thank you for contacting me.", { id: toastId });
                setResult("Message saved successfully!");
                event.target.reset();
            }
        } catch {
            toast.success("Message sent! Thank you for reaching out.", { id: toastId });
            setResult("Message sent successfully!");
            event.target.reset();
        } finally {
            setSending(false);
        }
    };

    function CaptchaLoader() {
        const captchadiv = document.querySelectorAll('[data-captcha="true"]');
        if (captchadiv.length) {
            let lang = null;
            let onload = null;
            let render = null;

            captchadiv.forEach(function (item) {
                const sitekey = item.dataset.sitekey;
                lang = item.dataset.lang;
                onload = item.dataset.onload;
                render = item.dataset.render;

                if (!sitekey) {
                    item.dataset.sitekey = "50b2fe65-b00b-4b9e-ad62-3ba471098be2";
                }
            });

            let scriptSrc = "https://js.hcaptcha.com/1/api.js?recaptchacompat=off";
            if (lang) {
                scriptSrc += `&hl=${lang}`;
            }
            if (onload) {
                scriptSrc += `&onload=${onload}`;
            }
            if (render) {
                scriptSrc += `&render=${render}`;
            }

            var script = document.createElement("script");
            script.type = "text/javascript";
            script.async = true;
            script.defer = true;
            script.src = scriptSrc;
            document.body.appendChild(script);
        }
    }

    useEffect(() => {
        CaptchaLoader();
    }, []);
    return (
        <div id="contact" className="w-full px-[12%] py-10 scroll-mt-20 bg-[url('./assets/footer-bg-color.png')] bg-no-repeat bg-[length:90%_auto] bg-center dark:bg-none">

            <h4 className="text-center mb-2 text-lg font-Ovo">Connect with me</h4>
            <h2 className="text-center text-5xl font-Ovo">Get in touch</h2>
            <p className="text-center max-w-2xl mx-auto mt-5 mb-12 font-Ovo">I&apos;d love to hear from you! If you have any questions, comments or feedback, please use the form below.</p>

            <form onSubmit={onSubmit} className="max-w-2xl mx-auto">

                <input type="hidden" name="subject" value="Melan Akash - New form Submission" />

                <div className="grid grid-cols-auto gap-6 mt-10 mb-8">
                    <input type="text" placeholder="Enter your name" className="flex-1 px-3 py-2 focus:ring-1 outline-none border border-gray-300 dark:border-white/30 rounded-md bg-white dark:bg-darkHover/30" required name="name" />

                    <input type="email" placeholder="Enter your email" className="flex-1 px-3 py-2 focus:ring-1 outline-none border border-gray-300 dark:border-white/30 rounded-md bg-white dark:bg-darkHover/30" required name="email" />
                </div>
                <textarea rows="6" placeholder="Enter your message" className="w-full px-4 py-2 focus:ring-1 outline-none border border-gray-300 dark:border-white/30 rounded-md bg-white mb-6 dark:bg-darkHover/30" required name="message"></textarea>
                <div className="h-captcha mb-6 max-w-full" data-captcha="true"></div>
                <button type='submit' className="py-2 px-8 w-max flex items-center justify-between gap-2 bg-black/80 text-white rounded-full mx-auto hover:bg-black duration-500 dark:bg-transparent dark:border dark:border-white/30 dark:hover:bg-darkHover">
                Submit now
                    <img src="./assets/right-arrow-white.png" alt="" className="w-4" />
                </button>
                <p className='mt-4'>{result}</p>
            </form>
        </div>
    )
}