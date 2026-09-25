import { motion } from 'framer-motion';

export default function Experience() {
    const experiences = [
        {
            role: 'Associate Software Engineer',
            company: 'Creantis Pvt Ltd',
            period: 'Aug 2026 – Present',
            type: 'Full-time',
            points: [
                'Developing a full-stack web application using the MERN stack (MongoDB, Express.js, React, Node.js), building both frontend interfaces and backend REST APIs.',
                'Building a React Native mobile application, developing UI screens and integrating APIs for cross-platform (Android/iOS) functionality.',
                'Contributing to an e-commerce SaaS web application — working on features including product management, shopping cart, and order workflows.',
            ]
        },
        {
            role: 'Full Stack Developer Intern',
            company: 'Creantis Pvt Ltd',
            period: 'Jan 2026 – Jul 2026',
            type: 'Internship',
            points: [
                'Worked on a live international client web project built on the MERN stack, contributing to feature development alongside a professional development team.',
                'Developed and customized a WordPress website for a client, handling theme/plugin setup and content structuring.',
                'Gained hands-on experience with real-world Agile workflows, Git version control, and client project delivery — internship converted to a full-time Associate Software Engineer role.',
            ]
        }
    ];

    return (
        <div id="experience" className="w-full px-[12%] py-10 scroll-mt-20">
            <motion.h4
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
                className="text-center mb-2 text-lg font-Ovo text-sky-600 dark:text-sky-400"
            >
                My journey
            </motion.h4>
            <motion.h2
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.55, delay: 0.1 }}
                className="text-center text-5xl font-Ovo"
            >
                Work Experience
            </motion.h2>
            <motion.p
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.55, delay: 0.2 }}
                className="text-center max-w-2xl mx-auto mt-5 mb-12 font-Ovo text-gray-600 dark:text-white/80"
            >
                Professional experience building production-grade full-stack applications and working with international client projects.
            </motion.p>

            <div className="max-w-4xl mx-auto relative">
                {/* Timeline line */}
                <motion.div
                    initial={{ scaleY: 0 }}
                    whileInView={{ scaleY: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8, ease: "easeInOut" }}
                    style={{ originY: 0 }}
                    className="hidden sm:block absolute left-8 top-0 bottom-0 w-px bg-gradient-to-b from-sky-500 via-blue-600 to-transparent dark:from-sky-400 dark:to-blue-500"
                ></motion.div>

                <div className="flex flex-col gap-10">
                    {experiences.map((exp, index) => (
                        <motion.div
                            key={exp.role}
                            initial={{ opacity: 0, x: -30 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.6, delay: index * 0.18, ease: [0.22, 1, 0.36, 1] }}
                            className="sm:pl-20 relative group"
                        >
                            {/* Timeline dot */}
                            <motion.div
                                initial={{ scale: 0 }}
                                whileInView={{ scale: 1 }}
                                viewport={{ once: true }}
                                transition={{ type: "spring", stiffness: 400, delay: index * 0.18 + 0.2 }}
                                className="hidden sm:flex absolute left-[22px] top-6 w-[13px] h-[13px] rounded-full bg-gradient-to-r from-sky-500 to-blue-600 border-[3px] border-white dark:border-darkTheme z-10 group-hover:scale-150 transition-transform duration-300 shadow-md shadow-sky-500/50"
                            ></motion.div>

                            <motion.div
                                whileHover={{ y: -5, scale: 1.01 }}
                                transition={{ type: "spring", stiffness: 350, damping: 25 }}
                                className="border border-gray-300 dark:border-white/20 rounded-2xl p-6 sm:p-8 hover:bg-lightHover duration-300 hover:shadow-xl dark:hover:shadow-sky-500/10 dark:hover:bg-darkHover/50 transition-colors"
                            >
                                <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 mb-4">
                                    <h3 className="text-lg font-semibold text-gray-800 dark:text-white group-hover:text-sky-600 dark:group-hover:text-sky-400 transition-colors">
                                        {exp.role}
                                    </h3>
                                    <span className="text-xs font-medium px-3 py-1 rounded-full bg-sky-100 text-sky-700 dark:bg-sky-500/20 dark:text-sky-300 w-fit">
                                        {exp.type}
                                    </span>
                                </div>
                                <p className="text-sm text-sky-600 dark:text-sky-400 font-medium mb-1">{exp.company}</p>
                                <p className="text-xs text-gray-500 dark:text-white/50 mb-4">{exp.period}</p>
                                <ul className="space-y-2.5">
                                    {exp.points.map((point, i) => (
                                        <motion.li
                                            key={i}
                                            initial={{ opacity: 0, x: -10 }}
                                            whileInView={{ opacity: 1, x: 0 }}
                                            viewport={{ once: true }}
                                            transition={{ duration: 0.4, delay: index * 0.1 + i * 0.08 }}
                                            className="text-sm text-gray-600 dark:text-white/75 leading-relaxed flex gap-2.5"
                                        >
                                            <span className="text-sky-500 mt-0.5 shrink-0 font-bold">▹</span>
                                            <span>{point}</span>
                                        </motion.li>
                                    ))}
                                </ul>
                            </motion.div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </div>
    );
}

