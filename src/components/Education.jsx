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
            <h4 className="text-center mb-2 text-lg font-Ovo">My background</h4>
            <h2 className="text-center text-5xl font-Ovo">Education</h2>
            <p className="text-center max-w-2xl mx-auto mt-5 mb-12 font-Ovo">
                Academic foundation in Software Engineering with hands-on project experience.
            </p>

            <div className="max-w-3xl mx-auto flex flex-col gap-6">
                {education.map((edu) => (
                    <div key={edu.degree} className="border border-gray-300 dark:border-white/20 rounded-xl p-6 sm:p-8 hover:bg-lightHover hover:-translate-y-1 duration-500 hover:shadow-black dark:hover:shadow-white/80 dark:hover:bg-darkHover/50">
                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-3">
                            <h3 className="text-lg font-semibold text-gray-800 dark:text-white">{edu.degree}</h3>
                            <span className="text-xs font-medium px-3 py-1 rounded-full bg-sky-100 text-sky-700 dark:bg-sky-500/20 dark:text-sky-300 w-fit shrink-0">{edu.period}</span>
                        </div>
                        <p className="text-sm text-sky-600 dark:text-sky-400 font-medium">{edu.institution}</p>
                        {edu.result && <p className="text-sm text-gray-600 dark:text-white/70 mt-1">{edu.result}</p>}
                    </div>
                ))}

                {/* Certifications & Languages */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mt-4">
                    <div className="border border-gray-300 dark:border-white/20 rounded-xl p-6 hover:bg-lightHover hover:-translate-y-1 duration-500 hover:shadow-black dark:hover:shadow-white/80 dark:hover:bg-darkHover/50">
                        <h3 className="font-semibold text-gray-800 dark:text-white mb-3">Certifications</h3>
                        {certifications.map((cert) => (
                            <div key={cert.name} className="flex items-start gap-2">
                                <span className="text-sky-500 mt-0.5 shrink-0">▹</span>
                                <div>
                                    <p className="text-sm text-gray-700 dark:text-white/80">{cert.name}</p>
                                    <p className="text-xs text-gray-500 dark:text-white/50">{cert.period}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                    <div className="border border-gray-300 dark:border-white/20 rounded-xl p-6 hover:bg-lightHover hover:-translate-y-1 duration-500 hover:shadow-black dark:hover:shadow-white/80 dark:hover:bg-darkHover/50">
                        <h3 className="font-semibold text-gray-800 dark:text-white mb-3">Languages</h3>
                        <div className="flex flex-col gap-2">
                            <div className="flex items-center gap-2">
                                <span className="text-sky-500 shrink-0">▹</span>
                                <p className="text-sm text-gray-700 dark:text-white/80">English</p>
                            </div>
                            <div className="flex items-center gap-2">
                                <span className="text-sky-500 shrink-0">▹</span>
                                <p className="text-sm text-gray-700 dark:text-white/80">Sinhala</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
