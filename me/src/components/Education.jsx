import { motion } from 'framer-motion';

export default function Education() {
    const education = [
        {
            degree: 'BSc (Hons) Software Engineering',
            result: 'Second Class Upper (2:1)',
            institution: 'Cardiff Metropolitan University (ICBT Campus)',
            period: '2024 – 2025',
        },
        {
            degree: 'Higher National Diploma in Software Engineering',
            result: '',
            institution: 'Cardiff Metropolitan University',
            period: '2022 – 2024',
        },
    ];

    const certifications = [
        { name: 'British Council English Courses', period: '2021 – 2022' },
    ];

    return (
        <div id="education" className="w-full px-[12%] py-10 scroll-mt-20">
            <motion.h4
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
                className="text-center mb-2 text-lg font-Ovo text-sky-600 dark:text-sky-400"
            >
                My background
            </motion.h4>
            <motion.h2
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.55, delay: 0.1 }}
                className="text-center text-5xl font-Ovo"
            >
                Education
            </motion.h2>
            <motion.p
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.55, delay: 0.2 }}
                className="text-center max-w-2xl mx-auto mt-5 mb-12 font-Ovo text-gray-600 dark:text-white/80"
            >
                Academic foundation in Software Engineering with hands-on project experience.
            </motion.p>

            <div className="max-w-3xl mx-auto flex flex-col gap-6">
                {education.map((edu, index) => (
                    <motion.div
                        key={edu.degree}
                        initial={{ opacity: 0, y: 25 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5, delay: index * 0.15 }}
                        whileHover={{ y: -5, scale: 1.01 }}
                        className="group border border-gray-300 dark:border-white/20 rounded-2xl p-6 sm:p-8 hover:bg-lightHover duration-300 hover:shadow-xl dark:hover:shadow-sky-500/10 dark:hover:bg-darkHover/50 transition-colors"
                    >
                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-3">
                            <h3 className="text-lg font-semibold text-gray-800 dark:text-white group-hover:text-sky-600 dark:group-hover:text-sky-400 transition-colors">
                                {edu.degree}
                            </h3>
                            <span className="text-xs font-medium px-3 py-1 rounded-full bg-sky-100 text-sky-700 dark:bg-sky-500/20 dark:text-sky-300 w-fit shrink-0">
                                {edu.period}
                            </span>
                        </div>
                        <p className="text-sm text-sky-600 dark:text-sky-400 font-medium">{edu.institution}</p>
                        {edu.result && <p className="text-sm text-gray-600 dark:text-white/70 mt-1">{edu.result}</p>}
                    </motion.div>
                ))}

                {/* Certifications & Languages */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mt-4">
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5, delay: 0.3 }}
                        whileHover={{ y: -4, scale: 1.01 }}
                        className="border border-gray-300 dark:border-white/20 rounded-2xl p-6 hover:bg-lightHover duration-300 hover:shadow-xl dark:hover:shadow-sky-500/10 dark:hover:bg-darkHover/50 transition-colors"
                    >
                        <h3 className="font-semibold text-gray-800 dark:text-white mb-4 flex items-center gap-2">
                            <span className="w-2 h-2 rounded-full bg-sky-500"></span>
                            Certifications
                        </h3>
                        {certifications.map((cert) => (
                            <div key={cert.name} className="flex items-start gap-2.5">
                                <span className="text-sky-500 mt-0.5 shrink-0 font-bold">▹</span>
                                <div>
                                    <p className="text-sm text-gray-700 dark:text-white/80 font-medium">{cert.name}</p>
                                    <p className="text-xs text-gray-500 dark:text-white/50">{cert.period}</p>
                                </div>
                            </div>
                        ))}
                    </motion.div>
                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5, delay: 0.35 }}
                        whileHover={{ y: -4, scale: 1.01 }}
                        className="border border-gray-300 dark:border-white/20 rounded-2xl p-6 hover:bg-lightHover duration-300 hover:shadow-xl dark:hover:shadow-sky-500/10 dark:hover:bg-darkHover/50 transition-colors"
                    >
                        <h3 className="font-semibold text-gray-800 dark:text-white mb-4 flex items-center gap-2">
                            <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                            Languages
                        </h3>
                        <div className="flex flex-col gap-2.5">
                            <div className="flex items-center gap-2.5">
                                <span className="text-sky-500 shrink-0 font-bold">▹</span>
                                <p className="text-sm text-gray-700 dark:text-white/80 font-medium">English <span className="text-xs text-gray-400 font-normal">(Professional)</span></p>
                            </div>
                            <div className="flex items-center gap-2.5">
                                <span className="text-sky-500 shrink-0 font-bold">▹</span>
                                <p className="text-sm text-gray-700 dark:text-white/80 font-medium">Sinhala <span className="text-xs text-gray-400 font-normal">(Native)</span></p>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </div>
        </div>
    );
}

