import './App.css'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import { useEffect } from 'react'
import Home from './pages/Home/Home.jsx'
import Jobs from './pages/Jobs/Jobs.jsx'
import DesignSystemDemo from './components/DesignSystemDemo.jsx'
import Navbar from './components/Navbar/Navbar.jsx'
import Footer from './components/Footer/Footer.jsx'
import { initializeTheme } from './utils/theme.js'
import Events from './pages/Events/Events.jsx'
import Resources from './pages/Resources/Resources.jsx'
import Profile from './pages/Profile/Profile.jsx'
import Settings from './pages/Settings/Settings.jsx'
import About from './pages/About/About.jsx'
import Students from './pages/Students/Students.jsx'
import Employers from './pages/Employers/Employers.jsx'

function App() {
  useEffect(() => {
    initializeTheme();
  }, []);
 
  const Layout = ({ children }) => (
    <>
      <Navbar userName="John Doe" onNotificationClick={() => console.log('Notifications clicked')} />
      {children}
      <Footer />
    </>
  );

  const router = createBrowserRouter([
    {
      path: "/",
      element: <Layout><Home /></Layout>
    },
    {
      path: "/jobs",
      element: <Layout><Jobs /></Layout>
    },
    {
      path: "/events",
      element: <Layout><Events /></Layout>
    },
    {
      path: "/resources",
      element: <Layout><Resources /></Layout>
    },
    {
      path: "/students",
      element: <Layout><Students /></Layout>
    },
    {
      path: "/employers",
      element: <Layout><Employers /></Layout>
    },
    {
      path: "/about",
      element: <Layout><About /></Layout>
    },
    {
      path: "/profile",
      element: <Layout><Profile /></Layout>
    },
    {
      path: "/settings",
      element: <Layout><Settings /></Layout>
    },
    {
      path: "/design-system",
      element: <Layout><DesignSystemDemo /></Layout>
    }
  ]);

  return (
    <>
      <RouterProvider router={router} />
    </>
  );
}

export default App;
