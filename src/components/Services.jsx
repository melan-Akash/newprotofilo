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
    return (
        <div id="services" className="w-full px-[12%] py-10 scroll-mt-20">
            <h4 className="text-center mb-2 text-lg font-Ovo">What i offer</h4>
            <h2 className="text-center text-5xl font-Ovo">My services</h2>
            <p className="text-center max-w-2xl mx-auto mt-5 mb-12 font-Ovo">As a Full Stack Developer, I build modern, scalable web and mobile applications — from AI-powered tools to production-grade e-commerce platforms.</p>

            <div className="grid grid-cols-auto gap-6 my-10">
                {services.map((service) => (
                    <div key={service.name} className="border border-gray-300 dark:border-white/30 rounded-lg px-8 py-12 hover:shadow-black cursor-pointer hover:bg-lightHover hover:-translate-y-1 duration-500 dark:hover:bg-darkHover dark:hover:shadow-white">
                        <img src={service.icon} alt="" className="w-10" />
                        <h3 className="text-lg my-4 text-gray-700 dark:text-white">{service.name}</h3>
                        <p className="text-sm text-gray-600 leading-5 dark:text-white/80">{service.description}</p>
                        <a href={service.link} className="flex items-center gap-2 text-sm mt-5">Read more <img src="./assets/right-arrow.png" alt="" className="w-4" /></a>
                    </div>
                ))}
            </div>
        </div>
    )
}