import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { JobService, Job as JobType, JobApplication as JobApplicationType } from "@/lib/jobService";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Brain,
  Search,
  MapPin,
  Building2,
  Clock,
  Bookmark,
  Heart,
  Filter,
  ChevronRight,
  DollarSign,
  Users,
  TrendingUp,
  Bell,
  Settings,
  LogOut,
  Briefcase,
  FileText,
  BarChart3,
} from "lucide-react";

export default function JobSeekerDashboard() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState("feed");
  const [savedJobs, setSavedJobs] = useState<number[]>([]);
  const [applications, setApplications] = useState<JobApplicationType[]>([]);
  const [searchResults, setSearchResults] = useState<JobType[]>([]);
  const [jobs, setJobs] = useState<JobType[]>([]);
  const [isLoadingJobs, setIsLoadingJobs] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const [notifications, setNotifications] = useState<any[]>([]);
  const [profileViews, setProfileViews] = useState(0);
  const [profile, setProfile] = useState({
    firstName: user?.firstName || "",
    lastName: user?.lastName || "",
    email: user?.email || "",
    phone: user?.phone || "",
    address: "",
    city: "",
    state: "",
    zipCode: "",
    jobTitle: user?.title || "",
    experience: user?.experience || "",
    skills: user?.skills || ["React", "TypeScript", "Node.js", "Python", "AWS"],
    coverLetter: "",
    linkedin: "",
    portfolio: "",
    jobType: "Full-time",
    salaryRange: "",
    preferredLocation: user?.location || "",
    noticePeriod: "2 weeks",
    profilePhoto: "",
    resume: "",
  });

  // Load jobs from API
  const loadJobs = async () => {
    setIsLoadingJobs(true);
    try {
      const fetchedJobs = await JobService.getAllJobs(profile.skills);
      setJobs(fetchedJobs);
    } catch (error) {
      console.error("Failed to load jobs:", error);
      addNotification("Failed to load jobs. Please try again later.", "general");
    } finally {
      setIsLoadingJobs(false);
    }
  };

  // Load user applications from API
  const loadUserApplications = async () => {
    if (!user?.email) {
      setApplications([]);
      return;
    }

    try {
      const fetchedApplications = await JobService.getUserApplications(user.email);
      setApplications(Array.isArray(fetchedApplications) ? fetchedApplications : []);

      // Update localStorage for backwards compatibility
      const localApplications = fetchedApplications.map(app => ({
        jobId: app.jobId,
        appliedAt: app.appliedAt,
        status: app.status
      }));
      localStorage.setItem("applications", JSON.stringify(localApplications));
    } catch (error) {
      console.error("Failed to load applications:", error);
      setApplications([]);
    }
  };

  // Calculate real stats based on user data
  const calculateStats = () => {
    const applicationsCount = applications.length;
    const savedJobsCount = savedJobs.length;
    const jobMatchesCount = jobs.length; // Total available jobs
    const recentApplications = applications.filter((app) => {
      const appDate = new Date(app.appliedAt);
      const weekAgo = new Date();
      weekAgo.setDate(weekAgo.getDate() - 7);
      return appDate > weekAgo;
    }).length;

    const recentProfileViews = Math.floor(profileViews * 0.2); // Simulate recent views
    const newJobMatches = Math.floor(jobMatchesCount * 0.05); // Simulate new matches
    const recentSavedJobs = Math.max(
      0,
      savedJobsCount - Math.floor(savedJobsCount * 0.8),
    ); // Simulate recent saves

    return [
      {
        label: "Applications Sent",
        value: applicationsCount.toString(),
        icon: FileText,
        trend:
          recentApplications > 0
            ? `+${recentApplications} this week`
            : "No new applications",
      },
      {
        label: "Profile Views",
        value: profileViews.toString(),
        icon: Users,
        trend:
          recentProfileViews > 0
            ? `+${recentProfileViews} this week`
            : "No recent views",
      },
      {
        label: "Job Matches",
        value: jobMatchesCount.toString(),
        icon: TrendingUp,
        trend:
          newJobMatches > 0 ? `+${newJobMatches} new today` : "No new matches",
      },
      {
        label: "Saved Jobs",
        value: savedJobsCount.toString(),
        icon: Bookmark,
        trend: recentSavedJobs > 0 ? `${recentSavedJobs} new` : "No new saves",
      },
    ];
  };

  const stats = calculateStats();

  const sidebarItems = [
    { id: "feed", label: "Job Feed", icon: Briefcase },
    { id: "applications", label: "My Applications", icon: FileText },
    { id: "saved", label: "Saved Jobs", icon: Bookmark },
    { id: "profile", label: "Profile", icon: Users },
    { id: "analytics", label: "Analytics", icon: BarChart3 },
  ];

  // Function to add sample data for testing
  const addSampleData = () => {
    // Add sample saved jobs
    const sampleSavedJobs = [2]; // Save "Full Stack Engineer" job
    setSavedJobs(sampleSavedJobs);
    localStorage.setItem("savedJobs", JSON.stringify(sampleSavedJobs));

    // Add sample applications
    const sampleApplications = [
      {
        jobId: 1,
        appliedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(), // 2 days ago
        status: "Under Review"
      }
    ];
    setApplications(sampleApplications);
    localStorage.setItem("applications", JSON.stringify(sampleApplications));

    addNotification("Sample data added - check out your saved jobs and applications!", "general");
  };

  // Check authentication and load data
  useEffect(() => {
    // Redirect to login if not authenticated
    if (!user) {
      navigate("/login");
      return;
    }

    // Load saved jobs from localStorage
    const saved = JSON.parse(localStorage.getItem("savedJobs") || "[]");
    setSavedJobs(saved);

    // Load jobs from API
    loadJobs();

    // Load user applications from API
    loadUserApplications();

    const savedProfile = JSON.parse(
      localStorage.getItem("userProfile") || "{}",
    );

    // Merge user data with saved profile data, prioritizing user data for name/email
    setProfile(prev => ({
      ...prev,
      ...savedProfile,
      firstName: user.firstName || savedProfile.firstName || "",
      lastName: user.lastName || savedProfile.lastName || "",
      email: user.email || savedProfile.email || "",
      phone: user.phone || savedProfile.phone || "",
      jobTitle: user.title || savedProfile.jobTitle || "",
      experience: user.experience || savedProfile.experience || "",
      skills: user.skills || savedProfile.skills || ["React", "TypeScript", "Node.js"],
      preferredLocation: user.location || savedProfile.preferredLocation || "",
    }));

    const savedNotifications = JSON.parse(
      localStorage.getItem("notifications") || "[]",
    );
    setNotifications(savedNotifications);

    const views = JSON.parse(localStorage.getItem("profileViews") || "0");
    setProfileViews(views);
  }, [user, navigate]);

  const handleSaveJob = (jobId: number) => {
    const job = getJobById(jobId);
    if (!job) return;

    let updatedSavedJobs;
    let message;

    if (savedJobs.includes(jobId)) {
      // Remove from saved jobs
      updatedSavedJobs = savedJobs.filter((id) => id !== jobId);
      message = `Removed ${job.title} from saved jobs`;
    } else {
      // Add to saved jobs
      updatedSavedJobs = [...savedJobs, jobId];
      message = `Saved ${job.title} to your saved jobs`;
    }

    setSavedJobs(updatedSavedJobs);
    localStorage.setItem("savedJobs", JSON.stringify(updatedSavedJobs));

    // Add notification
    addNotification(message, "general");
  };

  const handleApplyNow = async (jobId: number) => {
    const job = getJobById(jobId);
    if (!job) return;

    // Check if already applied
    const alreadyApplied = applications.some(app => app.jobId === jobId);
    if (alreadyApplied) {
      alert("You have already applied to this job!");
      return;
    }

    if (!user) {
      alert("Please log in to apply for jobs.");
      return;
    }

    // Submit application via API
    const applicationData = {
      candidateName: `${profile.firstName} ${profile.lastName}`.trim() || user.firstName + " " + user.lastName,
      candidateEmail: user.email,
      candidatePhone: profile.phone,
      experience: profile.experience,
      skills: profile.skills,
      coverLetter: profile.coverLetter || `I am interested in the ${job.title} position at ${job.company}.`,
      matchScore: job.matchScore
    };

    const result = await JobService.applyToJob(jobId, applicationData);

    if (result.success) {
      // Reload applications to get the latest data
      await loadUserApplications();

      // Reload jobs to update applicant count
      await loadJobs();

      // Add notification
      addNotification(`Application submitted for ${job.title} at ${job.company}`, "application");

      // Simulate recruiter viewing profile when user applies
      incrementProfileViews();

      // Show success message
      alert(`Successfully applied to ${job.title} at ${job.company}!`);
    } else {
      alert(`Failed to apply: ${result.message}`);
    }
  };

  // Function to be called after successful job application
  const onJobApplicationSuccess = (jobTitle: string, company: string) => {
    addNotification(
      `Application submitted for ${jobTitle} at ${company}`,
      "application",
    );
  };

  const getJobById = (jobId: number) => {
    return jobs.find((job) => job.id === jobId);
  };

  const getSavedJobsList = () => {
    return jobs.filter((job) => savedJobs.includes(job.id));
  };

  const getApplicationsList = () => {
    return applications
      .map((app) => {
        const job = getJobById(app.jobId);
        return job
          ? { ...job, appliedAt: app.appliedAt, status: app.status }
          : null;
      })
      .filter(Boolean);
  };

  const handleWithdrawApplication = (jobId: number) => {
    const job = getJobById(jobId);
    if (!job) return;

    // Confirm withdrawal
    if (!confirm(`Are you sure you want to withdraw your application for ${job.title} at ${job.company}?`)) {
      return;
    }

    // Remove application from localStorage
    const updatedApplications = applications.filter(
      (app) => app.jobId !== jobId,
    );
    setApplications(updatedApplications);
    localStorage.setItem("applications", JSON.stringify(updatedApplications));

    // Add notification
    addNotification(`Withdrew application for ${job.title} at ${job.company}`, "general");
  };

  const handleProfileChange = (field: string, value: string) => {
    setProfile((prev) => ({ ...prev, [field]: value }));
  };

  const handleAddSkill = (skill: string) => {
    if (skill.trim() && !profile.skills.includes(skill.trim())) {
      const updatedSkills = [...profile.skills, skill.trim()];
      setProfile((prev) => ({ ...prev, skills: updatedSkills }));
    }
  };

  const handleRemoveSkill = (skillToRemove: string) => {
    const updatedSkills = profile.skills.filter(
      (skill) => skill !== skillToRemove,
    );
    setProfile((prev) => ({ ...prev, skills: updatedSkills }));
  };

  const handleSaveProfile = () => {
    // Save profile with photo data
    localStorage.setItem("userProfile", JSON.stringify(profile));
    // Increment profile views when user saves profile (simulating activity)
    incrementProfileViews();
    // Show success message (you could add toast notification here)
    alert("Profile saved successfully!");
  };

  const handleFileUpload = (type: "photo" | "resume", file: File) => {
    if (type === "photo") {
      // Convert image to base64 for persistent storage
      const reader = new FileReader();
      reader.onload = (e) => {
        const base64Image = e.target?.result as string;
        setProfile((prev) => ({ ...prev, profilePhoto: base64Image }));
        // Save immediately to localStorage
        const currentProfile = JSON.parse(
          localStorage.getItem("userProfile") || "{}",
        );
        const updatedProfile = { ...currentProfile, profilePhoto: base64Image };
        localStorage.setItem("userProfile", JSON.stringify(updatedProfile));
      };
      reader.readAsDataURL(file);
    } else {
      // For resume, just store the filename
      setProfile((prev) => ({ ...prev, resume: file.name }));
    }
  };

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    setIsSearching(query.length > 0);

    if (query.trim() === "") {
      setSearchResults([]);
      return;
    }

    // Filter jobs based on search query
    const filteredJobs = jobs.filter(
      (job) =>
        job.title.toLowerCase().includes(query.toLowerCase()) ||
        job.company.toLowerCase().includes(query.toLowerCase()) ||
        job.location.toLowerCase().includes(query.toLowerCase()) ||
        job.skills.some((skill) =>
          skill.toLowerCase().includes(query.toLowerCase()),
        ),
    );

    setSearchResults(filteredJobs);
  };

  const addNotification = (
    message: string,
    type: "application" | "general" = "general",
  ) => {
    const newNotification = {
      id: Date.now(),
      message,
      type,
      timestamp: new Date().toISOString(),
      read: false,
    };

    const updatedNotifications = [newNotification, ...notifications];
    setNotifications(updatedNotifications);
    localStorage.setItem("notifications", JSON.stringify(updatedNotifications));
  };

  const markNotificationAsRead = (id: number) => {
    const updatedNotifications = notifications.map((notif) =>
      notif.id === id ? { ...notif, read: true } : notif,
    );
    setNotifications(updatedNotifications);
    localStorage.setItem("notifications", JSON.stringify(updatedNotifications));
  };

  const getUnreadNotificationCount = () => {
    return notifications.filter((notif) => !notif.read).length;
  };

  const incrementProfileViews = () => {
    const newViews = profileViews + 1;
    setProfileViews(newViews);
    localStorage.setItem("profileViews", JSON.stringify(newViews));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50/50 via-white to-purple-50/50 relative">
      {/* Background decorations */}
      <div className="absolute inset-0 overflow-hidden -z-10">
        <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-blue-200/20 to-purple-200/20 rounded-full blur-3xl transform translate-x-1/2 -translate-y-1/2"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-gradient-to-tr from-purple-200/20 to-pink-200/20 rounded-full blur-3xl transform -translate-x-1/2 translate-y-1/2"></div>
      </div>

      {/* Header */}
      <header className="bg-white/80 backdrop-blur-md border-b border-slate-200/60 sticky top-0 z-50 shadow-sm">
        <div className="flex items-center justify-between px-6 py-4">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-white rounded-full overflow-hidden flex items-center justify-center">
                <img
                  src="https://cdn.builder.io/api/v1/image/assets%2Fe8df578c0f38439a97d1f3a56a1f7872%2F90c72f447e7b4bf69123889c8f3cd6be?format=webp&width=800"
                  alt="HireIQ Logo"
                  className="w-full h-full object-contain p-1"
                />
              </div>
              <span className="text-xl font-bold text-foreground">
                HireIQ
              </span>
            </div>

            <div className="hidden md:flex items-center gap-2 ml-8">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                <Input
                  placeholder="Search jobs, companies, skills..."
                  value={searchQuery}
                  onChange={(e) => handleSearch(e.target.value)}
                  className="pl-10 w-96"
                />
                {/* Search Results Dropdown */}
                {isSearching && (
                  <div className="absolute top-full left-0 right-0 bg-white border border-slate-200 rounded-md shadow-lg mt-1 max-h-96 overflow-y-auto z-50">
                    {searchResults.length > 0 ? (
                      searchResults.map((job) => (
                        <div
                          key={job.id}
                          className="p-3 hover:bg-slate-50 cursor-pointer border-b border-slate-100 last:border-b-0"
                          onClick={() => {
                            handleApplyNow(job.id);
                            setSearchQuery("");
                            setIsSearching(false);
                          }}
                        >
                          <div className="flex items-center gap-3">
                            <Avatar className="w-8 h-8">
                              <AvatarFallback className="bg-primary/10 text-primary text-xs">
                                {job.logo}
                              </AvatarFallback>
                            </Avatar>
                            <div className="flex-1">
                              <p className="font-medium text-sm">{job.title}</p>
                              <p className="text-xs text-muted-foreground">
                                {job.company} • {job.location}
                              </p>
                            </div>
                            <Badge variant="secondary" className="text-xs">
                              {job.matchScore}% match
                            </Badge>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="p-6 text-center">
                        <p className="text-muted-foreground">No roles found</p>
                        <p className="text-xs text-muted-foreground mt-1">
                          Try adjusting your search terms
                        </p>
                      </div>
                    )}
                  </div>
                )}
              </div>
              <Button
                size="sm"
                onClick={() => {
                  if (searchQuery.trim()) {
                    setActiveTab("feed");
                    setIsSearching(false);
                  }
                }}
              >
                <Search className="w-4 h-4" />
              </Button>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="relative">
              <Button variant="ghost" size="sm" className="relative">
                <Bell className="w-4 h-4" />
                {getUnreadNotificationCount() > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                    {getUnreadNotificationCount()}
                  </span>
                )}
              </Button>

              {/* Notification Dropdown - you can add state to show/hide this */}
              <div className="hidden absolute top-full right-0 bg-white border border-slate-200 rounded-md shadow-lg mt-1 w-80 max-h-96 overflow-y-auto z-50">
                <div className="p-3 border-b border-slate-200">
                  <h3 className="font-semibold text-sm">Notifications</h3>
                </div>
                {notifications.length > 0 ? (
                  notifications.slice(0, 5).map((notification) => (
                    <div
                      key={notification.id}
                      className={`p-3 border-b border-slate-100 last:border-b-0 ${
                        !notification.read ? "bg-blue-50" : ""
                      }`}
                      onClick={() => markNotificationAsRead(notification.id)}
                    >
                      <p className="text-sm">{notification.message}</p>
                      <p className="text-xs text-muted-foreground mt-1">
                        {new Date(notification.timestamp).toLocaleDateString()}
                      </p>
                    </div>
                  ))
                ) : (
                  <div className="p-6 text-center">
                    <p className="text-muted-foreground text-sm">
                      No notifications yet
                    </p>
                  </div>
                )}
              </div>
            </div>

            <Button variant="ghost" size="sm">
              <Settings className="w-4 h-4" />
            </Button>

            <Avatar
              className="w-8 h-8 cursor-pointer hover:ring-2 hover:ring-primary hover:ring-offset-2 transition-all"
              onClick={() => {
                setActiveTab("profile");
                incrementProfileViews();
              }}
            >
              <AvatarImage src={profile.profilePhoto} />
              <AvatarFallback>
                {profile.firstName && profile.lastName
                  ? `${profile.firstName.charAt(0)}${profile.lastName.charAt(0)}`.toUpperCase()
                  : "JS"}
              </AvatarFallback>
            </Avatar>

            <Button variant="ghost" size="sm" onClick={() => {
              logout();
              navigate("/");
            }}>
              <LogOut className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </header>

      <div className="flex">
        {/* Sidebar */}
        <aside className="w-64 bg-white/60 backdrop-blur-md border-r border-slate-200/60 min-h-[calc(100vh-73px)]">
          <div className="p-6">
            <div className="space-y-3">
              {sidebarItems.map((item) => (
                <Button
                  key={item.id}
                  variant={activeTab === item.id ? "default" : "ghost"}
                  className={`w-full justify-start rounded-xl transition-all duration-200 ${
                    activeTab === item.id
                      ? "bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 shadow-lg"
                      : "hover:bg-slate-100/80 hover:scale-[1.02]"
                  }`}
                  onClick={() => setActiveTab(item.id)}
                >
                  <item.icon className="w-4 h-4 mr-3" />
                  {item.label}
                </Button>
              ))}
            </div>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-6">
          {activeTab === "feed" && (
            <div className="space-y-6">
              {/* Profile Summary Card */}
              <Card className="border-blue-200 bg-blue-50/50">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex gap-4">
                      <Avatar className="w-16 h-16">
                        <AvatarImage src={profile.profilePhoto} />
                        <AvatarFallback className="text-lg bg-blue-100 text-blue-700">
                          {profile.firstName?.charAt(0) || "J"}
                          {profile.lastName?.charAt(0) || "S"}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <h3 className="text-lg font-semibold text-foreground">
                          Welcome back, {profile.firstName || "Job Seeker"}!
                        </h3>
                        <p className="text-sm text-muted-foreground mb-2">
                          {profile.email}
                        </p>
                        {profile.jobTitle && (
                          <p className="text-sm text-blue-700 font-medium">
                            {profile.jobTitle}
                          </p>
                        )}

                        {/* Missing information alerts */}
                        <div className="mt-3 space-y-1">
                          {!profile.jobTitle && (
                            <p className="text-xs text-amber-600 bg-amber-50 px-2 py-1 rounded inline-block mr-2">
                              Add job title to improve matches
                            </p>
                          )}
                          {!profile.phone && (
                            <p className="text-xs text-amber-600 bg-amber-50 px-2 py-1 rounded inline-block mr-2">
                              Add phone number
                            </p>
                          )}
                          {profile.skills.length === 0 && (
                            <p className="text-xs text-amber-600 bg-amber-50 px-2 py-1 rounded inline-block mr-2">
                              Add skills to get better job matches
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="text-right space-y-2">
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setActiveTab("profile")}
                        >
                          Complete Profile
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={addSampleData}
                          className="text-xs"
                        >
                          Add Sample Data
                        </Button>
                      </div>
                      <div className="text-xs text-muted-foreground">
                        Profile {Math.floor((
                          [profile.firstName, profile.lastName, profile.email, profile.jobTitle, profile.phone].filter(Boolean).length / 5
                        ) * 100)}% complete
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Stats Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {stats.map((stat, index) => (
                  <Card key={index}>
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-medium text-muted-foreground">
                            {stat.label}
                          </p>
                          <p className="text-2xl font-bold text-foreground">
                            {stat.value}
                          </p>
                          <p className="text-xs text-muted-foreground mt-1">
                            {stat.trend}
                          </p>
                        </div>
                        <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                          <stat.icon className="w-6 h-6 text-primary" />
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              {/* Job Feed */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-semibold text-foreground">
                    Recommended Jobs
                  </h2>
                  <Button variant="outline" size="sm">
                    <Filter className="w-4 h-4 mr-2" />
                    Filters
                  </Button>
                </div>

                {jobs.map((job) => {
                  const hasApplied = applications.some(app => app.jobId === job.id);
                  const isSaved = savedJobs.includes(job.id);

                  return (
                  <Card
                    key={job.id}
                    className="hover:shadow-md transition-shadow"
                  >
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between">
                        <div className="flex gap-4 flex-1">
                          <Avatar className="w-12 h-12">
                            <AvatarFallback className="bg-primary/10 text-primary font-semibold">
                              {job.logo}
                            </AvatarFallback>
                          </Avatar>

                          <div className="flex-1">
                            <div className="flex items-start justify-between">
                              <div>
                                <h3 className="text-lg font-semibold text-foreground hover:text-primary cursor-pointer">
                                  {job.title}
                                </h3>
                                <p className="text-sm text-muted-foreground">
                                  {job.company}
                                </p>
                              </div>
                              <div className="flex items-center gap-2">
                                <Badge
                                  variant="secondary"
                                  className="bg-green-100 text-green-700"
                                >
                                  {job.matchScore}% match
                                </Badge>
                                {hasApplied && (
                                  <Badge
                                    variant="default"
                                    className="bg-blue-100 text-blue-700"
                                  >
                                    Applied
                                  </Badge>
                                )}
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => handleSaveJob(job.id)}
                                >
                                  <Bookmark
                                    className={`w-4 h-4 ${isSaved ? "fill-current text-primary" : ""}`}
                                  />
                                </Button>
                              </div>
                            </div>

                            <div className="flex items-center gap-4 mt-2 text-sm text-muted-foreground">
                              <div className="flex items-center gap-1">
                                <MapPin className="w-4 h-4" />
                                {job.location}
                              </div>
                              <div className="flex items-center gap-1">
                                <Building2 className="w-4 h-4" />
                                {job.type}
                              </div>
                              <div className="flex items-center gap-1">
                                <DollarSign className="w-4 h-4" />
                                {job.salary}
                              </div>
                              <div className="flex items-center gap-1">
                                <Clock className="w-4 h-4" />
                                {job.posted}
                              </div>
                            </div>

                            <p className="text-sm text-muted-foreground mt-3 line-clamp-2">
                              {job.description}
                            </p>

                            <div className="flex items-center gap-2 mt-3">
                              {job.skills.map((skill) => (
                                <Badge
                                  key={skill}
                                  variant="secondary"
                                  className="text-xs"
                                >
                                  {skill}
                                </Badge>
                              ))}
                            </div>

                            <div className="flex items-center justify-between mt-4">
                              <p className="text-xs text-muted-foreground">
                                {job.applicants} applicants
                              </p>
                              <div className="flex gap-2">
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => handleSaveJob(job.id)}
                                >
                                  {isSaved ? "Saved" : "Save"}
                                </Button>
                                <Button
                                  size="sm"
                                  onClick={() => handleApplyNow(job.id)}
                                  disabled={hasApplied}
                                  className={hasApplied ? "opacity-50 cursor-not-allowed" : ""}
                                >
                                  {hasApplied ? "Applied" : "Apply Now"}
                                </Button>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );})}
              </div>
            </div>
          )}

          {activeTab === "applications" && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold text-foreground">
                  My Applications
                </h2>
                <Badge variant="secondary">
                  {applications.length} applications
                </Badge>
              </div>

              {applications.length === 0 ? (
                <Card>
                  <CardContent className="p-12 text-center">
                    <FileText className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-foreground mb-2">
                      No Applications Yet
                    </h3>
                    <p className="text-muted-foreground mb-4">
                      Start applying to jobs to see them here
                    </p>
                    <Button onClick={() => setActiveTab("feed")}>
                      Browse Jobs
                    </Button>
                  </CardContent>
                </Card>
              ) : (
                <div className="space-y-4">
                  {getApplicationsList().map((job: any) => (
                    <Card
                      key={job.id}
                      className="hover:shadow-md transition-shadow"
                    >
                      <CardContent className="p-6">
                        <div className="flex items-start justify-between">
                          <div className="flex gap-4 flex-1">
                            <Avatar className="w-12 h-12">
                              <AvatarFallback className="bg-primary/10 text-primary font-semibold">
                                {job.logo}
                              </AvatarFallback>
                            </Avatar>

                            <div className="flex-1">
                              <div className="flex items-start justify-between">
                                <div>
                                  <h3 className="text-lg font-semibold text-foreground hover:text-primary cursor-pointer">
                                    {job.title}
                                  </h3>
                                  <p className="text-sm text-muted-foreground">
                                    {job.company}
                                  </p>
                                </div>
                                <div className="flex items-center gap-2">
                                  <Badge
                                    variant="outline"
                                    className="bg-blue-50 text-blue-700 border-blue-200"
                                  >
                                    {job.status || "Pending"}
                                  </Badge>
                                </div>
                              </div>

                              <div className="flex items-center gap-4 mt-2 text-sm text-muted-foreground">
                                <div className="flex items-center gap-1">
                                  <MapPin className="w-4 h-4" />
                                  {job.location}
                                </div>
                                <div className="flex items-center gap-1">
                                  <DollarSign className="w-4 h-4" />
                                  {job.salary}
                                </div>
                                <div className="flex items-center gap-1">
                                  <Clock className="w-4 h-4" />
                                  Applied{" "}
                                  {new Date(job.appliedAt).toLocaleDateString()}
                                </div>
                              </div>

                              <div className="flex items-center gap-2 mt-3">
                                {job.skills.slice(0, 3).map((skill: string) => (
                                  <Badge
                                    key={skill}
                                    variant="secondary"
                                    className="text-xs"
                                  >
                                    {skill}
                                  </Badge>
                                ))}
                                {job.skills.length > 3 && (
                                  <Badge
                                    variant="secondary"
                                    className="text-xs"
                                  >
                                    +{job.skills.length - 3} more
                                  </Badge>
                                )}
                              </div>

                              <div className="flex items-center justify-between mt-4">
                                <p className="text-xs text-muted-foreground">
                                  Application Status:{" "}
                                  <span className="font-medium text-foreground">
                                    {job.status || "Under Review"}
                                  </span>
                                </p>
                                <div className="flex gap-2">
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => navigate(`/job/${job.id}`)}
                                  >
                                    View Job
                                  </Button>
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() =>
                                      handleWithdrawApplication(job.id)
                                    }
                                    className="text-destructive hover:text-destructive hover:bg-destructive/10"
                                  >
                                    Withdraw
                                  </Button>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </div>
          )}

          {activeTab === "saved" && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold text-foreground">
                  Saved Jobs
                </h2>
                <Badge variant="secondary">{savedJobs.length} saved</Badge>
              </div>

              {savedJobs.length === 0 ? (
                <Card>
                  <CardContent className="p-12 text-center">
                    <Bookmark className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-foreground mb-2">
                      No Saved Jobs
                    </h3>
                    <p className="text-muted-foreground mb-4">
                      Save interesting jobs to review them later
                    </p>
                    <Button onClick={() => setActiveTab("feed")}>
                      Browse Jobs
                    </Button>
                  </CardContent>
                </Card>
              ) : (
                <div className="space-y-4">
                  {getSavedJobsList().map((job) => (
                    <Card
                      key={job.id}
                      className="hover:shadow-md transition-shadow"
                    >
                      <CardContent className="p-6">
                        <div className="flex items-start justify-between">
                          <div className="flex gap-4 flex-1">
                            <Avatar className="w-12 h-12">
                              <AvatarFallback className="bg-primary/10 text-primary font-semibold">
                                {job.logo}
                              </AvatarFallback>
                            </Avatar>

                            <div className="flex-1">
                              <div className="flex items-start justify-between">
                                <div>
                                  <h3 className="text-lg font-semibold text-foreground hover:text-primary cursor-pointer">
                                    {job.title}
                                  </h3>
                                  <p className="text-sm text-muted-foreground">
                                    {job.company}
                                  </p>
                                </div>
                                <div className="flex items-center gap-2">
                                  <Badge
                                    variant="secondary"
                                    className="bg-green-100 text-green-700"
                                  >
                                    {job.matchScore}% match
                                  </Badge>
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => handleSaveJob(job.id)}
                                  >
                                    <Bookmark className="w-4 h-4 fill-current text-primary" />
                                  </Button>
                                </div>
                              </div>

                              <div className="flex items-center gap-4 mt-2 text-sm text-muted-foreground">
                                <div className="flex items-center gap-1">
                                  <MapPin className="w-4 h-4" />
                                  {job.location}
                                </div>
                                <div className="flex items-center gap-1">
                                  <Building2 className="w-4 h-4" />
                                  {job.type}
                                </div>
                                <div className="flex items-center gap-1">
                                  <DollarSign className="w-4 h-4" />
                                  {job.salary}
                                </div>
                                <div className="flex items-center gap-1">
                                  <Clock className="w-4 h-4" />
                                  {job.posted}
                                </div>
                              </div>

                              <p className="text-sm text-muted-foreground mt-3 line-clamp-2">
                                {job.description}
                              </p>

                              <div className="flex items-center gap-2 mt-3">
                                {job.skills.slice(0, 4).map((skill) => (
                                  <Badge
                                    key={skill}
                                    variant="secondary"
                                    className="text-xs"
                                  >
                                    {skill}
                                  </Badge>
                                ))}
                                {job.skills.length > 4 && (
                                  <Badge
                                    variant="secondary"
                                    className="text-xs"
                                  >
                                    +{job.skills.length - 4} more
                                  </Badge>
                                )}
                              </div>

                              <div className="flex items-center justify-between mt-4">
                                <p className="text-xs text-muted-foreground">
                                  {job.applicants} applicants
                                </p>
                                <div className="flex gap-2">
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => handleSaveJob(job.id)}
                                  >
                                    Remove
                                  </Button>
                                  <Button
                                    size="sm"
                                    onClick={() => handleApplyNow(job.id)}
                                  >
                                    Apply Now
                                  </Button>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </div>
          )}

          {activeTab === "profile" && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold text-foreground">
                  Profile
                </h2>
                <Badge variant="secondary">Complete your profile</Badge>
              </div>

              <div className="grid gap-6">
                {/* Personal Information */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Users className="w-5 h-5" />
                      Personal Information
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    {/* Profile Photo */}
                    <div className="flex items-center gap-6">
                      <div className="relative">
                        <Avatar className="w-24 h-24">
                          <AvatarImage src={profile.profilePhoto} />
                          <AvatarFallback className="text-lg">
                            {profile.firstName?.charAt(0) || "J"}
                            {profile.lastName?.charAt(0) || "S"}
                          </AvatarFallback>
                        </Avatar>
                        <input
                          type="file"
                          accept="image/*"
                          className="hidden"
                          id="photo-upload"
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file) handleFileUpload("photo", file);
                          }}
                        />
                        <Button
                          size="sm"
                          variant="outline"
                          className="absolute -bottom-2 -right-2 rounded-full p-2 h-8 w-8"
                          onClick={() =>
                            document.getElementById("photo-upload")?.click()
                          }
                        >
                          📷
                        </Button>
                      </div>
                      <div>
                        <h3 className="font-medium text-foreground">
                          Profile Photo
                        </h3>
                        <p className="text-sm text-muted-foreground">
                          Upload a professional photo
                        </p>
                        <Button
                          variant="link"
                          className="p-0 h-auto text-sm"
                          onClick={() =>
                            document.getElementById("photo-upload")?.click()
                          }
                        >
                          Upload Photo
                        </Button>
                      </div>
                    </div>

                    {/* Name Fields */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <label className="text-sm font-medium">
                          First Name
                        </label>
                        <Input
                          placeholder="Enter your first name"
                          value={profile.firstName}
                          onChange={(e) =>
                            handleProfileChange("firstName", e.target.value)
                          }
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-medium">Last Name</label>
                        <Input
                          placeholder="Enter your last name"
                          value={profile.lastName}
                          onChange={(e) =>
                            handleProfileChange("lastName", e.target.value)
                          }
                        />
                      </div>
                    </div>

                    {/* Contact Information */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <label className="text-sm font-medium">Email</label>
                        <Input
                          type="email"
                          placeholder="your.email@example.com"
                          value={profile.email}
                          onChange={(e) =>
                            handleProfileChange("email", e.target.value)
                          }
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-medium">
                          Phone Number
                        </label>
                        <Input
                          type="tel"
                          placeholder="+1 (555) 123-4567"
                          value={profile.phone}
                          onChange={(e) =>
                            handleProfileChange("phone", e.target.value)
                          }
                        />
                      </div>
                    </div>

                    {/* Address */}
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <label className="text-sm font-medium">Address</label>
                        <Input
                          placeholder="Street address"
                          value={profile.address}
                          onChange={(e) =>
                            handleProfileChange("address", e.target.value)
                          }
                        />
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="space-y-2">
                          <label className="text-sm font-medium">City</label>
                          <Input
                            placeholder="City"
                            value={profile.city}
                            onChange={(e) =>
                              handleProfileChange("city", e.target.value)
                            }
                          />
                        </div>
                        <div className="space-y-2">
                          <label className="text-sm font-medium">State</label>
                          <Input
                            placeholder="State"
                            value={profile.state}
                            onChange={(e) =>
                              handleProfileChange("state", e.target.value)
                            }
                          />
                        </div>
                        <div className="space-y-2">
                          <label className="text-sm font-medium">
                            ZIP Code
                          </label>
                          <Input
                            placeholder="12345"
                            value={profile.zipCode}
                            onChange={(e) =>
                              handleProfileChange("zipCode", e.target.value)
                            }
                          />
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Professional Information */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Briefcase className="w-5 h-5" />
                      Professional Information
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    {/* Job Title & Experience */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <label className="text-sm font-medium">
                          Current Job Title
                        </label>
                        <Input
                          placeholder="e.g. Senior Frontend Developer"
                          value={profile.jobTitle}
                          onChange={(e) =>
                            handleProfileChange("jobTitle", e.target.value)
                          }
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-medium">
                          Years of Experience
                        </label>
                        <Input
                          placeholder="e.g. 5"
                          type="number"
                          value={profile.experience}
                          onChange={(e) =>
                            handleProfileChange("experience", e.target.value)
                          }
                        />
                      </div>
                    </div>

                    {/* Resume Upload */}
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Resume</label>
                      <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                        <FileText className="w-10 h-10 text-muted-foreground mx-auto mb-2" />
                        {profile.resume ? (
                          <div>
                            <p className="text-sm font-medium text-foreground mb-2">
                              {profile.resume}
                            </p>
                            <p className="text-xs text-green-600 mb-2">
                              Resume uploaded successfully
                            </p>
                          </div>
                        ) : (
                          <p className="text-sm text-muted-foreground mb-2">
                            Upload your resume (PDF, DOC, DOCX)
                          </p>
                        )}
                        <input
                          type="file"
                          accept=".pdf,.doc,.docx"
                          className="hidden"
                          id="resume-upload"
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file) handleFileUpload("resume", file);
                          }}
                        />
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() =>
                            document.getElementById("resume-upload")?.click()
                          }
                        >
                          Choose File
                        </Button>
                      </div>
                    </div>

                    {/* Skills */}
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Skills</label>
                      <div className="space-y-3">
                        <div className="flex gap-2">
                          <Input
                            placeholder="Add a skill (e.g. React, JavaScript, Python)"
                            onKeyPress={(e) => {
                              if (e.key === "Enter") {
                                e.preventDefault();
                                const input = e.target as HTMLInputElement;
                                if (input.value.trim()) {
                                  handleAddSkill(input.value);
                                  input.value = "";
                                }
                              }
                            }}
                          />
                          <Button
                            type="button"
                            variant="outline"
                            onClick={(e) => {
                              const input = e.currentTarget
                                .previousElementSibling as HTMLInputElement;
                              if (input?.value.trim()) {
                                handleAddSkill(input.value);
                                input.value = "";
                              }
                            }}
                          >
                            Add
                          </Button>
                        </div>
                        <div className="flex flex-wrap gap-2">
                          {profile.skills.map((skill) => (
                            <Badge
                              key={skill}
                              variant="secondary"
                              className="px-3 py-1"
                            >
                              {skill}
                              <button
                                className="ml-2 text-xs hover:text-destructive"
                                onClick={() => handleRemoveSkill(skill)}
                              >
                                ×
                              </button>
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* Cover Letter */}
                    <div className="space-y-2">
                      <label className="text-sm font-medium">
                        Default Cover Letter
                      </label>
                      <textarea
                        className="min-h-[120px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                        placeholder="Write a default cover letter that will be used for job applications..."
                        value={profile.coverLetter}
                        onChange={(e) =>
                          handleProfileChange("coverLetter", e.target.value)
                        }
                      />
                    </div>

                    {/* LinkedIn & Portfolio */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <label className="text-sm font-medium">
                          LinkedIn Profile
                        </label>
                        <Input
                          placeholder="https://linkedin.com/in/yourprofile"
                          value={profile.linkedin}
                          onChange={(e) =>
                            handleProfileChange("linkedin", e.target.value)
                          }
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-medium">
                          Portfolio Website
                        </label>
                        <Input
                          placeholder="https://yourportfolio.com"
                          value={profile.portfolio}
                          onChange={(e) =>
                            handleProfileChange("portfolio", e.target.value)
                          }
                        />
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Preferences */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Settings className="w-5 h-5" />
                      Job Preferences
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <label className="text-sm font-medium">
                          Preferred Job Type
                        </label>
                        <select
                          className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background"
                          value={profile.jobType}
                          onChange={(e) =>
                            handleProfileChange("jobType", e.target.value)
                          }
                        >
                          <option>Full-time</option>
                          <option>Part-time</option>
                          <option>Contract</option>
                          <option>Freelance</option>
                        </select>
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-medium">
                          Preferred Salary Range
                        </label>
                        <Input
                          placeholder="e.g. $80,000 - $120,000"
                          value={profile.salaryRange}
                          onChange={(e) =>
                            handleProfileChange("salaryRange", e.target.value)
                          }
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <label className="text-sm font-medium">
                          Preferred Location
                        </label>
                        <Input
                          placeholder="e.g. San Francisco, CA or Remote"
                          value={profile.preferredLocation}
                          onChange={(e) =>
                            handleProfileChange(
                              "preferredLocation",
                              e.target.value,
                            )
                          }
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-medium">
                          Notice Period
                        </label>
                        <select
                          className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background"
                          value={profile.noticePeriod}
                          onChange={(e) =>
                            handleProfileChange("noticePeriod", e.target.value)
                          }
                        >
                          <option>Immediate</option>
                          <option>2 weeks</option>
                          <option>1 month</option>
                          <option>2 months</option>
                          <option>3+ months</option>
                        </select>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Save Button */}
                <div className="flex justify-end">
                  <Button
                    size="lg"
                    className="px-8"
                    onClick={handleSaveProfile}
                  >
                    Save Profile
                  </Button>
                </div>
              </div>
            </div>
          )}

          {activeTab === "analytics" && (
            <Card>
              <CardHeader>
                <CardTitle>Analytics</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  View detailed analytics about your job search performance.
                </p>
              </CardContent>
            </Card>
          )}
        </main>
      </div>
    </div>
  );
}
