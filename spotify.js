const spotifyApi = require('spotify-web-api-node');
require('dotenv').config();

const spotify = new spotifyApi({
    clientId: process.env.SPOTIFY_ID,
    clientSecret: process.env.SPOTIFY_SECRET
});

const getAccessToken = async() => {
    const token = await spotify.clientCredentialsGrant();
    spotify.setAccessToken(token.body['access_token']);
}

const getTracks = async(query) => {
    try{
        const searchResults = await spotify.searchTracks(query, {limit: 30});
        return searchResults;
    } catch(error){
        if(error.statusCode == 401){
            await getAccessToken();
            return getTracks(query);
        }
        throw error;
    }
}

module.exports = { getTracks };