import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';

import { useTheme } from '../theme/ThemeProvider';
import { Button } from './ui/Button';
import { Card } from './ui/Card';
import { responsive } from '../utils/responsive';

interface RoleSelectorProps {
  onRoleSelect: (role: 'job-seeker' | 'recruiter') => void;
  onBack: () => void;
}

export const RoleSelector: React.FC<RoleSelectorProps> = ({
  onRoleSelect,
  onBack,
}) => {
  const theme = useTheme();

  const roles = [
    {
      id: 'job-seeker',
      title: 'Job Seeker',
      subtitle: 'Find your next opportunity',
      description: 'Join professional queues, track applications, and connect directly with recruiters.',
      icon: 'person',
      color: ['#3b82f6', '#1d4ed8'],
      features: [
        'Smart queue placement',
        'Application tracking',
        'Direct recruiter connections',
        'Real-time notifications',
      ],
    },
    {
      id: 'recruiter',
      title: 'Recruiter',
      subtitle: 'Find top talent faster',
      description: 'Access pre-qualified candidates, manage hiring pipelines, and build your team.',
      icon: 'briefcase',
      color: [theme.colors.primary.orange, theme.colors.primary.orangeLight],
      features: [
        'Candidate queue sourcing',
        'AI-powered matching',
        'Team collaboration',
        'Hiring analytics',
      ],
    },
  ];

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background.primary }]}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={onBack} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color={theme.colors.text.primary} />
        </TouchableOpacity>
        
        <View style={styles.headerContent}>
          <LinearGradient
            colors={[theme.colors.primary.orange, theme.colors.primary.orangeLight]}
            style={styles.logoIcon}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
          >
            <Ionicons name="car" size={20} color={theme.colors.text.inverse} />
          </LinearGradient>
          
          <Text style={[styles.logoText, { color: theme.colors.text.primary }]}>
            <Text style={{ color: theme.colors.text.primary }}>the</Text>
            <Text style={{ color: theme.colors.primary.orange }}>Garage</Text>
          </Text>
        </View>
        
        <View style={styles.headerSpacer} />
      </View>

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <View style={styles.content}>
          {/* Title Section */}
          <View style={styles.titleSection}>
            <Text style={[styles.title, { color: theme.colors.text.primary }]}>
              Welcome to theGarage
            </Text>
            <Text style={[styles.subtitle, { color: theme.colors.text.secondary }]}>
              Choose how you'd like to use our platform
            </Text>
          </View>

          {/* Role Cards */}
          <View style={styles.rolesContainer}>
            {roles.map((role) => (
              <TouchableOpacity
                key={role.id}
                onPress={() => onRoleSelect(role.id as 'job-seeker' | 'recruiter')}
                activeOpacity={0.9}
              >
                <Card style={styles.roleCard} variant="elevated">
                  <LinearGradient
                    colors={role.color as any}
                    style={styles.roleHeader}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                  >
                    <View style={styles.roleIconContainer}>
                      <Ionicons 
                        name={role.icon as any} 
                        size={32} 
                        color={theme.colors.text.inverse} 
                      />
                    </View>
                    <View style={styles.roleTitleContainer}>
                      <Text style={[styles.roleTitle, { color: theme.colors.text.inverse }]}>
                        {role.title}
                      </Text>
                      <Text style={[styles.roleSubtitle, { color: theme.colors.text.inverse }]}>
                        {role.subtitle}
                      </Text>
                    </View>
                    <Ionicons 
                      name="chevron-forward" 
                      size={24} 
                      color={theme.colors.text.inverse} 
                    />
                  </LinearGradient>
                  
                  <View style={styles.roleContent}>
                    <Text style={[styles.roleDescription, { color: theme.colors.text.secondary }]}>
                      {role.description}
                    </Text>
                    
                    <View style={styles.featuresContainer}>
                      {role.features.map((feature, index) => (
                        <View key={index} style={styles.featureItem}>
                          <View style={[styles.featureDot, { backgroundColor: role.color[0] }]} />
                          <Text style={[styles.featureText, { color: theme.colors.text.primary }]}>
                            {feature}
                          </Text>
                        </View>
                      ))}
                    </View>
                    
                    <Button
                      title={`Continue as ${role.title}`}
                      onPress={() => onRoleSelect(role.id as 'job-seeker' | 'recruiter')}
                      variant={role.id === 'job-seeker' ? 'outline' : 'primary'}
                      size="medium"
                      style={{
                        width: '100%',
                        ...(role.id === 'job-seeker' && { borderColor: role.color[0] }),
                      }}
                      textStyle={
                        role.id === 'job-seeker' 
                          ? { color: role.color[0] }
                          : undefined
                      }
                    />
                  </View>
                </Card>
              </TouchableOpacity>
            ))}
          </View>

          {/* Bottom Info */}
          <View style={styles.bottomInfo}>
            <Text style={[styles.bottomInfoText, { color: theme.colors.text.secondary }]}>
              You can always switch between roles later in your account settings.
            </Text>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: responsive.screenPadding(),
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e2e8f0',
  },
  backButton: {
    padding: 8,
    marginRight: 8,
  },
  headerContent: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
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
    fontSize: 20,
    fontWeight: '600',
  },
  headerSpacer: {
    width: 40, // Same width as back button to center logo
  },
  scrollView: {
    flex: 1,
  },
  content: {
    paddingHorizontal: responsive.screenPadding(),
    paddingVertical: 32,
  },
  titleSection: {
    alignItems: 'center',
    marginBottom: 48,
  },
  title: {
    fontSize: responsive.fontSize(32),
    fontWeight: '600',
    textAlign: 'center',
    marginBottom: 12,
  },
  subtitle: {
    fontSize: responsive.fontSize(18),
    textAlign: 'center',
    lineHeight: 26,
  },
  rolesContainer: {
    gap: 24,
    marginBottom: 32,
  },
  roleCard: {
    overflow: 'hidden',
    padding: 0,
  },
  roleHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
  },
  roleIconContainer: {
    width: 56,
    height: 56,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  roleTitleContainer: {
    flex: 1,
  },
  roleTitle: {
    fontSize: responsive.fontSize(20),
    fontWeight: '600',
    marginBottom: 4,
  },
  roleSubtitle: {
    fontSize: responsive.fontSize(14),
    opacity: 0.9,
  },
  roleContent: {
    padding: 20,
  },
  roleDescription: {
    fontSize: responsive.fontSize(16),
    lineHeight: 24,
    marginBottom: 20,
  },
  featuresContainer: {
    marginBottom: 24,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  featureDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    marginRight: 12,
  },
  featureText: {
    fontSize: responsive.fontSize(14),
    flex: 1,
  },
  roleButton: {
    width: '100%',
  },
  bottomInfo: {
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  bottomInfoText: {
    fontSize: responsive.fontSize(14),
    textAlign: 'center',
    lineHeight: 20,
  },
});