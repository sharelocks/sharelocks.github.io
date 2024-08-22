// Load the movies data from the JSON file
async function loadMovies() {
    const response = await fetch('QxR_Torrents.json');
    const movies = await response.json();
    return movies;
}

// Function to render movies on the page
function renderMovies(movies) {
    const moviesGrid = document.getElementById('moviesGrid');
    moviesGrid.innerHTML = ''; // Clear any existing content

    movies.forEach(movie => {
        const movieItem = document.createElement('div');
        movieItem.classList.add('grid-item');

        // Check if the movie has a poster, otherwise use the title as a fallback
        const posterContent = movie.poster
            ? `<img src="${movie.poster}" alt="${movie.Title}">`
            : `<div class="title-placeholder">${movie.Title}</div>`;

        movieItem.innerHTML = `
            ${posterContent}
            <div class="info">
                <p>Seeders: ${movie["No. Seed"]}</p>
                <p>Leechers: ${movie["No. Leechers"]}</p>
                <p>Size: ${movie.Size}</p>
                <p>Upload Date: ${movie["Date uploaded"]}</p>
                <a href="${movie["Magnet Link"]}" class="download-link">Download</a>
            </div>
        `;

        moviesGrid.appendChild(movieItem);
    });
}

// Filter movies based on search input
function filterMovies(movies, query) {
    query = query.toLowerCase();
    return movies.filter(movie => {
        return movie.Title.toLowerCase().split(' ').some(word => word.startsWith(query));
    });
}


// Event listener for the search bar
document.getElementById('searchInput').addEventListener('input', async (event) => {
    const query = event.target.value;
    const movies = await loadMovies();
    const filteredMovies = filterMovies(movies, query);
    renderMovies(filteredMovies);
});

// Initial load
window.addEventListener('DOMContentLoaded', async () => {
    const movies = await loadMovies();
    renderMovies(movies);
});
