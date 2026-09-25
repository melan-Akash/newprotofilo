import { motion } from 'framer-motion';

export default function Services() {
    const services = [
        {
            name: 'Full Stack Web Development',
            icon: './assets/web-icon.png',
            description: 'End-to-end web applications using MERN & PERN stacks, Spring Boot, and .NET — from frontend UI to backend REST APIs and database design.',
            link: '#work',
        },
        {
            name: 'Mobile App Development',
            icon: './assets/mobile-icon.png',
            description: 'Cross-platform mobile applications with React Native & Expo, including API integration, real-time features, and native device capabilities.',
            link: '#work',
        },
        {
            name: 'AI-Integrated Applications',
            icon: './assets/ui-icon.png',
            description: 'AI-powered features using OpenRouter, Vercel AI SDK, and LLM APIs — from AI chatbots and voice assistants to intelligent content generation.',
            link: '#work',
        },
        {
            name: 'UI/UX & Graphic Design',
            icon: './assets/graphics-icon.png',
            description: 'Clean, responsive, and modern user interfaces with Tailwind CSS and React — focused on user experience, accessibility, and visual appeal.',
            link: '#work',
        }
    ];

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.12,
            },
        },
    };

    const cardVariants = {
        hidden: { opacity: 0, y: 30 },
        visible: {
            opacity: 1,
            y: 0,
            transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] },
        },
    };

    return (
        <div id="services" className="w-full px-[12%] py-10 scroll-mt-20">
            <motion.h4
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
                className="text-center mb-2 text-lg font-Ovo text-sky-600 dark:text-sky-400"
            >
                What I offer
            </motion.h4>
            <motion.h2
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.55, delay: 0.1 }}
                className="text-center text-5xl font-Ovo"
            >
                My services
            </motion.h2>
            <motion.p
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.55, delay: 0.2 }}
                className="text-center max-w-2xl mx-auto mt-5 mb-12 font-Ovo text-gray-600 dark:text-white/80"
            >
                As a Full Stack Developer, I build modern, scalable web and mobile applications — from AI-powered tools to production-grade e-commerce platforms.
            </motion.p>

            <motion.div
                variants={containerVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "-50px" }}
                className="grid grid-cols-auto gap-6 my-10"
            >
                {services.map((service, index) => (
                    <motion.div
                        key={service.name}
                        variants={cardVariants}
                        whileHover={{ y: -8, scale: 1.02 }}
                        transition={{ type: "spring", stiffness: 350, damping: 25 }}
                        className="group border border-gray-300 dark:border-white/30 rounded-2xl px-8 py-12 hover:shadow-xl cursor-pointer hover:bg-lightHover duration-300 dark:hover:bg-darkHover dark:hover:shadow-sky-500/10 transition-colors"
                    >
                        <motion.div
                            whileHover={{ rotate: 10, scale: 1.15 }}
                            transition={{ type: "spring", stiffness: 400, damping: 15 }}
                            className="w-12 h-12 flex items-center justify-center rounded-xl bg-sky-500/10 dark:bg-sky-500/20 mb-4"
                        >
                            <img src={service.icon} alt={service.name} className="w-7 h-7 object-contain" />
                        </motion.div>
                        <h3 className="text-lg my-3 font-semibold text-gray-800 dark:text-white group-hover:text-sky-600 dark:group-hover:text-sky-400 transition-colors">
                            {service.name}
                        </h3>
                        <p className="text-sm text-gray-600 leading-relaxed dark:text-white/80">
                            {service.description}
                        </p>
                        <a
                            href={service.link}
                            className="flex items-center gap-2 text-sm mt-6 font-medium text-sky-600 dark:text-sky-400 group-hover:gap-3 transition-all"
                        >
                            Explore projects
                            <img src="./assets/right-arrow.png" alt="" className="w-4 dark:invert group-hover:translate-x-1 transition-transform" />
                        </a>
                    </motion.div>
                ))}
            </motion.div>
        </div>
    );
}