const { getAccessToken } = require('./auth');

const getArtistRecommendations = async (artistName) => {
    if (!artistName || !artistName.trim()) {
        throw new Error('Artist name is required');
    }

    const token = await getAccessToken();

    const artistSearchResponse = await fetch(
        'https://api.spotify.com/v1/search?q=' + encodeURIComponent(artistName.trim()) + '&type=artist&limit=1',
        { headers: { Authorization: `Bearer ${token}` } }
    );
    const artistSearch = await artistSearchResponse.json();

    if (!artistSearchResponse.ok) {
        throw new Error('Spotify request failed: ' + artistSearchResponse.status);
    }

    if (!artistSearch.artists?.items?.length) {
        throw new Error('No matching artist found');
    }

    const artist = artistSearch.artists.items[0];
    const genres = Array.isArray(artist.genres) ? artist.genres : [];
    const query = genres[0] || artist.name;

    const trackSearchResponse = await fetch(
        'https://api.spotify.com/v1/search?q=' + encodeURIComponent(query) + '&type=track&limit=10',
        { headers: { Authorization: `Bearer ${token}` } }
    );
    const trackSearch = await trackSearchResponse.json();

    if (!trackSearchResponse.ok) {
        throw new Error('Spotify request failed: ' + trackSearchResponse.status);
    }

    const tracks = (trackSearch.tracks?.items || []).map((track) => ({
        id: track.id,
        name: track.name,
        album: track.album?.name || null,
        artists: (track.artists || []).map((a) => a.name),
        previewUrl: track.preview_url,
        spotifyUrl: track.external_urls?.spotify || null,
        image: track.album?.images?.[0]?.url || null
    }));

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
