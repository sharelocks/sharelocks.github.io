// Load the data from the JSON file
async function loadData() {
    const response = await fetch('QxR_Torrents.json');
    const data = await response.json();
    return data;
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

