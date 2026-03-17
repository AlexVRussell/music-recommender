/**
 * This module handles authentication with the Spotify API using the Client Credentials Flow.
 * Recieving the access token.
 */

require('dotenv').config();

const SPOTIFY_CLIENT_ID = process.env.SPOTIFY_CLIENT_ID;
const SPOTIFY_CLIENT_SECRET = process.env.SPOTIFY_CLIENT_SECRET;

if (!SPOTIFY_CLIENT_ID || !SPOTIFY_CLIENT_SECRET) {
    throw new Error("Missing or Invalid Spotify API credentials.");
}

/**
 * Requests an app access token from Spotify.
 * @returns {Promise<string>} Spotify access token.
 */
const fetchAccessToken = async () => {
    const response = await fetch("https://accounts.spotify.com/api/token", {
        method: "POST",
        headers: {
            "Content-Type": "application/x-www-form-urlencoded",
            "Authorization": "Basic " + Buffer.from(SPOTIFY_CLIENT_ID + ":" + SPOTIFY_CLIENT_SECRET).toString("base64")
        },
        body: "grant_type=client_credentials"
    });

    const data = await response.json();

    if (!response.ok) {
        throw new Error("Failed to fetch access token: " + response.status + "\n" + JSON.stringify(data));
    }

    if (!data?.access_token) {
        throw new Error("Spotify token response did not include an access token.");
    }

    return data.access_token;
};

module.exports = {
    getAccessToken: fetchAccessToken
};