import { useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { Badge } from './ui/badge';
import { ArrowRight, Play, Check, Users, Target, BarChart3, Zap, Database, Brain, TrendingUp, CheckCircle, Menu, X, Building, User, UserCheck, Award, Sparkles, ChevronDown } from 'lucide-react';
import { DualPerspectiveDemo } from './DualPerspectiveDemo';

interface LandingPageProps {
  onGetStarted: () => void;
  onLogin: () => void;
  onViewPitchDeck?: () => void;
  onViewAbout?: () => void;
  onViewBlog?: () => void;
  isAuthenticated?: boolean;
  onBackToApp?: () => void;
}

export function LandingPage({ onGetStarted, onLogin, onViewPitchDeck, onViewAbout, onViewBlog, isAuthenticated = false, onBackToApp }: Readonly<LandingPageProps>) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [showDemo, setShowDemo] = useState(false);

  const features = [
    {
      icon: Target,
      title: "Smart Queue System",
      description: "Job seekers get placed in AI-powered queues while recruiters access organized candidate pools.",
      highlight: "AI-Powered Matching",
      forBoth: true
    },
    {
      icon: BarChart3,
      title: "Real-Time Analytics",
      description: "Track your job search progress or monitor hiring pipeline performance with detailed insights.",
      highlight: "Data-Driven Decisions",
      forBoth: true
    },
    {
      icon: Users,
      title: "Dual Perspective Platform",
      description: "Seamlessly switch between job seeker and recruiter views on the same unified platform.",
      highlight: "Unique Approach",
      forBoth: true
    },
    {
      icon: TrendingUp,
      title: "Performance Tracking",
      description: "Job seekers see queue rankings while recruiters track hiring metrics and candidate engagement.",
      highlight: "Competitive Edge",
      forBoth: true
    },
    {
      icon: Database,
      title: "Advanced Organization",
      description: "Kanban boards for application tracking (job seekers) and candidate pipeline management (recruiters).",
      highlight: "Visual Organization",
      forBoth: true
    },
    {
      icon: Brain,
      title: "AI-Powered Recommendations",
      description: "Get career guidance and skill suggestions, or receive candidate matching and sourcing insights.",
      highlight: "Smart Guidance",
      forBoth: true
    }
  ];



  const stats = [
    { number: "89K+", label: "Job Seekers", icon: Users },
    { number: "15K+", label: "Companies", icon: Building },
    { number: "89%", label: "Success Rate", icon: TrendingUp },
    { number: "2.3x", label: "Faster Hiring", icon: Zap }
  ];

  const pricingPlans = [
    {
      name: "Free",
      price: "$0",
      period: "forever",
      description: "Perfect for getting started with job tracking",
      features: [
        "Basic job application tracking",
        "3 manual queue selections", 
        "Standard filtering and search",
        "Mobile app access",
        "Email notifications"
      ],
      buttonText: "Get Started Free",
      isPopular: false
    },
    {
      name: "Premium",
      price: "$29",
      period: "per month",
      description: "Advanced features for serious job seekers",
      features: [
        "Everything in Free",
        "5 total queues (3 manual + 2 AI-selected)",
        "Live Profile Upgrade Checker",
        "Queue Leaderboards & Analytics",
        "Career change recommendations",
        "Priority support",
        "Advanced filtering & insights"
      ],
      buttonText: "Start Premium Trial",
      isPopular: true
    },
    {
      name: "Enterprise",
      price: "Custom",
      period: "per month",
      description: "For teams and recruitment agencies",
      features: [
        "Everything in Premium",
        "Recruiter dashboard access",
        "Bulk candidate management",
        "Custom queue configurations", 
        "Advanced analytics & reporting",
        "Dedicated account manager",
        "API access"
      ],
      buttonText: "Contact Sales",
      isPopular: false
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-gray-800 to-slate-900 text-white overflow-hidden relative">
      {/* Ambient glow effects */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-1/4 w-[600px] h-[600px] bg-[#ff6b35]/10 rounded-full blur-3xl animate-pulse" style={{ animationDuration: '8s' }} />
        <div className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] bg-purple-500/8 rounded-full blur-3xl animate-pulse" style={{ animationDuration: '10s' }} />
        <div className="absolute top-1/2 left-1/2 w-[400px] h-[400px] bg-blue-500/5 rounded-full blur-3xl animate-pulse" style={{ animationDuration: '12s' }} />
      </div>
      
      {/* Fixed Navigation */}
      <motion.nav 
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        className="fixed top-0 left-0 right-0 z-50 bg-gray-900/80 backdrop-blur-xl border-b border-white/10"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <button 
              onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
              className="flex items-center gap-3 hover:opacity-80 transition-opacity"
            >
              <div className="w-8 h-8 bg-gradient-to-r from-[#ff6b35] to-[#ff8c42] rounded-lg flex items-center justify-center">
                <Target className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-medium">
                <span className="text-white">the</span>
                <span className="text-[#ff6b35]">Garage</span>
              </span>
            </button>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center gap-8">
              {onViewPitchDeck && (
                <button 
                  onClick={(e) => {
                    e.preventDefault();
                    onViewPitchDeck();
                  }}
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  Pitch Deck
                </button>
              )}
              {onViewBlog && (
                <button 
                  onClick={(e) => {
                    e.preventDefault();
                    onViewBlog();
                  }}
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  Blog
                </button>
              )}
              {onViewAbout && (
                <button 
                  onClick={(e) => {
                    e.preventDefault();
                    onViewAbout();
                  }}
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  About
                </button>
              )}
              
              <div className="flex items-center gap-3 ml-4">
                {isAuthenticated ? (
                  <Button 
                    onClick={onBackToApp}
                    className="bg-gradient-to-r from-[#ff6b35] to-[#ff8c42] hover:from-[#e55a2b] hover:to-[#d4461f] text-white"
                  >
                    <ArrowRight className="w-4 h-4 mr-2" />
                    Back to App
                  </Button>
                ) : (
                  <>
                    <Button variant="ghost" onClick={onLogin} className="text-gray-400 hover:text-white">
                      Sign In
                    </Button>
                    <Button 
                      onClick={onGetStarted}
                      className="bg-gradient-to-r from-[#ff6b35] to-[#ff8c42] hover:from-[#e55a2b] hover:to-[#d4461f] text-white"
                    >
                      Get Started Free
                    </Button>
                  </>
                )}
              </div>
            </div>

            {/* Mobile menu button */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden p-2 rounded-md text-gray-400 hover:text-white"
            >
              {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

          {/* Mobile Navigation */}
          {isMenuOpen && (
            <div className="md:hidden py-4 border-t border-white/10">
              <div className="flex flex-col gap-4">
                {onViewPitchDeck && (
                  <button 
                    onClick={(e) => {
                      e.preventDefault();
                      setIsMenuOpen(false);
                      onViewPitchDeck();
                    }}
                    className="text-gray-400 hover:text-white transition-colors text-left"
                  >
                    Pitch Deck
                  </button>
                )}
                {onViewBlog && (
                  <button 
                    onClick={(e) => {
                      e.preventDefault();
                      setIsMenuOpen(false);
                      onViewBlog();
                    }}
                    className="text-gray-400 hover:text-white transition-colors text-left"
                  >
                    Blog
                  </button>
                )}
                {onViewAbout && (
                  <button 
                    onClick={(e) => {
                      e.preventDefault();
                      setIsMenuOpen(false);
                      onViewAbout();
                    }}
                    className="text-gray-400 hover:text-white transition-colors text-left"
                  >
                    About
                  </button>
                )}
                <div className="flex flex-col gap-2 mt-4">
                  {isAuthenticated ? (
                    <Button 
                      onClick={onBackToApp}
                      className="bg-gradient-to-r from-[#ff6b35] to-[#ff8c42] hover:from-[#e55a2b] hover:to-[#d4461f] text-white justify-start"
                    >
                      <ArrowRight className="w-4 h-4 mr-2" />
                      Back to App
                    </Button>
                  ) : (
                    <>
                      <Button variant="ghost" onClick={onLogin} className="justify-start text-gray-400">
                        Sign In
                      </Button>
                      <Button 
                        onClick={onGetStarted}
                        className="bg-gradient-to-r from-[#ff6b35] to-[#ff8c42] hover:from-[#e55a2b] hover:to-[#d4461f] text-white justify-start"
                      >
                        Get Started Free
                      </Button>
                    </>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </motion.nav>

      {/* Hero Section - Diagonal Split */}
      <section className="relative min-h-screen flex items-center overflow-hidden pt-16">
        {/* Background Elements */}
        <div className="absolute inset-0">
          <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-br from-[#ff6b35]/20 to-transparent transform rotate-12 origin-top-right" />
          <div className="absolute bottom-0 left-0 w-1/2 h-1/2 bg-gradient-to-tr from-orange-500/10 to-transparent transform -rotate-12" />
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 w-full">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left Content */}
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
            >
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="inline-block mb-4"
              >
                <div className="px-4 py-2 bg-[#ff6b35]/10 border border-[#ff6b35]/30 rounded-full text-sm text-[#ff6b35]">
                  <Sparkles className="w-4 h-4 inline mr-2" />
                  For Job Seekers & Recruiters
                </div>
              </motion.div>

              <motion.h1 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="text-6xl md:text-8xl font-medium mb-6 leading-none text-white"
              >
                Connect
                <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#ff6b35] to-amber-500">
                  Talent
                </span>
              </motion.h1>

              <motion.p 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="text-xl text-gray-400 mb-8 max-w-lg leading-relaxed"
              >
                The dual-perspective platform that revolutionizes hiring with AI-powered queues and real-time insights.
              </motion.p>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="text-sm text-gray-500 italic mb-8"
              >
                "Life Should Be Easy"
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
                className="flex flex-col sm:flex-row gap-4"
              >
                <Button 
                  onClick={onGetStarted}
                  size="lg"
                  className="bg-gradient-to-r from-[#ff6b35] to-[#ff8c42] hover:from-[#e55a2b] hover:to-[#d4461f] text-white px-8 py-6 text-lg"
                >
                  Start Tracking Jobs Free
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
                <Button 
                  variant="outline"
                  size="lg"
                  onClick={() => setShowDemo(true)}
                  className="border-white/20 text-white hover:bg-white/10 hover:border-white/40 px-8 py-6 text-lg group"
                >
                  <Play className="w-5 h-5 mr-2" />
                  Watch Demo
                </Button>
              </motion.div>
            </motion.div>

            {/* Right Stats Grid */}
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="grid grid-cols-2 gap-6"
            >
              {stats.map((stat, index) => {
                const IconComponent = stat.icon;
                const gradients = [
                  'from-[#ff6b35] to-orange-500',
                  'from-orange-500 to-amber-500',
                  'from-amber-500 to-yellow-500',
                  'from-[#ff6b35] to-red-500'
                ];
                const gradient = gradients[index % gradients.length];
                
                return (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.5 + index * 0.1 }}
                    whileHover={{ scale: 1.05, rotate: 2 }}
                    className="bg-gradient-to-br from-white/5 to-white/0 border border-white/10 rounded-2xl p-6 backdrop-blur-sm group"
                  >
                    <div className={`w-12 h-12 bg-gradient-to-r ${gradient} rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                      <IconComponent className="w-6 h-6 text-white" />
                    </div>
                    <div className="text-4xl font-medium mb-2 text-white">{stat.number}</div>
                    <div className="text-sm text-gray-400">{stat.label}</div>
                  </motion.div>
                );
              })}
            </motion.div>
          </div>
        </div>

        {/* Scroll Indicator */}
        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ repeat: Infinity, duration: 2 }}
          className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
        >
          <ChevronDown className="w-6 h-6 text-gray-600" />
        </motion.div>
      </section>

      {/* Dual Perspective Demo Modal */}
      {showDemo && (
        <DualPerspectiveDemo
          onBack={() => setShowDemo(false)}
          onNavigate={() => {}}
          user={null}
          onLogout={() => {}}
        />
      )}

      {/* Features Section */}
      <section id="features" className="relative py-32 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-black via-gray-900 to-black">
        {/* Floating animated elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <motion.div
            animate={{
              y: [0, -30, 0],
              rotate: [0, 10, 0],
            }}
            transition={{
              duration: 6,
              repeat: Infinity,
              ease: "easeInOut"
            }}
            className="absolute top-20 right-20 w-20 h-20 bg-gradient-to-br from-[#ff6b35]/20 to-amber-500/20 rounded-2xl backdrop-blur-sm border border-white/10"
          />
          <motion.div
            animate={{
              y: [0, 40, 0],
              rotate: [0, -15, 0],
            }}
            transition={{
              duration: 8,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 1
            }}
            className="absolute bottom-40 left-20 w-32 h-32 bg-gradient-to-br from-blue-500/20 to-[#ff6b35]/20 rounded-full backdrop-blur-sm border border-white/10"
          />
        </div>

        <div className="max-w-7xl mx-auto relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-20"
          >
            <h2 className="text-5xl md:text-6xl font-medium mb-6 leading-tight text-white">
              Everything You
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-[#ff6b35] to-amber-500">
                Need to Win
              </span>
            </h2>
            <p className="text-xl text-gray-400 max-w-2xl mx-auto">
              Combining intelligent automation with detailed tracking for competitive edge
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => {
              const IconComponent = feature.icon;
              const gradients = [
                'from-[#ff6b35] to-orange-500',
                'from-orange-500 to-amber-500',
                'from-amber-500 to-yellow-500',
                'from-[#ff6b35] to-red-500',
                'from-yellow-500 to-orange-500'
              ];
              const gradient = gradients[index % gradients.length];
              
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 50 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  whileHover={{ y: -10 }}
                  className="group"
                >
                  <Card className="bg-gradient-to-br from-white/5 to-white/0 border border-white/10 p-8 hover:border-[#ff6b35]/50 transition-all duration-300 backdrop-blur-sm h-full">
                    <div className={`w-14 h-14 bg-gradient-to-r ${gradient} rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform`}>
                      <IconComponent className="w-7 h-7 text-white" />
                    </div>
                    
                    <h3 className="text-2xl font-medium mb-3 text-white">{feature.title}</h3>
                    <p className="text-gray-400 mb-6 leading-relaxed">{feature.description}</p>
                    
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-[#ff6b35] rounded-full"></div>
                      <span className="text-sm font-medium text-[#ff6b35]">{feature.highlight}</span>
                    </div>
                  </Card>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Dual-Perspective Platform Showcase */}
      <section className="relative py-32 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-20"
          >
            <h2 className="text-5xl md:text-6xl font-medium mb-6">
              Dual-Perspective
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-[#ff6b35] to-amber-500">
                Platform
              </span>
            </h2>
            <p className="text-xl text-gray-400 max-w-2xl mx-auto">
              Experience hiring from both angles - discover opportunities and understand the complete picture
            </p>
          </motion.div>

          <div className="grid lg:grid-cols-2 gap-12 mb-12">
            {/* Job Seeker Perspective */}
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              whileHover={{ scale: 1.02 }}
            >
              <Card className="p-8 bg-gradient-to-br from-blue-500/10 to-blue-600/5 border border-blue-500/20 hover:border-blue-500/40 transition-all duration-300 backdrop-blur-sm h-full">
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl flex items-center justify-center">
                    <Users className="w-8 h-8 text-white" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-medium">Job Seeker View</h3>
                    <p className="text-blue-400">Your perspective</p>
                  </div>
                </div>
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <CheckCircle className="w-5 h-5 text-green-400" />
                    <span className="text-gray-300">Join professional queues by expertise</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <CheckCircle className="w-5 h-5 text-green-400" />
                    <span className="text-gray-300">Get discovered by relevant recruiters</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <CheckCircle className="w-5 h-5 text-green-400" />
                    <span className="text-gray-300">Track applications with real-time updates</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <CheckCircle className="w-5 h-5 text-green-400" />
                    <span className="text-gray-300">Receive personalized job recommendations</span>
                  </div>
                </div>
                <div className="mt-6 p-4 bg-white/5 rounded-lg border border-white/10">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-400">Active job seekers</span>
                    <span className="text-2xl font-medium text-blue-400">89K+</span>
                  </div>
                </div>
              </Card>
            </motion.div>

            {/* Recruiter Perspective */}
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              whileHover={{ scale: 1.02 }}
            >
              <Card className="p-8 bg-gradient-to-br from-[#ff6b35]/10 to-[#ff8c42]/5 border border-[#ff6b35]/20 hover:border-[#ff6b35]/40 transition-all duration-300 backdrop-blur-sm h-full">
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-16 h-16 bg-gradient-to-r from-[#ff6b35] to-[#ff8c42] rounded-xl flex items-center justify-center">
                    <UserCheck className="w-8 h-8 text-white" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-medium">Recruiter View</h3>
                    <p className="text-[#ff6b35]">Understanding their experience</p>
                  </div>
                </div>
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <Target className="w-5 h-5 text-[#ff6b35]" />
                    <span className="text-gray-300">Access pre-qualified candidate queues</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Target className="w-5 h-5 text-[#ff6b35]" />
                    <span className="text-gray-300">AI-powered candidate matching & ranking</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Target className="w-5 h-5 text-[#ff6b35]" />
                    <span className="text-gray-300">Direct candidate communication & scheduling</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Target className="w-5 h-5 text-[#ff6b35]" />
                    <span className="text-gray-300">Comprehensive hiring analytics & insights</span>
                  </div>
                </div>
                <div className="mt-6 p-4 bg-white/5 rounded-lg border border-white/10">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-400">Active recruiters</span>
                    <span className="text-2xl font-medium text-[#ff6b35]">15K+</span>
                  </div>
                </div>
              </Card>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Interactive Success Journey */}
      <section id="journey" className="relative py-32 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-black via-gray-900 to-black overflow-hidden">
        {/* Animated background */}
        <div className="absolute inset-0 opacity-30">
          <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-blue-500/20 rounded-full blur-3xl animate-pulse" />
          <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-purple-500/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
        </div>

        <div className="max-w-7xl mx-auto relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-20"
          >
            <h2 className="text-5xl md:text-6xl font-medium mb-6 text-white">
              Your Journey to
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-[#ff6b35] to-purple-500">
                Success Starts Here
              </span>
            </h2>
            <p className="text-xl text-gray-400 max-w-2xl mx-auto">
              Watch how theGarage transforms your job search from overwhelming to effortless
            </p>
          </motion.div>

          {/* Interactive Journey Steps */}
          <div className="grid md:grid-cols-4 gap-6 relative">
            {/* Connection Line */}
            <div className="hidden md:block absolute top-24 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-[#ff6b35]/50 to-transparent" />

            {[
              {
                step: '01',
                title: 'Sign Up',
                description: 'Create your profile in 2 minutes',
                icon: User,
                color: 'from-blue-500 to-blue-600',
                delay: 0
              },
              {
                step: '02',
                title: 'Get Matched',
                description: 'AI finds your perfect queues',
                icon: Brain,
                color: 'from-purple-500 to-purple-600',
                delay: 0.2
              },
              {
                step: '03',
                title: 'Track Progress',
                description: 'Monitor real-time rankings',
                icon: TrendingUp,
                color: 'from-[#ff6b35] to-[#ff8c42]',
                delay: 0.4
              },
              {
                step: '04',
                title: 'Land Offers',
                description: '2.3x faster placement',
                icon: Award,
                color: 'from-green-500 to-green-600',
                delay: 0.6
              }
            ].map((item, index) => {
              const IconComponent = item.icon;
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 50 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: item.delay }}
                  whileHover={{ y: -10, scale: 1.05 }}
                  className="relative"
                >
                  {/* Step Number Badge */}
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 w-12 h-12 bg-gradient-to-br from-white/10 to-white/5 border border-white/20 rounded-full flex items-center justify-center backdrop-blur-sm z-10">
                    <span className="text-sm font-medium text-[#ff6b35]">{item.step}</span>
                  </div>

                  <Card className="p-8 bg-gradient-to-br from-white/5 to-white/0 border border-white/10 hover:border-[#ff6b35]/50 transition-all duration-300 backdrop-blur-sm h-full mt-8">
                    <div className={`w-16 h-16 bg-gradient-to-r ${item.color} rounded-xl flex items-center justify-center mb-6 mx-auto`}>
                      <IconComponent className="w-8 h-8 text-white" />
                    </div>
                    
                    <h3 className="text-2xl font-medium mb-3 text-center text-white">{item.title}</h3>
                    <p className="text-gray-400 text-center leading-relaxed">{item.description}</p>
                  </Card>
                </motion.div>
              );
            })}
          </div>


        </div>
      </section>

      {/* Before vs After Comparison */}
      <section className="relative py-32 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-20"
          >
            <h2 className="text-5xl md:text-6xl font-medium mb-6 text-white">
              Job Search
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-[#ff6b35] to-amber-500">
                Transformed
              </span>
            </h2>
            <p className="text-xl text-gray-400 max-w-2xl mx-auto">
              See the difference theGarage makes in your hiring journey
            </p>
          </motion.div>

          <div className="grid lg:grid-cols-2 gap-8">
            {/* Before - Traditional Approach */}
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <Card className="p-8 bg-gradient-to-br from-red-500/5 to-red-600/5 border border-red-500/20 backdrop-blur-sm h-full">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-12 h-12 bg-red-500/20 rounded-full flex items-center justify-center">
                    <X className="w-6 h-6 text-red-400" />
                  </div>
                  <h3 className="text-2xl font-medium text-red-400">Traditional Job Search</h3>
                </div>
                
                <div className="space-y-4">
                  {[
                    'Scattered applications across multiple platforms',
                    'No visibility into application status',
                    'Manual tracking in spreadsheets',
                    'Guessing what skills to improve',
                    'Missing networking opportunities',
                    'Overwhelming and time-consuming'
                  ].map((item, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, x: -20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: index * 0.1 }}
                      className="flex items-start gap-3 text-gray-400"
                    >
                      <X className="w-5 h-5 text-red-400 mt-0.5 flex-shrink-0" />
                      <span>{item}</span>
                    </motion.div>
                  ))}
                </div>
              </Card>
            </motion.div>

            {/* After - With theGarage */}
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <Card className="p-8 bg-gradient-to-br from-[#ff6b35]/10 to-green-500/10 border border-[#ff6b35]/30 backdrop-blur-sm h-full relative overflow-hidden">
                {/* Glow effect */}
                <div className="absolute inset-0 bg-gradient-to-r from-[#ff6b35]/5 to-green-500/5 blur-2xl" />
                
                <div className="relative z-10">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-12 h-12 bg-gradient-to-r from-[#ff6b35] to-green-500 rounded-full flex items-center justify-center">
                      <CheckCircle className="w-6 h-6 text-white" />
                    </div>
                    <h3 className="text-2xl font-medium text-transparent bg-clip-text bg-gradient-to-r from-[#ff6b35] to-green-500">With theGarage</h3>
                  </div>
                  
                  <div className="space-y-4">
                    {[
                      'Centralized job tracking dashboard',
                      'Real-time application status updates',
                      'AI-powered queue rankings',
                      'Personalized skill upgrade recommendations',
                      'Direct recruiter connections',
                      'Streamlined and efficient workflow'
                    ].map((item, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, x: 20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: index * 0.1 }}
                        className="flex items-start gap-3 text-gray-300"
                      >
                        <CheckCircle className="w-5 h-5 text-green-400 mt-0.5 flex-shrink-0" />
                        <span>{item}</span>
                      </motion.div>
                    ))}
                  </div>
                </div>
              </Card>
            </motion.div>
          </div>

          {/* Impact Stats */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mt-16 grid grid-cols-3 gap-6"
          >
            {[
              { value: '2.3x', label: 'Faster Hiring', change: '+130%' },
              { value: '89%', label: 'Success Rate', change: '+45%' },
              { value: '16 Days', label: 'Time to Hire', change: '-62%' }
            ].map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.6 + index * 0.1 }}
                whileHover={{ scale: 1.05 }}
              >
                <Card className="p-6 bg-gradient-to-br from-white/5 to-white/0 border border-white/10 backdrop-blur-sm text-center">
                  <div className="text-4xl font-medium mb-2 text-transparent bg-clip-text bg-gradient-to-r from-[#ff6b35] to-purple-500">{stat.value}</div>
                  <div className="text-gray-400 mb-2">{stat.label}</div>
                  <Badge className="bg-green-500/20 text-green-400 border border-green-500/30">
                    {stat.change}
                  </Badge>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="relative py-32 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-black via-gray-900 to-black overflow-hidden">
        {/* Background decoration */}
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-20 right-10 w-96 h-96 bg-gradient-to-br from-[#ff6b35]/30 to-purple-500/30 rounded-full blur-3xl" />
          <div className="absolute bottom-20 left-10 w-96 h-96 bg-gradient-to-br from-blue-500/30 to-[#ff6b35]/30 rounded-full blur-3xl" />
        </div>

        <div className="max-w-7xl mx-auto relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-20"
          >
            <h2 className="text-5xl md:text-6xl font-medium mb-6 leading-tight text-white">
              Simple,
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-[#ff6b35] to-purple-500">
                Transparent Pricing
              </span>
            </h2>
            <p className="text-xl text-gray-400 max-w-2xl mx-auto">
              Start free and upgrade when you're ready. No hidden fees, cancel anytime.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {pricingPlans.map((plan, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ y: -10 }}
              >
                <Card className={`p-8 relative bg-gradient-to-br from-white/5 to-white/0 border backdrop-blur-sm h-full ${
                  plan.isPopular ? 'border-[#ff6b35] shadow-xl shadow-[#ff6b35]/20' : 'border-white/10'
                }`}>
                  {plan.isPopular && (
                    <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                      <Badge className="bg-gradient-to-r from-[#ff6b35] to-[#ff8c42] text-white px-4 py-1">Most Popular</Badge>
                    </div>
                  )}
                  
                  <div className="text-center mb-8">
                    <h3 className="text-2xl font-medium mb-2 text-white">{plan.name}</h3>
                    <div className="flex items-baseline justify-center gap-2 mb-2">
                      <span className="text-5xl font-medium text-white">{plan.price}</span>
                      <span className="text-gray-400">/{plan.period}</span>
                    </div>
                    <p className="text-gray-400">{plan.description}</p>
                  </div>

                  <ul className="space-y-4 mb-8">
                    {plan.features.map((feature, featureIndex) => (
                      <li key={featureIndex} className="flex items-start gap-3">
                        <Check className="w-5 h-5 text-green-400 mt-0.5 flex-shrink-0" />
                        <span className="text-gray-300">{feature}</span>
                      </li>
                    ))}
                  </ul>

                  <Button 
                    onClick={onGetStarted}
                    className={`w-full ${plan.isPopular 
                      ? 'bg-gradient-to-r from-[#ff6b35] to-[#ff8c42] hover:from-[#e55a2b] hover:to-[#d4461f] text-white' 
                      : 'border border-white/20 text-white hover:bg-white/10'
                    }`}
                    variant={plan.isPopular ? 'default' : 'outline'}
                  >
                    {plan.buttonText}
                  </Button>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA Section */}
      <section className="relative py-32 px-4 sm:px-6 lg:px-8 overflow-hidden">
        {/* Animated Background */}
        <div className="absolute inset-0">
          <motion.div 
            animate={{ 
              scale: [1, 1.2, 1],
              rotate: [0, 90, 0]
            }}
            transition={{ 
              repeat: Infinity, 
              duration: 20,
              ease: "linear"
            }}
            className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-r from-[#ff6b35]/20 to-amber-500/20 rounded-full blur-3xl"
          />
        </div>

        <div className="max-w-4xl mx-auto text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-5xl md:text-7xl font-medium mb-8 leading-tight text-white">
              Ready to Transform
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-[#ff6b35] to-amber-500">
                Your Career?
              </span>
            </h2>

            <p className="text-xl text-gray-400 mb-12 max-w-2xl mx-auto leading-relaxed">
              Join thousands of professionals experiencing the future of recruitment
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
              <Button 
                onClick={onGetStarted}
                size="lg"
                className="bg-gradient-to-r from-[#ff6b35] to-[#ff8c42] hover:from-[#e55a2b] hover:to-[#d4461f] text-white px-12 py-6 text-lg"
              >
                Start Your Journey
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
              <Button 
                onClick={onLogin}
                variant="outline"
                size="lg"
                className="border-white/20 text-white hover:bg-white/10 hover:border-white/40 px-12 py-6 text-lg"
              >
                Sign In
              </Button>
            </div>

            <p className="text-sm text-gray-500 italic">
              "Life Should Be Easy"
            </p>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/10 py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-gradient-to-r from-[#ff6b35] to-[#ff8c42] rounded-lg flex items-center justify-center">
                <Target className="w-5 h-5 text-white" />
              </div>
              <span className="text-lg font-medium">
                <span className="text-white">the</span>
                <span className="text-[#ff6b35]">Garage</span>
              </span>
            </div>

            <div className="text-sm text-gray-500">
              © 2025 theGarage. All rights reserved.
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
