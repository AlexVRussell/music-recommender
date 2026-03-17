const form = document.querySelector('[data-search-form]');
const artistInput = document.querySelector('[data-artist-input]');
const feedback = document.querySelector('[data-feedback]');
const results = document.querySelector('[data-results]');
const artistCard = document.querySelector('[data-artist-card]');
const tracksGrid = document.querySelector('[data-tracks-grid]');

function setFeedback(message, state) {
    feedback.textContent = message;
    feedback.dataset.state = state;
}

function renderArtist(artist) {
    const genres = (artist.genres || []).length
        ? artist.genres.join(', ')
        : 'Genre data unavailable';

    const image = artist.image
        ? `<img src="${artist.image}" alt="${artist.name}">`
        : '<div class="artist-card__placeholder">No image</div>';

    artistCard.innerHTML = `
        <div class="artist-card__media">${image}</div>
        <div class="artist-card__content">
            <h2>${artist.name}</h2>
            <p>${genres}</p>
            <a href="${artist.spotifyUrl}" target="_blank" rel="noreferrer">Open in Spotify</a>
        </div>
    `;
}

function renderTracks(tracks) {
    if (!tracks.length) {
        tracksGrid.innerHTML = '<p>No tracks found.</p>';
        return;
    }

    const items = tracks.map((track) => {
        const image = track.image
            ? `<img class="track-card__image" src="${track.image}" alt="${track.name}">`
            : '<div class="track-card__image track-card__image--placeholder">No cover</div>';

        const preview = track.previewUrl
            ? `<audio controls src="${track.previewUrl}"></audio>`
            : '<span class="track-card__preview-empty">Preview unavailable</span>';

        return `
            <article class="track-card">
                ${image}
                <div class="track-card__body">
                    <h3>${track.name}</h3>
                    <p>${(track.artists || []).join(', ')}</p>
                    <p>${track.album || 'Album unavailable'}</p>
                    <div class="track-card__actions">
                        <a href="${track.spotifyUrl}" target="_blank" rel="noreferrer">Spotify</a>
                        ${preview}
                    </div>
                </div>
            </article>
        `;
    });

    tracksGrid.innerHTML = items.join('');
}

async function fetchRecommendations(artist) {
    const response = await fetch(`/api/recommendations?artist=${encodeURIComponent(artist)}`);
    const payload = await response.json();

    if (!response.ok) {
        throw new Error(payload.error || 'Request failed.');
    }

    return payload;
}

form.addEventListener('submit', async (event) => {
    event.preventDefault();

    const artist = artistInput.value.trim();
    if (!artist) {
        feedback.textContent = 'Enter an artist name first.';
        feedback.dataset.state = 'error';
        results.hidden = true;
        return;
    }

    setFeedback('Searching Spotify...', 'loading');
    results.hidden = true;

    try {
        const payload = await fetchRecommendations(artist);
        const tracks = payload.tracks || [];

        renderArtist(payload.artist);
        renderTracks(tracks);

        results.hidden = false;
        setFeedback(`Loaded ${tracks.length} tracks for ${payload.artist.name}.`, 'success');
    } catch (error) {
        setFeedback(error.message || 'Something went wrong.', 'error');
        results.hidden = true;
    }
});