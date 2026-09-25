import { v2 as cloudinary } from 'cloudinary';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import mongoose from 'mongoose';
import { Project } from '../models/protofilos.js';
import { isMongoConnected } from '../config/db.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const DATA_DIR = path.join(__dirname, '..', 'data');
const LOCAL_PROJECTS_FILE = path.join(DATA_DIR, 'projects.json');

// Ensure data folder exists
if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
}

// Local storage fallback helpers
export const getLocalProjects = () => {
    try {
        if (!fs.existsSync(LOCAL_PROJECTS_FILE)) return [];
        return JSON.parse(fs.readFileSync(LOCAL_PROJECTS_FILE, 'utf-8'));
    } catch {
        return [];
    }
};

export const saveLocalProjects = (data) => {
    try {
        fs.writeFileSync(LOCAL_PROJECTS_FILE, JSON.stringify(data, null, 2));
    } catch (e) {
        console.warn('Failed to save to local projects.json:', e.message);
    }
};

// Helper: Upload a single buffer to Cloudinary
export const uploadToCloudinary = (fileBuffer, folder = 'melan_portfolio') => {
    return new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
            { folder, resource_type: 'auto' },
            (error, result) => {
                if (error) return reject(error);
                resolve(result.secure_url);
            }
        );
        stream.end(fileBuffer);
    });
};

// GET /api/projects - Get all projects
export const getProjects = async (req, res) => {
    try {
        if (isMongoConnected()) {
            const projects = await Project.find().sort({ createdAt: -1 });
            if (projects && projects.length > 0) {
                return res.json({ success: true, projects });
            }
        }
        const local = getLocalProjects();
        return res.json({ success: true, projects: local });
    } catch (err) {
        console.warn('getProjects error:', err.message);
        const local = getLocalProjects();
        return res.json({ success: true, projects: local });
    }
};

// GET /api/projects/:id - Get single project
export const getProjectById = async (req, res) => {
    try {
        const { id } = req.params;
        if (isMongoConnected() && mongoose.Types.ObjectId.isValid(id)) {
            const project = await Project.findById(id);
            if (project) return res.json({ success: true, project });
        }
        const local = getLocalProjects();
        const found = local.find(p => p._id === id || p.id === id);
        if (found) return res.json({ success: true, project: found });

        return res.status(404).json({ success: false, message: 'Project not found' });
    } catch (err) {
        return res.status(500).json({ success: false, message: err.message });
    }
};

// POST /api/projects - Create/Add project with images
export const addProject = async (req, res) => {
    try {
        const body = req.body || {};
        const uploadedFiles = req.files || [];

        // 1. Upload multipart files to Cloudinary
        const uploadedCloudinaryUrls = [];
        for (const file of uploadedFiles) {
            try {
                const cloudUrl = await uploadToCloudinary(file.buffer, 'melan_portfolio');
                uploadedCloudinaryUrls.push(cloudUrl);
            } catch (cloudErr) {
                console.warn('Cloudinary upload file warning:', cloudErr.message);
            }
        }

        // 2. Parse existing or manual image URLs passed in body
        let finalImages = [...uploadedCloudinaryUrls];

        if (body.images) {
            try {
                const parsed = Array.isArray(body.images) ? body.images : JSON.parse(body.images || '[]');
                for (const img of parsed) {
                    if (img && typeof img === 'string') {
                        // If it's a base64 string and we have cloudinary configured, try upload
                        if (img.startsWith('data:image')) {
                            try {
                                const cloudRes = await cloudinary.uploader.upload(img, { folder: 'melan_portfolio' });
                                if (cloudRes?.secure_url && !finalImages.includes(cloudRes.secure_url)) {
                                    finalImages.push(cloudRes.secure_url);
                                }
                            } catch (base64Err) {
                                console.warn('Cloudinary base64 upload warning:', base64Err.message);
                            }
                        } else if (!finalImages.includes(img) && (img.startsWith('http://') || img.startsWith('https://') || img.startsWith('./') || img.startsWith('/'))) {
                            finalImages.push(img);
                        }
                    }
                }
            } catch {
                // Ignore parse errors on body.images
            }
        }

        // Fallback default image if none provided
        if (finalImages.length === 0) {
            finalImages = ['./assets/work-1.png'];
        }

        const projectData = {
            name: body.name || 'Untitled Project',
            description: body.description || '',
            overview: body.overview || body.description || '',
            tech: body.tech || '',
            year: body.year || new Date().getFullYear().toString(),
            github: body.github || '',
            live: body.live || '',
            images: finalImages,
            image: finalImages[0]
        };

        let savedProject;
        if (isMongoConnected()) {
            savedProject = await Project.create(projectData);
        } else {
            savedProject = {
                ...projectData,
                _id: 'proj_' + Date.now(),
                createdAt: new Date().toISOString()
            };
            const local = getLocalProjects();
            local.unshift(savedProject);
            saveLocalProjects(local);
        }

        return res.status(201).json({ success: true, project: savedProject });
    } catch (err) {
        console.error('Error in addProject:', err);
        return res.status(500).json({ success: false, message: err.message || 'Server failed to save project' });
    }
};

// DELETE /api/projects/:id - Delete project
export const deleteProject = async (req, res) => {
    try {
        const { id } = req.params;
        if (isMongoConnected() && mongoose.Types.ObjectId.isValid(id)) {
            await Project.findByIdAndDelete(id);
        }
        const local = getLocalProjects();
        const filtered = local.filter(p => p._id !== id && p.id !== id);
        saveLocalProjects(filtered);

        return res.json({ success: true, message: 'Project deleted successfully' });
    } catch (err) {
        return res.status(500).json({ success: false, message: err.message });
    }
};

// PUT /api/projects/:id - Update existing project with details & images
export const updateProject = async (req, res) => {
    try {
        const { id } = req.params;
        const body = req.body || {};
        const uploadedFiles = req.files || [];

        // 1. Upload any new files to Cloudinary
        const uploadedCloudinaryUrls = [];
        for (const file of uploadedFiles) {
            try {
                const cloudUrl = await uploadToCloudinary(file.buffer, 'melan_portfolio');
                uploadedCloudinaryUrls.push(cloudUrl);
            } catch (cloudErr) {
                console.warn('Cloudinary upload file warning:', cloudErr.message);
            }
        }

        // 2. Parse existing or retained image URLs passed in body
        let finalImages = [];
        if (body.images) {
            try {
                const parsed = Array.isArray(body.images) ? body.images : JSON.parse(body.images || '[]');
                for (const img of parsed) {
                    if (img && typeof img === 'string') {
                        if (img.startsWith('data:image')) {
                            try {
                                const cloudRes = await cloudinary.uploader.upload(img, { folder: 'melan_portfolio' });
                                if (cloudRes?.secure_url && !finalImages.includes(cloudRes.secure_url)) {
                                    finalImages.push(cloudRes.secure_url);
                                }
                            } catch (e) {
                                console.warn('Base64 upload error:', e.message);
                            }
                        } else if (!finalImages.includes(img) && (img.startsWith('http://') || img.startsWith('https://') || img.startsWith('./') || img.startsWith('/'))) {
                            finalImages.push(img);
                        }
                    }
                }
            } catch {
                // Ignore parse error
            }
        }

        // Combine new uploads with existing images
        finalImages = [...uploadedCloudinaryUrls, ...finalImages];

        if (finalImages.length === 0) {
            finalImages = ['./assets/work-1.png'];
        }

        const updateFields = {
            name: body.name,
            description: body.description,
            overview: body.overview || body.description,
            tech: body.tech,
            year: body.year,
            github: body.github,
            live: body.live,
            images: finalImages,
            image: finalImages[0]
        };

        // Remove undefined fields
        Object.keys(updateFields).forEach(key => updateFields[key] === undefined && delete updateFields[key]);

        let updatedProject;
        if (isMongoConnected() && mongoose.Types.ObjectId.isValid(id)) {
            updatedProject = await Project.findByIdAndUpdate(
                id,
                { $set: updateFields },
                { new: true }
            );
        }

        // Also update local storage fallback if exists
        const local = getLocalProjects();
        const index = local.findIndex(p => p._id === id || p.id === id);
        if (index !== -1) {
            local[index] = { ...local[index], ...updateFields };
            saveLocalProjects(local);
            if (!updatedProject) updatedProject = local[index];
        } else if (!updatedProject) {
            updatedProject = { ...updateFields, _id: id };
            local.unshift(updatedProject);
            saveLocalProjects(local);
        }

        if (!updatedProject) {
            return res.status(404).json({ success: false, message: 'Project not found to update' });
        }

        return res.json({ success: true, project: updatedProject });
    } catch (err) {
        console.error('Error in updateProject:', err);
        return res.status(500).json({ success: false, message: err.message || 'Server failed to update project' });
    }
};
