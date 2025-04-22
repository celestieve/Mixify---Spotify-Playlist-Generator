// this is mostly code from Gemini right now, 
const express = require('express');
const dotenv = require('dotenv');
const SpotifyWebApi = require('spotify-web-api-node');
const cors = require('cors');
const path = require('path');

dotenv.config();

// Debug: load env
console.log('--- Spotify ENV ---');
console.log('CLIENT_ID:', process.env.CLIENT_ID ? '✔️ loaded' : '❌ missing');
console.log('CLIENT_SECRET:', process.env.CLIENT_SECRET ? '✔️ loaded' : '❌ missing');
console.log('-------------------');

const app = express();
const port = process.env.PORT || 8888;

app.use(cors());

// Serve static files from the root directory (where index.html and CSS are)
app.use(express.static(path.join(__dirname, '..'))); // Assuming spotify-backend is one level down

// Root route for sanity check
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

// Start the server
app.listen(port, () => {
    console.log(`Server listening on port ${port}`);
});