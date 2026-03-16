const { getAccessToken } = require('./auth');

const getArtistRecommendations = async (artistName) => {
    if (!artistName || artistName.trim() === "") {
        throw new Error("Artist name is required");
    } 
    const token = await getAccessToken();

    const searchResponse = await fetch('https://api.spotify.com/v1/search?q=' + encodeURIComponent(artistName) + '&type=artist&limit=1', {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${token}`
        }
    });
    if (!searchResponse.ok) {
        const dataErr = await searchResponse.json();
        throw new Error("Failed to search for artist: " + searchResponse.status + "\n" + JSON.stringify(dataErr));  
    }
    const searchData = await searchResponse.json();
    if (!searchData.artists.items || searchData.artists.items.length === 0) {
        throw new Error("No matching artist found");
    }
    const artist = searchData.artists.items[0];
    const artistId = artist.id;
    const artistName = artist.name;
    const genres = artist.genres;
    const image = artist.images.length > 0 ? artist.images[0].url : null;
    const spotifyUrl = artist.external_urls.spotify;

    // Step 11: use artistId to fetch top tracks from /v1/artists/{id}/top-tracks

    // Step 12: await response
    // Step 13: if response is not OK, throw error "Failed to fetch artist tracks"
    // Step 14: parse JSON top tracks result

    // Step 15: build and return simplified response object:
    //   searchedArtist: { artistName, genres, image, spotifyUrl }
    //   recommendedTracks: array of { name, album, previewUrl, spotifyUrl }

    // Step 16: return simplified object
}

// Step 17: export the function so the server route can call it
module.exports = { getArtistRecommendations };