import './App.css'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import { useEffect } from 'react'
import Home from './pages/Home/Home.jsx'
import Jobs from './pages/Jobs/Jobs.jsx'
import DesignSystemDemo from './components/DesignSystemDemo.jsx'
import Navbar from './components/Navbar/Navbar.jsx'
import { initializeTheme } from './utils/theme.js'
import Events from './pages/Events/Events.jsx'
import Resources from './pages/Resources/Resources.jsx'

function App() {
  useEffect(() => {
    initializeTheme();
  }, []);
  // Layout wrapper component
  const Layout = ({ children }) => (
    <>
      <Navbar userName="John Doe" onNotificationClick={() => console.log('Notifications clicked')} />
      {children}
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
      element: <Layout><div className="p-8 bg-background text-foreground min-h-screen"><h1>Students Page</h1><p>Coming soon...</p></div></Layout>
    },
    {
      path: "/employers",
      element: <Layout><div className="p-8 bg-background text-foreground min-h-screen"><h1>Mentors Page</h1><p>Coming soon...</p></div></Layout>
    },
    {
      path: "/about",
      element: <Layout><div className="p-8 bg-background text-foreground min-h-screen"><h1>About Us Page</h1><p>Coming soon...</p></div></Layout>
    },
    {
      path: "/profile",
      element: <Layout><div className="p-8 bg-background text-foreground min-h-screen"><h1>Profile Page</h1><p>Coming soon...</p></div></Layout>
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
