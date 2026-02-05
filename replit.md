# theGarage - Replit Agent Guide

## Overview

theGarage is a dual-perspective job application platform that serves both job seekers and recruiters through a unified React/TypeScript web application. The platform features a distinctive brand identity with "the" in slate and "Garage" in orange (#ff6b35), offering Kanban-style job tracking, smart queue placement, role-based dashboards, and enterprise team management capabilities.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Framework
- **React 18 with TypeScript** - Core UI framework
- **Vite** - Build tool and dev server for fast development
- **Tailwind CSS v4** - Utility-first styling with custom theGarage brand colors
- **shadcn/ui + Radix UI** - Pre-built accessible component library

### State Management
- React hooks (useState, useEffect) for local component state
- Custom navigation state management instead of React Router
- View-based routing through a central ViewRenderer component

### Component Architecture
- **ViewRenderer** - Central routing component that renders views based on state
- **AppHeader** - Unified navigation header with role-based menu items
- Role-specific components for job seekers vs recruiters vs enterprise admins
- Modular feature components (JobTracker, CandidateManagement, TeamManagement, etc.)

### Authentication Flow
- Mock authentication with demo profiles for testing
- Role selector (Job Seeker / Recruiter) at login
- Role-based view rendering after authentication
- Enterprise admin dashboard for organization management

### Key Design Patterns
1. **Dual-Perspective Architecture** - Separate but interconnected experiences for job seekers and recruiters
2. **Role-Based Access Control** - Different features/views based on user role (regular recruiter, manager, lead, hiring manager, admin)
3. **Approval Workflows** - Job postings go through manager approval before publishing
4. **Kanban Interface** - Drag-and-drop style tracking for applications and candidates

### Brand Colors (CSS Variables)
- Primary Orange: #ff6b35
- Orange Light: #ff8c42
- Ocean Blue: #0f172a
- Background: #f8fafc

## External Dependencies

### UI Component Libraries
- **@radix-ui/react-*** - Full suite of accessible primitives (dialog, dropdown, select, tabs, etc.)
- **lucide-react** - Icon library
- **framer-motion** - Animation library
- **class-variance-authority** - Component variant management
- **cmdk** - Command menu component
- **embla-carousel-react** - Carousel functionality

### Build & Development
- **@vitejs/plugin-react-swc** - Fast React compilation
- **TypeScript** - Type checking
- **autoprefixer** - CSS processing

### Additional Features
- **sonner** - Toast notifications
- **recharts** - Data visualization
- **react-day-picker** - Date selection
- **input-otp** - OTP input handling

### External Services (To Be Integrated)
- Authentication provider (currently mocked)
- Database for user/job data (currently uses mock data)
- File storage for resumes and documents
- Email service for notifications