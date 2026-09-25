import { createContext, useContext, useState, useEffect } from 'react';
import { getAuthHeaders } from '../utils/auth';

const ProfileContext = createContext(null);

export const useProfile = () => {
    const context = useContext(ProfileContext);
    if (!context) {
        throw new Error('useProfile must be used within a ProfileProvider');
    }
    return context;
};

export function ProfileProvider({ children }) {
    const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
    const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:5000';

    const defaultProfile = {
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

    const [profile, setProfile] = useState(() => {
        try {
            const saved = localStorage.getItem('melan_cached_profile');
            return saved ? JSON.parse(saved) : defaultProfile;
        } catch {
            return defaultProfile;
        }
    });

    const [loading, setLoading] = useState(false);
    const [projects, setProjects] = useState([]);
    const [projectsLoading, setProjectsLoading] = useState(false);

    // Fetch Profile from backend API
    const fetchProfile = async () => {
        setLoading(true);
        try {
            const res = await fetch(`${API_URL}/profile`).then(r => r.json());
            if (res && res.success && res.profile) {
                setProfile(res.profile);
                localStorage.setItem('melan_cached_profile', JSON.stringify(res.profile));
            }
        } catch {
            // Keep current / cached profile on network error
        } finally {
            setLoading(false);
        }
    };

    // Update Profile (supports FormData with avatarFile or regular JSON)
    const updateProfile = async (data) => {
        setLoading(true);
        try {
            let res;
            if (data instanceof FormData) {
                res = await fetch(`${API_URL}/profile`, {
                    method: 'POST',
                    headers: getAuthHeaders(),
                    body: data
                }).then(r => r.json());
            } else {
                res = await fetch(`${API_URL}/profile`, {
                    method: 'POST',
                    headers: getAuthHeaders({ 'Content-Type': 'application/json' }),
                    body: JSON.stringify(data)
                }).then(r => r.json());
            }

            if (res && res.success && res.profile) {
                setProfile(res.profile);
                localStorage.setItem('melan_cached_profile', JSON.stringify(res.profile));
                return { success: true, profile: res.profile };
            }
            throw new Error(res?.message || 'Failed to update profile');
        } catch (err) {
            // Update locally if server unreachable
            if (!(data instanceof FormData)) {
                const updated = { ...profile, ...data };
                setProfile(updated);
                localStorage.setItem('melan_cached_profile', JSON.stringify(updated));
                return { success: true, profile: updated };
            }
            return { success: false, error: err.message };
        } finally {
            setLoading(false);
        }
    };

    // Fetch Projects
    const fetchProjects = async () => {
        setProjectsLoading(true);
        try {
            const res = await fetch(`${API_URL}/projects`).then(r => r.json());
            if (res && res.success && res.projects) {
                setProjects(res.projects);
            }
        } catch {
            // Ignore
        } finally {
            setProjectsLoading(false);
        }
    };

    useEffect(() => {
        fetchProfile();
        fetchProjects();
    }, []);

    const value = {
        profile,
        loading,
        fetchProfile,
        updateProfile,
        projects,
        setProjects,
        projectsLoading,
        fetchProjects,
        API_URL,
        BACKEND_URL
    };

    return (
        <ProfileContext.Provider value={value}>
            {children}
        </ProfileContext.Provider>
    );
}
