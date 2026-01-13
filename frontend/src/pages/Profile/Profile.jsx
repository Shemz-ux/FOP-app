import { useState } from "react";
import { Briefcase, Calendar, Heart, User, Settings, Bell, ChevronDown } from "lucide-react";
import JobCard from "../../components/JobCard/JobCard";
import EventCard from "../../components/EventCard/EventCard";
import { Avatar, AvatarImage, AvatarFallback } from "../../components/ui/Avatar";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "../../components/ui/Tabs";
import { Link } from "react-router-dom";
import Pagination from "../../components/Pagination/Pagination";
import EducationCard from "../../components/ui/EducationCard";
import CVUploadCard from "../../components/ui/CVUploadCard";
import {appliedJobs} from "../../services/Jobs/appliedJobs";
import {savedJobs} from "../../services/Jobs/savedJobs";
import {registeredEvents} from "../../services/Events/registeredEvents";
import {savedEvents} from "../../services/Events/savedEvents";

export default function ProfilePage() {
  const [favorites, setFavorites] = useState(new Set([0, 1]));
  const [eventFavorites, setEventFavorites] = useState(new Set([0]));
  const [activeTab, setActiveTab] = useState("saved-jobs");
  
  // Pagination state for each tab
  const [savedJobsPage, setSavedJobsPage] = useState(1);
  const [appliedJobsPage, setAppliedJobsPage] = useState(1);
  const [savedEventsPage, setSavedEventsPage] = useState(1);
  const [registeredEventsPage, setRegisteredEventsPage] = useState(1);
  const itemsPerPage = 6;
  
  // TODO: Fetch from backend
  const [educationData, setEducationData] = useState({
    education_level: "undergraduate",
    institution_name: "University of London - King's College",
    uni_year: "2nd",
    degree_type: "bsc",
    area_of_study: "Computer Science",
    role_interest_option_one: "Software Developer",
    role_interest_option_two: "Data Scientist",
    society: "Tech Society",
  });

  // TODO: Fetch from backend
  const [uploadedCV, setUploadedCV] = useState({
    name: "Fintan_Cabrera_CV.pdf",
    size: "245 KB",
    uploadedDate: "January 2, 2026",
  });

  const toggleFavorite = (index) => {
    setFavorites((prev) => {
      const newSet = new Set(prev);
      newSet.has(index) ? newSet.delete(index) : newSet.add(index);
      return newSet;
    });
  };

  const toggleEventFavorite = (index) => {
    setEventFavorites((prev) => {
      const newSet = new Set(prev);
      newSet.has(index) ? newSet.delete(index) : newSet.add(index);
      return newSet;
    });
  };

  const handleSaveEducation = (newData) => {
    setEducationData(newData);
    // save to backend here
  };

  const handleCVUpload = (newCV) => {
    setUploadedCV(newCV);
    // save to backend here
  };

  const handleCVDelete = () => {
    setUploadedCV({
      name: "",
      size: "",
      uploadedDate: "",
    });
    // delete from backend here
  };

  // Pagination helpers
  const getPaginatedItems = (items, currentPage) => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return items.slice(startIndex, endIndex);
  };

  const getTotalPages = (items) => Math.ceil(items.length / itemsPerPage);

  // Paginated data
  const paginatedSavedJobs = getPaginatedItems(savedJobs, savedJobsPage);
  const paginatedAppliedJobs = getPaginatedItems(appliedJobs, appliedJobsPage);
  const paginatedSavedEvents = getPaginatedItems(savedEvents, savedEventsPage);
  const paginatedRegisteredEvents = getPaginatedItems(registeredEvents, registeredEventsPage);

  return (
    <div className="min-h-screen">
      {/* Profile Header */}
      <section className="bg-secondary/30 border-b border-border">
        <div className="container mx-auto px-6 py-12">
          <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
            <Avatar className="w-30 h-30">
              <AvatarFallback className="text-3xl">FC</AvatarFallback>
            </Avatar>

            <div className="flex-1 text-left">
              <h1 className="text-3xl mb-2 text-foreground">Fintan Cabrera</h1>
              <p className="text-muted-foreground mb-4">
                Product Designer • San Francisco, CA
              </p>

              <div className="flex flex-wrap gap-3">
                <Link
                  to="/settings"
                  className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:opacity-90 transition-opacity flex items-center gap-2"
                >
                  <Settings className="w-4 h-4" />
                  Account Settings
                </Link>

                {/* <button className="px-4 py-2 border border-border text-foreground rounded-lg hover:bg-secondary transition-colors flex items-center gap-2">
                  <Bell className="w-4 h-4" />
                  Preferences
                </button> */}
              </div>
            </div>

            <div className="grid grid-cols-3 gap-8 text-center">
              <div>
                <div className="text-2xl mb-1 text-foreground">
                  {appliedJobs.length}
                </div>
                <div className="text-muted-foreground text-sm">Applied</div>
              </div>
              <div>
                <div className="text-2xl mb-1 text-foreground">
                  {savedJobs.length}
                </div>
                <div className="text-muted-foreground text-sm">Saved</div>
              </div>
              <div>
                <div className="text-2xl mb-1 text-foreground">
                  {registeredEvents.length}
                </div>
                <div className="text-muted-foreground text-sm">Events</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Dashboard Content */}
      <div className="container mx-auto px-6 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* LEFT COLUMN */}
          <div className="lg:col-span-1 space-y-6">
            <EducationCard 
              initialData={educationData}
              onSave={handleSaveEducation}
            />

            <CVUploadCard
              initialCV={uploadedCV}
              onUpload={handleCVUpload}
              onDelete={handleCVDelete}
            />
          </div>

          {/* RIGHT COLUMN */}
          <div className="lg:col-span-3">
            {/* Mobile Dropdown */}
            <div className="md:hidden mb-6 relative">
              <select
                value={activeTab}
                onChange={(e) => setActiveTab(e.target.value)}
                className="w-full px-4 py-3 pr-10 bg-card border border-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-primary appearance-none"
              >
                <option value="saved-jobs">Saved Jobs</option>
                <option value="applied-jobs">Applied Jobs</option>
                <option value="saved-events">Saved Events</option>
                <option value="registered-events">Registered Events</option>
              </select>
              <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground pointer-events-none" />
            </div>

            {/* Desktop Tabs */}
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="hidden md:grid grid-cols-4 mb-8 w-full">
                <TabsTrigger value="saved-jobs">Saved Jobs</TabsTrigger>
                <TabsTrigger value="applied-jobs">Applied Jobs</TabsTrigger>
                <TabsTrigger value="saved-events">Saved Events</TabsTrigger>
                <TabsTrigger value="registered-events">Registered Events</TabsTrigger>
              </TabsList>

              <TabsContent value="saved-jobs">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {paginatedSavedJobs.map((job, index) => (
                    <JobCard
                      key={index}
                      {...job}
                      isFavorite={favorites.has(index)}
                      onFavoriteClick={() => toggleFavorite(index)}
                    />
                  ))}
                </div>
                {savedJobs.length > itemsPerPage && (
                  <Pagination
                    currentPage={savedJobsPage}
                    totalPages={getTotalPages(savedJobs)}
                    onPageChange={setSavedJobsPage}
                  />
                )}
              </TabsContent>

              <TabsContent value="applied-jobs">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {paginatedAppliedJobs.map((job, index) => (
                    <JobCard
                      key={index}
                      {...job}
                      isFavorite={favorites.has(index)}
                      onFavoriteClick={() => toggleFavorite(index)}
                    />
                  ))}
                </div>
                {appliedJobs.length > itemsPerPage && (
                  <Pagination
                    currentPage={appliedJobsPage}
                    totalPages={getTotalPages(appliedJobs)}
                    onPageChange={setAppliedJobsPage}
                  />
                )}
              </TabsContent>

              <TabsContent value="saved-events">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {paginatedSavedEvents.map((event, index) => (
                    <EventCard
                      key={index}
                      {...event}
                      isFavorite={eventFavorites.has(index)}
                      onFavoriteClick={() => toggleEventFavorite(index)}
                    />
                  ))}
                </div>
                {savedEvents.length > itemsPerPage && (
                  <Pagination
                    currentPage={savedEventsPage}
                    totalPages={getTotalPages(savedEvents)}
                    onPageChange={setSavedEventsPage}
                  />
                )}
              </TabsContent>

              <TabsContent value="registered-events">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {paginatedRegisteredEvents.map((event, index) => (
                    <EventCard
                      key={index}
                      {...event}
                      isFavorite={eventFavorites.has(index)}
                      onFavoriteClick={() => toggleEventFavorite(index)}
                    />
                  ))}
                </div>
                {registeredEvents.length > itemsPerPage && (
                  <Pagination
                    currentPage={registeredEventsPage}
                    totalPages={getTotalPages(registeredEvents)}
                    onPageChange={setRegisteredEventsPage}
                  />
                )}
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </div>
  );
}

