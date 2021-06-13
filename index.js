const spotAPI = require('./spotify');
const axios = require('axios');
const youtubeAudio = require('ytdl-core');
const querystring = require('querystring');
const express = require('express');
const cors = require('cors');
require('dotenv').config();

const PORT = process.env.PORT || 3001;
const app = express();

//const whitelist = ['http://localhost:3000', 'http://localhost:3001', 'https://skookshie.herokuapp.com']
//const corsOptions = {
//origin: function (origin, callback) {
//  console.log("** Origin of request " + origin)
//  if (whitelist.indexOf(origin) !== -1 || !origin) {
//    console.log("Origin acceptable")
//    callback(null, true)
//  } else {
//    console.log("Origin rejected")
//    callback(new Error('Not allowed by CORS'))
//  }
// }
//}
//app.use(cors(corsOptions))

app.get('/youtube', async(req, res) => {
    let youtubeResults = await axios.get(`https://www.googleapis.com/youtube/v3/search?part=snippet&q=${querystring.escape(req.query.search)}&type=video&maxResults=1&videoCategoryId=10&key=${process.env.GOOGLE_API}`);
    let uri = `https://www.youtube.com/watch?v=${youtubeResults.data.items[0].id.videoId}`;
    youtubeAudio(uri, { filter: 'audioonly' }).pipe(res);
});

app.get('/song', async(req, res) => {
    let spotifyResults = await spotAPI.getTracks(req.query.search);
    res.json({ spotify: spotifyResults });
});

const path = require('path');
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, 'client/build')));
  app.get('*', function(req, res) {
    res.sendFile(path.join(__dirname, 'client/build', 'index.html'));
  });
}

app.listen(PORT, console.log("Online"));

