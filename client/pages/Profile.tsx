import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Brain, 
  User, 
  Mail, 
  Phone, 
  MapPin, 
  Briefcase, 
  GraduationCap,
  LogOut,
  Users
} from "lucide-react";

export default function Profile() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  useEffect(() => {
    // If no user data, redirect to login
    if (!user) {
      navigate("/login");
    }
  }, [user, navigate]);

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  if (!user) {
    return <div>Loading...</div>;
  }

  const fadeUp = (delay = 0) => ({
    initial: { opacity: 0, y: 24 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.6, delay },
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 shadow-sm">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-white overflow-hidden">
              <img
                src="https://cdn.builder.io/api/v1/image/assets%2Fe8df578c0f38439a97d1f3a56a1f7872%2F90c72f447e7b4bf69123889c8f3cd6be?format=webp&width=800"
                alt="HireIQ Logo"
                className="w-full h-full object-contain p-1"
              />
            </div>
            <span className="text-xl font-bold tracking-tight">HireIQ</span>
          </div>
          <Button
            variant="ghost"
            onClick={handleLogout}
            className="flex items-center gap-2 text-slate-600 hover:text-slate-900"
          >
            <LogOut className="w-4 h-4" />
            Logout
          </Button>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <motion.div {...fadeUp(0)} className="mb-8">
          <h1 className="text-3xl font-bold text-slate-900 mb-2">Your Profile</h1>
          <p className="text-slate-600">
            Welcome back! Here are your account details.
          </p>
        </motion.div>

        <div className="grid gap-6">
          {/* User Type Badge */}
          <motion.div {...fadeUp(0.1)}>
            <div className="flex items-center gap-2 mb-4">
              {user.userType === "job_seeker" ? (
                <Badge variant="default" className="flex items-center gap-1 px-3 py-1">
                  <User className="w-4 h-4" />
                  Job Seeker
                </Badge>
              ) : (
                <Badge variant="secondary" className="flex items-center gap-1 px-3 py-1">
                  <Users className="w-4 h-4" />
                  Recruiter
                </Badge>
              )}
            </div>
          </motion.div>

          {/* Basic Information */}
          <motion.div {...fadeUp(0.2)}>
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="w-5 h-5" />
                  Personal Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="text-sm font-medium text-slate-700 block mb-1">First Name</label>
                    <p className="text-slate-900 font-medium">{user.firstName}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-slate-700 block mb-1">Last Name</label>
                    <p className="text-slate-900 font-medium">{user.lastName}</p>
                  </div>
                </div>

                <div>
                  <label className="text-sm font-medium text-slate-700 block mb-1">Email Address</label>
                  <div className="flex items-center gap-2">
                    <Mail className="w-4 h-4 text-slate-400" />
                    <p className="text-slate-900 font-medium">{user.email}</p>
                  </div>
                </div>

                {user.phone && (
                  <div>
                    <label className="text-sm font-medium text-slate-700 block mb-1">Phone Number</label>
                    <div className="flex items-center gap-2">
                      <Phone className="w-4 h-4 text-slate-400" />
                      <p className="text-slate-900 font-medium">{user.phone || "Not provided"}</p>
                    </div>
                  </div>
                )}

                {user.location && (
                  <div>
                    <label className="text-sm font-medium text-slate-700 block mb-1">Location</label>
                    <div className="flex items-center gap-2">
                      <MapPin className="w-4 h-4 text-slate-400" />
                      <p className="text-slate-900 font-medium">{user.location || "Not provided"}</p>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </motion.div>

          {/* Professional Information - Only for Job Seekers */}
          {user.userType === "job_seeker" && (
            <motion.div {...fadeUp(0.3)}>
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Briefcase className="w-5 h-5" />
                    Professional Information
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {user.title && (
                    <div>
                      <label className="text-sm font-medium text-slate-700 block mb-1">Job Title</label>
                      <p className="text-slate-900 font-medium">{user.title || "Not specified"}</p>
                    </div>
                  )}

                  {user.experience && (
                    <div>
                      <label className="text-sm font-medium text-slate-700 block mb-1">Experience Level</label>
                      <p className="text-slate-900 font-medium">{user.experience || "Not specified"}</p>
                    </div>
                  )}

                  {user.summary && (
                    <div>
                      <label className="text-sm font-medium text-slate-700 block mb-1">Professional Summary</label>
                      <p className="text-slate-700">{user.summary || "No summary provided"}</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </motion.div>
          )}

          {/* Education - Only for Job Seekers */}
          {user.userType === "job_seeker" && user.education && (
            <motion.div {...fadeUp(0.4)}>
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <GraduationCap className="w-5 h-5" />
                    Education
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div>
                    <label className="text-sm font-medium text-slate-700 block mb-1">Highest Education</label>
                    <p className="text-slate-900 font-medium">{user.education || "Not specified"}</p>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}

          {/* Skills - Only for Job Seekers */}
          {user.userType === "job_seeker" && user.skills && user.skills.length > 0 && (
            <motion.div {...fadeUp(0.5)}>
              <Card>
                <CardHeader>
                  <CardTitle>Skills</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2">
                    {user.skills.map((skill, index) => (
                      <Badge
                        key={index}
                        variant="secondary"
                        className="px-3 py-1"
                      >
                        {skill}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}

          {/* Account Status */}
          <motion.div {...fadeUp(0.6)}>
            <Card>
              <CardHeader>
                <CardTitle>Account Status</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-2">
                  <Badge variant={user.profileCompleted ? "default" : "secondary"}>
                    {user.profileCompleted ? "Profile Complete" : "Profile Incomplete"}
                  </Badge>
                  <Badge variant={user.isAuthenticated ? "default" : "destructive"}>
                    {user.isAuthenticated ? "Verified" : "Unverified"}
                  </Badge>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Navigation Buttons */}
          <motion.div {...fadeUp(0.7)} className="flex justify-center gap-4 pt-6">
            {user.userType === "job_seeker" ? (
              <Button
                onClick={() => navigate("/dashboard/job-seeker")}
                size="lg"
                className="bg-gradient-to-r from-blue-600 to-purple-600 hover:opacity-90 transition shadow-md hover:shadow-lg"
              >
                Go to Job Dashboard
              </Button>
            ) : (
              <Button
                onClick={() => navigate("/recruiter")}
                size="lg"
                className="bg-gradient-to-r from-emerald-600 to-teal-600 hover:opacity-90 transition shadow-md hover:shadow-lg"
              >
                Go to Recruiter Dashboard
              </Button>
            )}
          </motion.div>
        </div>
      </div>
    </div>
  );
}
