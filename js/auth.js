require('dotenv').config();

const getAccessToken = async () => {
    const clientId = process.env.SPOTIFY_CLIENT_ID;
    const clientSecret = process.env.SPOTIFY_CLIENT_SECRET;

    if (!clientId || !clientSecret) {
        throw new Error('Missing Spotify API credentials.');
    }

    const response = await fetch("https://accounts.spotify.com/api/token", {
        method: "POST",
        headers: {
            "Content-Type": "application/x-www-form-urlencoded",
            "Authorization": "Basic " + Buffer.from(clientId + ":" + clientSecret).toString("base64")
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
    getAccessToken
};