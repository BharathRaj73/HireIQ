import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Brain, Users, Search } from "lucide-react";
import { motion } from "framer-motion";

type UserType = "job_seeker" | "recruiter" | null;

export default function Onboarding() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [selectedType, setSelectedType] = useState<UserType>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleCompleteSetup = async () => {
    if (!selectedType) {
      setError("⚠️ Please select your role to continue");
      return;
    }
    setIsLoading(true);
    setError("");
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      // Both user types go to signup with their selected type
      navigate("/signup", { state: { userType: selectedType } });
    } catch {
      setError("Onboarding failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-sky-50 via-white to-indigo-100 flex items-center justify-center p-6">
      <Card className="w-full max-w-2xl border-0 shadow-2xl rounded-2xl overflow-hidden">
        <CardHeader className="text-center pb-8">
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="w-16 h-16 mx-auto mb-4 bg- rounded-full flex items-center justify-center shadow-lg"
          >
            <img
              src="https://cdn.builder.io/api/v1/image/assets%2Fe8df578c0f38439a97d1f3a56a1f7872%2F90c72f447e7b4bf69123889c8f3cd6be?format=webp&width=800"
              alt="HireIQ Logo"
              className="w-8 h-8 object-contain "
            />
          </motion.div>
          <CardTitle className="text-3xl font-bold text-gray-900">
            Tell us who you are
          </CardTitle>
          <p className="text-gray-500 mt-2 text-lg">
            Personalize your HireIQ experience
          </p>
        </CardHeader>

        <CardContent className="space-y-6">
          {error && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="bg-red-100 border border-red-300 rounded-lg p-4 text-center"
            >
              <p className="text-red-600 font-medium">{error}</p>
            </motion.div>
          )}

          <div className="grid gap-6 md:grid-cols-2">
            {/* Job Seeker Card */}
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => {
                setSelectedType("job_seeker");
                setError("");
              }}
              className={`border-2 rounded-xl p-8 text-center cursor-pointer transition-all duration-300 ${
                selectedType === "job_seeker"
                  ? "border-sky-500 bg-sky-50 shadow-lg shadow-sky-100"
                  : "border-gray-200 hover:border-sky-300 hover:bg-sky-50/60"
              }`}
            >
              <div className="w-14 h-14 mx-auto mb-4 bg-sky-100 rounded-full flex items-center justify-center">
                <Search className="w-7 h-7 text-sky-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Job Seeker
              </h3>
              <p className="text-gray-500 text-sm">
                I&apos;m looking for opportunities
              </p>
            </motion.div>

            {/* Recruiter Card */}
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => {
                setSelectedType("recruiter");
                setError("");
              }}
              className={`border-2 rounded-xl p-8 text-center cursor-pointer transition-all duration-300 ${
                selectedType === "recruiter"
                  ? "border-emerald-500 bg-emerald-50 shadow-lg shadow-emerald-100"
                  : "border-gray-200 hover:border-emerald-300 hover:bg-emerald-50/60"
              }`}
            >
              <div className="w-14 h-14 mx-auto mb-4 bg-emerald-100 rounded-full flex items-center justify-center">
                <Users className="w-7 h-7 text-emerald-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Recruiter / Hirer
              </h3>
              <p className="text-gray-500 text-sm">
                I&apos;m looking to hire talent
              </p>
            </motion.div>
          </div>

          {/* Continue Button */}
          <div className="pt-6">
            <Button
              onClick={handleCompleteSetup}
              disabled={!selectedType || isLoading}
              className="w-full h-12 text-base rounded-xl shadow-md hover:shadow-lg transition-all bg-gradient-to-r from-sky-500 to-indigo-500 text-white font-semibold hover:opacity-90"
            >
              {isLoading ? "Setting up..." : "Complete Setup"}
            </Button>
          </div>

          {/* Back Link */}
          <div className="text-center">
            <Button
              variant="link"
              onClick={() => {
                // If user exists and is authenticated, go to profile page
                // Otherwise, go to login page
                if (user?.isAuthenticated) {
                  navigate("/profile");
                } else {
                  navigate("/login");
                }
              }}
              className="text-gray-500 hover:text-gray-800"
            >
              Back to sign in
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
