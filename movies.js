// Load the movies data from the JSON file
async function loadMovies() {
    const response = await fetch('QxR_Torrents.json');
    const data = await response.json();
    return data.filter(item => !item.Title.toLowerCase().includes('season'));
}

// Function to format number with commas
function formatNumberWithCommas(number) {
    return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

// Function to count the total number of movies
async function countMovies() {
    const movies = await loadMovies();
    const totalMovies = movies.length; // Get the total number of movies

    // Format the total count with commas
    const formattedCount = formatNumberWithCommas(totalMovies);

    // Display the total count in the HTML with the number in red
    const countContainer = document.getElementById('movieCount');
    countContainer.innerHTML = `Total Movies: <span class="red-number">${formattedCount}</span>`;
}

// Function to render movies on the page
function renderMovies(movies) {
    const moviesGrid = document.getElementById('moviesGrid');
    moviesGrid.innerHTML = ''; // Clear any existing content

    if (movies.length === 0) {
        // Show 'No results found' message if no movies match the search
        showError("No results found.");
        return;
    }

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

    // Add animation class for a smooth fade-in effect
    moviesGrid.classList.add('fade-in');
    setTimeout(() => moviesGrid.classList.remove('fade-in'), 1000);
}

// Function to show an error or information message with animation
function showError(message) {
    const errorElement = document.createElement('div');
    errorElement.classList.add('error-message');
    errorElement.innerText = message;

    const errorContainer = document.getElementById('errorContainer');
    errorContainer.innerHTML = ''; // Clear previous messages
    errorContainer.appendChild(errorElement); // Append new message

    setTimeout(() => {
        errorElement.classList.add('fade-out');
        errorElement.addEventListener('transitionend', () => {
            errorElement.remove();
        });
    }, 5000); // Adjusted to hold the message longer
}

// Filter movies based on search input
function filterMovies(movies, query) {
    query = query.toLowerCase();
    return movies.filter(item => item.Title.toLowerCase().includes(query));
}

// Function to handle the search
async function handleSearch() {
    const query = document.getElementById('searchInput').value;
    if (query.length > 0) { // Only search if there's a query
        const movies = await loadMovies();
        const filteredMovies = filterMovies(movies, query);
        renderMovies(filteredMovies);
    } else {
        showError("Please enter a search term.");
    }
}

// Event listener for the search button
document.getElementById('searchButton').addEventListener('click', handleSearch);

// Event listener for the "Show All" button
document.getElementById('showAllButton').addEventListener('click', async () => {
    const movies = await loadMovies();
    renderMovies(movies);
});

// Event listener for the Enter key on the search input
document.getElementById('searchInput').addEventListener('keypress', (event) => {
    if (event.key === 'Enter') {
        handleSearch();
    }
});

// Call countMovies to display the total number of movies when the page loads
countMovies();
