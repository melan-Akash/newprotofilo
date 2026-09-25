import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
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
        return <Navigate to="/cms-login" replace />;
    }
    try {
        const parsed = JSON.parse(authData);
        if (!parsed || !parsed.token) {
            localStorage.removeItem('melan_admin_auth');
            return <Navigate to="/cms-login" replace />;
        }
    } catch {
        localStorage.removeItem('melan_admin_auth');
        return <Navigate to="/cms-login" replace />;
    }
    return children;
}

export default function App() {
    return (
        <ProfileProvider>
            <BrowserRouter>
                <Routes>
                    {/* Client Portfolio */}
                    <Route path="/" element={<MainPortfolio />} />

                    {/* CMS Admin Login Route */}
                    <Route path="/cms-login" element={<Login />} />
                    <Route path="/admin/login" element={<Navigate to="/cms-login" replace />} />

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