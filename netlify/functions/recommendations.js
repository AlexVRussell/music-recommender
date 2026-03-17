const { getArtistRecommendations } = require('../../js/spotifyHandler');

exports.handler = async (event) => {
    if (event.httpMethod !== 'GET') {
        return {
            statusCode: 405,
            body: JSON.stringify({ error: 'Method not allowed' })
        };
    }

    const artist = (event.queryStringParameters?.artist || '').trim();

    if (!artist) {
        return {
            statusCode: 400,
            body: JSON.stringify({ error: 'Artist query is required.' })
        };
    }

    try {
        const data = await getArtistRecommendations(artist);
        return {
            statusCode: 200,
            body: JSON.stringify(data)
        };
    } catch (error) {
        const statusCode = error.message === 'No matching artist found' ? 404 : 500;
        return {
            statusCode,
            body: JSON.stringify({ error: error.message })
        };
    }
};