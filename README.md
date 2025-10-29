# InstaMembers - Colony Directory

A Next.js website that replicates the functionality of instamembers.appspot.com, providing a searchable directory of Hutterite colonies with contact information and locations.

## Features

- 🔍 **Search Functionality**: Search colonies by name or location
- 📞 **Contact Information**: Switchboard, Manager, Minister, Postal Address, School contacts
- 📍 **Location Data**: Latitude, longitude, and formatted coordinates
- 📱 **Responsive Design**: Works on desktop and mobile devices
- 🗄️ **Supabase Database**: Scalable PostgreSQL database with real-time capabilities

## Tech Stack

- **Frontend**: Next.js 16, React 19, TypeScript
- **Styling**: Tailwind CSS
- **Database**: Supabase (PostgreSQL)
- **Icons**: Lucide React
- **Deployment**: Vercel (recommended)

## Setup Instructions

### 1. Supabase Credentials

Create a `.env.local` file with:

```bash
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
```

Use the values from Supabase project Settings > API. The service role key is required for the import script and must never be exposed to the browser.

### 2. Database Setup

1. Create a new Supabase project at [supabase.com](https://supabase.com)
2. Run the SQL schema from `supabase/schema.sql` in your Supabase SQL editor
3. This will create the `colonies` and `contacts` tables with proper relationships

### 3. Install Dependencies

```bash
npm install
```

### 4. Import Data

Copy the `all_colony_data_improved.json` file from the parent directory to the website root, then run:

```bash
npm run import-data
```

This will import all 627 colonies and their contact information into your Supabase database.

### 5. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the website.

## Database Schema

### Colonies Table
- `id` (UUID, Primary Key)
- `name` (VARCHAR) - Colony name
- `location` (VARCHAR) - Province/State code (e.g., "SK", "MB", "AB")
- `latitude` (DECIMAL) - GPS latitude
- `longitude` (DECIMAL) - GPS longitude
- `coordinates` (VARCHAR) - Formatted coordinates string
- `created_at` (TIMESTAMP)
- `updated_at` (TIMESTAMP)

### Contacts Table
- `id` (UUID, Primary Key)
- `colony_id` (UUID, Foreign Key to colonies)
- `contact_type` (VARCHAR) - Type: 'switchboard', 'manager', 'minister', 'postal', 'school'
- `name` (VARCHAR) - Contact person name
- `phone` (VARCHAR) - Phone number
- `fax` (VARCHAR) - Fax number
- `email` (VARCHAR) - Email address
- `street` (VARCHAR) - Street address
- `city` (VARCHAR) - City name
- `zip_code` (VARCHAR) - Postal/ZIP code
- `extensions` (VARCHAR) - Phone extensions info
- `tollfree` (VARCHAR) - Toll-free number
- `created_at` (TIMESTAMP)
- `updated_at` (TIMESTAMP)

## Features Overview

### Homepage
- Search bar for finding colonies
- Statistics dashboard showing total colonies, success rate, etc.
- List of all colonies with key contact information
- Responsive grid layout

### Colony Detail Page
- **Contacts Tab**: Detailed contact information organized by type
  - Switchboard with phone numbers and extensions
  - Manager with name, phone, and fax
  - Minister with name and contact info
  - Postal address with street, city, zip code
  - School with phone and fax numbers
- **Location Tab**: GPS coordinates and map integration
  - Latitude and longitude display
  - Formatted coordinates
  - Direct link to Google Maps

### Search Functionality
- Real-time search as you type
- Searches both colony names and locations
- Case-insensitive matching
- Instant results filtering

## Deployment

### Vercel (Recommended)

1. Push your code to GitHub
2. Connect your repository to Vercel
3. Add environment variables in Vercel dashboard
4. Deploy automatically

### Other Platforms

The app can be deployed to any platform that supports Next.js:
- Netlify
- Railway
- DigitalOcean App Platform
- AWS Amplify

## Data Import

The import script (`scripts/import-data.js`) processes the scraped data and:
- Creates colony records with location data
- Organizes contact information by type
- Handles multiple phone numbers per contact type
- Preserves all original data structure

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is for educational and research purposes.