import melanPhoto from '../assests/melanakash.png'

export default function About() {
    const tools = [
        { name: 'VS Code', icon: './assets/vscode.png' },
        { name: 'Firebase', icon: './assets/firebase.png' },
        { name: 'MongoDB', icon: './assets/mongodb.png' },
        { name: 'Figma', icon: './assets/figma.png' },
        { name: 'Git', icon: './assets/git.png' },
    ];

    const data = [
        {
            name: 'Languages',
            icon1: './assets/code-icon.png',
            icon2: './assets/code-icon-dark.png',
            description: 'JavaScript, Java, C#, PHP, Python, Go, HTML, CSS',
        },
        {
            name: 'Education',
            icon1: './assets/edu-icon.png',
            icon2: './assets/edu-icon-dark.png',
            description: 'BSc (Hons) Software Engineering — Cardiff Met University',
        },
        {
            name: 'Projects',
            icon1: './assets/project-icon.png',
            icon2: './assets/project-icon-dark.png',
            description: 'Built 9+ full-stack & AI-integrated projects',
        },
    ];

    const skills = [
        { category: 'Frontend', items: 'React, Tailwind CSS, HTML5, CSS3' },
        { category: 'Backend', items: 'Node.js, Express.js, Spring Boot, .NET' },
        { category: 'Mobile', items: 'React Native, Expo, Android' },
        { category: 'Database', items: 'MongoDB, MySQL, PostgreSQL, Firebase, Supabase, NeonDB' },
        { category: 'AI / ML', items: 'OpenRouter, Vercel AI SDK, LLM APIs, Meta Llama 3.1, Claude, AI Studio' },
        { category: 'Tools', items: 'Git, GitHub, REST APIs, Postman, VS Code, SEO, Inngest, CodeRabbit' },
    ];

    return (
        <div id="about" className="w-full px-[12%] py-10 scroll-mt-20">
            <h4 className="text-center mb-2 text-lg font-Ovo">Introduction</h4>
            <h2 className="text-center text-5xl font-Ovo">About me</h2>

            <div className="flex w-full flex-col lg:flex-row items-center gap-20 my-20">
                <div className="max-w-max mx-auto relative">
                    <img src={melanPhoto} alt="Melan Akash" className="w-64 sm:w-80 rounded-3xl max-w-none object-cover" />

                    <div className="bg-white w-1/2 aspect-square absolute right-0 bottom-0 rounded-full translate-x-1/4 translate-y-1/3 shadow-[0_4px_55px_rgba(14,165,233,0.18)] flex items-center justify-center">
                        <img src="./assets/circular-text.png" alt="" className="w-full animate-spin_slow" />
                        <img src="./assets/dev-icon.png" alt="" className="w-1/4 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
                    </div>
                </div>
                <div className="flex-1">
                    <p className="mb-10 max-w-2xl font-Ovo">
                        Associate Software Engineer with hands-on experience across the MERN and PERN stacks, Spring Boot, and .NET, having shipped full-stack and AI-integrated web and mobile applications including an AI-powered website builder, a real-time video conferencing app, and an AI habit-coaching app. Comfortable working across frontend and backend layers, with growing experience integrating LLM APIs into production apps. Also active as a startup co-founder leading frontend development and on-page SEO.
                    </p>

                    <ul className="grid grid-cols-1 sm:grid-cols-3 gap-6 max-w-2xl">
                        {data.map((item) => (
                            <li key={item.name} className="border border-gray-300 dark:border-white/30 rounded-xl p-6 cursor-pointer hover:bg-lightHover hover:-translate-y-1 duration-500 hover:shadow-black dark:hover:shadow-white/80 dark:hover:bg-darkHover/50">
                                <img src={item.icon1} alt="" className="w-7 mt-3 dark:hidden" />
                                <img src={item.icon2} alt="" className="w-7 mt-3 hidden dark:block" />
                                <h3 className="my-4 font-semibold text-gray-700 dark:text-white">{item.name}</h3>
                                <p className="text-gray-600 text-sm dark:text-white/80">{item.description}</p>
                            </li>
                        ))}
                    </ul>

                    <h4 className="my-6 text-gray-700 font-Ovo dark:text-white/80">Tools i use</h4>

                    <ul className="flex items-center gap-3 sm:gap-5">
                        {tools.map((tool) => (
                            <li key={tool.name} className="flex items-center justify-center w-12 sm:w-14 aspect-square border border-gray-300 dark:border-white/30 rounded-lg cursor-pointer hover:-translate-y-1 duration-500">
                                <img src={tool.icon} alt={tool.name} className="w-5 sm:w-7" />
                            </li>
                        ))}
                    </ul>
                </div>
            </div>

            {/* Technical Skills Grid */}
            <div className="mt-10">
                <h4 className="text-center mb-2 text-lg font-Ovo">What I know</h4>
                <h2 className="text-center text-5xl font-Ovo mb-12">Technical Skills</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 max-w-5xl mx-auto">
                    {skills.map((skill) => (
                        <div key={skill.category} className="border border-gray-300 dark:border-white/30 rounded-xl px-6 py-5 hover:bg-lightHover hover:-translate-y-1 duration-500 hover:shadow-black dark:hover:shadow-white/80 dark:hover:bg-darkHover/50">
                            <h3 className="font-semibold text-gray-800 dark:text-white mb-2">{skill.category}</h3>
                            <p className="text-sm text-gray-600 dark:text-white/70 leading-relaxed">{skill.items}</p>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}