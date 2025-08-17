import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Brain, 
  ArrowLeft, 
  Calendar, 
  Clock, 
  TrendingUp,
  Code,
  Zap,
  Shield,
  Smartphone,
  Cloud
} from "lucide-react";

export default function TechNews() {
  const navigate = useNavigate();

  const newsArticles = [
    {
      id: 1,
      title: "AI and Machine Learning Dominate 2024 Job Market",
      summary: "Companies are rapidly adopting AI technologies, creating unprecedented demand for ML engineers, data scientists, and AI specialists.",
      category: "Artificial Intelligence",
      date: "2024-01-15",
      readTime: "5 min read",
      icon: Brain,
      trending: true,
      tags: ["AI", "Machine Learning", "Data Science"]
    },
    {
      id: 2,
      title: "React 19 and Next.js 15: What Developers Need to Know",
      summary: "The latest updates bring server components, improved performance, and new developer experience features that are reshaping frontend development.",
      category: "Frontend Development",
      date: "2024-01-12",
      readTime: "7 min read",
      icon: Code,
      trending: true,
      tags: ["React", "Next.js", "Frontend"]
    },
    {
      id: 3,
      title: "Cloud-Native Development Skills in High Demand",
      summary: "Kubernetes, Docker, and serverless technologies are becoming essential skills as companies migrate to cloud-first architectures.",
      category: "Cloud Computing",
      date: "2024-01-10",
      readTime: "6 min read",
      icon: Cloud,
      trending: false,
      tags: ["Kubernetes", "Docker", "AWS", "Serverless"]
    },
    {
      id: 4,
      title: "Cybersecurity Professionals: The Most Sought-After Tech Talent",
      summary: "With increasing cyber threats, companies are investing heavily in security, creating massive opportunities for cybersecurity experts.",
      category: "Cybersecurity",
      date: "2024-01-08",
      readTime: "8 min read",
      icon: Shield,
      trending: false,
      tags: ["Security", "Ethical Hacking", "DevSecOps"]
    },
    {
      id: 5,
      title: "Mobile Development Trends: Flutter vs React Native in 2024",
      summary: "Cross-platform mobile development continues to evolve with new frameworks and improved performance optimizations.",
      category: "Mobile Development",
      date: "2024-01-05",
      readTime: "6 min read",
      icon: Smartphone,
      trending: false,
      tags: ["Flutter", "React Native", "Mobile"]
    },
    {
      id: 6,
      title: "The Rise of Edge Computing and IoT Integration",
      summary: "Edge computing is revolutionizing how we process data, creating new opportunities for developers skilled in IoT and real-time systems.",
      category: "Edge Computing",
      date: "2024-01-03",
      readTime: "7 min read",
      icon: Zap,
      trending: false,
      tags: ["Edge Computing", "IoT", "Real-time Systems"]
    }
  ];

  const techStacks = [
    {
      name: "Full Stack JavaScript",
      description: "React, Node.js, TypeScript, MongoDB",
      demand: "Very High",
      growth: "+25%",
      color: "bg-yellow-100 text-yellow-800"
    },
    {
      name: "AI/ML Stack",
      description: "Python, TensorFlow, PyTorch, Jupyter",
      demand: "Extremely High",
      growth: "+40%",
      color: "bg-green-100 text-green-800"
    },
    {
      name: "Cloud Native",
      description: "Docker, Kubernetes, AWS, Terraform",
      demand: "High",
      growth: "+30%",
      color: "bg-blue-100 text-blue-800"
    },
    {
      name: "DevOps",
      description: "Jenkins, GitLab CI, Ansible, Prometheus",
      demand: "High",
      growth: "+22%",
      color: "bg-purple-100 text-purple-800"
    }
  ];

  return (
    <div className="min-h-screen bg-slate-50">
      <header className="bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-6">
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
                <span className="text-xl font-bold text-foreground">HireIQ</span>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-slate-900 mb-4">
            Latest Tech Trends & Industry News
          </h1>
          <p className="text-xl text-slate-600 max-w-3xl mx-auto">
            Stay updated with the latest technology trends, industry insights, and in-demand skills 
            that are shaping the future of tech careers.
          </p>
        </div>

        <section className="mb-16">
          <h2 className="text-2xl font-bold text-slate-900 mb-8 flex items-center gap-2">
            <TrendingUp className="w-6 h-6 text-green-600" />
            Trending Tech Stacks
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {techStacks.map((stack, index) => (
              <Card key={index} className="hover:-translate-y-1 hover:shadow-xl transition-all h-full flex flex-col">
                <CardContent className="p-6 flex flex-col flex-1">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-semibold text-slate-900">{stack.name}</h3>
                    <Badge className={stack.color}>{stack.growth}</Badge>
                  </div>
                  <p className="text-sm text-slate-600 mb-3 flex-1">{stack.description}</p>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-slate-500">Demand:</span>
                    <span className="text-xs font-medium text-slate-900">{stack.demand}</span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-slate-900 mb-8">Latest Industry News</h2>
          <div className="grid md:grid-cols-2 gap-6">
            {newsArticles.map((article) => (
              <Card key={article.id} className="hover:-translate-y-1 hover:shadow-xl transition-all h-full flex flex-col">
                <CardContent className="p-6 flex flex-col flex-1">
                  <div className="flex items-start gap-4 flex-1">
                    <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                      <article.icon className="w-6 h-6 text-blue-600" />
                    </div>
                    <div className="flex-1 flex flex-col">
                      <div className="flex items-center gap-3 mb-2">
                        <Badge variant="secondary">{article.category}</Badge>
                        {article.trending && (
                          <Badge className="bg-red-100 text-red-800 flex items-center gap-1">
                            <TrendingUp className="w-3 h-3" />
                            Trending
                          </Badge>
                        )}
                      </div>
                      <h3 className="text-xl font-semibold text-slate-900 mb-2 hover:text-blue-600 transition-colors">
                        {article.title}
                      </h3>
                      <p className="text-slate-600 mb-4 leading-relaxed flex-1">
                        {article.summary}
                      </p>
                      <div className="flex items-center gap-4 text-sm text-slate-500">
                        <div className="flex items-center gap-1">
                          <Calendar className="w-4 h-4" />
                          {new Date(article.date).toLocaleDateString()}
                        </div>
                        <div className="flex items-center gap-1">
                          <Clock className="w-4 h-4" />
                          {article.readTime}
                        </div>
                      </div>
                      <div className="flex flex-wrap gap-2 mt-4">
                        {article.tags.map((tag) => (
                          <Badge key={tag} variant="outline" className="text-xs">
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        <section className="mt-16 text-center">
          <Card className="bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:shadow-2xl hover:scale-[1.02] transition-transform">
            <CardContent className="p-12">
              <h2 className="text-3xl font-bold mb-4">Ready to Level Up Your Tech Career?</h2>
              <p className="text-xl mb-8 opacity-90">
                Stay ahead of the curve with HireIQ's intelligent job matching for the latest tech roles.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button 
                  size="lg" 
                  onClick={() => navigate("/onboarding")}
                  className="bg-white text-slate-900 hover:bg-slate-100"
                >
                  Start Job Search
                </Button>
                <Button 
                  variant="outline" 
                  size="lg" 
                  onClick={() => navigate("/login")}
                  className="border-white text-white hover:bg-white hover:text-slate-900"
                >
                  Sign In
                </Button>
              </div>
            </CardContent>
          </Card>
        </section>
      </div>
    </div>
  );
}
