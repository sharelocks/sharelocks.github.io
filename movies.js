// Load the movies data from the JSON file
async function loadMovies() {
    const response = await fetch('QxR_Torrents.json');
    const data = await response.json();
    return data.filter(item => !item.Title.toLowerCase().includes('season'));
}

// Function to render movies on the page
function renderMovies(movies) {
    const moviesGrid = document.getElementById('moviesGrid');
    moviesGrid.innerHTML = ''; // Clear any existing content

    movies.forEach(item => {
        const movieItem = document.createElement('div');
        movieItem.classList.add('grid-item');

        // Check if the movie has a poster, otherwise use the title as a fallback
        const posterContent = item.poster
            ? `<img src="${item.poster}" alt="${item.Title}">`
            : `<div class="title-placeholder">${item.Title}</div>`;

        movieItem.innerHTML = `
            ${posterContent}
            <div class="info">
                <p>Seeders: ${item["No. Seed"]}</p>
                <p>Leechers: ${item["No. Leechers"]}</p>
                <p>Size: ${item.Size}</p>
                <p>Upload Date: ${item["Date uploaded"]}</p>
                <a href="${item["Magnet Link"]}" class="download-link">Download</a>
            </div>
        `;

        moviesGrid.appendChild(movieItem);
    });
}

// Filter movies based on search input
function filterMovies(movies, query) {
    return movies.filter(item => item.Title.toLowerCase().includes(query.toLowerCase()));
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
