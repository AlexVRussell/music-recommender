const form = document.querySelector('[data-search-form]');
const artistInput = document.querySelector('[data-artist-input]');
const feedback = document.querySelector('[data-feedback]');
const results = document.querySelector('[data-results]');
const artistCard = document.querySelector('[data-artist-card]');
const tracksGrid = document.querySelector('[data-tracks-grid]');

const setFeedback = (message, type = 'neutral') => {
    feedback.textContent = message;
    feedback.dataset.state = type;
};

const renderArtist = (artist) => {
    const genreMarkup = (artist.genres || []).length
        ? artist.genres.map((genre) => `<li>${genre}</li>`).join('')
        : '<li>Genre data unavailable</li>';

    artistCard.innerHTML = `
        <div class="artist-card__media">
            ${artist.image ? `<img src="${artist.image}" alt="${artist.name}">` : '<div class="artist-card__placeholder">No image</div>'}
        </div>
        <div class="artist-card__content">
            <h2>${artist.name}</h2>
            <a href="${artist.spotifyUrl}" target="_blank" rel="noreferrer">Open in Spotify</a>
            <ul class="genre-list">${genreMarkup}</ul>
        </div>
    `;
};

const renderTracks = (tracks) => {
    if (!tracks.length) {
        tracksGrid.innerHTML = '<p>No tracks found.</p>';
        return;
    }

    tracksGrid.innerHTML = tracks.map((track) => `
        <article class="track-card">
            ${track.image ? `<img class="track-card__image" src="${track.image}" alt="${track.album || track.name}">` : '<div class="track-card__image track-card__image--placeholder">No cover</div>'}
            <div class="track-card__body">
                <h3>${track.name}</h3>
                <p>${track.artists.join(', ')}</p>
                <p>${track.album || 'Album unavailable'}</p>
                <div class="track-card__actions">
                    <a href="${track.spotifyUrl}" target="_blank" rel="noreferrer">Spotify</a>
                    ${track.previewUrl ? `<audio controls src="${track.previewUrl}"></audio>` : '<span class="track-card__preview-empty">Preview unavailable</span>'}
                </div>
            </div>
        </article>
    `).join('');
};

form.addEventListener('submit', async (event) => {
    event.preventDefault();

    const artist = artistInput.value.trim();
    if (!artist) {
        setFeedback('Enter an artist name first.', 'error');
        results.hidden = true;
        return;
    }

    setFeedback('Searching Spotify...', 'loading');
    results.hidden = true;
    tracksGrid.innerHTML = '';

    try {
        const response = await fetch(`/api/recommendations?artist=${encodeURIComponent(artist)}`);
        const payload = await response.json();

        if (!response.ok) {
            throw new Error(payload.error || 'Request failed.');
        }

        renderArtist(payload.artist);
        renderTracks(payload.tracks || []);
        results.hidden = false;
        setFeedback(`Loaded ${payload.tracks?.length || 0} tracks for ${payload.artist.name}.`, 'success');
    } catch (error) {
        setFeedback(error.message || 'Something went wrong.', 'error');
        results.hidden = true;
    }
});