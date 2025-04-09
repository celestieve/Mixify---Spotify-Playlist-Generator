require('dotenv').config();
const express = require('express');
const SpotifyWebApi = require('spotify-web-api-node');
const app = express();

// Initialize Spotify API with your credentials
const spotifyApi = new SpotifyWebApi({
  clientId: process.env.CLIENT_ID,
  clientSecret: process.env.CLIENT_SECRET,
  redirectUri: process.env.REDIRECT_URI
});

// Step 1: Redirect to Spotify for user login
app.get('/login', (req, res) => {
  const authorizeURL = spotifyApi.createAuthorizeURL(['user-read-private', 'playlist-modify-public', 'playlist-modify-private'], 'state');
  res.redirect(authorizeURL);
});

// Step 2: Handle the callback from Spotify
app.get('/callback', (req, res) => {
  const code = req.query.code;

  // Retrieve an access token using the code
  spotifyApi.authorizationCodeGrant(code).then(data => {
    const { access_token, refresh_token } = data.body;
    spotifyApi.setAccessToken(access_token);
    spotifyApi.setRefreshToken(refresh_token);

    res.send('Logged in to Spotify!');
  }).catch(err => {
    console.log('Error getting tokens:', err);
    res.send('Error during authentication.');
  });
});

// Start the Express server
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});