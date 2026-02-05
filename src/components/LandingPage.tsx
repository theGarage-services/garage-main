import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  Platform,
  Dimensions,
  TouchableOpacity,
  SafeAreaView,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';

import { useTheme } from '../theme/ThemeProvider';
import { Button } from './ui/Button';
import { Card } from './ui/Card';

const { width: screenWidth } = Dimensions.get('window');

interface LandingPageProps {
  onGetStarted: () => void;
  onLogin: () => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({
  onGetStarted,
  onLogin,
}) => {
  const theme = useTheme();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const features = [
    {
      icon: 'people',
      title: 'Smart Queue Placement',
      description: 'AI-powered matching puts you in the right queues with relevant opportunities.',
      highlight: 'AI-Powered',
    },
    {
      icon: 'trending-up',
      title: 'Real-Time Analytics',
      description: 'Track your job search progress or monitor hiring pipeline performance with detailed insights.',
      highlight: 'Live Data',
    },
    {
      icon: 'target',
      title: 'Direct Connections',
      description: 'Connect directly with recruiters and hiring managers for faster, more personal interactions.',
      highlight: 'No Middleman',
    },
    {
      icon: 'checkmark-circle',
      title: 'Verified Opportunities',
      description: 'All job postings and recruiters are verified to ensure quality and legitimacy.',
      highlight: 'Trusted',
    },
  ];

  const testimonials = [
    {
      quote: "theGarage completely transformed my job search. I found my dream role in just 2 weeks!",
      author: "Sarah Chen",
      role: "Software Engineer at Google",
      rating: 5,
    },
    {
      quote: "As a recruiter, this platform has revolutionized how I find and connect with top talent.",
      author: "Michael Rodriguez",
      role: "Senior Recruiter at Microsoft",
      rating: 5,
    },
    {
      quote: "The dual perspective approach is genius. I can see exactly what recruiters are looking for.",
      author: "Emma Thompson",
      role: "Product Manager at Shopify",
      rating: 5,
    },
  ];

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, index) => (
      <Ionicons
        key={index}
        name="star"
        size={16}
        color={index < rating ? theme.colors.semantic.warning : theme.colors.neutral.gray300}
      />
    ));
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="dark" />
      
      {/* Header */}
      <View style={[styles.header, { backgroundColor: theme.colors.background.secondary }]}>
        <View style={styles.headerContent}>
          <View style={styles.logoContainer}>
            <LinearGradient
              colors={theme.colors.background.gradient.orange as any}
              style={styles.logoIcon}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
            >
              <Ionicons name="car" size={20} color={theme.colors.text.inverse} />
            </LinearGradient>
            <View style={styles.logoText}>
              <Text style={[styles.logoTextPrimary, { color: theme.colors.text.primary }]}>
                the
              </Text>
              <Text style={[styles.logoTextAccent, { color: theme.colors.primary.orange }]}>
                Garage
              </Text>
            </View>
          </View>

          {Platform.OS === 'web' && screenWidth > 768 ? (
            <View style={styles.headerButtons}>
              <Button
                title="Sign In"
                onPress={onLogin}
                variant="ghost"
                size="medium"
              />
              <Button
                title="Get Started Free"
                onPress={onGetStarted}
                variant="primary"
                size="medium"
              />
            </View>
          ) : (
            <TouchableOpacity
              style={styles.menuButton}
              onPress={() => setIsMenuOpen(!isMenuOpen)}
            >
              <Ionicons
                name={isMenuOpen ? "close" : "menu"}
                size={24}
                color={theme.colors.text.primary}
              />
            </TouchableOpacity>
          )}
        </View>

        {/* Mobile Menu */}
        {isMenuOpen && Platform.OS !== 'web' && (
          <View style={[styles.mobileMenu, { backgroundColor: theme.colors.background.secondary }]}>
            <Button
              title="Sign In"
              onPress={() => {
                setIsMenuOpen(false);
                onLogin();
              }}
              variant="ghost"
              size="medium"
              style={styles.mobileMenuButton}
            />
            <Button
              title="Get Started Free"
              onPress={() => {
                setIsMenuOpen(false);
                onGetStarted();
              }}
              variant="primary"
              size="medium"
              style={styles.mobileMenuButton}
            />
          </View>
        )}
      </View>

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Hero Section */}
        <LinearGradient
          colors={theme.colors.background.gradient.primary as any}
          style={styles.heroSection}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        >
          <View style={styles.heroContent}>
            <View style={styles.heroBadge}>
              <Text style={[styles.heroBadgeText, { color: theme.colors.primary.orange }]}>
                🚀 For Job Seekers & Recruiters
              </Text>
            </View>
            
            <Text style={[styles.heroTitle, { color: theme.colors.text.primary }]}>
              The dual-perspective platform that{'\n'}
              <Text style={{ color: theme.colors.primary.orange }}>connects talent</Text>
            </Text>
            
            <Text style={[styles.heroDescription, { color: theme.colors.text.secondary }]}>
              Whether you're looking for your next opportunity or searching for top talent, 
              theGarage's AI-powered platform helps you succeed faster with smart queues and real-time insights.
            </Text>

            <View style={styles.heroStats}>
              <View style={styles.heroStat}>
                <LinearGradient
                  colors={['#3b82f6', '#1d4ed8']}
                  style={styles.heroStatIcon}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                >
                  <Ionicons name="people" size={16} color={theme.colors.text.inverse} />
                </LinearGradient>
                <Text style={[styles.heroStatText, { color: theme.colors.text.secondary }]}>
                  89,234+ Job Seekers
                </Text>
              </View>
              
              <View style={styles.heroStat}>
                <LinearGradient
                  colors={theme.colors.background.gradient.orange as any}
                  style={styles.heroStatIcon}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                >
                  <Ionicons name="business" size={16} color={theme.colors.text.inverse} />
                </LinearGradient>
                <Text style={[styles.heroStatText, { color: theme.colors.text.secondary }]}>
                  8,456+ Recruiters
                </Text>
              </View>
            </View>

            <View style={styles.heroButtons}>
              <Button
                title="Start Tracking Jobs Free"
                onPress={onGetStarted}
                variant="primary"
                size="large"
                style={styles.heroButtonPrimary}
                icon={<Ionicons name="arrow-forward" size={20} color={theme.colors.text.inverse} />}
              />
              <Button
                title="Watch Demo"
                onPress={() => {}}
                variant="outline"
                size="large"
                style={styles.heroButtonSecondary}
                icon={<Ionicons name="play" size={20} color={theme.colors.primary.orange} />}
              />
            </View>
          </View>
        </LinearGradient>

        {/* Features Section */}
        <View style={styles.featuresSection}>
          <View style={styles.sectionHeader}>
            <Text style={[styles.sectionTitle, { color: theme.colors.text.primary }]}>
              Why theGarage?
            </Text>
            <Text style={[styles.sectionDescription, { color: theme.colors.text.secondary }]}>
              The only platform designed for both job seekers and recruiters
            </Text>
          </View>

          <View style={styles.featuresGrid}>
            {features.map((feature, index) => (
              <Card key={index} style={styles.featureCard} variant="elevated">
                <LinearGradient
                  colors={theme.colors.background.gradient.orange as any}
                  style={styles.featureIcon}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                >
                  <Ionicons 
                    name={feature.icon as any} 
                    size={24} 
                    color={theme.colors.text.inverse} 
                  />
                </LinearGradient>
                
                <Text style={[styles.featureTitle, { color: theme.colors.text.primary }]}>
                  {feature.title}
                </Text>
                
                <Text style={[styles.featureDescription, { color: theme.colors.text.secondary }]}>
                  {feature.description}
                </Text>
                
                <View style={styles.featureHighlight}>
                  <View style={[styles.featureHighlightDot, { backgroundColor: theme.colors.primary.orange }]} />
                  <Text style={[styles.featureHighlightText, { color: theme.colors.primary.orange }]}>
                    {feature.highlight}
                  </Text>
                </View>
              </Card>
            ))}
          </View>
        </View>

        {/* Testimonials Section */}
        <LinearGradient
          colors={['#f8fafc', '#fff5f2']}
          style={styles.testimonialsSection}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        >
          <View style={styles.sectionHeader}>
            <Text style={[styles.sectionTitle, { color: theme.colors.text.primary }]}>
              Loved by professionals everywhere
            </Text>
            <Text style={[styles.sectionDescription, { color: theme.colors.text.secondary }]}>
              See what our users are saying about theGarage
            </Text>
          </View>

          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.testimonialsScroll}
          >
            {testimonials.map((testimonial, index) => (
              <Card key={index} style={styles.testimonialCard} variant="elevated">
                <View style={styles.testimonialStars}>
                  {renderStars(testimonial.rating)}
                </View>
                
                <Text style={[styles.testimonialQuote, { color: theme.colors.text.primary }]}>
                  "{testimonial.quote}"
                </Text>
                
                <View style={styles.testimonialAuthor}>
                  <Text style={[styles.testimonialAuthorName, { color: theme.colors.text.primary }]}>
                    {testimonial.author}
                  </Text>
                  <Text style={[styles.testimonialAuthorRole, { color: theme.colors.text.secondary }]}>
                    {testimonial.role}
                  </Text>
                </View>
              </Card>
            ))}
          </ScrollView>
        </LinearGradient>

        {/* CTA Section */}
        <View style={styles.ctaSection}>
          <LinearGradient
            colors={theme.colors.background.gradient.orange as any}
            style={styles.ctaGradient}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
          >
            <Text style={[styles.ctaTitle, { color: theme.colors.text.inverse }]}>
              Ready to transform your career?
            </Text>
            <Text style={[styles.ctaDescription, { color: theme.colors.text.inverse }]}>
              Join thousands of professionals who have found success with theGarage
            </Text>
            <Button
              title="Get Started - It's Free"
              onPress={onGetStarted}
              variant="secondary"
              size="large"
              style={styles.ctaButton}
            />
          </LinearGradient>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  header: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#e2e8f0',
  },
  headerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  logoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  logoIcon: {
    width: 32,
    height: 32,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 8,
  },
  logoText: {
    flexDirection: 'row',
  },
  logoTextPrimary: {
    fontSize: 20,
    fontWeight: '600',
  },
  logoTextAccent: {
    fontSize: 20,
    fontWeight: '600',
  },
  headerButtons: {
    flexDirection: 'row',
    gap: 12,
  },
  menuButton: {
    padding: 8,
  },
  mobileMenu: {
    paddingVertical: 16,
    paddingHorizontal: 16,
    borderTopWidth: 1,
    borderTopColor: '#e2e8f0',
  },
  mobileMenuButton: {
    marginBottom: 8,
  },
  scrollView: {
    flex: 1,
  },
  heroSection: {
    paddingHorizontal: 16,
    paddingVertical: 80,
    alignItems: 'center',
  },
  heroContent: {
    maxWidth: 600,
    alignItems: 'center',
  },
  heroBadge: {
    backgroundColor: '#fff5f2',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    marginBottom: 24,
  },
  heroBadgeText: {
    fontSize: 14,
    fontWeight: '500',
  },
  heroTitle: {
    fontSize: Platform.OS === 'web' ? 48 : 36,
    fontWeight: '600',
    textAlign: 'center',
    lineHeight: Platform.OS === 'web' ? 56 : 44,
    marginBottom: 16,
  },
  heroDescription: {
    fontSize: 18,
    lineHeight: 28,
    textAlign: 'center',
    marginBottom: 32,
  },
  heroStats: {
    flexDirection: 'row',
    gap: 32,
    marginBottom: 32,
  },
  heroStat: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  heroStatIcon: {
    width: 32,
    height: 32,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  heroStatText: {
    fontSize: 14,
  },
  heroButtons: {
    flexDirection: Platform.OS === 'web' ? 'row' : 'column',
    gap: 12,
    width: '100%',
    alignItems: 'center',
  },
  heroButtonPrimary: {
    minWidth: Platform.OS === 'web' ? 'auto' : '100%',
  },
  heroButtonSecondary: {
    minWidth: Platform.OS === 'web' ? 'auto' : '100%',
  },
  featuresSection: {
    paddingHorizontal: 16,
    paddingVertical: 80,
  },
  sectionHeader: {
    alignItems: 'center',
    marginBottom: 48,
  },
  sectionTitle: {
    fontSize: 32,
    fontWeight: '600',
    textAlign: 'center',
    marginBottom: 16,
  },
  sectionDescription: {
    fontSize: 18,
    textAlign: 'center',
    maxWidth: 500,
  },
  featuresGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: 24,
  },
  featureCard: {
    width: Platform.OS === 'web' ? 280 : screenWidth - 64,
    maxWidth: 280,
    padding: 24,
    alignItems: 'center',
  },
  featureIcon: {
    width: 64,
    height: 64,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  featureTitle: {
    fontSize: 20,
    fontWeight: '600',
    textAlign: 'center',
    marginBottom: 12,
  },
  featureDescription: {
    fontSize: 14,
    lineHeight: 20,
    textAlign: 'center',
    marginBottom: 16,
  },
  featureHighlight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  featureHighlightDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  featureHighlightText: {
    fontSize: 12,
    fontWeight: '500',
  },
  testimonialsSection: {
    paddingVertical: 80,
  },
  testimonialsScroll: {
    paddingHorizontal: 16,
    gap: 24,
  },
  testimonialCard: {
    width: 300,
    padding: 24,
  },
  testimonialStars: {
    flexDirection: 'row',
    gap: 4,
    marginBottom: 16,
  },
  testimonialQuote: {
    fontSize: 16,
    lineHeight: 24,
    marginBottom: 16,
    fontStyle: 'italic',
  },
  testimonialAuthor: {
    borderTopWidth: 1,
    borderTopColor: '#e2e8f0',
    paddingTop: 16,
  },
  testimonialAuthorName: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 4,
  },
  testimonialAuthorRole: {
    fontSize: 12,
  },
  ctaSection: {
    paddingHorizontal: 16,
    paddingVertical: 40,
  },
  ctaGradient: {
    borderRadius: 16,
    padding: 48,
    alignItems: 'center',
  },
  ctaTitle: {
    fontSize: 28,
    fontWeight: '600',
    textAlign: 'center',
    marginBottom: 16,
  },
  ctaDescription: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 32,
    opacity: 0.9,
  },
  ctaButton: {
    backgroundColor: '#ffffff',
    borderColor: '#ffffff',
  },
});