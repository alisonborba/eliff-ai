# Eliff AI - Legal Mediation Platform

## 🚀 Tech Stack

- **Framework**: Next.js 15.4.4 (App Router)
- **UI Library**: Chakra UI v3.23.0
- **Database**: PostgreSQL + Prisma ORM 6.12.0
- **File Storage**: Vercel Blob
- **Form Handling**: React Hook Form + Zod validation
- **HTTP Client**: Axios
- **Email**: Resend
- **Deployment**: Vercel

## 📦 Core Features

### Dashboard & Analytics

- Real-time case statistics (total, active, resolved, unresolved)
- Case type distribution with percentages
- Advanced filtering by category, status, and search terms
- Responsive grid layout with color-coded metrics

### Case Management

- Multi-step case creation with dynamic form validation
- Legal status tracking (PENDING_IN_COURT, PENDING_IN_POLICE, NOT_REGISTERED)
- Conditional form fields based on legal status
- File upload support (images, videos, documents)
- Witness management system

### User Management

- User registration with address validation
- Role-based access (claimant vs opposite party)
- Profile management with photo uploads

### File System

- Multi-file upload with progress tracking
- Vercel Blob integration for cloud storage
- File type validation and preview
- Drag-and-drop interface

## 🏗️ Architecture

### Database Schema

```prisma
User {
  id, name, email, phone, birthday, gender
  address: Address? (one-to-one)
  submittedCases: Case[] (one-to-many)
  receivedCases: Case[] (one-to-many)
}

Case {
  id, caseType, description, status
  legalStatus, legalExtraInfo
  proofFiles: String[] (URLs)
  claimant: User, oppositeParty: User
  witnesses: Witness[]
  panel: MediationPanel?
}

Witness { id, name, contact, caseId }
MediationPanel { id, lawyerId, religiousId, communityRepId }
```

### API Structure

```
/api/
├── users/          # User CRUD operations
├── cases/          # Case management
├── cases/[id]/     # Individual case operations
└── upload/         # File upload handling
```

### Component Architecture

```
components/
├── Navigation.tsx      # Main navigation with sidebar
├── Upload.tsx          # Single file upload
├── MultiUpload.tsx     # Multi-file upload with progress
├── Badge.tsx           # Status/category badges
├── UserCard.tsx        # User display component
├── UserDatailsCard.tsx # Detailed user information
└── ui/
    ├── provider.tsx    # Chakra UI provider
    ├── color-mode.tsx  # Theme management
    ├── toaster.tsx     # Notification system
    └── tooltip.tsx     # Tooltip component
```

## 🛠️ Development Setup

### Prerequisites

- Node.js 18+
- PostgreSQL database
- Vercel account (for Blob storage)

### Environment Variables

```env
DATABASE_URL="postgresql://user:pass@host:port/db"
BLOB_READ_WRITE_TOKEN="vercel_blob_token"
```

### Installation

```bash
# Install dependencies
npm install

# Generate Prisma client
npx prisma generate

# Push database schema
npx prisma db push

# Start development server
npm run dev
```

## 📋 Available Scripts

```bash
npm run dev          # Development server
npm run build        # Production build
npm run start        # Production server
npm run lint         # ESLint check
npm run lint:fix     # Auto-fix linting issues
npm run format       # Prettier formatting
npm run format:check # Check formatting
```

## 🔧 Key Implementation Details

### Form Validation

- Zod schemas for type-safe validation
- React Hook Form for efficient form state management
- Conditional validation based on case type and legal status

### State Management

- React hooks for local state
- useMemo for expensive calculations (dashboard stats, filtering)
- Optimistic updates for better UX

### File Upload System

- Chunked uploads for large files
- Progress tracking with visual indicators
- Error handling with retry mechanisms
- File type validation and size limits

### Dashboard Analytics

- Real-time statistics calculation
- Responsive grid layouts
- Color-coded status indicators
- Advanced filtering with multiple criteria

### Database Operations

- Prisma ORM for type-safe queries
- Optimized includes for related data
- Transaction support for complex operations
- Error handling with proper rollbacks

## 🚀 Deployment

### Vercel Configuration

```json
{
  "buildCommand": "prisma generate && next build",
  "installCommand": "npm install",
  "framework": "nextjs",
  "maxDuration": 30
}
```

### Build Process

1. Prisma client generation
2. TypeScript compilation
3. Next.js build optimization
4. Static asset optimization

## 🔍 Code Quality

### Linting & Formatting

- ESLint with Next.js configuration
- Prettier for consistent formatting
- TypeScript strict mode enabled
- Pre-commit hooks for code quality

### Type Safety

- Full TypeScript coverage
- Prisma-generated types
- Zod runtime validation
- Strict null checks

## 📊 Performance Optimizations

- Next.js 15 App Router optimizations
- Chakra UI v3 CSS-in-JS optimizations
- Prisma query optimization
- Image optimization with Next.js
- Lazy loading for components
- Memoization for expensive calculations

## 🔐 Security Features

- Input validation with Zod
- SQL injection prevention (Prisma ORM)
- File upload security (type/size validation)
- Environment variable protection
- CORS configuration
- Rate limiting (Vercel)

## 📱 Responsive Design

- Mobile-first approach
- Chakra UI responsive utilities
- Flexible grid systems
- Touch-friendly interfaces
- Progressive enhancement

## 🐛 Troubleshooting

### Common Issues

```bash
# Database connection
npx prisma db push

# Type errors
npx prisma generate

# Build issues
npm run build

# Format issues
npm run format
```

### Development Tips

- Use `npm run lint:fix` for automatic fixes
- Check TypeScript errors with `npx tsc --noEmit`
- Monitor build logs for optimization opportunities
- Use React DevTools for component debugging
