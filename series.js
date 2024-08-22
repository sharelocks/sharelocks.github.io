// Load the series data from the JSON file
async function loadSeries() {
    const response = await fetch('QxR_Torrents.json');
    const data = await response.json();
    return data.filter(item => item.Title.toLowerCase().includes('season'));
}

// Function to render series on the page
function renderSeries(series) {
    const seriesGrid = document.getElementById('seriesGrid');
    seriesGrid.innerHTML = ''; // Clear any existing content

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
}

// Filter series based on search input
function filterSeries(series, query) {
    return series.filter(item => item.Title.toLowerCase().includes(query.toLowerCase()));
}

// Event listener for the search bar
document.getElementById('searchInput').addEventListener('input', async (event) => {
    const query = event.target.value;
    const series = await loadSeries();
    const filteredSeries = filterSeries(series, query);
    renderSeries(filteredSeries);
});

// Initial load
window.addEventListener('DOMContentLoaded', async () => {
    const series = await loadSeries();
    renderSeries(series);
});
