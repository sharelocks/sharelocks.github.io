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

// Load the counts from the counts.json file
async function loadCounts() {
    const response = await fetch('counts.json');
    const counts = await response.json();
    return counts;
}

// Function to display the total number of movies
async function displayTotalMovies() {
    const counts = await loadCounts();
    const formattedCount = formatNumberWithCommas(counts.total_movies);

    // Display the total count in the HTML
    const countContainer = document.getElementById('movieCount');
    countContainer.innerHTML = `Total Movies: <span class="red-number">${formattedCount}</span>`;
}

// Call the function to display the total movies on page load
displayTotalMovies();


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

// Function to render search results for movies (or series)
function renderMovies(movies) {
    const moviesGrid = document.getElementById('moviesGrid');
    moviesGrid.innerHTML = ''; // Clear any existing content

    const clearSearchButton = document.getElementById('clearSearchButton');
    if (movies.length === 0) {
        showError("No results found.");
        clearSearchButton.style.display = 'none'; // Hide the clear button if no results
        return;
    }

    movies.forEach(item => {
        const movieItem = document.createElement('div');
        movieItem.classList.add('grid-item');

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

    clearSearchButton.style.display = 'inline-block'; // Show the clear button
}

// Clear the search results
function clearSearchResults() {
    const moviesGrid = document.getElementById('moviesGrid');
    moviesGrid.innerHTML = ''; // Clear the results
    document.getElementById('searchInput').value = ''; // Clear the search input

    const clearSearchButton = document.getElementById('clearSearchButton');
    clearSearchButton.style.display = 'none'; // Hide the clear button
}

// Attach the clear search results function to the button
document.getElementById('clearSearchButton').addEventListener('click', clearSearchResults);

// Create a container for particles in the body
const particlesContainer = document.createElement('div');
particlesContainer.classList.add('particles-container');
document.body.appendChild(particlesContainer);

// Function to create moving shapes
function createShape(x, y) {
    const shape = document.createElement('div');
    shape.classList.add('shape');

    const size = Math.random() * 20 + 10 + 'px';
    shape.style.width = size;
    shape.style.height = size;
    shape.style.left = `${x}px`;
    shape.style.top = `${y}px`;

    particlesContainer.appendChild(shape);

    // Remove shape after animation
    setTimeout(() => {
        shape.remove();
    }, 10000); // Remove after 10 seconds
}

// Add shapes based on mouse movement
document.body.addEventListener('mousemove', (e) => {
    createShape(e.clientX, e.clientY);
});

// Continuously generate shapes without mouse movement
setInterval(() => {
    createShape(Math.random() * window.innerWidth, Math.random() * window.innerHeight);
}, 1000); // Generates shapes every second
