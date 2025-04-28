// most of this structure was initially created using prompts with ChatGPT and Gemini 
// Troubleshooting, debugging, curating, and lots of changes were made by me (Levi).
// Lots of functions/concepts from the Spotify API were also used. 

const express = require('express');
const dotenv = require('dotenv');
const SpotifyWebApi = require('spotify-web-api-node');
const cors = require('cors');
const path = require('path');

dotenv.config();

// A simple debugging process to ensure the environment variables are loaded correctly.
console.log('--- Spotify ENV ---');
console.log('CLIENT_ID:', process.env.CLIENT_ID ? '✔️ loaded' : '❌ missing');
console.log('CLIENT_SECRET:', process.env.CLIENT_SECRET ? '✔️ loaded' : '❌ missing');
console.log('-------------------');

const app = express(); // <--- This line is now correctly placed
const port = process.env.PORT || 8888;

app.use(cors());

// Serve static files from the root directory
app.use(express.static(path.join(__dirname, '..')));

// Root route
app.get('/', (req, res) => {
    res.send('✅ Mixify API is running');
});

// Spotify Client Credentials setup
const spotifyApi = new SpotifyWebApi({
    clientId: process.env.CLIENT_ID,
    clientSecret: process.env.CLIENT_SECRET,
});

// Quick auth check on startup
spotifyApi.clientCredentialsGrant()
    .then(data => {
        console.log('✅ Spotify auth OK – token expires in', data.body.expires_in, 'seconds');
    })
    .catch(err => {
        console.error('❌ Spotify auth FAILED:', err.message || err);
    });

// Middleware: ensure a valid access token
let tokenExpiration = 0;
async function ensureToken(req, res, next) {
    console.log('ensureToken: currentToken?', !!spotifyApi.getAccessToken());
    const now = Date.now();
    if (!spotifyApi.getAccessToken() || now > tokenExpiration) {
        console.log('ensureToken: retrieving new token...');
        try {
            const data = await spotifyApi.clientCredentialsGrant();
            console.log('🎫 New token retrieved:', data.body.access_token.substring(0, 10) + '...');
            spotifyApi.setAccessToken(data.body.access_token);
            tokenExpiration = now + data.body.expires_in * 1000;
            console.log('ensureToken: tokenExpiration at', new Date(tokenExpiration).toISOString());
        } catch (err) {
            console.error('Error retrieving Spotify token in ensureToken:', err);
            return res.status(500).json({ error: 'Failed to authenticate with Spotify', details: err.message });
        }
    } else {
        console.log('ensureToken: existing token still valid');
    }
    next();
}
app.use(ensureToken);

// Endpoint to search for tracks by genre (accepts 'genre' as a query parameter)
app.get('/api/search/tracks', async (req, res) => {
    const genre = req.query.genre; // Get the genre from the query parameters

    if (!genre) {
        return res.status(400).json({ error: 'Please provide a genre in the query parameters (e.g., /api/search/tracks?genre=pop)' });
    }

    try {
        const searchQuery = `genre:${genre}`;
        const data = await spotifyApi.search(searchQuery, ['track'], { limit: 10 }); // Search for 'track' type

        console.log('--- Spotify API Response Data ---');
        console.log(JSON.stringify(data, null, 2)); // Log the entire data object

        const tracks = data.body.tracks.items.map(item => ({
            id: item.id,
            name: item.name,
            artists: item.artists.map(artist => artist.name),
            album: item.album.name,
            albumArt: item.album.images.length > 0 ? item.album.images[0].url : null,
            previewUrl: item.preview_url,
        }));
        res.json(tracks);
        console.log(`✅ Sent 10 tracks for genre: ${genre} (using search endpoint)`);
    } catch (error) {
        console.error(`❌ Error searching for ${genre} tracks (using search endpoint):`, error);
        res.status(500).json({ error: `Failed to retrieve ${genre} tracks from Spotify (using search endpoint)`, details: error.message });
    }
});

// Start the server
app.listen(port, () => {
    console.log(`Server listening on port ${port}`);
});