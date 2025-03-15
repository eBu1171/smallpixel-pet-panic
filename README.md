# Pixel Pet Panic: AI Edition

A fun arcade game where you control a cute AI pet that must collect food while avoiding stressors. Features a global leaderboard system powered by Supabase.

## How to Play

- Use the UP and DOWN arrow keys to move your pet
- Collect food (burgers and pizza) to gain energy
- Avoid stressors (books and clocks) that drain energy
- Your pet's mood changes randomly, affecting gameplay
- The game gets progressively harder as you play
- Submit your score to the global leaderboard when you lose

## Setting Up the Supabase Backend

To enable the leaderboard functionality, you need to set up a Supabase project:

1. **Create a Supabase Account**
   - Go to [supabase.com](https://supabase.com/) and sign up for a free account
   - Create a new project with any name (e.g., "pixel-pet-panic")

2. **Create the Leaderboard Table**
   - In your Supabase dashboard, go to the "SQL Editor" section
   - Create a new query and paste the following SQL:

```sql
-- Create the leaderboard table
CREATE TABLE leaderboard (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  player_name TEXT NOT NULL,
  score INTEGER NOT NULL,
  difficulty_reached INTEGER,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE leaderboard ENABLE ROW LEVEL SECURITY;

-- Create policy to allow anyone to read leaderboard entries
CREATE POLICY "Anyone can read leaderboard" 
  ON leaderboard 
  FOR SELECT 
  USING (true);

-- Create policy to allow anyone to insert scores
CREATE POLICY "Anyone can insert scores" 
  ON leaderboard 
  FOR INSERT 
  WITH CHECK (true);
```

   - Click "Run" to execute the SQL commands

3. **Set Up Your API Keys**
   - Go to the "Settings" section, then "API"
   - Copy your "Project URL" and "anon" key
   - Create a `config.js` file by copying `config.example.js` and replace the placeholder values:

```javascript
// Supabase configuration
const SUPABASE_CONFIG = {
    url: 'https://your-project-id.supabase.co',
    key: 'your-anon-key'
};
```

   - This file is excluded from Git to keep your credentials secure

## Running the Game with a Local Server

Due to CORS restrictions, you need to run the game using a local server rather than opening the HTML file directly. Here are a few ways to do this:

### Using Python

If you have Python installed:

1. Open a terminal/command prompt
2. Navigate to the game directory
3. Run one of these commands:
   - Python 3: `python -m http.server 8000`
   - Python 2: `python -m SimpleHTTPServer 8000`
4. Open your browser and go to `http://localhost:8000`

### Using Node.js

If you have Node.js installed:

1. Install a simple server: `npm install -g http-server`
2. Navigate to the game directory
3. Run: `http-server -p 8000`
4. Open your browser and go to `http://localhost:8000`

### Using VS Code

If you're using Visual Studio Code:

1. Install the "Live Server" extension
2. Right-click on `index.html`
3. Select "Open with Live Server"

### Using the Included Node.js Server

This project includes a simple Node.js server for easy local hosting:

1. Make sure you have Node.js installed
2. Open a terminal/command prompt
3. Navigate to the game directory
4. Run: `node server.js`
5. Open your browser and go to `http://localhost:8000`

## Customizing the Leaderboard

You can customize the leaderboard appearance by modifying the CSS in `index.html`. The leaderboard data is fetched from Supabase and displayed in a table format.

## Troubleshooting

- If you see CORS errors, make sure you're running the game from a proper server, not just opening the HTML file directly
- Check the browser console for any errors related to Supabase connections
- Verify that your Supabase URL and anon key are correctly entered in the code
- If the leaderboard doesn't load, check your Supabase table structure and RLS policies
- If you encounter errors about p5.js functions like `minute()` or `second()`, the game has fallback implementations named `getCurrentMinute()` and `getCurrentSecond()`
- For any text rendering issues, the game uses a custom text wrapping implementation in the speech bubble

## Publishing Your Game

To publish your game online, you have several options:

### GitHub Pages

1. Create a GitHub repository and push your game files
2. Go to repository Settings > Pages
3. Select the branch you want to deploy (usually `main`)
4. Your game will be available at `https://yourusername.github.io/repository-name/`

### Netlify or Vercel

1. Create an account on [Netlify](https://www.netlify.com/) or [Vercel](https://vercel.com/)
2. Connect your GitHub repository or upload your files directly
3. The platform will automatically deploy your game and provide a URL

### Traditional Web Hosting

1. Upload all files to your web hosting service using FTP or their file manager
2. Make sure to maintain the file structure
3. Your game will be available at your domain or subdomain

Remember to update your Supabase configuration with appropriate security settings when publishing your game publicly.

## Credits

- Game developed with p5.js
- Backend powered by Supabase
- Created by [Your Name] # pixel-pet-panic
# gamepixel-pet-panic
# 2dpixel-pet-panic
# smallpixel-pet-panic
