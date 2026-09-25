import mongoose from 'mongoose';

// 1. Portfolio / Project Schema
export const projectSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Project name is required'],
        trim: true
    },
    description: {
        type: String,
        default: ''
    },
    overview: {
        type: String,
        default: ''
    },
    tech: {
        type: String,
        default: ''
    },
    year: {
        type: String,
        default: () => new Date().getFullYear().toString()
    },
    github: {
        type: String,
        default: ''
    },
    live: {
        type: String,
        default: ''
    },
    images: {
        type: [String],
        default: []
    },
    image: {
        type: String,
        default: ''
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

// 2. Profile Schema
export const profileSchema = new mongoose.Schema({
    name: { type: String, default: 'Melan Akash' },
    role: { type: String, default: 'Full Stack Developer' },
    title: { type: String, default: 'Associate Software Engineer' },
    tagline: { type: String, default: 'full stack developer based in Sri Lanka.' },
    about: {
        type: String,
        default: 'Associate Software Engineer with hands-on experience across the MERN and PERN stacks, Spring Boot, and .NET, having shipped full-stack and AI-integrated web and mobile applications including an AI-powered website builder, a real-time video conferencing app, and an AI habit-coaching app. Comfortable working across frontend and backend layers, with growing experience integrating LLM APIs into production apps. Also active as a startup co-founder leading frontend development and on-page SEO.'
    },
    location: { type: String, default: 'Matara, Sri Lanka' },
    email: { type: String, default: 'melonakash2002@gmail.com' },
    phone: { type: String, default: '+94 71 760 2792' },
    avatar: { type: String, default: '' },
    resumeUrl: { type: String, default: '' },
    github: { type: String, default: 'https://github.com/melan-Akash' },
    linkedin: { type: String, default: 'https://linkedin.com/in/melan-akash-35558a372' },
    updatedAt: { type: Date, default: Date.now }
});

// 3. Message Schema
export const messageSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true },
    message: { type: String, required: true },
    date: { type: Date, default: Date.now },
    read: { type: Boolean, default: false }
});

export const Project = mongoose.models.Project || mongoose.model('Project', projectSchema);
export const Portfolio = Project; // Alias for flexibility
export const Profile = mongoose.models.Profile || mongoose.model('Profile', profileSchema);
export const Message = mongoose.models.Message || mongoose.model('Message', messageSchema);

export default Project;
