# Baník Ostrava Quiz Application

## Overview

This is a full-stack web application featuring a true/false quiz about Baník Ostrava, a Czech football club. The application consists of a React frontend with shadcn/ui components and an Express.js backend, using PostgreSQL with Drizzle ORM for data persistence. The quiz includes 30 questions about the football club's history, achievements, and notable facts.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

The application follows a modern full-stack architecture with clear separation between frontend and backend components:

- **Frontend**: React with TypeScript, using Vite as the build tool
- **Backend**: Express.js server with TypeScript
- **Database**: PostgreSQL with Drizzle ORM
- **UI Framework**: shadcn/ui components with Radix UI primitives
- **Styling**: Tailwind CSS with custom theming
- **State Management**: React Query for server state management

## Key Components

### Frontend Architecture
- **React Router**: Uses Wouter for client-side routing
- **Component Structure**: Built with shadcn/ui components providing a consistent design system
- **State Management**: React Query handles API calls and caching
- **Quiz Logic**: Manages quiz state including current question, score, and game flow
- **Responsive Design**: Mobile-first approach with Tailwind CSS

### Backend Architecture
- **Express Server**: RESTful API endpoints for quiz functionality
- **Database Layer**: Drizzle ORM with PostgreSQL for data persistence
- **Storage Interface**: Abstracted storage layer with in-memory fallback
- **API Structure**: Clean separation of routes and business logic

### Database Schema
- **users**: Basic user information (id, username, password)
- **quiz_questions**: Quiz questions with text and boolean answers
- **quiz_sessions**: Records of completed quiz attempts with scores

## Data Flow

1. **Quiz Initialization**: Frontend fetches questions from `/api/quiz/questions`
2. **Question Display**: Questions are presented one at a time with True/False options
3. **Answer Processing**: User selections are validated against correct answers
4. **Progress Tracking**: Visual progress bar shows completion status
5. **Session Storage**: Completed quiz sessions are saved via `/api/quiz/sessions`
6. **Results Display**: Final score and statistics are shown to the user

## External Dependencies

### Frontend Dependencies
- **React Ecosystem**: React 18 with TypeScript support
- **UI Components**: Extensive shadcn/ui component library with Radix UI primitives
- **Styling**: Tailwind CSS with custom CSS variables for theming
- **HTTP Client**: React Query with built-in fetch for API communication
- **Icons**: Lucide React for consistent iconography

### Backend Dependencies
- **Web Framework**: Express.js for HTTP server functionality
- **Database**: Neon Database (PostgreSQL) with Drizzle ORM
- **Validation**: Zod for runtime type validation
- **Development**: TSX for TypeScript execution in development

## Deployment Strategy

### Build Process
- **Frontend**: Vite builds React application to `dist/public`
- **Backend**: ESBuild bundles TypeScript server code to `dist/index.js`
- **Database**: Drizzle migrations handle schema updates

### Environment Configuration
- Database connection via `DATABASE_URL` environment variable
- Development and production modes with appropriate optimizations
- Static file serving for production builds

### Development Workflow
- Hot module replacement for frontend development
- TypeScript compilation checking
- Database schema synchronization with `db:push` command

The application is designed to be easily deployable to platforms like Replit, with proper environment variable configuration and build processes that work in containerized environments.