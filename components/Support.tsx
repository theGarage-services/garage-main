import { useState } from 'react';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Badge } from './ui/badge';
import { Alert, AlertDescription } from './ui/alert';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from './ui/accordion';
import { ArrowLeft, MessageCircle, Book, Video, Phone, Mail, Search, Send, CheckCircle, Clock, Star, ThumbsUp, ExternalLink, HelpCircle, Lightbulb, Users, Zap } from 'lucide-react';

interface SupportProps {
  onBack: () => void;
}

export function Support({ onBack }: Readonly<SupportProps>) {
  const [searchQuery, setSearchQuery] = useState('');
  const [contactSubject, setContactSubject] = useState('');
  const [contactMessage, setContactMessage] = useState('');
  const [contactType, setContactType] = useState('general');
  const [submitted, setSubmitted] = useState(false);

  const handleContactSubmit = () => {
    if (!contactSubject.trim() || !contactMessage.trim()) return;
    
    // In a real app, this would send the message
    console.log('Support ticket submitted:', { contactType, contactSubject, contactMessage });
    setSubmitted(true);
    setContactSubject('');
    setContactMessage('');
    
    setTimeout(() => setSubmitted(false), 3000);
  };

  const faqData = [
    {
      question: "How do I apply to jobs on theGarage?",
      answer: "You can apply to jobs in several ways: 1) Use Quick Apply for instant applications, 2) Apply manually through company websites, or 3) Get automatically considered by recruiters through our queue system. All applied jobs will appear in your Job Tracker."
    },
    {
      question: "What is the difference between manual apply and quick apply?",
      answer: "Quick Apply instantly submits your profile to employers with one click. Manual Apply redirects you to the company's website where you can customize your application. Both methods automatically add the job to your tracker."
    },
    {
      question: "How does the queue system work?",
      answer: "Our AI-powered queue system matches you with relevant jobs based on your profile, skills, and preferences. You can join up to 5 queues total (3 manual + 2 AI-selected). Premium users get advanced analytics and priority placement."
    },
    {
      question: "What's included in the Premium plan?",
      answer: "Premium includes: Direct messaging with recruiters, priority application status, advanced queue analytics, Live Profile Upgrade Checker, Queue Leaderboards, interview scheduling, and unlimited job applications. It's $19.99/month with a 7-day free trial."
    },
    {
      question: "How do I track my job applications?",
      answer: "All your applications automatically appear in the Job Tracker with stages: Application Received, Under Consideration, Interview Stage, Offer, or Rejected. You can add notes and see recruiter feedback for each application."
    },
    {
      question: "Can I withdraw my job applications?",
      answer: "Yes, you can withdraw applications directly from the job details page or your Job Tracker. This will remove you from consideration and update your application status."
    },
    {
      question: "How do I chat with recruiters?",
      answer: "Recruiter chat is available for Premium users only. Once you apply to a job, you'll see a chat option in the job details if the recruiter has enabled it. You can schedule interviews and communicate directly."
    },
    {
      question: "What should I include in my profile?",
      answer: "Complete profiles get better matches! Include: Professional summary, work experience, skills, education, certifications, and career preferences. Use our Resume Editor to keep everything up-to-date."
    },
    {
      question: "How do notifications work?",
      answer: "You'll receive notifications for: Application status changes, new job matches, recruiter messages, interview reminders, and queue updates. Customize notification preferences in Account Settings."
    },
    {
      question: "Is my data secure on theGarage?",
      answer: "Absolutely! We use enterprise-grade security, encrypt all data, and never share personal information without consent. You control your profile visibility and can export or delete your data anytime."
    }
  ];

  const filteredFAQ = faqData.filter(item => 
    item.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.answer.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-orange-50">
      <div className="max-w-4xl mx-auto p-6">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={onBack}
            className="border-[#ff6b35] text-[#ff6b35] hover:bg-orange-50"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Support Center</h1>
            <p className="text-gray-600">Get help with theGarage and find answers to common questions</p>
          </div>
        </div>

        <Tabs defaultValue="faq" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4 bg-white border border-gray-200">
            <TabsTrigger value="faq">FAQ</TabsTrigger>
            <TabsTrigger value="contact">Contact Us</TabsTrigger>
            <TabsTrigger value="guides">Guides</TabsTrigger>
            <TabsTrigger value="status">System Status</TabsTrigger>
          </TabsList>

          {/* FAQ Section */}
          <TabsContent value="faq" className="space-y-6">
            {/* Search */}
            <Card>
              <CardContent className="p-6">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <Input
                    placeholder="Search frequently asked questions..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </CardContent>
            </Card>

            {/* FAQ List */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <HelpCircle className="w-5 h-5 text-[#ff6b35]" />
                  Frequently Asked Questions
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Accordion type="single" collapsible className="space-y-2">
                  {filteredFAQ.map((item, index) => (
                    <AccordionItem key={index} value={`item-${index}`} className="border border-gray-200 rounded-lg px-4">
                      <AccordionTrigger className="text-left hover:no-underline">
                        {item.question}
                      </AccordionTrigger>
                      <AccordionContent className="text-gray-600 pb-4">
                        {item.answer}
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              </CardContent>
            </Card>

            {/* Quick Help */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card className="border-blue-200 bg-blue-50">
                <CardContent className="p-4 text-center">
                  <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
                    <Zap className="w-6 h-6 text-blue-600" />
                  </div>
                  <h3 className="font-semibold text-blue-900 mb-2">Getting Started</h3>
                  <p className="text-sm text-blue-700 mb-3">New to theGarage? Learn the basics</p>
                  <Button size="sm" variant="outline" className="border-blue-300 text-blue-700 hover:bg-blue-100">
                    View Guide
                  </Button>
                </CardContent>
              </Card>

              <Card className="border-green-200 bg-green-50">
                <CardContent className="p-4 text-center">
                  <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                    <Users className="w-6 h-6 text-green-600" />
                  </div>
                  <h3 className="font-semibold text-green-900 mb-2">Job Applications</h3>
                  <p className="text-sm text-green-700 mb-3">Learn how to apply and track jobs</p>
                  <Button size="sm" variant="outline" className="border-green-300 text-green-700 hover:bg-green-100">
                    View Guide
                  </Button>
                </CardContent>
              </Card>

              <Card className="border-purple-200 bg-purple-50">
                <CardContent className="p-4 text-center">
                  <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-3">
                    <Lightbulb className="w-6 h-6 text-purple-600" />
                  </div>
                  <h3 className="font-semibold text-purple-900 mb-2">Premium Features</h3>
                  <p className="text-sm text-purple-700 mb-3">Unlock advanced capabilities</p>
                  <Button size="sm" variant="outline" className="border-purple-300 text-purple-700 hover:bg-purple-100">
                    Learn More
                  </Button>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Contact Section */}
          <TabsContent value="contact" className="space-y-6">
            {submitted && (
              <Alert className="border-green-200 bg-green-50">
                <CheckCircle className="w-4 h-4 text-green-600" />
                <AlertDescription className="text-green-800">
                  Your message has been sent! We'll get back to you within 24 hours.
                </AlertDescription>
              </Alert>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Contact Form */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <MessageCircle className="w-5 h-5 text-[#ff6b35]" />
                    Send us a Message
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="contact-type">Type of Issue</Label>
                    <select 
                      id="contact-type"
                      value={contactType}
                      onChange={(e) => setContactType(e.target.value)}
                      className="w-full p-2 border border-gray-300 rounded-lg"
                    >
                      <option value="general">General Question</option>
                      <option value="technical">Technical Issue</option>
                      <option value="billing">Billing Support</option>
                      <option value="account">Account Help</option>
                      <option value="feature">Feature Request</option>
                      <option value="bug">Bug Report</option>
                    </select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="subject">Subject</Label>
                    <Input
                      id="subject"
                      placeholder="Brief description of your issue"
                      value={contactSubject}
                      onChange={(e) => setContactSubject(e.target.value)}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="message">Message</Label>
                    <Textarea
                      id="message"
                      placeholder="Please describe your issue in detail..."
                      rows={6}
                      value={contactMessage}
                      onChange={(e) => setContactMessage(e.target.value)}
                    />
                  </div>

                  <Button 
                    onClick={handleContactSubmit}
                    disabled={!contactSubject.trim() || !contactMessage.trim()}
                    className="w-full bg-gradient-to-r from-[#ff6b35] to-[#ff8c42] hover:from-[#e55a2b] hover:to-[#ff6b35] text-white"
                  >
                    <Send className="w-4 h-4 mr-2" />
                    Send Message
                  </Button>
                </CardContent>
              </Card>

              {/* Contact Options */}
              <div className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Phone className="w-5 h-5 text-[#ff6b35]" />
                      Other Ways to Reach Us
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                      <Mail className="w-5 h-5 text-gray-600" />
                      <div>
                        <p className="font-medium text-gray-900">Email Support</p>
                        <p className="text-sm text-gray-600">support@thegarage.com</p>
                        <p className="text-xs text-gray-500">Response within 24 hours</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                      <MessageCircle className="w-5 h-5 text-gray-600" />
                      <div>
                        <p className="font-medium text-gray-900">Live Chat</p>
                        <p className="text-sm text-gray-600">Available Mon-Fri, 9AM-6PM EST</p>
                        <Button size="sm" variant="outline" className="mt-2 border-[#ff6b35] text-[#ff6b35] hover:bg-orange-50">
                          Start Chat
                        </Button>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                      <Phone className="w-5 h-5 text-gray-600" />
                      <div>
                        <p className="font-medium text-gray-900">Phone Support</p>
                        <p className="text-sm text-gray-600">+1 (555) 123-GARAGE</p>
                        <p className="text-xs text-gray-500">Premium users only</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Response Times */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Clock className="w-5 h-5 text-[#ff6b35]" />
                      Response Times
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">General Inquiries</span>
                      <Badge variant="outline">24 hours</Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">Technical Issues</span>
                      <Badge variant="outline">12 hours</Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">Billing Support</span>
                      <Badge variant="outline">8 hours</Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">Premium Support</span>
                      <Badge className="bg-[#ff6b35] text-white">2 hours</Badge>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>

          {/* Guides Section */}
          <TabsContent value="guides" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Book className="w-5 h-5 text-[#ff6b35]" />
                  Help Guides & Tutorials
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-4 border border-gray-200 rounded-lg hover:shadow-md transition-shadow">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                        <Zap className="w-5 h-5 text-blue-600" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900">Quick Start Guide</h3>
                        <p className="text-sm text-gray-600">5 min read</p>
                      </div>
                    </div>
                    <p className="text-sm text-gray-600 mb-3">
                      Learn how to set up your profile, apply to jobs, and track your applications.
                    </p>
                    <Button variant="outline" size="sm" className="border-[#ff6b35] text-[#ff6b35] hover:bg-orange-50">
                      <ExternalLink className="w-4 h-4 mr-2" />
                      Read Guide
                    </Button>
                  </div>

                  <div className="p-4 border border-gray-200 rounded-lg hover:shadow-md transition-shadow">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                        <Users className="w-5 h-5 text-green-600" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900">Job Queue System</h3>
                        <p className="text-sm text-gray-600">8 min read</p>
                      </div>
                    </div>
                    <p className="text-sm text-gray-600 mb-3">
                      Understanding how queues work and how to optimize your queue selection.
                    </p>
                    <Button variant="outline" size="sm" className="border-[#ff6b35] text-[#ff6b35] hover:bg-orange-50">
                      <ExternalLink className="w-4 h-4 mr-2" />
                      Read Guide
                    </Button>
                  </div>

                  <div className="p-4 border border-gray-200 rounded-lg hover:shadow-md transition-shadow">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                        <Star className="w-5 h-5 text-purple-600" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900">Profile Optimization</h3>
                        <p className="text-sm text-gray-600">12 min read</p>
                      </div>
                    </div>
                    <p className="text-sm text-gray-600 mb-3">
                      Tips and best practices to make your profile stand out to recruiters.
                    </p>
                    <Button variant="outline" size="sm" className="border-[#ff6b35] text-[#ff6b35] hover:bg-orange-50">
                      <ExternalLink className="w-4 h-4 mr-2" />
                      Read Guide
                    </Button>
                  </div>

                  <div className="p-4 border border-gray-200 rounded-lg hover:shadow-md transition-shadow">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
                        <Video className="w-5 h-5 text-orange-600" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900">Video Tutorials</h3>
                        <p className="text-sm text-gray-600">Watch & learn</p>
                      </div>
                    </div>
                    <p className="text-sm text-gray-600 mb-3">
                      Step-by-step video guides for all theGarage features.
                    </p>
                    <Button variant="outline" size="sm" className="border-[#ff6b35] text-[#ff6b35] hover:bg-orange-50">
                      <Video className="w-4 h-4 mr-2" />
                      Watch Videos
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Popular Articles */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <ThumbsUp className="w-5 h-5 text-[#ff6b35]" />
                  Popular Articles
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div>
                      <p className="font-medium text-gray-900">How to write an effective job application</p>
                      <p className="text-sm text-gray-600">Tips for standing out to recruiters</p>
                    </div>
                    <Button variant="ghost" size="sm" className="text-[#ff6b35]">
                      Read
                    </Button>
                  </div>
                  
                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div>
                      <p className="font-medium text-gray-900">Understanding job application statuses</p>
                      <p className="text-sm text-gray-600">What each stage means for your application</p>
                    </div>
                    <Button variant="ghost" size="sm" className="text-[#ff6b35]">
                      Read
                    </Button>
                  </div>
                  
                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div>
                      <p className="font-medium text-gray-900">Maximizing your premium membership</p>
                      <p className="text-sm text-gray-600">Get the most out of premium features</p>
                    </div>
                    <Button variant="ghost" size="sm" className="text-[#ff6b35]">
                      Read
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* System Status */}
          <TabsContent value="status" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CheckCircle className="w-5 h-5 text-green-500" />
                  System Status
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <Alert className="border-green-200 bg-green-50">
                    <CheckCircle className="w-4 h-4 text-green-600" />
                    <AlertDescription className="text-green-800">
                      All systems operational. Last updated: 2 minutes ago
                    </AlertDescription>
                  </Alert>

                  <div className="space-y-3">
                    <div className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
                      <div className="flex items-center gap-3">
                        <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                        <span className="font-medium text-gray-900">Job Search & Applications</span>
                      </div>
                      <Badge className="bg-green-100 text-green-800">Operational</Badge>
                    </div>

                    <div className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
                      <div className="flex items-center gap-3">
                        <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                        <span className="font-medium text-gray-900">Job Tracker</span>
                      </div>
                      <Badge className="bg-green-100 text-green-800">Operational</Badge>
                    </div>

                    <div className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
                      <div className="flex items-center gap-3">
                        <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                        <span className="font-medium text-gray-900">Recruiter Chat</span>
                      </div>
                      <Badge className="bg-green-100 text-green-800">Operational</Badge>
                    </div>

                    <div className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
                      <div className="flex items-center gap-3">
                        <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                        <span className="font-medium text-gray-900">Notifications</span>
                      </div>
                      <Badge className="bg-green-100 text-green-800">Operational</Badge>
                    </div>

                    <div className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
                      <div className="flex items-center gap-3">
                        <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                        <span className="font-medium text-gray-900">Queue Analytics</span>
                      </div>
                      <Badge className="bg-green-100 text-green-800">Operational</Badge>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Recent Updates */}
            <Card>
              <CardHeader>
                <CardTitle>Recent Updates</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="p-4 border-l-4 border-green-500 bg-green-50">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-semibold text-green-900">System Maintenance Complete</h4>
                      <span className="text-sm text-green-700">2 hours ago</span>
                    </div>
                    <p className="text-sm text-green-800">
                      Scheduled maintenance completed successfully. All features are now fully operational.
                    </p>
                  </div>

                  <div className="p-4 border-l-4 border-blue-500 bg-blue-50">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-semibold text-blue-900">New Feature Release</h4>
                      <span className="text-sm text-blue-700">1 day ago</span>
                    </div>
                    <p className="text-sm text-blue-800">
                      Enhanced recruiter chat functionality with video call support and interview scheduling.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}