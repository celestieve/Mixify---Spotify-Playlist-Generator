document.addEventListener('DOMContentLoaded', () => {
    const playlistContainer = document.getElementById('playlist-container');
    const selectedGenreDisplay = document.getElementById('selected-genre');

    // Function to get the genre from the URL query parameters
    function getQueryParam(name) {
        const urlParams = new URLSearchParams(window.location.search);
        return urlParams.get(name);
    }

    const selectedGenre = getQueryParam('genre');

    if (selectedGenre) {
        selectedGenreDisplay.textContent = selectedGenre;

        // Fetch recommendations from the backend
        fetch(`http://localhost:8888/recommendations?genre=${encodeURIComponent(selectedGenre)}`)
            .then(response => response.json())
            .then(data => {
                if (data && data.tracks) {
                    if (data.tracks.length > 0) {
                        const playlistTitle = document.createElement('h2');
                        playlistTitle.textContent = 'Here are some tracks:';
                        playlistContainer.appendChild(playlistTitle);

                        const tracksList = document.createElement('ul');
                        data.tracks.forEach(track => {
                            const listItem = document.createElement('li');
                            listItem.textContent = `${track.name} by ${track.artists}`;
                            tracksList.appendChild(listItem);
                        });
                        playlistContainer.appendChild(tracksList);
                    } else {
                        playlistContainer.textContent = 'No tracks found for this genre.';
                    }
                } else if (data && data.error) {
                    playlistContainer.textContent = `Error: ${data.error}`;
                } else {
                    playlistContainer.textContent = 'Failed to load playlist.';
                }
            })
            .catch(error => {
                console.error('Error fetching recommendations:', error);
                playlistContainer.textContent = 'Failed to load playlist.';
            });
    } else {
        playlistContainer.textContent = 'No genre selected.';
    }
});