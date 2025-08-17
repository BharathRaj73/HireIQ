import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Brain,
  Users,
  Search,
  Zap,
  CheckCircle,
  ArrowRight,
  BarChart3,
} from "lucide-react";

export default function Homepage() {
  const navigate = useNavigate();

  const features = [
    {
      icon: Brain,
      title: "AI-Powered Matching",
      description:
        "Our advanced AI algorithm matches you with jobs that perfectly fit your skills and preferences.",
      color: "from-blue-500/20 to-blue-700/20 text-blue-700",
    },
    {
      icon: Zap,
      title: "Instant Applications",
      description:
        "Apply to multiple jobs with one click using your pre-filled profile and cover letter.",
      color: "from-purple-500/20 to-purple-700/20 text-purple-700",
    },
    {
      icon: BarChart3,
      title: "Smart Analytics",
      description:
        "Track your application performance and get insights to improve your job search strategy.",
      color: "from-emerald-500/20 to-emerald-700/20 text-emerald-700",
    },
  ];

  const benefits = [
    "95% faster job application process",
    "3x higher interview callback rate",
    "Access to exclusive job opportunities",
    "Real-time application tracking",
    "Personalized career recommendations",
    "Professional profile optimization",
  ];

  const stats = [
    { number: "10K+", label: "Jobs Posted" },
    { number: "5K+", label: "Happy Users" },
    { number: "500+", label: "Partner Companies" },
    { number: "95%", label: "Success Rate" },
  ];

  const fadeUp = (delay = 0) => ({
    initial: { opacity: 0, y: 24 },
    whileInView: { opacity: 1, y: 0 },
    transition: { duration: 0.6, delay },
    viewport: { once: true, margin: "-80px" },
  });

  return (
    <div className="min-h-screen bg-gradient-to-b from-white via-slate-50 to-white text-slate-900 antialiased">
      <header className="sticky top-0 z-50 bg-white/70 backdrop-blur-md border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <motion.div
              whileHover={{ rotate: 15, scale: 1.05 }}
              className="w-9 h-9 rounded-full overflow-hidden shadow-md bg-white"
            >
              <img
                src="https://cdn.builder.io/api/v1/image/assets%2Fe8df578c0f38439a97d1f3a56a1f7872%2F90c72f447e7b4bf69123889c8f3cd6be?format=webp&width=800"
                alt="HireIQ Logo"
                className="w-full h-full object-contain p-1"
              />
            </motion.div>
            <span className="text-xl font-bold tracking-tight">
              HireIQ
            </span>
          </div>
          <nav className="hidden md:flex items-center gap-8">
            <a
              href="#features"
              className="text-slate-600 hover:text-slate-900 transition"
            >
              Features
            </a>
            <a
              href="#how-it-works"
              className="text-slate-600 hover:text-slate-900 transition"
            >
              How it Works
            </a>
            <button
              onClick={() => navigate("/tech-news")}
              className="text-slate-600 hover:text-slate-900 transition"
            >
              Tech News
            </button>
          </nav>
          <div className="flex items-center gap-2">
            <Button
              onClick={() => navigate("/onboarding")}
              className="bg-gradient-to-r from-blue-600 to-purple-600 hover:opacity-90 transition shadow-md hover:shadow-lg"
            >
              Get Started
            </Button>
          </div>
        </div>
      </header>

      <section className="relative overflow-hidden">
        <div className="absolute inset-0 -z-10">
          <div className="absolute -top-24 -left-24 w-80 h-80 rounded-full bg-gradient-to-tr from-blue-500/20 to-purple-500/20 blur-3xl" />
          <div className="absolute -bottom-24 -right-24 w-80 h-80 rounded-full bg-gradient-to-tr from-fuchsia-400/20 to-emerald-400/20 blur-3xl" />
        </div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-16 sm:pt-24 sm:pb-24">
          <motion.h1
            {...fadeUp(0)}
            className="text-center text-4xl sm:text-5xl lg:text-6xl font-extrabold leading-tight"
          >
            Find Your Perfect Job with
            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600">
              AI Intelligence
            </span>
          </motion.h1>
          <motion.p
            {...fadeUp(0.15)}
            className="text-center text-lg sm:text-xl text-slate-600 mt-6 max-w-3xl mx-auto"
          >
            HireIQ revolutionizes job searching with intelligent matching,
            automated applications, and personalized career insights. Land your
            dream job faster than ever before.
          </motion.p>
          <motion.div
            {...fadeUp(0.3)}
            className="mt-10 flex flex-col sm:flex-row gap-4 justify-center"
          >
            <Button
              size="lg"
              onClick={() => navigate("/onboarding")}
              className="text-lg px-10 py-7 h-auto bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 hover:from-blue-600 hover:via-purple-600 hover:to-pink-600 hover:scale-[1.05] transition-all duration-300 shadow-xl hover:shadow-2xl rounded-2xl animate-glow"
            >
              Start Job Search
              <ArrowRight className="ml-2 w-5 h-5" />
            </Button>
          </motion.div>
          <div className="mt-14 grid grid-cols-2 md:grid-cols-4 gap-5 max-w-4xl mx-auto">
            {stats.map((s, i) => (
              <motion.div
                key={i}
                {...fadeUp(0.1 + i * 0.08)}
                className="rounded-xl border border-slate-200 bg-white/70 backdrop-blur p-5 text-center shadow-sm hover:shadow-md transition hover:-translate-y-0.5"
              >
                <div className="text-3xl font-extrabold">{s.number}</div>
                <div className="text-slate-600">{s.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section
        id="features"
        className="py-20 bg-gradient-to-b from-slate-50 to-white"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-slate-900 mb-4">
              Powered by Advanced AI Technology
            </h2>
            <p className="text-xl text-slate-600 max-w-2xl mx-auto">
              Experience the future of job searching with our intelligent
              platform designed for modern professionals.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 items-stretch">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                whileHover={{ y: -8, scale: 1.02 }}
                transition={{ type: "spring", stiffness: 300 }}
                className="h-full"
              >
                <Card className="h-full border-0 shadow-lg hover:shadow-2xl transition-shadow rounded-2xl">
                  <CardContent className="p-8 text-center flex flex-col h-full">
                    <div
                      className={`w-16 h-16 ${feature.color} rounded-full flex items-center justify-center mx-auto mb-6 shadow-md`}
                    >
                      <feature.icon className="w-8 h-8" />
                    </div>
                    <h3 className="text-xl font-semibold text-slate-900 mb-4">
                      {feature.title}
                    </h3>
                    <p className="text-slate-600 flex-grow">
                      {feature.description}
                    </p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section id="how-it-works" className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div {...fadeUp(0)} className="text-center mb-14">
            <h2 className="text-3xl sm:text-4xl font-bold">
              How HireIQ Works
            </h2>
            <p className="text-lg sm:text-xl text-slate-600 mt-3 max-w-2xl mx-auto">
              Get started in minutes and let our AI do the heavy lifting for
              your job search.
            </p>
          </motion.div>
          <div className="grid md:grid-cols-3 gap-6 lg:gap-8">
            {[
              {
                step: "1",
                title: "Create Your Profile",
                text: "Upload your resume and tell us about your skills, experience, and career preferences.",
                bg: "bg-blue-600",
              },
              {
                step: "2",
                title: "Get Matched",
                text: "Our AI analyzes thousands of jobs and presents you with personalized matches based on your profile.",
                bg: "bg-purple-600",
              },
              {
                step: "3",
                title: "Apply & Track",
                text: "Apply with one click and track your applications with real-time updates and analytics.",
                bg: "bg-emerald-600",
              },
            ].map((item, i) => (
              <motion.div
                key={i}
                {...fadeUp(0.1 + i * 0.1)}
                className="text-center rounded-2xl border border-slate-200 bg-white/70 backdrop-blur p-8 shadow-sm hover:shadow-md transition"
              >
                <div
                  className={`w-16 h-16 ${item.bg} text-white rounded-full grid place-items-center mx-auto mb-6 text-2xl font-bold`}
                >
                  {item.step}
                </div>
                <h3 className="text-xl font-semibold mb-3">{item.title}</h3>
                <p className="text-slate-600">{item.text}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 bg-gradient-to-b from-slate-900 to-slate-950 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div {...fadeUp(0)}>
              <h2 className="text-3xl sm:text-4xl font-bold">
                Why Choose HireIQ?
              </h2>
              <p className="text-lg text-slate-300 mt-4">
                Join thousands of professionals who have accelerated their
                careers with our intelligent job matching platform.
              </p>
              <div className="grid gap-4 mt-8">
                {benefits.map((b, i) => (
                  <motion.div
                    key={i}
                    {...fadeUp(0.05 + i * 0.05)}
                    className="flex items-center gap-3"
                  >
                    <CheckCircle className="w-5 h-5 text-emerald-400" />
                    <span className="text-slate-200">{b}</span>
                  </motion.div>
                ))}
              </div>
              <Button
                size="lg"
                onClick={() => navigate("/onboarding")}
                className="mt-8 bg-white text-slate-900 hover:bg-slate-100 transition shadow-md hover:shadow-lg"
              >
                Start Your Job Search
              </Button>
            </motion.div>
            <motion.div {...fadeUp(0.2)} className="relative">
              <div className="absolute -inset-1 rounded-3xl bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 blur opacity-25" />
              <div className="relative bg-white rounded-3xl p-8 shadow-2xl">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 bg-blue-600 rounded-full grid place-items-center">
                    <Search className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-slate-900">
                      Senior Frontend Developer
                    </h3>
                    <p className="text-slate-600">
                      TechCorp Inc. • San Francisco
                    </p>
                  </div>
                  <div className="ml-auto bg-emerald-100 text-emerald-800 px-2 py-1 rounded text-sm font-medium">
                    95% Match
                  </div>
                </div>
                <div className="space-y-3 mb-6">
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-600">Salary Range</span>
                    <span className="text-slate-900 font-medium">
                      $120k - $160k
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-600">Experience</span>
                    <span className="text-slate-900 font-medium">5+ years</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-600">Location</span>
                    <span className="text-slate-900 font-medium">
                      Remote OK
                    </span>
                  </div>
                </div>
                <div className="flex gap-2 mb-6">
                  {["React", "TypeScript", "Node.js"].map((s) => (
                    <span
                      key={s}
                      className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs"
                    >
                      {s}
                    </span>
                  ))}
                </div>
                <Button className="w-full">Apply Now</Button>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      <section className="py-20">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <motion.h2 {...fadeUp(0)} className="text-3xl sm:text-4xl font-bold">
            Ready to Find Your Dream Job?
          </motion.h2>
          <motion.p
            {...fadeUp(0.15)}
            className="text-lg sm:text-xl text-slate-600 mt-4"
          >
            Join thousands of professionals who trust HireIQ to accelerate
            their careers.
          </motion.p>
          <motion.div
            {...fadeUp(0.3)}
            className="mt-8 flex flex-col sm:flex-row gap-4 justify-center"
          >
            <Button
              size="lg"
              onClick={() => navigate("/onboarding")}
              className="text-lg px-8 py-6 h-auto bg-gradient-to-r from-blue-600 to-purple-600 hover:scale-[1.02] transition shadow-lg"
            >
              Get Started Free
              <ArrowRight className="ml-2 w-5 h-5" />
            </Button>
            <Button
              variant="outline"
              size="lg"
              onClick={() => navigate("/recruiter")}
              className="text-lg px-8 py-6 h-auto hover:scale-[1.02] transition"
            >
              <Users className="mr-2 w-5 h-5" />
              For Recruiters
            </Button>
          </motion.div>
        </div>
      </section>

      <footer className="bg-slate-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-8 h-8 bg-white rounded-full overflow-hidden">
                  <img
                    src="https://cdn.builder.io/api/v1/image/assets%2Fe8df578c0f38439a97d1f3a56a1f7872%2F90c72f447e7b4bf69123889c8f3cd6be?format=webp&width=800"
                    alt="HireIQ Logo"
                    className="w-full h-full object-contain p-1"
                  />
                </div>
                <span className="text-xl font-bold">HireIQ</span>
              </div>
              <p className="text-slate-400">
                Revolutionizing job search with AI-powered matching and
                intelligent automation.
              </p>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Product</h3>
              <ul className="space-y-2 text-slate-400">
                <li>
                  <a href="#features" className="hover:text-white transition">
                    Features
                  </a>
                </li>
                <li>
                  <a
                    href="#how-it-works"
                    className="hover:text-white transition"
                  >
                    How it Works
                  </a>
                </li>
                <li>
                  <a href="#pricing" className="hover:text-white transition">
                    Pricing
                  </a>
                </li>
                <li>
                  <a href="#api" className="hover:text-white transition">
                    API
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Company</h3>
              <ul className="space-y-2 text-slate-400">
                <li>
                  <a href="#about" className="hover:text-white transition">
                    About Us
                  </a>
                </li>
                <li>
                  <a href="#careers" className="hover:text-white transition">
                    Careers
                  </a>
                </li>
                <li>
                  <a href="#blog" className="hover:text-white transition">
                    Blog
                  </a>
                </li>
                <li>
                  <a href="#contact" className="hover:text-white transition">
                    Contact
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Support</h3>
              <ul className="space-y-2 text-slate-400">
                <li>
                  <a href="#help" className="hover:text-white transition">
                    Help Center
                  </a>
                </li>
                <li>
                  <a href="#privacy" className="hover:text-white transition">
                    Privacy Policy
                  </a>
                </li>
                <li>
                  <a href="#terms" className="hover:text-white transition">
                    Terms of Service
                  </a>
                </li>
                <li>
                  <a href="#security" className="hover:text-white transition">
                    Security
                  </a>
                </li>
              </ul>
            </div>
          </div>
          <div className="border-t border-slate-800 mt-12 pt-8 flex flex-col md:flex-row items-center justify-between">
            <p className="text-slate-400">
              © 2024 HireIQ. All rights reserved.
            </p>
            <div className="flex items-center gap-6 mt-4 md:mt-0">
              <a
                href="#twitter"
                className="text-slate-400 hover:text-white transition"
              >
                Twitter
              </a>
              <a
                href="#linkedin"
                className="text-slate-400 hover:text-white transition"
              >
                LinkedIn
              </a>
              <a
                href="#github"
                className="text-slate-400 hover:text-white transition"
              >
                GitHub
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
