import './App.css'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import { useEffect } from 'react'
import { AuthProvider } from './contexts/AuthContext.jsx'
import NavigateProvider from './components/NavigateProvider.jsx'
import ScrollToTop from './components/ScrollToTop.jsx'
import Home from './pages/Home/Home.jsx'
import Jobs from './pages/Jobs/Jobs.jsx'
import JobDetails from './pages/Jobs/JobDetails.jsx'
import DesignSystemDemo from './components/DesignSystemDemo.jsx'
import Navbar from './components/Navbar/Navbar.jsx'
import Footer from './components/Footer/Footer.jsx'
import { initializeTheme } from './utils/theme.js'
import Events from './pages/Events/Events.jsx'
import EventDetails from './pages/Events/EventDetails.jsx'
import Resources from './pages/Resources/Resources.jsx'
import ResourceDetail from './pages/Resources/ResourceDetail.jsx'
import Profile from './pages/Profile/Profile.jsx'
import Settings from './pages/Settings/Settings.jsx'
import About from './pages/About/About.jsx'
import Students from './pages/Students/Students.jsx'
import Employers from './pages/Employers/Employers.jsx'
import Login from './pages/Login/Login.jsx';
import SignUp from './pages/SignUp/SignUp.jsx'
import AdminDashboard from './admin/AdminDashboard.jsx'
import JobsList from './admin/Jobs/JobsList.jsx'
import JobDetail from './admin/Jobs/JobDetail.jsx'
import JobCreate from './admin/Jobs/JobCreate.jsx'
import JobEdit from './admin/Jobs/JobEdit.jsx'
import EventsList from './admin/Events/EventsList.jsx'
import EventDetail from './admin/Events/EventDetail.jsx'
import EventCreate from './admin/Events/EventCreate.jsx'
import EventEdit from './admin/Events/EventEdit.jsx'
import ResourcesList from './admin/Resource/ResourcesList.jsx'
import AdminResourceDetail from './admin/Resource/ResourceDetail.jsx'
import ResourceCreate from './admin/Resource/ResourceCreate.jsx'
import ResourceEdit from './admin/Resource/ResourceEdit.jsx'
import JobseekersManagement from './admin/Management/JobseekersManagement.jsx'
import SocietiesManagement from './admin/Management/SocietiesManagement.jsx'

function App() {
  useEffect(() => {
    initializeTheme();
  }, []);
 
  const Layout = ({ children }) => (
    <NavigateProvider>
      <ScrollToTop />
      <Navbar userName="John Doe" onNotificationClick={() => console.log('Notifications clicked')} />
      {children}
      <Footer />
    </NavigateProvider>
  );

  const AuthLayout = ({ children }) => (
    // TODO: Needs to not pass down username if not logged in
    <NavigateProvider>
      <ScrollToTop />
      <Navbar userName="John Doe" onNotificationClick={() => console.log('Notifications clicked')} />
      {children}
    </NavigateProvider>
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
      path: "jobs/:jobId",
      element: <Layout><JobDetails /></Layout>
    },
    {
      path: "/events",
      element: <Layout><Events /></Layout>
    },
    {
      path: "/events/:eventId",
      element: <Layout><EventDetails /></Layout>
    },
    {
      path: "/resources",
      element: <Layout><Resources /></Layout>
    },
    {
      path: "/resources/:id",
      element: <Layout><ResourceDetail /></Layout>
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
      path: "/login",
      element: <AuthLayout><Login /></AuthLayout>
    },
    {
      path: "/profile",
      element: <AuthLayout><Profile /></AuthLayout>
    },
    {
      path: "/settings",
      element: <Layout><Settings /></Layout>
    },
    {
      path: "/signUp",
      element: <AuthLayout><SignUp /></AuthLayout>
    },
    {
      path: "/design-system",
      element: <Layout><DesignSystemDemo /></Layout>
    },
    {
      path: "/admin",
      element: <Layout><AdminDashboard /></Layout>
    },
    {
      path: "/admin/jobs",
      element: <Layout><JobsList /></Layout>
    },
    {
      path: "/admin/jobs/new",
      element: <Layout><JobCreate /></Layout>
    },
    {
      path: "/admin/jobs/:id",
      element: <Layout><JobDetail /></Layout>
    },
    {
      path: "/admin/jobs/:id/edit",
      element: <Layout><JobEdit /></Layout>
    },
    {
      path: "/admin/events",
      element: <Layout><EventsList /></Layout>
    },
    {
      path: "/admin/events/new",
      element: <Layout><EventCreate /></Layout>
    },
    {
      path: "/admin/events/:id",
      element: <Layout><EventDetail /></Layout>
    },
    {
      path: "/admin/events/:id/edit",
      element: <Layout><EventEdit /></Layout>
    },
    {
      path: "/admin/resources",
      element: <Layout><ResourcesList /></Layout>
    },
    {
      path: "/admin/resources/new",
      element: <Layout><ResourceCreate /></Layout>
    },
    {
      path: "/admin/resources/:id",
      element: <Layout><AdminResourceDetail /></Layout>
    },
    {
      path: "/admin/resources/:id/edit",
      element: <Layout><ResourceEdit /></Layout>
    },
    {
      path: "/admin/jobseekers",
      element: <Layout><JobseekersManagement /></Layout>
    },
    {
      path: "/admin/societies",
      element: <Layout><SocietiesManagement /></Layout>
    }
  ]);

  return (
    <AuthProvider>
      <RouterProvider router={router} />
    </AuthProvider>
  );
}

export default App;
