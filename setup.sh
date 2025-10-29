#!/bin/bash

echo "🚀 Setting up InstaMembers Website"
echo "=================================="

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js first."
    exit 1
fi

# Check if npm is installed
if ! command -v npm &> /dev/null; then
    echo "❌ npm is not installed. Please install npm first."
    exit 1
fi

echo "✅ Node.js and npm are installed"

# Install dependencies
echo "📦 Installing dependencies..."
npm install

# Copy data file
echo "📄 Copying data file..."
npm run setup-data

echo ""
echo "🎉 Setup complete!"
echo ""
echo "Next steps:"
echo "1. Create a Supabase project at https://supabase.com"
echo "2. Run the SQL from supabase/schema.sql in your Supabase SQL editor"
echo "3. Create .env.local with your Supabase credentials (see env.example)"
echo "4. Run 'npm run import-data' to import the scraped data"
echo "5. Run 'npm run dev' to start the development server"
echo ""
echo "For detailed instructions, see README.md and DEPLOYMENT.md"
