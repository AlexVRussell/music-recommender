const test = require('node:test');
const assert = require('node:assert/strict');
const path = require('node:path');
const Module = require('node:module');

const handlerPath = path.resolve(__dirname, '../js/spotifyHandler.js');
const authPath = path.resolve(__dirname, '../js/auth.js');

/**
 * Creates a minimal mock response object for fetch.
 */
const jsonResponse = (data, ok = true, status = 200) => ({
	ok,
	status,
	json: async () => data
});

/**
 * Loads spotifyHandler with mocked auth and ordered fetch responses.
 */
const withMockedHandler = (responses) => {
	let callIndex = 0;

	const fetchImpl = async () => {
		if (callIndex >= responses.length) {
			throw new Error('Unexpected extra fetch call');
		}

		const current = responses[callIndex];
		callIndex += 1;
		return current;
	};

	delete require.cache[handlerPath];
	delete require.cache[authPath];

	const authModule = new Module(authPath);
	authModule.exports = {
		getAccessToken: async () => 'test-token'
	};
	authModule.loaded = true;
	require.cache[authPath] = authModule;

	global.fetch = fetchImpl;

	return require(handlerPath);
};

test('throws when artist name is empty', async () => {
	const { getArtistRecommendations } = withMockedHandler([]);

	await assert.rejects(
		getArtistRecommendations(''),
		/Artist name is required/
	);
});

test('throws when no matching artist is found', async () => {
	const { getArtistRecommendations } = withMockedHandler([
		jsonResponse({ artists: { items: [] } })
	]);

	await assert.rejects(
		getArtistRecommendations('Unknown Artist Name'),
		/No matching artist found/
	);
});

test('returns normalized artist and track data', async () => {
	const { getArtistRecommendations } = withMockedHandler([
		jsonResponse({
			artists: {
				items: [
					{
						id: 'artist-1',
						name: 'Radiohead',
						genres: ['alternative rock'],
						images: [{ url: 'https://img.example/artist.jpg' }],
						external_urls: { spotify: 'https://open.spotify.com/artist/artist-1' }
					}
				]
			}
		}),
		jsonResponse({
			tracks: {
				items: [
					{
						id: 'track-1',
						name: 'Fake Plastic Trees',
						album: {
							name: 'The Bends',
							images: [{ url: 'https://img.example/album.jpg' }]
						},
						artists: [{ name: 'Radiohead' }],
						preview_url: null,
						external_urls: { spotify: 'https://open.spotify.com/track/track-1' }
					}
				]
			}
		})
	]);

	const result = await getArtistRecommendations('Radiohead');

	assert.equal(result.artist.name, 'Radiohead');
	assert.equal(result.artist.id, 'artist-1');
	assert.equal(result.tracks.length, 1);
	assert.equal(result.tracks[0].name, 'Fake Plastic Trees');
	assert.equal(result.tracks[0].album, 'The Bends');
	assert.equal(result.tracks[0].spotifyUrl, 'https://open.spotify.com/track/track-1');
});

