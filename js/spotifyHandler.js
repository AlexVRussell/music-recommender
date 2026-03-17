const { getAccessToken } = require('./auth');

/**
 * Maps a Spotify track object to the app's simplified track format.
 * @param {object} track Spotify track payload.
 * @returns {object} Simplified track object.
 */
const mapTrack = (track) => ({
    id: track.id,
    name: track.name,
    album: track.album?.name ?? null,
    artists: (track.artists || []).map((recommendedArtist) => recommendedArtist.name),
    previewUrl: track.preview_url,
    spotifyUrl: track.external_urls?.spotify ?? null,
    image: track.album?.images?.length ? track.album.images[0].url : null
});

/**
 * Performs an authenticated GET request to Spotify and returns JSON.
 * @param {string} url Spotify API URL.
 * @param {string} token Spotify access token.
 * @returns {Promise<object>} Parsed Spotify response.
 */
const spotifyGet = async (url, token) => {
    const response = await fetch(url, {
        headers: {
            Authorization: `Bearer ${token}`
        }
    });

    const data = await response.json();

    if (!response.ok) {
        throw new Error("Spotify request failed: " + response.status + "\n" + JSON.stringify(data));
    }

    return data;
};

/**
 * Finds a seed artist and returns simple track recommendations.
 * @param {string} artistName Artist name entered by the user.
 * @returns {Promise<{artist: object, tracks: object[]}>} Artist and track results.
 */
const getArtistRecommendations = async (artistName) => {
    if (!artistName || !artistName.trim()) {
        throw new Error("Artist name is required");
    }

    const token = await getAccessToken();

    const artistSearch = await spotifyGet(
        'https://api.spotify.com/v1/search?q=' + encodeURIComponent(artistName) + '&type=artist&limit=1',
        token
    );

    if (!artistSearch.artists?.items?.length) {
        throw new Error("No matching artist found");
    }

    const artist = artistSearch.artists.items[0];
    const genres = Array.isArray(artist.genres) ? artist.genres : [];
    const firstGenre = genres[0] || artist.name;

    const trackSearch = await spotifyGet(
        'https://api.spotify.com/v1/search?q=' + encodeURIComponent(firstGenre) + '&type=track&limit=10',
        token
    );

    const tracks = (trackSearch.tracks?.items || []).map(mapTrack);

    return {
        artist: {
            id: artist.id,
            name: artist.name,
            genres,
            image: artist.images?.[0]?.url || null,
            spotifyUrl: artist.external_urls?.spotify || null
        },
        tracks
    };
};

module.exports = {
    getArtistRecommendations
};
