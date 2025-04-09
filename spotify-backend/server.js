const express = require('express');
const dotenv = require('dotenv');
const SpotifyWebApi = require('spotify-web-api-node'); // Import Spotify API library
dotenv.config();  // Load environment variables from .env file

const app = express();
const PORT = credentials.env.PORT || 3000;

// Initialize Spotify API with your credentials
const spotifyApi = new SpotifyWebApi({
  clientId: process.env.CLIENT_ID,
  clientSecret: process.env.CLIENT_SECRET,
  redirectUri: process.env.REDIRECT_URI
});

// Simple route to check the server
app.get('/', (req, res) => {
  res.send('Spotify API Backend is running!');
});

// Step 1: Redirect to Spotify for user login
app.get('/login', (req, res) => {
  const authorizeURL = spotifyApi.createAuthorizeURL(
    ['user-read-private', 'playlist-modify-public', 'playlist-modify-private'], // Scopes for access
    'state'
  );
  res.redirect(authorizeURL);
});

// Step 2: Handle the callback from Spotify
app.get('/callback', (req, res) => {
  const code = req.query.code; // Get the authorization code from the query string

  // Use the code to get an access token
  spotifyApi.authorizationCodeGrant(code)
    .then(data => {
      const { access_token, refresh_token } = data.body;
      spotifyApi.setAccessToken(access_token);  // Set the access token
      spotifyApi.setRefreshToken(refresh_token); // Set the refresh token

      res.send('Logged in to Spotify!');
    })
    .catch(err => {
      console.log('Error getting tokens:', err);
      res.send('Error during authentication.');
    });
});

// Start the Express server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});