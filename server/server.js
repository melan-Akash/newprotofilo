import dotenv from 'dotenv';
import express from 'express';
import cors from 'cors';
import multer from 'multer';
import mongoose from 'mongoose';
import jwt from 'jsonwebtoken';
import { v2 as cloudinary } from 'cloudinary';
import nodemailer from 'nodemailer';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Modular imports
import connectDB, { isMongoConnected } from './config/db.js';
import { Project, Profile, Message } from './models/protofilos.js';
import {
    getProjects,
    getProjectById,
    addProject,
    deleteProject,
    updateProject,
    uploadToCloudinary
} from './controlers/protofiloControler.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.join(__dirname, '.env') });

const app = express();
const PORT = process.env.PORT || 5000;
const JWT_SECRET = process.env.JWT_SECRET || 'melan1234';

// ---------------- SECURITY MIDDLEWARE ----------------

// Trust reverse proxy if deployed behind Nginx / Vercel
app.set('trust proxy', 1);

// Middleware
app.use(cors({
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json({ limit: '20mb' }));
app.use(express.urlencoded({ extended: true, limit: '20mb' }));

// In-Memory Rate Limiter (Zero Dependency, Lightweight, High Performance)
const rateLimitMap = new Map();
const rateLimiter = (windowMs, maxRequests, message = 'Too many requests. Please try again later.') => {
    return (req, res, next) => {
        const ip = req.ip || req.headers['x-forwarded-for'] || req.socket?.remoteAddress || '127.0.0.1';
        const key = `${req.baseUrl || ''}${req.path}_${ip}`;
        const now = Date.now();
        const record = rateLimitMap.get(key) || { count: 0, resetAt: now + windowMs };

        if (now > record.resetAt) {
            record.count = 1;
            record.resetAt = now + windowMs;
            rateLimitMap.set(key, record);
            return next();
        }

        if (record.count >= maxRequests) {
            const retryAfter = Math.ceil((record.resetAt - now) / 1000);
            return res.status(429).json({
                success: false,
                message: `${message} (Retry after ${retryAfter}s)`
            });
        }

        record.count++;
        rateLimitMap.set(key, record);
        next();
    };
};

// Periodically clean stale rate limits every 10 minutes
setInterval(() => {
    const now = Date.now();
    for (const [key, val] of rateLimitMap.entries()) {
        if (now > val.resetAt) {
            rateLimitMap.delete(key);
        }
    }
}, 10 * 60 * 1000);

// Authentication Guard: Protects administrative routes
export const verifyAdmin = (req, res, next) => {
    const authHeader = req.headers.authorization;
    const token = authHeader?.startsWith('Bearer ')
        ? authHeader.split(' ')[1]
        : (req.headers['x-access-token'] || req.query?.token);

    if (!token) {
        return res.status(401).json({
            success: false,
            message: 'Unauthorized: Administrator authentication token required.'
        });
    }

    try {
        const decoded = jwt.verify(token, JWT_SECRET);
        if (decoded.role !== 'admin') {
            return res.status(403).json({
                success: false,
                message: 'Forbidden: Access requires administrator credentials.'
            });
        }
        req.user = decoded;
        next();
    } catch (err) {
        return res.status(401).json({
            success: false,
            message: 'Session expired or invalid token. Please log in again.'
        });
    }
};

// HTML Escaper for XSS Prevention in Emails & Output
function escapeHtml(text) {
    if (!text || typeof text !== 'string') return '';
    return text
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#039;');
}

// 1. Cloudinary Configuration
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});

// 2. Multer Memory Storage with generous file & field limits
const storage = multer.memoryStorage();
export const upload = multer({
    storage,
    limits: {
        fileSize: 15 * 1024 * 1024,  // 15MB file size limit per image
        fieldSize: 50 * 1024 * 1024  // 50MB form field size limit to prevent "Field value too long" errors
    }
});

// 3. Connect to MongoDB Atlas
connectDB();

// 4. Nodemailer Setup (Using Gmail Service preset with TLS for maximum cloud reliability)
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    },
    tls: {
        rejectUnauthorized: false
    }
});

// Local JSON backup fallback for profile & messages
const DATA_DIR = path.join(__dirname, 'data');
const LOCAL_PROFILE_FILE = path.join(DATA_DIR, 'profile.json');
const LOCAL_MESSAGES_FILE = path.join(DATA_DIR, 'messages.json');
if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true });

const defaultProfileData = {
    name: 'Melan Akash',
    role: 'Full Stack Developer',
    title: 'Associate Software Engineer',
    tagline: 'full stack developer based in Sri Lanka.',
    about: 'Associate Software Engineer with hands-on experience across the MERN and PERN stacks, Spring Boot, and .NET, having shipped full-stack and AI-integrated web and mobile applications including an AI-powered website builder, a real-time video conferencing app, and an AI habit-coaching app. Comfortable working across frontend and backend layers, with growing experience integrating LLM APIs into production apps. Also active as a startup co-founder leading frontend development and on-page SEO.',
    location: 'Matara, Sri Lanka',
    email: 'melonakash2002@gmail.com',
    phone: '+94 71 760 2792',
    avatar: '',
    resumeUrl: '',
    github: 'https://github.com/melan-Akash',
    linkedin: 'https://linkedin.com/in/melan-akash-35558a372'
};

function getLocalProfile() {
    try {
        if (!fs.existsSync(LOCAL_PROFILE_FILE)) {
            fs.writeFileSync(LOCAL_PROFILE_FILE, JSON.stringify(defaultProfileData, null, 2));
            return defaultProfileData;
        }
        return JSON.parse(fs.readFileSync(LOCAL_PROFILE_FILE, 'utf-8'));
    } catch {
        return defaultProfileData;
    }
}

function saveLocalProfile(data) {
    try {
        fs.writeFileSync(LOCAL_PROFILE_FILE, JSON.stringify(data, null, 2));
    } catch (e) {
        console.warn('saveLocalProfile warning:', e.message);
    }
}

// ---------------- API ENDPOINTS ----------------

// Suppress browser favicon request for raw API endpoints
app.get('/favicon.ico', (req, res) => res.status(204).end());

// Root API Landing
app.get('/', (req, res) => {
    res.json({
        success: true,
        message: '🚀 Melan Akash Portfolio Backend API is Running Live!',
        status: 'online',
        endpoints: {
            health: '/api/health',
            projects: '/api/projects',
            profile: '/api/profile',
            sitemap: '/api/sitemap.xml'
        }
    });
});

// Health check
app.get('/api/health', (req, res) => {
    res.json({
        status: 'online',
        database: isMongoConnected() ? 'MongoDB Atlas' : 'Local Storage Fallback',
        cloudinary: Boolean(process.env.CLOUDINARY_CLOUD_NAME),
        time: new Date().toISOString()
    });
});

// 1. Admin Authentication with JWT & Brute Force Rate Limiting (10 tries per 5 minutes)
app.post('/api/auth/login', rateLimiter(5 * 60 * 1000, 10, 'Too many login attempts. Please wait 5 minutes.'), (req, res) => {
    const { username, password } = req.body;

    const envUser = process.env.ADMIN_MAIL || process.env.ADMIN_USERNAME;
    const envPass = process.env.ADMIN_PASS;

    if (!envUser || !envPass) {
        return res.status(500).json({
            success: false,
            message: 'Admin credentials not configured in backend .env'
        });
    }

    if (!username || !password) {
        return res.status(400).json({
            success: false,
            message: 'Username and password are required.'
        });
    }

    // Accept username or email matching ADMIN_MAIL in .env
    const matchesUser = (username === envUser || username === envUser.split('@')[0]);
    const matchesPass = (password === envPass);

    if (matchesUser && matchesPass) {
        const token = jwt.sign(
            { username: envUser, role: 'admin', name: 'Melan Akash' },
            JWT_SECRET,
            { expiresIn: '7d' }
        );

        return res.json({
            success: true,
            token,
            user: {
                name: 'Melan Akash',
                email: process.env.EMAIL_USER || 'melonakash2002@gmail.com',
                role: 'Administrator'
            }
        });
    }

    return res.status(401).json({
        success: false,
        message: 'Invalid username or password. Access denied.'
    });
});

// Verify Admin Token
app.post('/api/auth/verify', (req, res) => {
    const token = req.headers.authorization?.replace('Bearer ', '') || req.body?.token;
    if (!token) {
        return res.status(401).json({ success: false, message: 'No token provided' });
    }
    try {
        const decoded = jwt.verify(token, JWT_SECRET);
        return res.json({ success: true, user: decoded });
    } catch {
        return res.status(401).json({ success: false, message: 'Invalid or expired token' });
    }
});

// 2. Profile API (Public GET, Protected POST/PUT)
app.get('/api/profile', async (req, res) => {
    try {
        if (isMongoConnected()) {
            let profile = await Profile.findOne().sort({ updatedAt: -1 });
            if (!profile) {
                profile = await Profile.create(defaultProfileData);
            }
            return res.json({ success: true, profile });
        }
        const local = getLocalProfile();
        return res.json({ success: true, profile: local });
    } catch (err) {
        const local = getLocalProfile();
        return res.json({ success: true, profile: local });
    }
});

// POST / PUT profile (Protected by verifyAdmin)
app.post('/api/profile', verifyAdmin, upload.single('avatarFile'), async (req, res) => {
    try {
        const body = req.body;
        let avatarUrl = body.avatar || '';

        // If file uploaded, stream upload to Cloudinary
        if (req.file) {
            try {
                avatarUrl = await uploadToCloudinary(req.file.buffer, 'melan_profile');
            } catch (cloudErr) {
                console.warn('Avatar Cloudinary upload error:', cloudErr.message);
            }
        }

        const updateData = {
            name: body.name || 'Melan Akash',
            role: body.role || 'Full Stack Developer',
            title: body.title || 'Associate Software Engineer',
            tagline: body.tagline || 'full stack developer based in Sri Lanka.',
            about: body.about || '',
            location: body.location || 'Matara, Sri Lanka',
            email: body.email || 'melonakash2002@gmail.com',
            phone: body.phone || '+94 71 760 2792',
            avatar: avatarUrl || body.avatar || '',
            resumeUrl: body.resumeUrl || '',
            github: body.github || 'https://github.com/melan-Akash',
            linkedin: body.linkedin || 'https://linkedin.com/in/melan-akash-35558a372',
            updatedAt: new Date()
        };

        let savedProfile;
        if (isMongoConnected()) {
            savedProfile = await Profile.findOneAndUpdate(
                {},
                { $set: updateData },
                { new: true, upsert: true }
            );
        } else {
            savedProfile = updateData;
            saveLocalProfile(savedProfile);
        }

        res.json({ success: true, profile: savedProfile });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
});

// 3. Portfolio Projects API (Public GET, Protected POST, PUT & DELETE)
app.get('/api/projects', getProjects);
app.get('/api/projects/:id', getProjectById);
app.post('/api/projects', verifyAdmin, upload.array('imageFiles', 4), addProject);
app.put('/api/projects/:id', verifyAdmin, upload.array('imageFiles', 4), updateProject);
app.delete('/api/projects/:id', verifyAdmin, deleteProject);

// 4. Contact Messages API (Public POST with Rate Limiting & Validation, Protected GET & DELETE)
app.get('/api/messages', verifyAdmin, async (req, res) => {
    try {
        if (isMongoConnected()) {
            const msgs = await Message.find().sort({ date: -1 });
            return res.json({ success: true, messages: msgs });
        }
        if (!fs.existsSync(LOCAL_MESSAGES_FILE)) return res.json({ success: true, messages: [] });
        const msgs = JSON.parse(fs.readFileSync(LOCAL_MESSAGES_FILE, 'utf-8'));
        res.json({ success: true, messages: msgs });
    } catch (err) {
        res.json({ success: true, messages: [] });
    }
});

// DELETE single message (Protected by verifyAdmin)
app.delete('/api/messages/:id', verifyAdmin, async (req, res) => {
    try {
        const { id } = req.params;
        if (isMongoConnected() && mongoose.Types.ObjectId.isValid(id)) {
            await Message.findByIdAndDelete(id);
        }
        if (fs.existsSync(LOCAL_MESSAGES_FILE)) {
            try {
                let msgs = JSON.parse(fs.readFileSync(LOCAL_MESSAGES_FILE, 'utf-8'));
                msgs = msgs.filter(m => m._id !== id && m.id !== id);
                fs.writeFileSync(LOCAL_MESSAGES_FILE, JSON.stringify(msgs, null, 2));
            } catch {
                // Ignore
            }
        }
        res.json({ success: true, message: 'Message deleted successfully' });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
});

// POST message (Contact form with anti-spam rate limiting & input sanitization)
app.post('/api/messages', rateLimiter(10 * 60 * 1000, 5, 'Message limit reached. Please wait a few minutes before sending another inquiry.'), async (req, res) => {
    try {
        const { name, email, message } = req.body;

        // Strict input validation
        if (!name || typeof name !== 'string' || name.trim().length < 2) {
            return res.status(400).json({ success: false, message: 'Please provide a valid name (at least 2 characters).' });
        }
        if (!email || typeof email !== 'string' || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
            return res.status(400).json({ success: false, message: 'Please provide a valid email address.' });
        }
        if (!message || typeof message !== 'string' || message.trim().length < 5) {
            return res.status(400).json({ success: false, message: 'Please enter a message (at least 5 characters).' });
        }

        const cleanName = name.trim().slice(0, 100);
        const cleanEmail = email.trim().toLowerCase().slice(0, 100);
        const cleanMessage = message.trim().slice(0, 3000);

        const msgData = {
            name: cleanName,
            email: cleanEmail,
            message: cleanMessage,
            date: new Date()
        };

        let savedMsg;
        if (isMongoConnected()) {
            savedMsg = await Message.create(msgData);
        } else {
            savedMsg = { ...msgData, _id: 'msg_' + Date.now() };
            let current = [];
            if (fs.existsSync(LOCAL_MESSAGES_FILE)) {
                try { current = JSON.parse(fs.readFileSync(LOCAL_MESSAGES_FILE, 'utf-8')); } catch { current = []; }
            }
            current.unshift(savedMsg);
            fs.writeFileSync(LOCAL_MESSAGES_FILE, JSON.stringify(current, null, 2));
        }

        // Send Email notification with XSS protection via HTML escaping (Awaited for Vercel Serverless)
        if (process.env.EMAIL_USER && process.env.EMAIL_PASS) {
            const escapedName = escapeHtml(cleanName);
            const escapedEmail = escapeHtml(cleanEmail);
            const escapedMessage = escapeHtml(cleanMessage).replace(/\n/g, '<br/>');

            try {
                await transporter.sendMail({
                    from: `"Melan Akash Portfolio" <${process.env.EMAIL_USER}>`,
                    to: process.env.EMAIL_USER,
                    replyTo: cleanEmail,
                    subject: `🚀 New Portfolio Inquiry from ${escapedName}`,
                    html: `
                        <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; padding: 28px; color: #1e293b; max-width: 600px; margin: 0 auto; border: 1px solid #e2e8f0; border-radius: 16px; background-color: #ffffff;">
                            <div style="text-align: center; margin-bottom: 24px;">
                                <h2 style="color: #0284c7; margin: 0; font-size: 22px;">New Client Inquiry</h2>
                                <p style="color: #64748b; font-size: 13px; margin-top: 4px;">Submitted via melanakash.dev contact form</p>
                            </div>
                            <div style="background-color: #f8fafc; border-radius: 12px; padding: 18px; border: 1px solid #f1f5f9; margin-bottom: 20px;">
                                <p style="margin: 0 0 8px 0; font-size: 14px;"><strong>Sender Name:</strong> ${escapedName}</p>
                                <p style="margin: 0 0 8px 0; font-size: 14px;"><strong>Sender Email:</strong> <a href="mailto:${escapedEmail}" style="color: #0284c7; text-decoration: none;">${escapedEmail}</a></p>
                                <p style="margin: 0; font-size: 14px;"><strong>Received:</strong> ${new Date().toLocaleString('en-US', { timeZone: 'Asia/Colombo' })} (LK Time)</p>
                            </div>
                            <div style="margin-bottom: 24px;">
                                <p style="margin: 0 0 8px 0; font-size: 13px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px; color: #475569;">Message Content:</p>
                                <div style="background: #ffffff; padding: 16px; border-radius: 10px; border-left: 4px solid #0284c7; line-height: 1.6; font-size: 14px; color: #334155; border: 1px solid #e2e8f0;">
                                    ${escapedMessage}
                                </div>
                            </div>
                            <div style="text-align: center; margin-top: 24px;">
                                <a href="mailto:${escapedEmail}?subject=Re: Your Inquiry on Melan Akash Portfolio" style="display: inline-block; background-color: #0284c7; color: #ffffff; text-decoration: none; padding: 11px 26px; border-radius: 50px; font-size: 14px; font-weight: 600;">
                                    Reply to ${escapedName} →
                                </a>
                            </div>
                            <hr style="border: none; border-top: 1px solid #e2e8f0; margin: 26px 0 14px 0;" />
                            <p style="font-size: 12px; color: #94a3b8; text-align: center; margin: 0;">Melan Akash Portfolio Automated Notification</p>
                        </div>
                    `
                });
                console.log(`Email successfully dispatched for ${cleanName}`);
            } catch (mailErr) {
                console.error('Email dispatch error:', mailErr.message);
            }
        }

        res.status(201).json({ success: true, message: savedMsg });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
});

// Admin Direct Email Reply Endpoint (Protected by verifyAdmin)
app.post('/api/messages/reply', verifyAdmin, async (req, res) => {
    try {
        const { to, subject, replyText, originalMessage } = req.body;

        if (!to || !replyText) {
            return res.status(400).json({ success: false, message: 'Recipient email and reply text are required.' });
        }

        if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
            return res.status(500).json({ success: false, message: 'Backend email credentials not configured in environment.' });
        }

        const escapedReply = escapeHtml(replyText).replace(/\n/g, '<br/>');
        const escapedOrig = originalMessage ? escapeHtml(originalMessage).replace(/\n/g, '<br/>') : '';

        await transporter.sendMail({
            from: `"Melan Akash" <${process.env.EMAIL_USER}>`,
            to: to.trim(),
            replyTo: process.env.EMAIL_USER,
            subject: subject || 'Re: Your Inquiry on Melan Akash Portfolio',
            html: `
                <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; padding: 28px; color: #1e293b; max-width: 600px; margin: 0 auto; border: 1px solid #e2e8f0; border-radius: 16px; background-color: #ffffff;">
                    <div style="margin-bottom: 20px;">
                        <h2 style="color: #0284c7; margin: 0; font-size: 20px;">Melan Akash</h2>
                        <p style="color: #64748b; font-size: 13px; margin-top: 4px;">Associate Software Engineer &amp; Full Stack Developer</p>
                    </div>
                    <div style="line-height: 1.7; font-size: 15px; color: #334155; margin-bottom: 24px;">
                        ${escapedReply}
                    </div>
                    ${escapedOrig ? `
                        <div style="background-color: #f8fafc; border-radius: 10px; padding: 14px; border-left: 3px solid #94a3b8; font-size: 13px; color: #64748b; margin-top: 20px;">
                            <strong>In reference to your message:</strong><br/>
                            ${escapedOrig}
                        </div>
                    ` : ''}
                    <hr style="border: none; border-top: 1px solid #e2e8f0; margin: 26px 0 14px 0;" />
                    <p style="font-size: 12px; color: #94a3b8; margin: 0;">
                        Best regards,<br/>
                        <strong>Melan Akash</strong><br/>
                        Email: <a href="mailto:${process.env.EMAIL_USER}" style="color: #0284c7;">${process.env.EMAIL_USER}</a> | Matara, Sri Lanka
                    </p>
                </div>
            `
        });

        res.json({ success: true, message: `Email reply successfully sent to ${to}` });
    } catch (err) {
        console.error('Reply email error:', err.message);
        res.status(500).json({ success: false, message: `Failed to send email: ${err.message}` });
    }
});

// ---------------- DYNAMIC SEO SITEMAP ROUTE ----------------
app.get(['/api/sitemap.xml', '/sitemap.xml'], async (req, res) => {
    try {
        const baseUrl = process.env.CLIENT_URL || 'https://melanakash.dev';
        const projects = await Project.find({ status: { $ne: 'draft' } }).lean().catch(() => []);

        const staticRoutes = [
            { loc: `${baseUrl}/`, priority: '1.0', changefreq: 'weekly' },
            { loc: `${baseUrl}/#about`, priority: '0.8', changefreq: 'monthly' },
            { loc: `${baseUrl}/#services`, priority: '0.8', changefreq: 'monthly' },
            { loc: `${baseUrl}/#work`, priority: '0.9', changefreq: 'weekly' },
            { loc: `${baseUrl}/#experience`, priority: '0.8', changefreq: 'monthly' },
            { loc: `${baseUrl}/#education`, priority: '0.7', changefreq: 'monthly' },
            { loc: `${baseUrl}/#contact`, priority: '0.8', changefreq: 'monthly' },
        ];

        let xml = '<?xml version="1.0" encoding="UTF-8"?>\n';
        xml += '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n';

        const today = new Date().toISOString().split('T')[0];

        // Static routes
        for (const r of staticRoutes) {
            xml += `  <url>\n    <loc>${r.loc}</loc>\n    <lastmod>${today}</lastmod>\n    <changefreq>${r.changefreq}</changefreq>\n    <priority>${r.priority}</priority>\n  </url>\n`;
        }

        // Dynamic project routes
        for (const p of projects) {
            const rawSlug = (p.name || '').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '') || p._id.toString();
            const lastMod = p.updatedAt ? new Date(p.updatedAt).toISOString().split('T')[0] : today;
            xml += `  <url>\n    <loc>${baseUrl}/project/${encodeURIComponent(rawSlug)}</loc>\n    <lastmod>${lastMod}</lastmod>\n    <changefreq>monthly</changefreq>\n    <priority>0.85</priority>\n  </url>\n`;
        }

        xml += '</urlset>';

        res.header('Content-Type', 'application/xml');
        res.send(xml);
    } catch (e) {
        res.status(500).send('Error generating sitemap');
    }
});

// 5. Global Error Handling Middleware (including Multer errors)
app.use((err, req, res, next) => {
    if (err instanceof multer.MulterError) {
        return res.status(400).json({
            success: false,
            message: `File upload error: ${err.message}`
        });
    }
    if (err) {
        return res.status(500).json({
            success: false,
            message: err.message || 'Internal Server Error'
        });
    }
    next();
});

// Export Express app for Vercel serverless functions
export default app;

if (!process.env.VERCEL) {
    app.listen(PORT, () => {
        console.log(`Backend Server running on port ${PORT}`);
    });
}
