// Load environment variables from .env file
// Note: In a real production environment, you'd use a proper build tool like Webpack
// with dotenv to handle environment variables

// For this simple example, we'll just expose the variables directly
// WARNING: In a real app, don't expose your Supabase keys directly in client-side code
// Use a backend API or serverless functions instead

const SUPABASE_URL = 'https://your-project-id.supabase.co'; // Replace with your actual URL
const SUPABASE_ANON_KEY = 'your-supabase-anon-key'; // Replace with your actual key

// Export the variables
export { SUPABASE_URL, SUPABASE_ANON_KEY };
