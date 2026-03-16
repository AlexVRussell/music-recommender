/**
 * This modules handles authentication with the Spotify API using Spotify's recommended Client Credientials flow.
 */

require('dotenv').config();

const SPOTIFY_CLIENT_ID = process.env.SPOTIFY_CLIENT_ID;
const SPOTIFY_CLIENT_SECRET = process.env.SPOTIFY_CLIENT_SECRET;

if (!SPOTIFY_CLIENT_ID || !SPOTIFY_CLIENT_SECRET) {
    throw new Error("Missing or Invalid Spotify API credentials.");
}
// First we get an access token from Spotify's API
const fetchAccessToken = async () => {
    const response = await fetch("https://accounts.spotify.com/api/token", {
        method: "POST",
        headers: {
            "Content-Type": "application/x-www-form-urlencoded",
            "Authorization": "Basic " + Buffer.from(SPOTIFY_CLIENT_ID + ":" + SPOTIFY_CLIENT_SECRET).toString("base64")
        },
        body: "grant_type=client_credentials"
    });
    if (!response.ok) {
        const dataErr = await response.json();
        throw new Error("Failed to fetch access token: " + response.status + "\n" + JSON.stringify(dataErr));
    }
    const data = await response.json();
    return data.access_token;
}
// export a module that makes a promise to get an access token when called
module.exports = {
    getAccessToken : async () => {
        const token = await fetchAccessToken();
        return token;
    }
}