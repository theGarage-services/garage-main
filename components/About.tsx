import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { 
  ArrowRight, 
  Target, 
  Zap, 
  Users, 
  Sparkles,
  TrendingUp,
  Brain,
  Heart,
  Award,
  ChevronDown,
  X,
  Menu,
  Linkedin
} from 'lucide-react';

interface AboutProps {
  onGetStarted: () => void;
  onLogin: () => void;
  onNavigateToLanding: () => void;
  onClose?: () => void;
  onViewBlog?: () => void;
  isAuthenticated?: boolean;
  onBackToApp?: () => void;
}

export function About({ onGetStarted, onNavigateToLanding, isAuthenticated, onBackToApp }: Readonly<AboutProps>) {
  const [scrollY, setScrollY] = useState(0);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const team = [
    {
      name: "Ray Asuma",
      role: "CEO & Co-Founder",
      image: "/Ray.JPEG",
      bio: "Visionary leader driving theGarage's mission to revolutionize recruitment.",
      expertise: ["Leadership", "Compliance", "Law"],
      linkedin: "https://www.linkedin.com/in/rayasuma/"
    },
    {
      name: "Declan Kintu",
      role: "CTO & Co-Founder",
      image: "/Declan.JPEG",
      bio: "Engineering excellence powering our platform's cutting-edge technology.",
      expertise: ["System Architecture", "AI", "Scale"],
      linkedin: "https://www.linkedin.com/in/declan-trevor-kintu/"
    },
    {
      name: "Michelle Cheng",
      role: "AI Lead & Co-Founder",
      image: "/Michelle.JPEG",
      bio: "AI expert creating intelligent matching systems for perfect career connections.",
      expertise: ["AI/ML", "Data Science", "Algorithms"],
      linkedin: "https://www.linkedin.com/in/michelle-cheng-643878119/"
    },
    {
      name: "Sandile Ngwenya",
      role: "CSO",
      image: "/Sandile.jpg",
      bio: "Guardian of our platform, ensuring secure and trusted experiences for all users.",
      expertise: ["Security", "Privacy", "Compliance"],
      linkedin: "https://www.linkedin.com/in/sandile-ngwenya-a00666296/"
    },
    {
      name: "Thandizo Henderson",
      role: "CMO",
      image: "/Thandizo.JPEG",
      bio: "Building communities and fostering connections that transform careers.",
      expertise: ["Marketing", "Branding", "Engagement"],
      linkedin: "https://www.linkedin.com/in/thandizo/"
    }
  ];

  const values = [
    {
      icon: Sparkles,
      title: "Innovation First",
      description: "We push boundaries to create solutions that don't just work—they transform."
    },
    {
      icon: Heart,
      title: "Human-Centered",
      description: "Technology should adapt to people, not the other way around."
    },
    {
      icon: TrendingUp,
      title: "Data-Driven",
      description: "Every decision backed by insights, every feature validated by results."
    },
    {
      icon: Award,
      title: "Excellence Always",
      description: "Good isn't good enough. We strive for exceptional in everything we do."
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#FBF9F7] via-[#FFF5F2] to-[#FBF9F7] text-[#1A1A1A] overflow-hidden relative">
      {/* Ambient glow effects */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-1/4 w-[600px] h-[600px] bg-[#FF6000]/8 rounded-full blur-3xl animate-pulse" style={{ animationDuration: '8s' }} />
        <div className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] bg-[#469AF9]/6 rounded-full blur-3xl animate-pulse" style={{ animationDuration: '10s' }} />
        <div className="absolute top-1/2 left-1/2 w-[400px] h-[400px] bg-[#FF6000]/5 rounded-full blur-3xl animate-pulse" style={{ animationDuration: '12s' }} />
      </div>
      
      {/* Fixed Navigation */}
      <motion.nav 
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        className="fixed top-0 left-0 right-0 z-50 bg-white/90 backdrop-blur-xl border-b border-[#E8E5E2]"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <button 
              onClick={onNavigateToLanding}
              className="flex items-center gap-3 hover:opacity-80 transition-opacity"
            >
              <div className="w-8 h-8 bg-gradient-to-r from-[#FF6000] to-[#FF8533] rounded-lg flex items-center justify-center">
                <Target className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-medium">
                <span className="text-[#1A1A1A]">the</span>
                <span className="text-[#FF6000]">Garage</span>
              </span>
            </button>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center gap-8">
              <button 
                onClick={() => {}}
                className="text-[#FF6000] font-medium"
              >
                About
              </button>
              
              <div className="flex items-center gap-3 ml-4">
                {isAuthenticated ? (
                  <Button 
                    onClick={onBackToApp}
                    className="bg-gradient-to-r from-[#FF6000] to-[#FF8533] hover:from-[#FF7A1F] hover:to-[#FF9D4D] text-white"
                  >
                    <ArrowRight className="w-4 h-4 mr-2" />
                    Back to App
                  </Button>
                ) : (
                  <>
                    {/* <Button
                      variant="ghost" 
                      onClick={onLogin} 
                      className="text-[#9E9B98] hover:text-[#1A1A1A] hover:bg-[#F5F3F1]"
                    >
                      Sign In
                    </Button> */}
                    <Button 
                      onClick={onGetStarted}
                      className="bg-gradient-to-r from-[#FF6000] to-[#FF8533] hover:from-[#FF7A1F] hover:to-[#FF9D4D] text-white"
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
              className="md:hidden p-2 rounded-md text-[#9E9B98] hover:text-[#1A1A1A]"
            >
              {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

          {/* Mobile Navigation */}
          {isMenuOpen && (
            <div className="md:hidden py-4 border-t border-[#E8E5E2]">
              <div className="flex flex-col gap-4">
                <button 
                  onClick={() => setIsMenuOpen(false)}
                  className="text-[#FF6000] font-medium text-left"
                >
                  About
                </button>
              </div>
            </div>
          )}
        </div>
      </motion.nav>

      {/* Hero Section */}
      <section id="hero" className="relative min-h-screen flex items-center overflow-hidden pt-16">
        {/* Background Elements */}
        <div className="absolute inset-0">
          <motion.div 
            style={{ 
              y: scrollY * 0.5 
            }}
            className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-br from-[#FF6000]/15 to-transparent transform rotate-12 origin-top-right"
          />
          <motion.div 
            style={{ 
              y: scrollY * -0.3 
            }}
            className="absolute bottom-0 left-0 w-1/2 h-1/2 bg-gradient-to-tr from-[#469AF9]/10 to-transparent transform -rotate-12"
          />
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
                <div className="px-4 py-2 bg-[#FF6000]/10 border border-[#FF6000]/30 rounded-full text-sm text-[#FF6000]">
                  <Sparkles className="w-4 h-4 inline mr-2" />
                  Redefining Recruitment
                </div>
              </motion.div>

              <motion.h1 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="text-6xl md:text-8xl font-medium mb-6 leading-none"
              >
                We're
                <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#FF6000] to-[#FF8533]">
                  theGarage
                </span>
              </motion.h1>

              <motion.p 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="text-xl text-[#545250] mb-8 max-w-lg leading-relaxed"
              >
                Where innovation meets opportunity. We're not just another job platform—we're the bridge between talent and destiny.
              </motion.p>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="text-sm text-[#9E9B98] italic mb-8"
              >
                "Life Should Be Easy"
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
              >
                <Button 
                  onClick={() => document.getElementById('mission')?.scrollIntoView({ behavior: 'smooth' })}
                  variant="outline"
                  className="border-[#E8E5E2] text-[#1A1A1A] hover:bg-[#F5F3F1] hover:border-[#FF6000] group"
                >
                  Discover Our Story
                  <ChevronDown className="w-4 h-4 ml-2 group-hover:translate-y-1 transition-transform" />
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
              {[
                { number: "5K+", label: "Job Seekers", icon: Users },
                { number: "100+", label: "Companies", icon: Target },
                { number: "89%", label: "Success Rate", icon: TrendingUp },
                { number: "2.3x", label: "Faster Hiring", icon: Zap }
              ].map((stat, index) => {
                const IconComponent = stat.icon;
                const gradients = [
                  'from-[#FF6000] to-[#FF8533]',
                  'from-[#469AF9] to-[#6AADFA]',
                  'from-[#FF8533] to-[#FF6000]',
                  'from-[#6AADFA] to-[#469AF9]'
                ];
                const gradient = gradients[index % gradients.length];
                
                return (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.5 + index * 0.1 }}
                    whileHover={{ scale: 1.05, rotate: 2 }}
                    className="bg-white/80 backdrop-blur-sm border border-[#E8E5E2] rounded-2xl p-6 shadow-lg group"
                  >
                    <div className={`w-12 h-12 bg-gradient-to-r ${gradient} rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                      <IconComponent className="w-6 h-6 text-white" />
                    </div>
                    <div className="text-4xl font-medium mb-2 text-[#1A1A1A]">{stat.number}</div>
                    <div className="text-sm text-[#9E9B98]">{stat.label}</div>
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
          <ChevronDown className="w-6 h-6 text-[#9E9B98]" />
        </motion.div>
      </section>

      {/* Mission Section */}
      <section id="mission" className="relative py-32 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-[#FFE8DC] to-[#FBF9F7]">
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="grid lg:grid-cols-5 gap-12 items-center">
            {/* Content - Takes 3 columns */}
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="lg:col-span-3"
            >
              <h2 className="text-5xl md:text-6xl font-medium mb-8 leading-tight">
                What We
                <span className="block text-transparent bg-clip-text bg-gradient-to-r from-[#FF6000] to-[#469AF9]">
                  Actually Do
                </span>
              </h2>

              <div className="space-y-6 text-lg text-[#545250] leading-relaxed">
                <p>
                  We're building the world's first <span className="text-[#1A1A1A] font-medium">dual-perspective recruitment platform</span> that serves both job seekers and recruiters with equal excellence.
                </p>
                <p>
                  Traditional job platforms force you to pick a side. We believe the best solutions come from understanding both perspectives. That's why <span className="text-[#FF6000] font-medium">theGarage</span> gives you the full picture.
                </p>
                <p>
                  For <span className="text-[#469AF9] font-medium">job seekers</span>, we provide AI-powered queues, real-time rankings, and actionable insights to level up your career. For <span className="text-[#FF6000] font-medium">recruiters</span>, we offer intelligent candidate matching, streamlined pipeline management, and data-driven hiring decisions.
                </p>
              </div>

              <div className="mt-12 grid md:grid-cols-2 gap-6">
                {values.map((value, index) => {
                  const IconComponent = value.icon;
                  return (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, x: -20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: index * 0.1 }}
                      className="group"
                    >
                      <div className="flex items-start gap-4">
                        <div className="w-12 h-12 bg-gradient-to-br from-[#FF6000]/20 to-[#469AF9]/20 border border-[#FF6000]/30 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                          <IconComponent className="w-6 h-6 text-[#FF6000]" />
                        </div>
                        <div>
                          <h3 className="font-medium mb-2 text-[#1A1A1A]">{value.title}</h3>
                          <p className="text-sm text-[#545250]">{value.description}</p>
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </motion.div>

            {/* Visual Element - Takes 2 columns */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="lg:col-span-2"
            >
              <div className="relative h-96">
                {/* Floating Cards */}
                <motion.div
                  animate={{ y: [0, -20, 0] }}
                  transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
                  className="absolute top-0 right-0 w-48 h-32 bg-gradient-to-br from-[#469AF9]/20 to-[#469AF9]/10 border border-[#469AF9]/30 rounded-2xl backdrop-blur-sm p-4"
                >
                  <Users className="w-8 h-8 text-[#469AF9] mb-2" />
                  <div className="text-sm text-[#545250]">Job Seekers</div>
                  <div className="text-2xl font-medium text-[#1A1A1A]">89K+</div>
                </motion.div>

                <motion.div
                  animate={{ y: [0, 20, 0] }}
                  transition={{ repeat: Infinity, duration: 4, ease: "easeInOut", delay: 0.5 }}
                  className="absolute bottom-0 left-0 w-48 h-32 bg-gradient-to-br from-[#FF6000]/20 to-[#FF8533]/10 border border-[#FF6000]/30 rounded-2xl backdrop-blur-sm p-4"
                >
                  <Target className="w-8 h-8 text-[#FF6000] mb-2" />
                  <div className="text-sm text-[#545250]">Recruiters</div>
                  <div className="text-2xl font-medium text-[#1A1A1A]">8.5K+</div>
                </motion.div>

                {/* Center Glow */}
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-gradient-to-r from-[#FF6000]/20 to-[#469AF9]/20 rounded-full blur-3xl" />
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Meet the Visionaries Section */}
      <section id="team" className="relative py-32 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-transparent via-slate-800/30 to-transparent">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-20"
          >
            <h2 className="text-5xl md:text-6xl font-medium mb-6">
              Meet The
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#FF6000] to-[#469AF9]"> Visionaries</span>
            </h2>
            <p className="text-xl text-[#545250] max-w-2xl mx-auto">
              A team of dreamers, builders, and innovators united by one mission: making careers happen.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-8">
            {team.map((member, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ y: -10 }}
                className="group"
              >
                <Card className="bg-white/60 backdrop-blur-md border border-white/40 shadow-xl p-8 hover:border-[#FF6000]/50 hover:shadow-2xl transition-all duration-300">
                  <div className="flex items-start gap-6">
                    {/* Avatar */}
                    <div className="relative">
                      <div 
                        className="w-24 h-24 rounded-2xl overflow-hidden group-hover:scale-110 transition-transform bg-cover bg-center"
                        style={{ backgroundImage: `url(${member.image})` }}
                      />
                      <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-green-500 border-4 border-white rounded-full" />
                    </div>

                    {/* Info */}
                    <div className="flex-1">
                      <h3 className="text-2xl font-medium mb-1 text-[#1A1A1A]">{member.name}</h3>
                      <div className="text-[#FF6000] mb-3">{member.role}</div>
                      <p className="text-[#545250] text-sm mb-4 leading-relaxed">{member.bio}</p>

                      {/* Expertise Tags */}
                      <div className="flex flex-wrap gap-2 mb-4">
                        {member.expertise.map((skill, idx) => (
                          <span 
                            key={idx}
                            className="px-3 py-1 bg-[#FF6000]/10 border border-[#FF6000]/20 rounded-full text-xs text-[#1A1A1A] font-medium"
                          >
                            {skill}
                          </span>
                        ))}
                      </div>

                      {/* Social Links */}
                      <div className="flex gap-3">
                        <a 
                          href={member.linkedin}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="w-8 h-8 bg-[#FF6000]/10 border border-[#FF6000]/20 rounded-lg flex items-center justify-center hover:bg-[#FF6000]/20 hover:border-[#FF6000]/50 transition-all"
                        >
                          <Linkedin className="w-4 h-4 text-[#FF6000]" />
                        </a>
                      </div>
                    </div>
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>

          {/* Join Team CTA */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mt-16 text-center"
          >
            <Card className="inline-block bg-white/50 backdrop-blur-md border border-white/40 shadow-xl p-8">
              <Brain className="w-12 h-12 text-[#FF6000] mx-auto mb-4" />
              <h3 className="text-2xl font-medium mb-3 text-[#1A1A1A]">Want to Join Us?</h3>
              <p className="text-[#545250] mb-6 max-w-md">
                We're always looking for exceptional talent to join our mission.
              </p>
              <Button 
                className="bg-gradient-to-r from-[#FF6000] to-[#469AF9] hover:from-[#FF7A1F] hover:to-[#6BB0FF] text-white"
              >
                View Open Positions
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </Card>
          </motion.div>
        </div>
      </section>

      {/* Final CTA Section */}
      <section id="cta" className="relative py-32 px-4 sm:px-6 lg:px-8 overflow-hidden bg-gradient-to-b from-[#FFE8DC] to-[#FBF9F7]">
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
            className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-r from-[#FF6000]/20 to-[#469AF9]/20 rounded-full blur-3xl"
          />
        </div>

        <div className="max-w-4xl mx-auto text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-5xl md:text-7xl font-medium mb-8 leading-tight text-[#1A1A1A]">
              Ready to Transform
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-[#FF6000] to-[#469AF9]">
                Your Career?
              </span>
            </h2>

            <p className="text-xl text-[#545250] mb-12 max-w-2xl mx-auto leading-relaxed">
              Join thousands of professionals who are already experiencing the future of recruitment.
            </p>

            {/* <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
              <Button 
                onClick={onGetStarted}
                size="lg"
                className="bg-gradient-to-r from-[#FF6000] to-[#FF8533] hover:from-[#FF7A1F] hover:to-[#FF9D4D] text-white px-12 py-6 text-lg"
              >
                Start Your Journey
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
              <Button 
                onClick={onLogin}
                variant="outline"
                size="lg"
                className="border-[#E8E5E2] text-[#1A1A1A] hover:bg-[#F5F3F1] hover:border-[#FF6000] px-12 py-6 text-lg"
              >
                Sign In
              </Button>
            </div> */}

            <p className="text-sm text-[#9E9B98] italic">
              "It gets better!"
            </p>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gradient-to-br from-slate-900 via-gray-800 to-slate-900 text-white py-16 mt-16 relative overflow-hidden">
        {/* Ambient glow effects */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-[#ff6b35]/10 rounded-full blur-3xl" />
          <div className="absolute top-0 right-1/4 w-96 h-96 bg-blue-500/5 rounded-full blur-3xl" />
        </div>
        
        <div className="container mx-auto px-6 relative z-10">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
            {/* Brand Section */}
            <div className="space-y-4">
              <div className="flex items-center gap-3 mb-4">
                <span className="text-2xl font-medium">
                  <span className="text-white">the</span>
                  <span className="text-[#ff6b35]">Garage</span>
                </span>
              </div>
              <p className="text-gray-400 text-sm leading-relaxed">
                Empowering job seekers and recruiters with intelligent tracking, analytics, and collaboration tools.
              </p>
              {/* Social Links */}
              <div className="flex items-center gap-4 pt-4">
                <a 
                  href="https://www.linkedin.com/company/thegaragejobs/about/" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-gray-400 hover:text-[#ff6b35] transition-colors"
                  aria-label="LinkedIn"
                >
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
                  </svg>
                </a>
              </div>
            </div>

            {/* Product Section */}
            <div>
              <h3 className="font-semibold mb-4 text-white">Product</h3>
              <ul className="space-y-3">
                <li>
                  <a href="#" className="text-gray-400 hover:text-[#ff6b35] transition-colors text-sm">Features</a>
                </li>
                <li>
                  <a href="#" className="text-gray-400 hover:text-[#ff6b35] transition-colors text-sm">Pricing</a>
                </li>
                <li>
                  <a href="#" className="text-gray-400 hover:text-[#ff6b35] transition-colors text-sm">For Job Seekers</a>
                </li>
                <li>
                  <a href="#" className="text-gray-400 hover:text-[#ff6b35] transition-colors text-sm">For Recruiters</a>
                </li>
                <li>
                  <a href="#" className="text-gray-400 hover:text-[#ff6b35] transition-colors text-sm">For Institutions</a>
                </li>
              </ul>
            </div>

            {/* Company Section */}
            <div>
              <h3 className="font-semibold mb-4 text-white">Company</h3>
              <ul className="space-y-3">
                <li>
                  <a href="#" className="text-gray-400 hover:text-[#ff6b35] transition-colors text-sm">About Us</a>
                </li>
                <li>
                  <a href="#" className="text-gray-400 hover:text-[#ff6b35] transition-colors text-sm">Blog</a>
                </li>
                <li>
                  <a href="#" className="text-gray-400 hover:text-[#ff6b35] transition-colors text-sm">Careers</a>
                </li>
                <li>
                  <a href="#" className="text-gray-400 hover:text-[#ff6b35] transition-colors text-sm">Contact</a>
                </li>
              </ul>
            </div>

            {/* Legal Section */}
            <div>
              <h3 className="font-semibold mb-4 text-white">Legal</h3>
              <ul className="space-y-3">
                <li>
                  <a href="#" className="text-gray-400 hover:text-[#ff6b35] transition-colors text-sm">Privacy Policy</a>
                </li>
                <li>
                  <a href="#" className="text-gray-400 hover:text-[#ff6b35] transition-colors text-sm">Terms of Service</a>
                </li>
                <li>
                  <a href="#" className="text-gray-400 hover:text-[#ff6b35] transition-colors text-sm">Cookie Policy</a>
                </li>
                <li>
                  <a href="#" className="text-gray-400 hover:text-[#ff6b35] transition-colors text-sm">Acceptable Use</a>
                </li>
                <li>
                  <a href="#" className="text-gray-400 hover:text-[#ff6b35] transition-colors text-sm">Data Protection</a>
                </li>
              </ul>
            </div>
          </div>

          {/* Bottom Bar */}
          <div className="pt-8 border-t border-gray-700/50">
            <div className="flex flex-col md:flex-row justify-between items-center gap-4">
              <p className="text-gray-400 text-sm">
                © {new Date().getFullYear()} theGarage. All rights reserved.
              </p>
              <div className="flex items-center gap-6 text-sm text-gray-400">
                <span>Made with ❤️ for job seekers everywhere</span>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}