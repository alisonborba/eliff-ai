# Eliff App - Mediation System

This is a Next.js project with Prisma ORM for a mediation system.

## Features

- User management
- Case management
- Mediation panel creation
- File upload support
- Real-time status tracking

## Tech Stack

- **Frontend**: Next.js 15, React 19, TypeScript
- **UI**: Chakra UI v3
- **Database**: PostgreSQL with Prisma ORM
- **File Storage**: Vercel Blob
- **Deployment**: Vercel

## Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn
- PostgreSQL database

### Installation

1. Clone the repository:

```bash
git clone <repository-url>
cd eliff-ai
```

2. Install dependencies:

```bash
npm install
```

3. Set up environment variables:
   Make sure the `.env` file contains the database credentials:

```env
DATABASE_URL="postgres://qwert:qwert@db.prisma.io:5432/?sslmode=require"
BLOB_READ_WRITE_TOKEN="your_vercel_blob_token"
```

4. Set up the database:

```bash
npx prisma generate
npx prisma db push
```

5. Run the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the application.

## API Documentation

### User API

#### List users

```http
GET /api/users
```

#### Create user

```http
POST /api/users
Content-Type: application/json

{
  "name": "John Doe",
  "birthday": "1990-01-01",
  "gender": "Male",
  "email": "john@email.com",
  "phone": "+1234567890",
  "address": {
    "street": "123 Main St",
    "city": "New York",
    "zipCode": "10001"
  }
}
```

### Case API

#### List cases

```http
GET /api/cases
```

#### Create case

```http
POST /api/cases
Content-Type: application/json

{
  "caseType": "FAMILY",
  "description": "Case description",
  "courtStatus": "PENDING_IN_COURT",
  "courtCaseNumber": "CASE-001",
  "courtName": "District Court",
  "claimantId": "user-id",
  "oppositePartyId": "opposite-party-id"
}
```

#### Get case by ID

```http
GET /api/cases/{id}
```

## Project Structure

```
eliff-ai/
├── app/
│   ├── api/
│   │   ├── upload/route.ts         # File upload API
│   │   ├── users/route.ts          # User API
│   │   └── cases/route.ts          # Case API
│   ├── case/
│   │   ├── page.tsx                # Create case page
│   │   └── [id]/page.tsx           # Case details page
│   ├── cases/page.tsx              # Cases list page
│   ├── users/page.tsx              # Users list page
│   └── page.tsx                    # Home page
├── components/
│   ├── Navigation.tsx              # Navigation component
│   ├── Upload.tsx                  # File upload component
│   └── ui/                         # UI components
├── lib/
│   ├── prisma.ts                   # Prisma client
│   └── database.ts                 # Database functions
├── prisma/
│   └── schema.prisma               # Database schema
└── public/                         # Static files
```

## Database Schema

### User Model

- Personal information (name, email, phone, etc.)
- Address (one-to-one relationship)
- Submitted and received cases (one-to-many relationships)

### Case Model

- Case type and description
- Court information
- Complete address (street, city, zip code)
- Witnesses and proof files

### File Model

- Proof files (images, videos, audio)

### Witness Model

- Witness information

### MediationPanel Model

- Panel members (lawyer, religious, community representative)

## Development

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint
- `npm run format` - Format code with Prettier

### Code Style

The project uses:

- ESLint for code linting
- Prettier for code formatting
- TypeScript for type safety

## Troubleshooting

### Connection Error

If you encounter database connection errors, check:

- Database URL in `.env` file
- Network connectivity
- Database server status

### Migration Error

If Prisma migrations fail:

```bash
npx prisma migrate reset
npx prisma db push
```

### Type Error

If TypeScript errors occur:

```bash
npm run build
```

## Security Notes

1. **Security**: Never commit the `.env` file to the repository
2. **Environment Variables**: Use environment variables for sensitive data
3. **Input Validation**: Always validate user input
4. **Error Handling**: Implement proper error handling

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

This project is licensed under the MIT License.

## Support

For support, please contact the development team or create an issue in the repository.
