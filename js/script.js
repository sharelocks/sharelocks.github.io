// Load the data from the JSON file
async function loadData() {
    const response = await fetch('../data/QxR_Torrents.json');
    const data = await response.json();
    return data;
}

// Function to format number with commas
function formatNumberWithCommas(number) {
    return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

// Load the counts from the counts.json file
async function loadCounts() {
    const response = await fetch('../data/counts.json');
    const counts = await response.json();
    return counts;
}

// Function to display the total number of titles
async function displayTotalTitles() {
    const counts = await loadCounts();
    const formattedCount = formatNumberWithCommas(counts.total_titles);

    // Display the total count in the HTML
    const countContainer = document.getElementById('titleCount');
    countContainer.innerHTML = `Total Titles: <span class="red-number">${formattedCount}</span>`;
}

// Call the function to display the total titles on page load
displayTotalTitles();


// Function to render search results on the page
function renderResults(results) {
    const resultsGrid = document.getElementById('resultsGrid');
    resultsGrid.innerHTML = ''; // Clear any existing content

    if (results.length === 0) {
        // Show 'No results found' message if no results match the search
        showError("No results found.");
        return;
    }

    results.forEach(item => {
        const resultItem = document.createElement('div');
        resultItem.classList.add('grid-item');

        // Check if the item has a poster, otherwise use the title as a fallback
        const posterContent = item.poster
            ? `<img src="${item.poster}" alt="${item.Title}">`
            : `<div class="title-placeholder">${item.Title}</div>`;

        resultItem.innerHTML = `
            ${posterContent}
            <div class="info">
                <p>Seeders: ${item["No. Seed"]}</p>
                <p>Leechers: ${item["No. Leechers"]}</p>
                <p>Size: ${item.Size}</p>
                <p>Upload Date: ${item["Date uploaded"]}</p>
                <a href="${item["Magnet Link"]}" class="download-link">Download</a>
            </div>
        `;

        resultsGrid.appendChild(resultItem);
    });

    // Add animation class for a smooth fade-in effect
    resultsGrid.classList.add('fade-in');
    setTimeout(() => resultsGrid.classList.remove('fade-in'), 1000);
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

// Filter results based on search input
function filterResults(data, query) {
    query = query.toLowerCase();
    return data.filter(item => item.Title.toLowerCase().includes(query));
}

// Function to handle the search
async function handleSearch() {
    const query = document.getElementById('searchInput').value;
    if (query.length > 0) { // Only search if there's a query
        const data = await loadData();
        const filteredResults = filterResults(data, query);
        renderResults(filteredResults);
    } else {
        showError("Please enter a search term.");
    }
}

// Event listener for the search button
document.getElementById('searchButton').addEventListener('click', handleSearch);

// Event listener for the "Show All" button
document.getElementById('showAllButton').addEventListener('click', async () => {
    const data = await loadData();
    renderResults(data);
});

// Event listener for the Enter key on the search input
document.getElementById('searchInput').addEventListener('keypress', (event) => {
    if (event.key === 'Enter') {
        handleSearch();
    }
});

// Function to render search results on the page
function renderResults(results) {
    const resultsGrid = document.getElementById('resultsGrid');
    resultsGrid.innerHTML = ''; // Clear any existing content

    const clearSearchButton = document.getElementById('clearSearchButton');
    if (results.length === 0) {
        // Show 'No results found' message if no results match the search
        showError("No results found.");
        clearSearchButton.style.display = 'none'; // Hide the clear button if no results
        return;
    }

    results.forEach(item => {
        const resultItem = document.createElement('div');
        resultItem.classList.add('grid-item');

        const posterContent = item.poster
            ? `<img src="${item.poster}" alt="${item.Title}">`
            : `<div class="title-placeholder">${item.Title}</div>`;

        resultItem.innerHTML = `
            ${posterContent}
            <div class="info">
                <p>Seeders: ${item["No. Seed"]}</p>
                <p>Leechers: ${item["No. Leechers"]}</p>
                <p>Size: ${item.Size}</p>
                <p>Upload Date: ${item["Date uploaded"]}</p>
                <a href="${item["Magnet Link"]}" class="download-link">Download</a>
            </div>
        `;

        resultsGrid.appendChild(resultItem);
    });

    // Show the clear button when results are shown
    clearSearchButton.style.display = 'inline-block';
}

// Function to clear search results
function clearSearchResults() {
    const resultsGrid = document.getElementById('resultsGrid');
    resultsGrid.innerHTML = ''; // Clear the results
    document.getElementById('searchInput').value = ''; // Clear the search input

    // Hide the clear button
    const clearSearchButton = document.getElementById('clearSearchButton');
    clearSearchButton.style.display = 'none';
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

document.querySelectorAll('.dropbtn').forEach(button => {
    button.addEventListener('click', function(e) {
        e.preventDefault();
        const dropdown = this.nextElementSibling; // Get the next sibling dropdown-content
        dropdown.style.display = dropdown.style.display === 'block' ? 'none' : 'block';
    });
});

// Function to highlight the current page link
function highlightActivePage() {
    // Get the current page's URL
    const currentPage = window.location.pathname.split('/').pop(); // Get the last part of the URL

    // Get all the links in the dropdowns
    const links = document.querySelectorAll('.dropdown-content a');

    // Loop through each link and compare the href with the current page URL
    links.forEach(link => {
        const linkPage = link.getAttribute('href');

        if (linkPage === currentPage) {
            link.classList.add('active'); // Add 'active' class to the current page link
        }
    });
}

// Call the function to highlight the active page when the page loads
highlightActivePage();