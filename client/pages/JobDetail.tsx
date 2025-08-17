import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import {
  Brain,
  ArrowLeft,
  MapPin,
  Building2,
  Clock,
  DollarSign,
  Users,
  Bookmark,
  Share2,
  CheckCircle,
  Globe,
} from "lucide-react";

export default function JobDetail() {
  const { jobId } = useParams<{ jobId: string }>();
  const navigate = useNavigate();
  const [isApplied, setIsApplied] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isWithdrawing, setIsWithdrawing] = useState(false);

  // Mock job data
  const jobData = {
    id: parseInt(jobId || "1"),
    title: "Senior Frontend Developer",
    company: "TechCorp Inc.",
    location: "San Francisco, CA",
    type: "Full-time",
    salary: "$120,000 - $160,000",
    posted: "2 days ago",
    logo: "TC",
    matchScore: 95,
    applicants: 47,
    description: `We are seeking a talented Senior Frontend Developer...`,
    responsibilities: [
      "Develop and maintain high-quality React applications",
      "Collaborate with UX/UI designers",
      "Write clean and maintainable code",
    ],
    requirements: [
      "5+ years of frontend experience",
      "Expert knowledge of React, TypeScript",
      "Experience with testing frameworks",
    ],
    skills: ["React", "TypeScript", "Node.js", "GraphQL", "CSS3"],
    benefits: [
      "Competitive salary",
      "Health, dental, and vision insurance",
      "Flexible hours",
    ],
    companyInfo: {
      size: "500-1000 employees",
      industry: "Software Development",
      founded: "2015",
      website: "techcorp.com",
    },
  };

  const handleApply = async () => {
    setIsLoading(true);
    await new Promise((resolve) => setTimeout(resolve, 1500));
    setIsApplied(true);
    setIsLoading(false);
  };

  const handleSave = () => {
    setIsSaved((prev) => !prev);
  };

  const handleWithdraw = async () => {
    setIsWithdrawing(true);
    await new Promise((resolve) => setTimeout(resolve, 1000));
    setIsApplied(false);
    setIsWithdrawing(false);
  };

  useEffect(() => {
    const savedJobs = JSON.parse(localStorage.getItem("savedJobs") || "[]");
    setIsSaved(savedJobs.includes(jobData.id));
  }, [jobData.id]);

  if (isApplied) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-sky-50 to-indigo-100">
        {/* Header */}
        <header className="bg-white/80 backdrop-blur-md shadow-md border-b border-slate-200">
          <div className="max-w-6xl mx-auto px-6 py-4 flex items-center gap-4">
            <Button
              variant="outline"
              size="sm"
              onClick={() => navigate("/dashboard/job-seeker")}
              className="flex items-center gap-2 rounded-lg hover:bg-sky-50 transition-all"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Dashboard
            </Button>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center">
                <img
                  src="https://cdn.builder.io/api/v1/image/assets%2Fe8df578c0f38439a97d1f3a56a1f7872%2F90c72f447e7b4bf69123889c8f3cd6be?format=webp&width=800"
                  alt="HireIQ Logo"
                  className="w-4 h-4 object-contain"
                />
              </div>
              <span className="text-xl font-bold text-slate-800">HireIQ</span>
            </div>
          </div>
        </header>

        {/* Success Message */}
        <div className="max-w-4xl mx-auto p-6">
          <Card className="bg-white/90 backdrop-blur-md shadow-lg rounded-xl text-center py-12">
            <CardContent>
              <div className="space-y-6">
                <div className="w-20 h-20 mx-auto bg-green-100 rounded-full flex items-center justify-center shadow-inner">
                  <CheckCircle className="w-10 h-10 text-green-600" />
                </div>
                <h1 className="text-3xl font-bold text-slate-800">
                  Application Submitted Successfully!
                </h1>
                <p className="text-slate-600">
                  Your application for <b>{jobData.title}</b> at <b>{jobData.company}</b> has been submitted.
                </p>
                <div className="bg-slate-50 rounded-lg p-6 max-w-md mx-auto text-left shadow-inner">
                  <h3 className="font-semibold text-slate-800 mb-3">Application Details</h3>
                  <ul className="text-sm text-slate-600 space-y-2">
                    <li>• Resume and cover letter included</li>
                    <li>• Skills and experience highlighted</li>
                    <li>• You’ll receive updates via email</li>
                  </ul>
                </div>
                <div className="flex gap-4 justify-center">
                  <Button
                    onClick={() => navigate("/dashboard/job-seeker")}
                    className="rounded-lg bg-gradient-to-r from-sky-500 to-indigo-500 text-white"
                  >
                    Back to Dashboard
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => navigate("/dashboard/job-seeker")}
                    className="rounded-lg hover:bg-sky-50"
                  >
                    View My Applications
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-sky-50 to-indigo-100">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-md border-b border-slate-200 sticky top-0 z-50 shadow-sm">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button
              variant="outline"
              size="sm"
              onClick={() => navigate("/dashboard/job-seeker")}
              className="flex items-center gap-2 rounded-lg hover:bg-sky-50 transition-all"
            >
              <ArrowLeft className="w-4 h-4" />
              Back
            </Button>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center">
                <img
                  src="https://cdn.builder.io/api/v1/image/assets%2Fe8df578c0f38439a97d1f3a56a1f7872%2F90c72f447e7b4bf69123889c8f3cd6be?format=webp&width=800"
                  alt="HireIQ Logo"
                  className="w-4 h-4 object-contain"
                />
              </div>
              <span className="text-xl font-bold text-slate-800">HireIQ</span>
            </div>
          </div>
          <Button
            variant="outline"
            size="sm"
            className="rounded-lg hover:bg-sky-50 transition-all"
          >
            <Share2 className="w-4 h-4 mr-2" /> Share
          </Button>
        </div>
      </header>

      {/* Main Layout */}
      <div className="max-w-6xl mx-auto p-6 grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Job Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Job Header */}
          <Card className="bg-white/90 backdrop-blur-md rounded-xl shadow-md hover:shadow-lg transition-all">
            <CardContent className="p-6">
              <div className="flex items-start gap-4">
                <Avatar className="w-16 h-16">
                  <AvatarFallback className="bg-sky-100 text-sky-600 font-bold text-lg">
                    {jobData.logo}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <div className="flex items-start justify-between">
                    <div>
                      <h1 className="text-2xl font-bold text-slate-800">{jobData.title}</h1>
                      <p className="text-slate-500">{jobData.company}</p>
                    </div>
                    <Badge className="rounded-full bg-emerald-100 text-emerald-600 shadow-sm">
                      {jobData.matchScore}% match
                    </Badge>
                  </div>
                  <div className="flex flex-wrap gap-4 mt-4 text-sm text-slate-500">
                    <span className="flex items-center gap-1"><MapPin className="w-4 h-4" /> {jobData.location}</span>
                    <span className="flex items-center gap-1"><Building2 className="w-4 h-4" /> {jobData.type}</span>
                    <span className="flex items-center gap-1"><DollarSign className="w-4 h-4" /> {jobData.salary}</span>
                    <span className="flex items-center gap-1"><Clock className="w-4 h-4" /> {jobData.posted}</span>
                    <span className="flex items-center gap-1"><Users className="w-4 h-4" /> {jobData.applicants} applicants</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Sections */}
          {[
            { title: "Job Description", content: jobData.description },
            { title: "Key Responsibilities", list: jobData.responsibilities },
            { title: "Requirements", list: jobData.requirements },
            { title: "Benefits & Perks", list: jobData.benefits },
          ].map((section, i) => (
            <Card
              key={i}
              className="bg-white/90 backdrop-blur rounded-xl shadow-sm hover:shadow-md transition-all"
            >
              <CardHeader><CardTitle>{section.title}</CardTitle></CardHeader>
              <CardContent>
                {section.content && <p className="text-slate-600 leading-relaxed">{section.content}</p>}
                {section.list && (
                  <ul className="space-y-2 text-slate-600">
                    {section.list.map((item, idx) => (
                      <li key={idx} className="flex gap-2"><span className="text-sky-500">•</span> {item}</li>
                    ))}
                  </ul>
                )}
              </CardContent>
            </Card>
          ))}

          {/* Skills */}
          <Card className="bg-white/90 backdrop-blur rounded-xl shadow-sm hover:shadow-md transition-all">
            <CardHeader><CardTitle>Required Skills</CardTitle></CardHeader>
            <CardContent className="flex flex-wrap gap-2">
              {jobData.skills.map((skill) => (
                <Badge key={skill} className="rounded-full bg-sky-50 text-sky-600 px-3 py-1 font-medium cursor-pointer 
                   transition-all duration-200 hover:bg-sky-500 hover:text-white">
                  {skill}
                </Badge>
              ))}
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Apply Card */}
          <Card className="bg-white/90 backdrop-blur rounded-xl shadow-md">
            <CardContent className="p-6 space-y-4">
              {isApplied ? (
                <>
                  <div className="bg-green-50 border border-green-200 rounded-lg p-4 text-center">
                    <CheckCircle className="w-5 h-5 text-green-600 mx-auto mb-2" />
                    <p className="text-sm font-semibold text-green-700">Application Submitted</p>
                  </div>
                  <Button
                    variant="outline"
                    onClick={handleWithdraw}
                    disabled={isWithdrawing}
                    className="w-full rounded-lg text-red-600 hover:bg-red-50"
                  >
                    {isWithdrawing ? "Withdrawing..." : "Withdraw Application"}
                  </Button>
                </>
              ) : (
                <Button
                  onClick={handleApply}
                  className="w-full rounded-lg bg-gradient-to-r from-sky-500 to-indigo-500 text-white"
                  disabled={isLoading}
                >
                  {isLoading ? "Applying..." : "Apply Now"}
                </Button>
              )}
              <Button
                variant="outline"
                onClick={handleSave}
                className="w-full rounded-lg hover:bg-sky-50"
              >
                <Bookmark className="w-4 h-4 mr-2" />
                {isSaved ? "Saved" : "Save Job"}
              </Button>
            </CardContent>
          </Card>

          {/* Company Info */}
          <Card className="bg-white/90 backdrop-blur rounded-xl shadow-sm">
            <CardHeader><CardTitle>About {jobData.company}</CardTitle></CardHeader>
            <CardContent className="space-y-3 text-sm">
              <div className="flex justify-between"><span className="text-slate-500">Industry</span> <span>{jobData.companyInfo.industry}</span></div>
              <div className="flex justify-between"><span className="text-slate-500">Company Size</span> <span>{jobData.companyInfo.size}</span></div>
              <div className="flex justify-between"><span className="text-slate-500">Founded</span> <span>{jobData.companyInfo.founded}</span></div>
              <Separator />
              <Button variant="link" className="w-full text-sky-600">
                <Globe className="w-4 h-4 mr-2" /> Visit Company Website
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
