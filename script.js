// Matrix effect
const canvas = document.getElementById('matrixCanvas');
const ctx = canvas.getContext('2d');

function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}

resizeCanvas();

const letters = "ABCDHIDEINPLAINSITEEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789あいうえおアイウエオ";
const fontSize = 16;
const columns = canvas.width / fontSize;

const drops = [];
for (let x = 0; x < columns; x++) {
    drops[x] = 1;
}

function draw() {
    ctx.fillStyle = "rgba(0, 0, 0, 0.05)";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.fillStyle = "#0F0";
    ctx.font = fontSize + "px arial";

    for (let i = 0; i < drops.length; i++) {
        const text = letters[Math.floor(Math.random() * letters.length)];
        ctx.fillText(text, i * fontSize, drops[i] * fontSize);

        if (drops[i] * fontSize > canvas.height && Math.random() > 0.975) {
            drops[i] = 0;
        }
        drops[i]++;
    }
}

setInterval(draw, 33);

window.addEventListener('resize', resizeCanvas);

// Function to load the JSON data
async function loadJSONData() {
    const response = await fetch('QxR_Torrents.json');
    const jsonData = await response.json();
    return jsonData;
}

// Function to display all torrents when "Show All" is clicked
async function displayAllTorrents() {
    const jsonData = await loadJSONData();
    const results = document.getElementById('results');
    results.innerHTML = ''; // Clear previous results

    jsonData.forEach(torrent => {
        const card = document.createElement('div');
        card.classList.add('result-card');

        card.dataset.title = torrent.Title.toLowerCase();  // Store the title in a data attribute for searching
        card.dataset.category = torrent.Title.toLowerCase().includes('season') ? 'TV Show' : 'Movie'; // Categorize

        const titleElement = document.createElement('h2');
        titleElement.textContent = torrent.Title;

        const seedsElement = document.createElement('p');
        seedsElement.textContent = `Seeders: ${torrent["No. Seed"]}`;

        const leechersElement = document.createElement('p');
        leechersElement.textContent = `Leechers: ${torrent["No. Leechers"]}`;

        const sizeElement = document.createElement('p');
        sizeElement.textContent = `Size: ${torrent.Size}`;

        const dateElement = document.createElement('p');
        dateElement.textContent = `Uploaded: ${torrent["Date uploaded"]}`;

        const magnetLinkElement = document.createElement('a');
        magnetLinkElement.href = torrent["Magnet Link"];
        magnetLinkElement.textContent = 'Download';

        card.appendChild(titleElement);
        card.appendChild(seedsElement);
        card.appendChild(leechersElement);
        card.appendChild(sizeElement);
        card.appendChild(dateElement);
        card.appendChild(magnetLinkElement);

        results.appendChild(card);
    });
}

// Function to search the torrents
function searchTorrents() {
    const input = document.getElementById('searchInput').value.toLowerCase();
    const results = document.getElementById('results').children;

    Array.from(results).forEach(card => {
        const title = card.dataset.title;
        if (title.includes(input)) {
            card.style.display = 'block';
        } else {
            card.style.display = 'none';
        }
    });
}

// Function to display torrents by category
async function displayCategory(category) {
    const jsonData = await loadJSONData();
    const results = document.getElementById('results');
    results.innerHTML = ''; // Clear previous results

    jsonData.forEach(torrent => {
        if ((category === 'TV Show' && torrent.Title.toLowerCase().includes('season')) ||
            (category === 'Movie' && !torrent.Title.toLowerCase().includes('season'))) {

            const card = document.createElement('div');
            card.classList.add('result-card');

            card.dataset.title = torrent.Title.toLowerCase();  // Store the title in a data attribute for searching
            card.dataset.category = category;  // Categorize

            const titleElement = document.createElement('h2');
            titleElement.textContent = torrent.Title;

            const seedsElement = document.createElement('p');
            seedsElement.textContent = `Seeders: ${torrent["No. Seed"]}`;

            const leechersElement = document.createElement('p');
            leechersElement.textContent = `Leechers: ${torrent["No. Leechers"]}`;

            const sizeElement = document.createElement('p');
            sizeElement.textContent = `Size: ${torrent.Size}`;

            const dateElement = document.createElement('p');
            dateElement.textContent = `Uploaded: ${torrent["Date uploaded"]}`;

            const magnetLinkElement = document.createElement('a');
            magnetLinkElement.href = torrent["Magnet Link"];
            magnetLinkElement.textContent = 'Download';

            card.appendChild(titleElement);
            card.appendChild(seedsElement);
            card.appendChild(leechersElement);
            card.appendChild(sizeElement);
            card.appendChild(dateElement);
            card.appendChild(magnetLinkElement);

            results.appendChild(card);
        }
    });
}

// Initialize an empty state on page load
document.getElementById('results').innerHTML = '<p>Please select a category or click "Show All" to view torrents.</p>';
