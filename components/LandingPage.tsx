import { useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { ArrowRight, Users, Target, Zap, Menu, X } from 'lucide-react';
import { DualPerspectiveDemo } from './DualPerspectiveDemo';

interface LandingPageProps {
  onGetStarted: () => void;
  onLogin: () => void;
  onViewAbout?: () => void;
  onViewBlog?: () => void;
  isAuthenticated?: boolean;
  onBackToApp?: () => void;
}

export function LandingPage({ onGetStarted, onViewAbout, isAuthenticated = false, onBackToApp }: Readonly<LandingPageProps>) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [showDemo, setShowDemo] = useState(false);

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
              onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
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
              {onViewAbout && (
                <button 
                  onClick={(e) => {
                    e.preventDefault();
                    onViewAbout();
                  }}
                  className="text-[#9E9B98] hover:text-[#1A1A1A] transition-colors"
                >
                  About
                </button>
              )}
              
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
                    {/* <Button variant="ghost" onClick={onLogin} className="text-[#9E9B98] hover:text-[#1A1A1A] hover:bg-[#F5F3F1]">
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
                {onViewAbout && (
                  <button 
                    onClick={(e) => {
                      e.preventDefault();
                      setIsMenuOpen(false);
                      onViewAbout();
                    }}
                    className="text-[#9E9B98] hover:text-[#1A1A1A] transition-colors text-left"
                  >
                    About
                  </button>
                )}
              </div>
            </div>
          )}
        </div>
      </motion.nav>

      {/* Hero Section with glassmorphism */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-[#FBF9F7] via-[#FFF5F2] to-[#FFE8DC] pt-16">
        {/* Animated background blobs */}
        <div className="absolute inset-0 overflow-hidden">
          <motion.div
            className="absolute top-20 -left-20 w-96 h-96 bg-[#FF6000] rounded-full mix-blend-multiply filter blur-3xl opacity-20"
            animate={{
              x: [0, 100, 0],
              y: [0, 50, 0],
              scale: [1, 1.1, 1],
            }}
            transition={{
              duration: 20,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
          <motion.div
            className="absolute top-40 right-20 w-96 h-96 bg-[#469AF9] rounded-full mix-blend-multiply filter blur-3xl opacity-20"
            animate={{
              x: [0, -100, 0],
              y: [0, 100, 0],
              scale: [1, 1.2, 1],
            }}
            transition={{
              duration: 25,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
          <motion.div
            className="absolute -bottom-20 left-1/2 w-96 h-96 bg-[#FF6000] rounded-full mix-blend-multiply filter blur-3xl opacity-15"
            animate={{
              x: [0, 50, 0],
              y: [0, -50, 0],
              scale: [1, 1.15, 1],
            }}
            transition={{
              duration: 22,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
        </div>

        {/* Glass card hero content */}
        <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="backdrop-blur-xl bg-white/40 border border-white/50 rounded-3xl p-8 md:p-12 shadow-2xl"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2, duration: 0.6 }}
              className="inline-block mb-6"
            >
              <span className="px-6 py-2 bg-gradient-to-r from-[#FF6000] to-[#FF8533] text-white rounded-full text-sm font-semibold shadow-lg">
                Join TheGarage's Talent Pool
              </span>
            </motion.div>
            
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.8 }}
              className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-[#FF6000] via-[#FF7A1F] to-[#469AF9] bg-clip-text text-transparent"
            >
              Your Next Career Move
              <br />
              Starts Here
            </motion.h1>
            
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.8 }}
              className="text-xl md:text-2xl text-[#545250] mb-10 max-w-3xl mx-auto leading-relaxed"
            >
              We are on a mission to connect top talents to recruiters by creating queues to help rank candidates for recruiter selection.
            </motion.p>
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.8 }}
              className="flex justify-center gap-4"
            >
              <a
                href='https://forms.gle/XSTpkTWovXBfhf7p9'
                target="_blank"
                rel="noopener noreferrer"
                // size="lg"
                className="bg-gradient-to-r from-[#FF6000] to-[#FF8533] hover:from-[#FF7A1F] hover:to-[#FF9D4D] text-white shadow-xl hover:shadow-2xl transition-all duration-300 text-lg px-8 py-6 rounded-xl group"
              >
                Join our Talent Pool
                <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </a>
              <a
                href='https://forms.gle/CnPr692VyrhS8RHC7'
                target="_blank"
                rel="noopener noreferrer"
                // size="lg"
                className="bg-gradient-to-r from-[#FF6000] to-[#FF8533] hover:from-[#FF7A1F] hover:to-[#FF9D4D] text-white shadow-xl hover:shadow-2xl transition-all duration-300 text-lg px-8 py-6 rounded-xl group"
              >
                Join our Recruiter Network
                <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </a>
            </motion.div>
          </motion.div>
        </div>
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

      {/* About Section with glass cards */}
      <section className="py-24 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-[#FFE8DC] to-[#FBF9F7]">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-[#FF6000] to-[#469AF9] bg-clip-text text-transparent">
              Why Join theGarage?
            </h2>
            <p className="text-xl text-[#545250] max-w-2xl mx-auto">
              We exist to make hiring faster, fairer and more human
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: <Users className="h-12 w-12" />,
                title: 'Recruiter Selection',
                description: 'Recruiters, when hiring, will upload a JD, and the system will match the JD with a job queue, and based on the rankings, recruiters can select candidates for interviews.',
                color: 'from-[#FF6000] to-[#FF8533]',
              },
              {
                icon: <Zap className="h-12 w-12" />,
                title: 'Job Recommendations & Auto-Apply',
                description: 'The app then surfaces matching jobs (within those streams) ranked by fit. It auto-apply for recommended roles.',
                color: 'from-[#469AF9] to-[#6BB0FF]',
              },
              {
                icon: <Target className="h-12 w-12" />,
                title: 'Application Status Tracking',
                description: 'Once applied (manually or via auto-apply), the candidate dashboard tracks each application\'s status. The platform pushes real-time status updates as recruiters progress candidates through the pipeline.',
                color: 'from-[#FF6000] to-[#469AF9]',
              },
            ].map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.2, duration: 0.6 }}
                whileHover={{ y: -10, transition: { duration: 0.3 } }}
              >
                <Card className="h-full backdrop-blur-xl bg-white/60 border border-white/80 shadow-xl hover:shadow-2xl transition-all duration-300 p-8 rounded-2xl group">
                  <div className={`inline-flex p-4 rounded-2xl bg-gradient-to-br ${feature.color} text-white mb-6 shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                    {feature.icon}
                  </div>
                  <h3 className="text-2xl font-bold mb-4 text-[#1A1A1A]">{feature.title}</h3>
                  <p className="text-[#545250] leading-relaxed">{feature.description}</p>
                </Card>
              </motion.div>
            ))}
          </div>
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