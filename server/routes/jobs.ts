import { RequestHandler } from "express";

export interface Job {
  id: number;
  title: string;
  company: string;
  location: string;
  type: string;
  salaryMin: string;
  salaryMax: string;
  salary?: string; // Formatted salary range
  description: string;
  requirements: string;
  benefits: string;
  skills: string[];
  postedAt: string;
  posted?: string; // Formatted posted date
  status: "active" | "paused" | "closed";
  applicants: number;
  views: number;
  interested: number;
  logo?: string; // Company logo initials
  matchScore?: number; // For job seekers
}

export interface JobApplication {
  id: number;
  jobId: number;
  jobTitle: string;
  candidateName: string;
  candidateEmail: string;
  candidatePhone?: string;
  experience?: string;
  skills: string[];
  appliedAt: string;
  status: "pending" | "reviewing" | "interviewed" | "accepted" | "rejected";
  resumeUrl?: string;
  coverLetter?: string;
  matchScore?: number;
}

// Get all active jobs
export const getAllJobs: RequestHandler = (req, res) => {
  try {
    const jobs = JSON.parse(global.localStorage?.getItem("jobPosts") || "[]") as Job[];
    
    // Transform jobs for job seeker dashboard format
    const transformedJobs = jobs
      .filter(job => job.status === "active")
      .map(job => ({
        ...job,
        salary: job.salaryMin && job.salaryMax 
          ? `$${parseInt(job.salaryMin).toLocaleString()} - $${parseInt(job.salaryMax).toLocaleString()}`
          : "Competitive",
        logo: job.company.split(' ').map(word => word[0]).join('').substring(0, 2).toUpperCase(),
        posted: formatPostedDate(job.postedAt),
        matchScore: calculateMatchScore(job, req.query.userSkills as string)
      }));

    res.json(transformedJobs);
  } catch (error) {
    console.error("Error getting jobs:", error);
    res.status(500).json({ error: "Failed to fetch jobs" });
  }
};

// Get job by ID
export const getJobById: RequestHandler = (req, res) => {
  try {
    const jobId = parseInt(req.params.id);
    const jobs = JSON.parse(global.localStorage?.getItem("jobPosts") || "[]") as Job[];
    const job = jobs.find(j => j.id === jobId);
    
    if (!job) {
      return res.status(404).json({ error: "Job not found" });
    }

    // Increment view count
    job.views = (job.views || 0) + 1;
    global.localStorage?.setItem("jobPosts", JSON.stringify(jobs));

    res.json({
      ...job,
      salary: job.salaryMin && job.salaryMax 
        ? `$${parseInt(job.salaryMin).toLocaleString()} - $${parseInt(job.salaryMax).toLocaleString()}`
        : "Competitive",
      logo: job.company.split(' ').map(word => word[0]).join('').substring(0, 2).toUpperCase(),
      posted: formatPostedDate(job.postedAt)
    });
  } catch (error) {
    console.error("Error getting job by ID:", error);
    res.status(500).json({ error: "Failed to fetch job" });
  }
};

// Apply to a job
export const applyToJob: RequestHandler = (req, res) => {
  try {
    const jobId = parseInt(req.params.id);
    const applicationData = req.body;

    // Get jobs and update applicant count
    const jobs = JSON.parse(global.localStorage?.getItem("jobPosts") || "[]") as Job[];
    const jobIndex = jobs.findIndex(j => j.id === jobId);
    
    if (jobIndex === -1) {
      return res.status(404).json({ error: "Job not found" });
    }

    // Increment applicant count
    jobs[jobIndex].applicants = (jobs[jobIndex].applicants || 0) + 1;
    global.localStorage?.setItem("jobPosts", JSON.stringify(jobs));

    // Store application
    const applications = JSON.parse(global.localStorage?.getItem("jobApplications") || "[]") as JobApplication[];
    
    const newApplication: JobApplication = {
      id: Date.now(),
      jobId: jobId,
      jobTitle: jobs[jobIndex].title,
      candidateName: applicationData.candidateName,
      candidateEmail: applicationData.candidateEmail,
      candidatePhone: applicationData.candidatePhone,
      experience: applicationData.experience,
      skills: applicationData.skills || [],
      appliedAt: new Date().toISOString(),
      status: "pending",
      coverLetter: applicationData.coverLetter,
      matchScore: applicationData.matchScore || 85
    };

    applications.push(newApplication);
    global.localStorage?.setItem("jobApplications", JSON.stringify(applications));

    res.json({ 
      success: true, 
      message: "Application submitted successfully",
      application: newApplication 
    });
  } catch (error) {
    console.error("Error applying to job:", error);
    res.status(500).json({ error: "Failed to submit application" });
  }
};

// Get applications for a job (for recruiters)
export const getJobApplications: RequestHandler = (req, res) => {
  try {
    const jobId = parseInt(req.params.id);
    const applications = JSON.parse(global.localStorage?.getItem("jobApplications") || "[]") as JobApplication[];
    
    const jobApplications = applications.filter(app => app.jobId === jobId);
    res.json(jobApplications);
  } catch (error) {
    console.error("Error getting job applications:", error);
    res.status(500).json({ error: "Failed to fetch applications" });
  }
};

// Get all applications for a user (for job seekers)
export const getUserApplications: RequestHandler = (req, res) => {
  try {
    const userEmail = req.query.email as string;
    if (!userEmail) {
      return res.status(400).json({ error: "User email required" });
    }

    const applications = JSON.parse(global.localStorage?.getItem("jobApplications") || "[]") as JobApplication[];
    const userApplications = applications.filter(app => app.candidateEmail === userEmail);
    
    res.json(userApplications);
  } catch (error) {
    console.error("Error getting user applications:", error);
    res.status(500).json({ error: "Failed to fetch user applications" });
  }
};

// Update application status (for recruiters)
export const updateApplicationStatus: RequestHandler = (req, res) => {
  try {
    const applicationId = parseInt(req.params.id);
    const { status } = req.body;

    const applications = JSON.parse(global.localStorage?.getItem("jobApplications") || "[]") as JobApplication[];
    const applicationIndex = applications.findIndex(app => app.id === applicationId);
    
    if (applicationIndex === -1) {
      return res.status(404).json({ error: "Application not found" });
    }

    applications[applicationIndex].status = status;
    global.localStorage?.setItem("jobApplications", JSON.stringify(applications));

    res.json({ success: true, application: applications[applicationIndex] });
  } catch (error) {
    console.error("Error updating application status:", error);
    res.status(500).json({ error: "Failed to update application status" });
  }
};

// Helper functions
function formatPostedDate(postedAt: string): string {
  const now = new Date();
  const posted = new Date(postedAt);
  const diffTime = Math.abs(now.getTime() - posted.getTime());
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  
  if (diffDays === 1) return "1 day ago";
  if (diffDays < 7) return `${diffDays} days ago`;
  if (diffDays < 30) return `${Math.ceil(diffDays / 7)} weeks ago`;
  return `${Math.ceil(diffDays / 30)} months ago`;
}

function calculateMatchScore(job: Job, userSkillsStr?: string): number {
  if (!userSkillsStr) return 85; // Default score
  
  try {
    const userSkills = JSON.parse(userSkillsStr) as string[];
    const jobSkills = job.skills || [];
    
    if (jobSkills.length === 0) return 85;
    
    const matchingSkills = userSkills.filter(skill => 
      jobSkills.some(jobSkill => 
        jobSkill.toLowerCase().includes(skill.toLowerCase()) ||
        skill.toLowerCase().includes(jobSkill.toLowerCase())
      )
    );
    
    const matchPercentage = Math.round((matchingSkills.length / jobSkills.length) * 100);
    return Math.min(Math.max(matchPercentage, 60), 100); // Keep between 60-100
  } catch {
    return 85;
  }
}
