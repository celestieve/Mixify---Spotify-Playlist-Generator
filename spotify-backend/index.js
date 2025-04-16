const express = require('express');
const dotenv = require('dotenv');
const SpotifyWebApi = require('spotify-web-api-node');
const cors = require('cors');

dotenv.config();
const app = express();
app.use(cors());

app.get('/', (req, res) => {
  res.send('🎧 Welcome to the Spotify Backend!');
});

const spotifyApi = new SpotifyWebApi({
  clientId: process.env.CLIENT_ID,
  clientSecret: process.env.CLIENT_SECRET,
  redirectUri: process.env.REDIRECT_URI,
});

app.get('/login', (req, res) => {
  const scopes = ['playlist-modify-public', 'playlist-modify-private'];
  const authUrl = spotifyApi.createAuthorizeURL(scopes);
  res.redirect(authUrl);
});

app.get('/callback', async (req, res) => {
  const code = req.query.code;

  try {
    const data = await spotifyApi.authorizationCodeGrant(code);
    const accessToken = data.body['access_token'];
    const refreshToken = data.body['refresh_token'];

    spotifyApi.setAccessToken(accessToken);
    spotifyApi.setRefreshToken(refreshToken);

    res.send('✅ Spotify login successful! You can now make playlists.');
  } catch (err) {
    console.error('❌ Error exchanging code for token:', err);
    res.status(500).send('Login failed.');
  }
});

const PORT = 8888;
app.listen(PORT, () => {
  console.log(`✅ Server running at http://localhost:${PORT}`);
});