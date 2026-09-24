import { BrowserRouter, Routes, Route } from 'react-router-dom';
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

export default function App() {
    return (
        <ProfileProvider>
            <BrowserRouter>
                <Routes>
                    {/* Client Portfolio */}
                    <Route path="/" element={<MainPortfolio />} />

                    {/* Admin Routes */}
                    <Route path="/admin/login" element={<Login />} />
                    <Route path="/admin" element={<Dashboard />} />
                    <Route path="/admin/*" element={<Dashboard />} />
                </Routes>
            </BrowserRouter>
        </ProfileProvider>
    );
}