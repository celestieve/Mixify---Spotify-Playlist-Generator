document.addEventListener('DOMContentLoaded', () => {
    const genreSelectionContainer = document.querySelector('.genre-selection-container');
    const generateButton = document.getElementById('generateButton');
    let selectedSubgenre = null;

    // Fetch genres and subgenres from the backend
    fetch('http://localhost:8888/genres')
        .then(response => response.json())
        .then(data => {
            if (data && data.genres) {
                data.genres.forEach(genreData => {
                    const genreDiv = document.createElement('div');
                    genreDiv.classList.add('genre-selection');

                    const genreHeading = document.createElement('h1');
                    genreHeading.classList.add('genres');
                    genreHeading.textContent = genreData.name;

                    const subgenresContainer = document.createElement('div');
                    subgenresContainer.classList.add('sub-genres-container');

                    genreData.subgenres.forEach(subgenre => {
                        const subgenreButton = document.createElement('button');
                        subgenreButton.textContent = subgenre;
                        subgenreButton.addEventListener('click', () => {
                            // Remove active class from previously selected button
                            const activeButtons = document.querySelectorAll('.sub-genres-container button.active');
                            activeButtons.forEach(btn => btn.classList.remove('active'));
                            // Add active class to the currently selected button
                            subgenreButton.classList.add('active');
                            selectedSubgenre = subgenre;
                            console.log('Selected subgenre:', selectedSubgenre);
                        });
                        subgenresContainer.appendChild(subgenreButton);
                    });

                    genreDiv.appendChild(genreHeading);
                    genreDiv.appendChild(subgenresContainer);
                    genreSelectionContainer.appendChild(genreDiv);
                });
            }
        })
        .catch(error => {
            console.error('Error fetching genres:', error);
            genreSelectionContainer.innerHTML = '<p>Failed to load genres.</p>';
        });

    // Handle the "Generate" button click
    generateButton.addEventListener('click', () => {
        if (selectedSubgenre) {
            const recommendationsUrl = `generation.html?genre=${encodeURIComponent(selectedSubgenre)}`;
            window.location.href = recommendationsUrl;
        } else {
            alert('Please select a subgenre before generating.');
        }
    });
});