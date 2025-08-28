// frontend/src/pages/HomePage.tsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Sparkles,
  Brain,
  Rocket,
  Target,
  Code,
  Cloud,
  Award,
  ChevronRight,
  Zap,
  BookOpen,
  Users,
  TrendingUp,
  Shield,
  Globe,
  Coffee,
  ArrowRight
} from 'lucide-react';
import axios from 'axios';
import toast from 'react-hot-toast';

const HomePage: React.FC = () => {
  const navigate = useNavigate();
  const [prompt, setPrompt] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [selectedLevel, setSelectedLevel] = useState('intermediate');
  const [timeCommitment, setTimeCommitment] = useState('2 hours per day');

  const certifications = [
    { 
      name: 'Azure AI Engineer', 
      icon: Brain, 
      color: 'from-blue-500 to-indigo-600',
      description: 'Master AI and ML on Azure'
    },
    { 
      name: 'Azure Solutions Architect', 
      icon: Cloud, 
      color: 'from-purple-500 to-pink-600',
      description: 'Design enterprise cloud solutions'
    },
    { 
      name: 'AWS Solutions Architect', 
      icon: Globe, 
      color: 'from-orange-500 to-red-600',
      description: 'Build on AWS infrastructure'
    },
    { 
      name: 'Google Cloud Professional', 
      icon: Shield, 
      color: 'from-green-500 to-teal-600',
      description: 'Expert in Google Cloud Platform'
    },
  ];

  const features = [
    {
      icon: Sparkles,
      title: 'AI-Powered Personalization',
      description: 'Get custom learning paths tailored to your goals and pace'
    },
    {
      icon: Code,
      title: 'Hands-on Labs',
      description: 'Practice with real cloud environments and sandbox resources'
    },
    {
      icon: TrendingUp,
      title: 'Progress Tracking',
      description: 'Monitor your advancement with detailed analytics'
    },
    {
      icon: Award,
      title: 'Earn Badges',
      description: 'Showcase your achievements and milestones'
    },
    {
      icon: Users,
      title: 'Community Support',
      description: 'Learn alongside peers and industry experts'
    },
    {
      icon: Coffee,
      title: 'Flexible Learning',
      description: 'Study at your own pace, anywhere, anytime'
    }
  ];

  const handleGeneratePath = async () => {
    if (!prompt.trim()) {
      toast.error('Please describe your learning goal');
      return;
    }

    setIsGenerating(true);
    try {
      const response = await axios.post('/api/v1/learning-path/generate', {
        prompt,
        user_level: selectedLevel,
        time_commitment: timeCommitment,
        preferences: {
          learning_style: 'hands-on',
          include_labs: true,
          include_quizzes: true
        }
      });

      toast.success('Learning path generated successfully!');
      // Store the generated path and navigate to dashboard
      localStorage.setItem('currentLearningPath', JSON.stringify(response.data));
      navigate('/dashboard');
    } catch (error) {
      // For demo, use mock data
      toast.success('Loading sample learning path...');
      setTimeout(() => {
        navigate('/dashboard');
      }, 1000);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleQuickStart = (certification: string) => {
    setPrompt(`I want to prepare for ${certification} certification`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-indigo-900">
      {/* Animated background */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse" />
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-indigo-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse animation-delay-200" />
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-pink-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse animation-delay-400" />
      </div>

      {/* Content */}
      <div className="relative z-10">
        {/* Header */}
        <header className="container mx-auto px-6 py-6">
          <nav className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Brain className="w-8 h-8 text-white" />
              <span className="text-2xl font-bold text-white">AI Learning Platform</span>
            </div>
            <button
              onClick={() => navigate('/dashboard')}
              className="px-6 py-2 bg-white/10 backdrop-blur text-white rounded-lg hover:bg-white/20 transition-all"
            >
              Dashboard
            </button>
          </nav>
        </header>

        {/* Hero Section */}
        <section className="container mx-auto px-6 py-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center max-w-4xl mx-auto"
          >
            <h1 className="text-6xl font-bold text-white mb-6 leading-tight">
              Master Cloud Certifications with{' '}
              <span className="text-gradient bg-gradient-to-r from-yellow-400 to-pink-500 bg-clip-text text-transparent">
                AI-Powered Learning
              </span>
            </h1>
            <p className="text-xl text-gray-200 mb-12">
              Get personalized learning paths, hands-on labs, and real-time progress tracking.
              Your journey to cloud expertise starts here.
            </p>

            {/* Input Section */}
            <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 shadow-2xl">
              <div className="space-y-6">
                <div>
                  <label className="block text-left text-white mb-2 font-medium">
                    What would you like to learn?
                  </label>
                  <textarea
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                    placeholder="e.g., I want to prepare for Azure AI Engineer certification in 3 months"
                    className="w-full px-4 py-3 bg-white/10 backdrop-blur text-white placeholder-gray-400 rounded-lg border border-white/20 focus:border-white/40 focus:outline-none transition-all"
                    rows={3}
                  />
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-left text-white mb-2 font-medium">
                      Your Level
                    </label>
                    <select
                      value={selectedLevel}
                      onChange={(e) => setSelectedLevel(e.target.value)}
                      className="w-full px-4 py-3 bg-white/10 backdrop-blur text-white rounded-lg border border-white/20 focus:border-white/40 focus:outline-none transition-all"
                    >
                      <option value="beginner">Beginner</option>
                      <option value="intermediate">Intermediate</option>
                      <option value="advanced">Advanced</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-left text-white mb-2 font-medium">
                      Time Commitment
                    </label>
                    <select
                      value={timeCommitment}
                      onChange={(e) => setTimeCommitment(e.target.value)}
                      className="w-full px-4 py-3 bg-white/10 backdrop-blur text-white rounded-lg border border-white/20 focus:border-white/40 focus:outline-none transition-all"
                    >
                      <option value="1 hour per day">1 hour per day</option>
                      <option value="2 hours per day">2 hours per day</option>
                      <option value="3 hours per day">3 hours per day</option>
                      <option value="weekends only">Weekends only</option>
                    </select>
                  </div>
                </div>

                <button
                  onClick={handleGeneratePath}
                  disabled={isGenerating}
                  className="w-full py-4 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-semibold rounded-lg hover:from-indigo-700 hover:to-purple-700 transition-all transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {isGenerating ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white" />
                      Generating Your Path...
                    </>
                  ) : (
                    <>
                      <Rocket className="w-5 h-5" />
                      Generate My Learning Path
                    </>
                  )}
                </button>
              </div>
            </div>
          </motion.div>
        </section>

        {/* Quick Start Certifications */}
        <section className="container mx-auto px-6 py-12">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.8 }}
          >
            <h2 className="text-3xl font-bold text-white text-center mb-8">
              Popular Certification Paths
            </h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {certifications.map((cert, index) => (
                <motion.div
                  key={cert.name}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 * index }}
                  onClick={() => handleQuickStart(cert.name)}
                  className="cursor-pointer group"
                >
                  <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 hover:bg-white/20 transition-all transform hover:scale-105">
                    <div className={`w-12 h-12 rounded-lg bg-gradient-to-r ${cert.color} flex items-center justify-center mb-4`}>
                      <cert.icon className="w-6 h-6 text-white" />
                    </div>
                    <h3 className="text-lg font-semibold text-white mb-2">{cert.name}</h3>
                    <p className="text-gray-300 text-sm mb-4">{cert.description}</p>
                    <div className="flex items-center text-indigo-400 group-hover:text-indigo-300">
                      <span className="text-sm">Quick Start</span>
                      <ChevronRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </section>

        {/* Features Section */}
        <section className="container mx-auto px-6 py-20">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5, duration: 0.8 }}
          >
            <h2 className="text-3xl font-bold text-white text-center mb-12">
              Why Choose Our Platform?
            </h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {features.map((feature, index) => (
                <motion.div
                  key={feature.title}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.1 * index }}
                  className="bg-white/5 backdrop-blur-lg rounded-xl p-6 hover:bg-white/10 transition-all"
                >
                  <feature.icon className="w-10 h-10 text-indigo-400 mb-4" />
                  <h3 className="text-xl font-semibold text-white mb-2">{feature.title}</h3>
                  <p className="text-gray-300">{feature.description}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </section>

        {/* CTA Section */}
        <section className="container mx-auto px-6 py-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7, duration: 0.8 }}
            className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-3xl p-12 text-center shadow-2xl"
          >
            <h2 className="text-4xl font-bold text-white mb-4">
              Ready to Start Your Journey?
            </h2>
            <p className="text-xl text-white/90 mb-8">
              Join thousands of learners achieving their cloud certification goals
            </p>
            <button
              onClick={() => navigate('/dashboard')}
              className="px-8 py-4 bg-white text-indigo-600 font-semibold rounded-lg hover:bg-gray-100 transition-all transform hover:scale-105 inline-flex items-center gap-2"
            >
              Get Started Now
              <ArrowRight className="w-5 h-5" />
            </button>
          </motion.div>
        </section>

        {/* Footer */}
        <footer className="container mx-auto px-6 py-8 border-t border-white/10">
          <div className="text-center text-gray-400">
            <p>© 2024 AI Learning Platform. Empowering cloud professionals worldwide.</p>
          </div>
        </footer>
      </div>
    </div>
  );
};

export default HomePage;