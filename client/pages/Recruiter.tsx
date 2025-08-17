import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { JobService, JobApplication as JobApplicationType } from "@/lib/jobService";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  Brain,
  ArrowLeft,
  Building2,
  MapPin,
  DollarSign,
  Users,
  Plus,
  Check,
  Briefcase,
  Clock,
  Target,
  Mail,
  Phone,
  Globe,
  FileText,
  TrendingUp,
  Eye,
  Download,
  User,
  Edit,
} from "lucide-react";

export default function Recruiter() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("post-job");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [jobForm, setJobForm] = useState({
    title: "",
    company: "",
    location: "",
    type: "Full-time",
    salaryMin: "",
    salaryMax: "",
    description: "",
    requirements: "",
    benefits: "",
    skills: [] as string[],
    newSkill: "",
  });

  const [recruiterProfile, setRecruiterProfile] = useState({
    name: "",
    email: "",
    phone: "",
    company: "",
    position: "",
    website: "",
    bio: "",
  });

  const handleInputChange = (field: string, value: string) => {
    setJobForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleAddSkill = () => {
    if (
      jobForm.newSkill.trim() &&
      !jobForm.skills.includes(jobForm.newSkill.trim())
    ) {
      setJobForm((prev) => ({
        ...prev,
        skills: [...prev.skills, prev.newSkill.trim()],
        newSkill: "",
      }));
    }
  };

  const handleRemoveSkill = (skillToRemove: string) => {
    setJobForm((prev) => ({
      ...prev,
      skills: prev.skills.filter((skill) => skill !== skillToRemove),
    }));
  };

  const handleSubmitJob = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 2000));

      // Store job posting (in real app, this would be API call)
      const currentJobPosts = JSON.parse(
        localStorage.getItem("jobPosts") || "[]",
      );
      const newJob = {
        id: Date.now(),
        ...jobForm,
        postedAt: new Date().toISOString(),
        status: "active",
        applicants: 0,
        views: Math.floor(Math.random() * 50) + 10, // Simulate some initial views
        interested: Math.floor(Math.random() * 20) + 5, // Simulate some initial interest
      };
      currentJobPosts.push(newJob);
      localStorage.setItem("jobPosts", JSON.stringify(currentJobPosts));
      setJobPosts(currentJobPosts);

      // Reset form
      setJobForm({
        title: "",
        company: "",
        location: "",
        type: "Full-time",
        salaryMin: "",
        salaryMax: "",
        description: "",
        requirements: "",
        benefits: "",
        skills: [],
        newSkill: "",
      });

      alert("Job posted successfully!");
      setActiveTab("dashboard");
    } catch (error) {
      console.error("Job posting failed:", error);
      alert("Failed to post job. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const [jobPosts, setJobPosts] = useState<any[]>([]);
  const [applications, setApplications] = useState<JobApplicationType[]>([]);
  const [selectedApplications, setSelectedApplications] = useState<number[]>([]);
  const [isLoadingApplications, setIsLoadingApplications] = useState(false);

  // Load applications for all jobs from API
  const loadAllApplications = async () => {
    setIsLoadingApplications(true);
    try {
      const allApplications: JobApplicationType[] = [];

      for (const job of jobPosts) {
        const jobApplications = await JobService.getJobApplications(job.id);
        allApplications.push(...jobApplications);
      }

      setApplications(allApplications);
    } catch (error) {
      console.error("Failed to load applications:", error);
    } finally {
      setIsLoadingApplications(false);
    }
  };

  // Helper function to load applications for a specific set of jobs
  const loadAllApplicationsForJobs = async (jobs: any[]) => {
    // Don't try to load applications if there are no jobs
    if (!jobs || jobs.length === 0) {
      setApplications([]);
      return;
    }

    setIsLoadingApplications(true);
    try {
      const allApplications: JobApplicationType[] = [];

      for (const job of jobs) {
        try {
          const jobApplications = await JobService.getJobApplications(job.id);
          allApplications.push(...jobApplications);
        } catch (jobError) {
          console.error(`Failed to load applications for job ${job.id}:`, jobError);
          // Continue with other jobs even if one fails
        }
      }

      setApplications(allApplications);
    } catch (error) {
      console.error("Failed to load applications:", error);
      // Set empty array on error instead of leaving undefined
      setApplications([]);
    } finally {
      setIsLoadingApplications(false);
    }
  };

  // Function to delete an application
  const handleDeleteApplication = (applicationId: number) => {
    if (confirm("Are you sure you want to delete this application? This action cannot be undone.")) {
      const updatedApplications = applications.filter(app => app.id !== applicationId);
      setApplications(updatedApplications);
      alert("Application deleted successfully!");
    }
  };

  // Function to update application status
  const handleUpdateApplicationStatus = async (applicationId: number, newStatus: string) => {
    try {
      const result = await JobService.updateApplicationStatus(applicationId, newStatus);
      if (result.success && result.application) {
        const updatedApplications = applications.map(app =>
          app.id === applicationId ? result.application! : app
        );
        setApplications(updatedApplications);
        alert(`Application status updated to ${newStatus}!`);
      } else {
        alert("Failed to update application status");
      }
    } catch (error) {
      console.error("Error updating application status:", error);
      alert("Failed to update application status");
    }
  };

  // Function to bulk delete applications for a job
  const handleBulkDeleteApplications = (jobId: number) => {
    if (confirm("Are you sure you want to delete ALL applications for this job? This action cannot be undone.")) {
      const updatedApplications = applications.filter(app => app.jobId !== jobId);
      setApplications(updatedApplications);
      setSelectedApplications([]);
      alert("All applications for this job have been deleted!");
    }
  };

  // Function to toggle application selection
  const toggleApplicationSelection = (applicationId: number) => {
    setSelectedApplications(prev =>
      prev.includes(applicationId)
        ? prev.filter(id => id !== applicationId)
        : [...prev, applicationId]
    );
  };

  // Function to delete selected applications
  const handleDeleteSelectedApplications = () => {
    if (selectedApplications.length === 0) {
      alert("Please select applications to delete.");
      return;
    }

    if (confirm(`Are you sure you want to delete ${selectedApplications.length} selected applications? This action cannot be undone.`)) {
      const updatedApplications = applications.filter(app => !selectedApplications.includes(app.id));
      setApplications(updatedApplications);
      setSelectedApplications([]);
      alert(`${selectedApplications.length} applications deleted successfully!`);
    }
  };

  // Function to add sample job posts for testing
  const addSampleJobPosts = () => {
    const sampleJobs = [
      {
        id: Date.now(),
        title: "Senior Frontend Developer",
        company: "TechCorp Inc.",
        location: "San Francisco, CA",
        type: "Full-time",
        salaryMin: "120000",
        salaryMax: "160000",
        description: "We're looking for an experienced frontend developer to join our team...",
        requirements: "5+ years React experience, TypeScript, GraphQL",
        benefits: "Health insurance, 401k, flexible hours",
        skills: ["React", "TypeScript", "GraphQL"],
        postedAt: new Date().toISOString(),
        status: "active",
        applicants: 12,
        views: 143,
        interested: 28,
      },
      {
        id: Date.now() + 1,
        title: "Product Manager",
        company: "Innovation Labs",
        location: "Remote",
        type: "Full-time",
        salaryMin: "100000",
        salaryMax: "140000",
        description: "Join our product team to drive innovation and growth...",
        requirements: "3+ years PM experience, Technical background",
        benefits: "Remote work, equity, learning budget",
        skills: ["Product Management", "Analytics", "Agile"],
        postedAt: new Date().toISOString(),
        status: "active",
        applicants: 8,
        views: 89,
        interested: 15,
      }
    ];

    localStorage.setItem("jobPosts", JSON.stringify(sampleJobs));
    setJobPosts(sampleJobs);

    // Add sample applications for the job posts
    const sampleApplications = [
      {
        id: 1,
        jobId: sampleJobs[0].id, // For Senior Frontend Developer
        jobTitle: sampleJobs[0].title,
        candidateName: "Alex Johnson",
        candidateEmail: "alex.johnson@email.com",
        candidatePhone: "+1 (555) 987-6543",
        experience: "5 years",
        skills: ["React", "TypeScript", "Node.js"],
        appliedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(), // 2 days ago
        status: "pending",
        resumeUrl: "#",
        coverLetter: "I am excited to apply for this Senior Frontend Developer position. With 5 years of experience in React and TypeScript, I believe I would be a great fit for your team.",
        matchScore: 95,
      },
      {
        id: 2,
        jobId: sampleJobs[0].id, // For Senior Frontend Developer
        jobTitle: sampleJobs[0].title,
        candidateName: "Sarah Chen",
        candidateEmail: "sarah.chen@email.com",
        candidatePhone: "+1 (555) 123-7890",
        experience: "6 years",
        skills: ["React", "GraphQL", "AWS"],
        appliedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(), // 1 day ago
        status: "reviewing",
        resumeUrl: "#",
        coverLetter: "Hello! I'm very interested in the Senior Frontend Developer role. My experience includes building scalable React applications with GraphQL and AWS integration.",
        matchScore: 88,
      },
      {
        id: 3,
        jobId: sampleJobs[1].id, // For Product Manager
        jobTitle: sampleJobs[1].title,
        candidateName: "Mike Rodriguez",
        candidateEmail: "mike.rodriguez@email.com",
        candidatePhone: "+1 (555) 456-1234",
        experience: "4 years",
        skills: ["Product Management", "Analytics", "Agile", "SQL"],
        appliedAt: new Date().toISOString(), // Today
        status: "pending",
        resumeUrl: "#",
        coverLetter: "I'm excited about the Product Manager opportunity. My background in technical product management and data analytics makes me well-suited for this role.",
        matchScore: 92,
      }
    ];

    setApplications(sampleApplications);
    alert("Sample job posts and applications added successfully!");
  };

  // Load real data from localStorage
  useEffect(() => {
    // Load recruiter profile
    const savedProfile = JSON.parse(
      localStorage.getItem("recruiterProfile") || "{}",
    );
    if (Object.keys(savedProfile).length > 0) {
      setRecruiterProfile(savedProfile);
    } else {
      // Set default profile if none exists
      const defaultProfile = {
        name: "John Recruiter",
        email: "john@company.com",
        phone: "+1 (555) 123-4567",
        company: "Your Company",
        position: "Technical Recruiter",
        website: "https://yourcompany.com",
        bio: "Passionate recruiter connecting top talent with innovative companies.",
      };
      setRecruiterProfile(defaultProfile);
      localStorage.setItem("recruiterProfile", JSON.stringify(defaultProfile));
    }

    // Load job posts
    const savedJobPosts = JSON.parse(localStorage.getItem("jobPosts") || "[]");
    setJobPosts(savedJobPosts);

    // Always try to load applications, even if there are no jobs (will return empty array)
    loadAllApplicationsForJobs(savedJobPosts);
  }, []);

  // Calculate real statistics
  const getJobStats = () => {
    const totalJobs = jobPosts.length;
    const totalApplications = applications.length;
    const totalViews = jobPosts.reduce((sum, job) => sum + (job.views || 0), 0);
    const totalInterested = jobPosts.reduce(
      (sum, job) => sum + (job.interested || 0),
      0,
    );

    return {
      totalJobs,
      totalApplications,
      totalViews,
      totalInterested,
    };
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50/50 via-white to-purple-50/50 relative">
      {/* Background decorations */}
      <div className="absolute inset-0 overflow-hidden -z-10">
        <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-blue-200/20 to-purple-200/20 rounded-full blur-3xl transform translate-x-1/2 -translate-y-1/2"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-gradient-to-tr from-purple-200/20 to-pink-200/20 rounded-full blur-3xl transform -translate-x-1/2 translate-y-1/2"></div>
      </div>

      {/* Header */}
      <header className="bg-white/80 backdrop-blur-md border-b border-slate-200/60 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => navigate("/")}
                className="flex items-center gap-2"
              >
                <ArrowLeft className="w-4 h-4" />
                Back to Home
              </Button>
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
            </div>

            <div className="flex items-center gap-4">
              <span className="text-sm text-slate-600">Recruiter Portal</span>
              <Button
                onClick={() => navigate("/")}
                variant="outline"
                className="border-slate-300 hover:bg-gradient-to-r hover:from-slate-50 hover:to-gray-50 transition-all duration-300 rounded-xl hover:scale-105"
              >
                Log Out
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex">
          {/* Sidebar */}
          <aside className="w-64 bg-white/60 backdrop-blur-md rounded-2xl shadow-xl border border-slate-200/60 h-fit">
            <div className="p-6">
              <h2 className="text-lg font-bold text-slate-900 mb-6 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Recruiter Dashboard
              </h2>
              <nav className="space-y-3">
                <Button
                  variant={activeTab === "post-job" ? "default" : "ghost"}
                  className={`w-full justify-start rounded-xl transition-all duration-200 ${
                    activeTab === "post-job"
                      ? "bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 shadow-lg"
                      : "hover:bg-slate-100/80 hover:scale-[1.02]"
                  }`}
                  onClick={() => setActiveTab("post-job")}
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Post New Job
                </Button>
                <Button
                  variant={activeTab === "dashboard" ? "default" : "ghost"}
                  className={`w-full justify-start rounded-xl transition-all duration-200 ${
                    activeTab === "dashboard"
                      ? "bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 shadow-lg"
                      : "hover:bg-slate-100/80 hover:scale-[1.02]"
                  }`}
                  onClick={() => setActiveTab("dashboard")}
                >
                  <Briefcase className="w-4 h-4 mr-2" />
                  My Job Posts
                </Button>
                <Button
                  variant={activeTab === "analytics" ? "default" : "ghost"}
                  className={`w-full justify-start rounded-xl transition-all duration-200 ${
                    activeTab === "analytics"
                      ? "bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 shadow-lg"
                      : "hover:bg-slate-100/80 hover:scale-[1.02]"
                  }`}
                  onClick={() => setActiveTab("analytics")}
                >
                  <Target className="w-4 h-4 mr-2" />
                  Analytics
                </Button>
              </nav>
            </div>
          </aside>

          {/* Main Content */}
          <main className="flex-1 ml-8">
            {activeTab === "post-job" && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-2xl">Post a New Job</CardTitle>
                  <p className="text-slate-600">
                    Reach thousands of qualified candidates with AI-powered job
                    matching.
                  </p>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleSubmitJob} className="space-y-6">
                    {/* Basic Information */}
                    <div className="space-y-4">
                      <h3 className="text-lg font-semibold text-slate-900">
                        Basic Information
                      </h3>

                      <div className="grid md:grid-cols-2 gap-4">
                        <div>
                          <label className="text-sm font-medium text-slate-700 mb-2 block">
                            Job Title
                          </label>
                          <Input
                            placeholder="e.g. Senior Frontend Developer"
                            value={jobForm.title}
                            onChange={(e) =>
                              handleInputChange("title", e.target.value)
                            }
                            required
                          />
                        </div>
                        <div>
                          <label className="text-sm font-medium text-slate-700 mb-2 block">
                            Company Name
                          </label>
                          <Input
                            placeholder="e.g. TechCorp Inc."
                            value={jobForm.company}
                            onChange={(e) =>
                              handleInputChange("company", e.target.value)
                            }
                            required
                          />
                        </div>
                      </div>

                      <div className="grid md:grid-cols-2 gap-4">
                        <div>
                          <label className="text-sm font-medium text-slate-700 mb-2 block">
                            Location
                          </label>
                          <Input
                            placeholder="e.g. San Francisco, CA or Remote"
                            value={jobForm.location}
                            onChange={(e) =>
                              handleInputChange("location", e.target.value)
                            }
                            required
                          />
                        </div>
                        <div>
                          <label className="text-sm font-medium text-slate-700 mb-2 block">
                            Job Type
                          </label>
                          <select
                            className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                            value={jobForm.type}
                            onChange={(e) =>
                              handleInputChange("type", e.target.value)
                            }
                          >
                            <option>Full-time</option>
                            <option>Part-time</option>
                            <option>Contract</option>
                            <option>Freelance</option>
                            <option>Internship</option>
                          </select>
                        </div>
                      </div>

                      <div className="grid md:grid-cols-2 gap-4">
                        <div>
                          <label className="text-sm font-medium text-slate-700 mb-2 block">
                            Minimum Salary ($)
                          </label>
                          <Input
                            type="number"
                            placeholder="80000"
                            value={jobForm.salaryMin}
                            onChange={(e) =>
                              handleInputChange("salaryMin", e.target.value)
                            }
                          />
                        </div>
                        <div>
                          <label className="text-sm font-medium text-slate-700 mb-2 block">
                            Maximum Salary ($)
                          </label>
                          <Input
                            type="number"
                            placeholder="120000"
                            value={jobForm.salaryMax}
                            onChange={(e) =>
                              handleInputChange("salaryMax", e.target.value)
                            }
                          />
                        </div>
                      </div>
                    </div>

                    <Separator />

                    {/* Job Details */}
                    <div className="space-y-4">
                      <h3 className="text-lg font-semibold text-slate-900">
                        Job Details
                      </h3>

                      <div>
                        <label className="text-sm font-medium text-slate-700 mb-2 block">
                          Job Description
                        </label>
                        <textarea
                          className="min-h-[120px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                          placeholder="Describe the role, responsibilities, and what makes this opportunity exciting..."
                          value={jobForm.description}
                          onChange={(e) =>
                            handleInputChange("description", e.target.value)
                          }
                          required
                        />
                      </div>

                      <div>
                        <label className="text-sm font-medium text-slate-700 mb-2 block">
                          Requirements
                        </label>
                        <textarea
                          className="min-h-[100px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                          placeholder="List the required qualifications, experience, and skills..."
                          value={jobForm.requirements}
                          onChange={(e) =>
                            handleInputChange("requirements", e.target.value)
                          }
                          required
                        />
                      </div>

                      <div>
                        <label className="text-sm font-medium text-slate-700 mb-2 block">
                          Benefits & Perks
                        </label>
                        <textarea
                          className="min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                          placeholder="Health insurance, remote work, professional development..."
                          value={jobForm.benefits}
                          onChange={(e) =>
                            handleInputChange("benefits", e.target.value)
                          }
                        />
                      </div>
                    </div>

                    <Separator />

                    {/* Skills */}
                    <div className="space-y-4">
                      <h3 className="text-lg font-semibold text-slate-900">
                        Required Skills
                      </h3>

                      <div className="flex gap-2">
                        <Input
                          placeholder="Add a skill (e.g. React, Python, AWS)"
                          value={jobForm.newSkill}
                          onChange={(e) =>
                            setJobForm((prev) => ({
                              ...prev,
                              newSkill: e.target.value,
                            }))
                          }
                          onKeyPress={(e) => {
                            if (e.key === "Enter") {
                              e.preventDefault();
                              handleAddSkill();
                            }
                          }}
                        />
                        <Button type="button" onClick={handleAddSkill}>
                          Add
                        </Button>
                      </div>

                      <div className="flex flex-wrap gap-2">
                        {jobForm.skills.map((skill) => (
                          <Badge
                            key={skill}
                            variant="secondary"
                            className="px-3 py-1"
                          >
                            {skill}
                            <button
                              type="button"
                              className="ml-2 text-xs hover:text-destructive"
                              onClick={() => handleRemoveSkill(skill)}
                            >
                              ×
                            </button>
                          </Badge>
                        ))}
                      </div>
                    </div>

                    <Separator />

                    <Button
                      type="submit"
                      className="w-full h-12"
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? "Posting Job..." : "Post Job"}
                    </Button>
                  </form>
                </CardContent>
              </Card>
            )}

            {activeTab === "dashboard" && (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <h2 className="text-2xl font-bold text-slate-900">
                    My Job Posts
                  </h2>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      onClick={addSampleJobPosts}
                      className="text-sm"
                    >
                      Add Sample Data
                    </Button>
                    <Button onClick={() => setActiveTab("post-job")}>
                      <Plus className="w-4 h-4 mr-2" />
                      Post New Job
                    </Button>
                  </div>
                </div>

                <div className="grid gap-4">
                  {jobPosts.map((job) => (
                    <Card
                      key={job.id}
                      className="hover:shadow-md transition-shadow"
                    >
                      <CardContent className="p-6">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center gap-3 mb-2">
                              <h3 className="text-lg font-semibold text-slate-900">
                                {job.title}
                              </h3>
                              <Badge
                                variant="outline"
                                className="bg-green-50 text-green-700"
                              >
                                {job.status}
                              </Badge>
                            </div>

                            <div className="flex items-center gap-4 text-sm text-slate-600 mb-3">
                              <div className="flex items-center gap-1">
                                <Building2 className="w-4 h-4" />
                                {job.company}
                              </div>
                              <div className="flex items-center gap-1">
                                <MapPin className="w-4 h-4" />
                                {job.location}
                              </div>
                              <div className="flex items-center gap-1">
                                <DollarSign className="w-4 h-4" />
                                {job.salary}
                              </div>
                            </div>

                            <div className="flex items-center gap-4 text-sm text-slate-500">
                              <div className="flex items-center gap-1">
                                <Clock className="w-4 h-4" />
                                Posted{" "}
                                {new Date(job.postedAt).toLocaleDateString()}
                              </div>
                              <div className="flex items-center gap-1">
                                <Users className="w-4 h-4" />
                                {job.applicants} applicants
                              </div>
                            </div>
                          </div>

                          <div className="flex gap-2">
                            <Button variant="outline" size="sm">
                              Edit
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() =>
                                setActiveTab(`applications-${job.id}`)
                              }
                            >
                              View Applications (
                              {
                                applications.filter(
                                  (app) => app.jobId === job.id,
                                ).length
                              }
                              )
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            )}

            {activeTab === "analytics" && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-2xl font-bold text-slate-900 mb-2">
                    Analytics Dashboard
                  </h2>
                  <p className="text-slate-600">
                    Track your job posting performance and candidate engagement.
                  </p>
                </div>

                {/* Overview Stats */}
                <div className="grid md:grid-cols-4 gap-6">
                  <Card>
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-medium text-slate-600">
                            Total Job Posts
                          </p>
                          <p className="text-3xl font-bold text-slate-900">
                            {getJobStats().totalJobs}
                          </p>
                        </div>
                        <Briefcase className="w-8 h-8 text-blue-600" />
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-medium text-slate-600">
                            Total Applications
                          </p>
                          <p className="text-3xl font-bold text-slate-900">
                            {getJobStats().totalApplications}
                          </p>
                        </div>
                        <FileText className="w-8 h-8 text-green-600" />
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-medium text-slate-600">
                            Total Views
                          </p>
                          <p className="text-3xl font-bold text-slate-900">
                            {getJobStats().totalViews}
                          </p>
                        </div>
                        <Eye className="w-8 h-8 text-purple-600" />
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-medium text-slate-600">
                            Interested Candidates
                          </p>
                          <p className="text-3xl font-bold text-slate-900">
                            {getJobStats().totalInterested}
                          </p>
                        </div>
                        <TrendingUp className="w-8 h-8 text-orange-600" />
                      </div>
                    </CardContent>
                  </Card>
                </div>

                {/* Job Performance */}
                <Card>
                  <CardHeader>
                    <CardTitle>Job Performance</CardTitle>
                  </CardHeader>
                  <CardContent>
                    {jobPosts.length === 0 ? (
                      <div className="text-center py-8">
                        <Briefcase className="w-12 h-12 text-slate-400 mx-auto mb-4" />
                        <h3 className="text-lg font-semibold text-slate-900 mb-2">
                          No Job Posts Yet
                        </h3>
                        <p className="text-slate-600 mb-4">
                          Start by posting your first job to see performance
                          analytics.
                        </p>
                        <Button onClick={() => setActiveTab("post-job")}>
                          Post Your First Job
                        </Button>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        {jobPosts.map((job) => (
                          <div
                            key={job.id}
                            className="border border-slate-200 rounded-lg p-4"
                          >
                            <div className="flex items-center justify-between mb-4">
                              <h3 className="font-semibold text-slate-900">
                                {job.title}
                              </h3>
                              <Badge
                                variant="outline"
                                className="bg-green-50 text-green-700"
                              >
                                {job.status}
                              </Badge>
                            </div>

                            <div className="grid md:grid-cols-4 gap-4 text-sm">
                              <div className="text-center">
                                <p className="font-medium text-slate-900">
                                  {job.views || 0}
                                </p>
                                <p className="text-slate-600">Views</p>
                              </div>
                              <div className="text-center">
                                <p className="font-medium text-slate-900">
                                  {job.interested || 0}
                                </p>
                                <p className="text-slate-600">Interested</p>
                              </div>
                              <div className="text-center">
                                <p className="font-medium text-slate-900">
                                  {job.applicants || 0}
                                </p>
                                <p className="text-slate-600">Applications</p>
                              </div>
                              <div className="text-center">
                                <p className="font-medium text-slate-900">
                                  {job.views > 0
                                    ? Math.round(
                                        ((job.applicants || 0) / job.views) *
                                          100,
                                      )
                                    : 0}
                                  %
                                </p>
                                <p className="text-slate-600">
                                  Conversion Rate
                                </p>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>
            )}

            {/* Applications View */}
            {activeTab.startsWith("applications-") && (
              <div className="space-y-6">
                {(() => {
                  const jobId = parseInt(activeTab.split("-")[1]);
                  const job = jobPosts.find((j) => j.id === jobId);
                  const jobApplications = applications.filter(
                    (app) => app.jobId === jobId,
                  );

                  return (
                    <>
                      <div className="flex items-center justify-between">
                        <div>
                          <h2 className="text-2xl font-bold text-slate-900">
                            Applications for {job?.title}
                          </h2>
                          <p className="text-slate-600">
                            {jobApplications.length} candidates have applied
                          </p>
                        </div>
                        <div className="flex gap-2">
                          {selectedApplications.length > 0 && (
                            <Button
                              variant="destructive"
                              size="sm"
                              onClick={handleDeleteSelectedApplications}
                            >
                              Delete Selected ({selectedApplications.length})
                            </Button>
                          )}
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleBulkDeleteApplications(jobId)}
                            className="text-destructive hover:text-destructive"
                          >
                            Delete All
                          </Button>
                          <Button
                            variant="outline"
                            onClick={() => setActiveTab("dashboard")}
                          >
                            Back to Jobs
                          </Button>
                        </div>
                      </div>

                      <div className="grid gap-4">
                        {jobApplications.length === 0 ? (
                          <Card>
                            <CardContent className="p-12 text-center">
                              <User className="w-12 h-12 text-slate-400 mx-auto mb-4" />
                              <h3 className="text-lg font-semibold text-slate-900 mb-2">
                                No Applications Yet
                              </h3>
                              <p className="text-slate-600">
                                This job posting hasn't received any applications yet.
                              </p>
                            </CardContent>
                          </Card>
                        ) : (
                          jobApplications.map((application) => (
                          <Card
                            key={application.id}
                            className="hover:shadow-md transition-shadow"
                          >
                            <CardContent className="p-6">
                              <div className="flex items-start justify-between">
                                <div className="flex-1">
                                  <div className="flex items-center gap-3 mb-3">
                                    <input
                                      type="checkbox"
                                      checked={selectedApplications.includes(application.id)}
                                      onChange={() => toggleApplicationSelection(application.id)}
                                      className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500"
                                    />
                                    <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                                      <User className="w-6 h-6 text-blue-600" />
                                    </div>
                                    <div>
                                      <h3 className="text-lg font-semibold text-slate-900">
                                        {application.candidateName}
                                      </h3>
                                      <p className="text-sm text-slate-600">
                                        {application.experience} experience
                                      </p>
                                    </div>
                                    <Badge
                                      variant="secondary"
                                      className="bg-green-100 text-green-700"
                                    >
                                      {application.matchScore}% match
                                    </Badge>
                                  </div>

                                  <div className="grid md:grid-cols-2 gap-4 mb-4 text-sm">
                                    <div className="flex items-center gap-2">
                                      <Mail className="w-4 h-4 text-slate-400" />
                                      <span className="text-slate-600">
                                        {application.candidateEmail}
                                      </span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                      <Phone className="w-4 h-4 text-slate-400" />
                                      <span className="text-slate-600">
                                        {application.candidatePhone}
                                      </span>
                                    </div>
                                  </div>

                                  <div className="mb-4">
                                    <p className="text-sm font-medium text-slate-700 mb-2">
                                      Skills:
                                    </p>
                                    <div className="flex flex-wrap gap-2">
                                      {application.skills.map((skill) => (
                                        <Badge
                                          key={skill}
                                          variant="outline"
                                          className="text-xs"
                                        >
                                          {skill}
                                        </Badge>
                                      ))}
                                    </div>
                                  </div>

                                  <div className="mb-4">
                                    <p className="text-sm font-medium text-slate-700 mb-2">
                                      Cover Letter:
                                    </p>
                                    <p className="text-sm text-slate-600 line-clamp-2">
                                      {application.coverLetter}
                                    </p>
                                  </div>

                                  <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-4 text-xs text-slate-500">
                                      <span>
                                        Applied{" "}
                                        {new Date(
                                          application.appliedAt,
                                        ).toLocaleDateString()}
                                      </span>
                                      <Badge
                                        variant="outline"
                                        className={
                                          application.status === "pending"
                                            ? "text-yellow-700 bg-yellow-50"
                                            : application.status === "reviewing"
                                              ? "text-blue-700 bg-blue-50"
                                              : "text-slate-700 bg-slate-50"
                                        }
                                      >
                                        {application.status}
                                      </Badge>
                                    </div>

                                    <div className="flex gap-2 flex-wrap">
                                      <Button variant="outline" size="sm">
                                        <Download className="w-4 h-4 mr-1" />
                                        Resume
                                      </Button>
                                      <Button variant="outline" size="sm">
                                        Message
                                      </Button>

                                      {/* Status Change Dropdown */}
                                      <select
                                        value={application.status}
                                        onChange={(e) => handleUpdateApplicationStatus(application.id, e.target.value)}
                                        className="px-3 py-1 text-sm border border-gray-300 rounded-md bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                      >
                                        <option value="pending">Pending</option>
                                        <option value="reviewing">Reviewing</option>
                                        <option value="interviewed">Interviewed</option>
                                        <option value="accepted">Accepted</option>
                                        <option value="rejected">Rejected</option>
                                      </select>

                                      <Button
                                        size="sm"
                                        variant="destructive"
                                        onClick={() => handleDeleteApplication(application.id)}
                                      >
                                        Delete
                                      </Button>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </CardContent>
                          </Card>
                          ))
                        )}
                      </div>
                    </>
                  );
                })()}
              </div>
            )}

            {/* Profile Section */}
            {activeTab === "profile" && (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <h2 className="text-2xl font-bold text-slate-900">
                    Recruiter Profile
                  </h2>
                  <Button>
                    <Edit className="w-4 h-4 mr-2" />
                    Edit Profile
                  </Button>
                </div>

                <div className="grid lg:grid-cols-3 gap-6">
                  {/* Profile Info */}
                  <Card className="lg:col-span-2">
                    <CardHeader>
                      <CardTitle>Personal Information</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      <div className="flex items-center gap-6">
                        <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center">
                          <User className="w-10 h-10 text-blue-600" />
                        </div>
                        <div>
                          <h3 className="text-xl font-semibold text-slate-900">
                            {recruiterProfile.name}
                          </h3>
                          <p className="text-slate-600">
                            {recruiterProfile.position}
                          </p>
                          <p className="text-slate-600">
                            {recruiterProfile.company}
                          </p>
                        </div>
                      </div>

                      <Separator />

                      <div className="grid md:grid-cols-2 gap-6">
                        <div>
                          <label className="text-sm font-medium text-slate-700 block mb-2">
                            Email
                          </label>
                          <div className="flex items-center gap-2">
                            <Mail className="w-4 h-4 text-slate-400" />
                            <span className="text-slate-600">
                              {recruiterProfile.email}
                            </span>
                          </div>
                        </div>
                        <div>
                          <label className="text-sm font-medium text-slate-700 block mb-2">
                            Phone
                          </label>
                          <div className="flex items-center gap-2">
                            <Phone className="w-4 h-4 text-slate-400" />
                            <span className="text-slate-600">
                              {recruiterProfile.phone}
                            </span>
                          </div>
                        </div>
                      </div>

                      <div>
                        <label className="text-sm font-medium text-slate-700 block mb-2">
                          Company Website
                        </label>
                        <div className="flex items-center gap-2">
                          <Globe className="w-4 h-4 text-slate-400" />
                          <span className="text-slate-600">
                            {recruiterProfile.website}
                          </span>
                        </div>
                      </div>

                      <div>
                        <label className="text-sm font-medium text-slate-700 block mb-2">
                          Bio
                        </label>
                        <p className="text-slate-600">{recruiterProfile.bio}</p>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Quick Stats */}
                  <div className="space-y-4">
                    <Card>
                      <CardHeader>
                        <CardTitle className="text-lg">Quick Stats</CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="text-center">
                          <p className="text-2xl font-bold text-blue-600">
                            {jobPosts.length}
                          </p>
                          <p className="text-sm text-slate-600">
                            Active Job Posts
                          </p>
                        </div>
                        <Separator />
                        <div className="text-center">
                          <p className="text-2xl font-bold text-green-600">
                            {jobPosts.reduce(
                              (sum, job) => sum + (job.applicants || 0),
                              0,
                            )}
                          </p>
                          <p className="text-sm text-slate-600">
                            Total Applications
                          </p>
                        </div>
                        <Separator />
                        <div className="text-center">
                          <p className="text-2xl font-bold text-purple-600">
                            {jobPosts.reduce(
                              (sum, job) => sum + (job.interested || 0),
                              0,
                            )}
                          </p>
                          <p className="text-sm text-slate-600">
                            Candidates Interested
                          </p>
                        </div>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader>
                        <CardTitle className="text-lg">
                          Recent Activity
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-3 text-sm">
                          <div className="flex items-center gap-2">
                            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                            <span className="text-slate-600">
                              New application received
                            </span>
                          </div>
                          <div className="flex items-center gap-2">
                            <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                            <span className="text-slate-600">
                              Job post viewed 15 times
                            </span>
                          </div>
                          <div className="flex items-center gap-2">
                            <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                            <span className="text-slate-600">
                              Profile updated
                            </span>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </div>
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
}
