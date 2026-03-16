const { fetchAccessToken } = require('./auth');

const getArtistRecommendations = async (artistName) => {
    if (!artistName || artistName.trim() === "") {
        throw new Error("Artist name is required");
    } 
    const token = await fetchAccessToken();
}