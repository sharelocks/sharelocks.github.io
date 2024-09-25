// Load the series data from the JSON file
async function loadSeries() {
    const response = await fetch('QxR_Torrents.json');
    const data = await response.json();
    return data.filter(item => item.Title.toLowerCase().includes('season'));
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

// Function to display the total number of series
async function displayTotalSeries() {
    const counts = await loadCounts();
    const formattedCount = formatNumberWithCommas(counts.total_series);

    // Display the total count in the HTML
    const countContainer = document.getElementById('seriesCount');
    countContainer.innerHTML = `Total Series: <span class="red-number">${formattedCount}</span>`;
}

// Call the function to display the total series on page load
displayTotalSeries();


// Function to render series on the page
function renderSeries(series) {
    const seriesGrid = document.getElementById('seriesGrid');
    seriesGrid.innerHTML = ''; // Clear any existing content

    if (series.length === 0) {
        // Show 'No results found' message if no series match the search
        showError("No results found.");
        return;
    }

    series.forEach(item => {
        const seriesItem = document.createElement('div');
        seriesItem.classList.add('grid-item');

        // Check if the series has a poster, otherwise use the title as a fallback
        const posterContent = item.poster
            ? `<img src="${item.poster}" alt="${item.Title}">`
            : `<div class="title-placeholder">${item.Title}</div>`;

        seriesItem.innerHTML = `
            ${posterContent}
            <div class="info">
                <p>Seeders: ${item["No. Seed"]}</p>
                <p>Leechers: ${item["No. Leechers"]}</p>
                <p>Size: ${item.Size}</p>
                <p>Upload Date: ${item["Date uploaded"]}</p>
                <a href="${item["Magnet Link"]}" class="download-link">Download</a>
            </div>
        `;

        seriesGrid.appendChild(seriesItem);
    });

    // Add animation class for a smooth fade-in effect
    seriesGrid.classList.add('fade-in');
    setTimeout(() => seriesGrid.classList.remove('fade-in'), 1000);
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

// Filter series based on search input
function filterSeries(series, query) {
    query = query.toLowerCase();
    return series.filter(item => item.Title.toLowerCase().includes(query));
}

// Function to handle the search
async function handleSearch() {
    const query = document.getElementById('searchInput').value;
    if (query.length > 0) { // Only search if there's a query
        const series = await loadSeries();
        const filteredSeries = filterSeries(series, query);
        renderSeries(filteredSeries);
    } else {
        showError("Please enter a search term.");
    }
}

// Event listener for the search button
document.getElementById('searchButton').addEventListener('click', handleSearch);

// Event listener for the "Show All" button
document.getElementById('showAllButton').addEventListener('click', async () => {
    const series = await loadSeries();
    renderSeries(series);
});

// Event listener for the Enter key on the search input
document.getElementById('searchInput').addEventListener('keypress', (event) => {
    if (event.key === 'Enter') {
        handleSearch();
    }
});
