import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { ProfileProvider } from './context/ProfileContext';
import Contact from './components/Contact';
import Footer from './components/Footer';
import Work from './components/Work';
import Services from './components/Services';
import About from './components/About';
import Header from './components/Header';
import Navbar from './components/Navbar';
import LenisScroll from './components/LenisScroll';
import Experience from './components/Experience';
import Education from './components/Education';

import Login from './admin/login';
import Dashboard from './admin/dashbord';
import ProjectDetails from './pages/ProjectDetails';

function MainPortfolio() {
    return (
        <>
            <LenisScroll />
            <Navbar />
            <Header />
            <About />
            <Experience />
            <Services />
            <Work />
            <Education />
            <Contact />
            <Footer />
        </>
    );
}

// Route Guard: Ensures nobody can access /admin without a valid backend authenticated session
function ProtectedAdmin({ children }) {
    const authData = localStorage.getItem('melan_admin_auth');
    if (!authData) {
        return <Navigate to="/cmsdash-login" replace />;
    }
    try {
        const parsed = JSON.parse(authData);
        if (!parsed || !parsed.token) {
            localStorage.removeItem('melan_admin_auth');
            return <Navigate to="/cmsdash-login" replace />;
        }
    } catch {
        localStorage.removeItem('melan_admin_auth');
        return <Navigate to="/cmsdash-login" replace />;
    }
    return children;
}

export default function App() {
    return (
        <ProfileProvider>
            <BrowserRouter>
                <Toaster
                    position="top-right"
                    reverseOrder={false}
                    toastOptions={{
                        duration: 3500,
                        style: {
                            background: '#0c182d',
                            color: '#fff',
                            border: '1px solid rgba(255, 255, 255, 0.1)',
                            borderRadius: '16px',
                            fontSize: '13px',
                            fontFamily: 'Outfit, sans-serif',
                            boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.3), 0 10px 10px -5px rgba(0, 0, 0, 0.2)'
                        },
                        success: {
                            iconTheme: {
                                primary: '#0ea5e9',
                                secondary: '#fff'
                            }
                        },
                        error: {
                            iconTheme: {
                                primary: '#ef4444',
                                secondary: '#fff'
                            }
                        }
                    }}
                />
                <Routes>
                    {/* Client Portfolio */}
                    <Route path="/" element={<MainPortfolio />} />

                    {/* Dedicated Project Details Page */}
                    <Route path="/project/:id" element={<ProjectDetails />} />

                    {/* CMS Admin Login Route */}
                    <Route path="/cmsdash-login" element={<Login />} />
                    <Route path="/cms-login" element={<Navigate to="/cmsdash-login" replace />} />
                    <Route path="/admin/login" element={<Navigate to="/cmsdash-login" replace />} />

                    {/* Protected Admin Routes */}
                    <Route
                        path="/admin"
                        element={
                            <ProtectedAdmin>
                                <Dashboard />
                            </ProtectedAdmin>
                        }
                    />
                    <Route
                        path="/admin/*"
                        element={
                            <ProtectedAdmin>
                                <Dashboard />
                            </ProtectedAdmin>
                        }
                    />

                    {/* Fallback to home */}
                    <Route path="*" element={<Navigate to="/" replace />} />
                </Routes>
            </BrowserRouter>
        </ProfileProvider>
    );
}