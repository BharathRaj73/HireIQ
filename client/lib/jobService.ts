export interface Job {
  id: number;
  title: string;
  company: string;
  location: string;
  type: string;
  salary: string;
  description: string;
  requirements: string;
  benefits: string;
  skills: string[];
  posted: string;
  applicants: number;
  views: number;
  interested: number;
  logo: string;
  matchScore: number;
  status: string;
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

export class JobService {
  private static baseUrl = "/api";

  static async getAllJobs(userSkills?: string[]): Promise<Job[]> {
    try {
      const skillsParam = userSkills ? `?userSkills=${encodeURIComponent(JSON.stringify(userSkills))}` : '';
      const response = await fetch(`${this.baseUrl}/jobs${skillsParam}`);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return Array.isArray(data) ? data : [];
    } catch (error) {
      console.error("Error fetching jobs:", error);
      return [];
    }
  }

  static async getJobById(jobId: number): Promise<Job | null> {
    try {
      const response = await fetch(`${this.baseUrl}/jobs/${jobId}`);
      
      if (!response.ok) {
        if (response.status === 404) return null;
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error("Error fetching job:", error);
      return null;
    }
  }

  static async applyToJob(jobId: number, applicationData: {
    candidateName: string;
    candidateEmail: string;
    candidatePhone?: string;
    experience?: string;
    skills?: string[];
    coverLetter?: string;
    matchScore?: number;
  }): Promise<{ success: boolean; message: string; application?: JobApplication }> {
    try {
      const response = await fetch(`${this.baseUrl}/jobs/${jobId}/apply`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(applicationData),
      });
      
      const result = await response.json();
      
      if (!response.ok) {
        throw new Error(result.error || `HTTP error! status: ${response.status}`);
      }
      
      return result;
    } catch (error) {
      console.error("Error applying to job:", error);
      return { 
        success: false, 
        message: error instanceof Error ? error.message : "Failed to apply to job" 
      };
    }
  }

  static async getUserApplications(userEmail: string): Promise<JobApplication[]> {
    try {
      const response = await fetch(`${this.baseUrl}/applications?email=${encodeURIComponent(userEmail)}`);

      if (!response.ok) {
        if (response.status === 404) {
          return [];
        }
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return Array.isArray(data) ? data : [];
    } catch (error) {
      console.error("Error fetching user applications:", error);
      return [];
    }
  }

  static async getJobApplications(jobId: number): Promise<JobApplication[]> {
    try {
      const response = await fetch(`${this.baseUrl}/jobs/${jobId}/applications`);

      if (!response.ok) {
        if (response.status === 404) {
          // Job not found, return empty array
          return [];
        }
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return Array.isArray(data) ? data : [];
    } catch (error) {
      console.error("Error fetching job applications:", error);
      // Return empty array instead of letting the error propagate
      return [];
    }
  }

  static async updateApplicationStatus(applicationId: number, status: string): Promise<{ success: boolean; application?: JobApplication }> {
    try {
      const response = await fetch(`${this.baseUrl}/applications/${applicationId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status }),
      });
      
      const result = await response.json();
      
      if (!response.ok) {
        throw new Error(result.error || `HTTP error! status: ${response.status}`);
      }
      
      return result;
    } catch (error) {
      console.error("Error updating application status:", error);
      return { success: false };
    }
  }
}
