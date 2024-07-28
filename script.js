// Matrix Effect Script

const canvas = document.getElementById('matrixCanvas');
const ctx = canvas.getContext('2d');

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

const letters = Array(256).join(1).split('');
let fontSize = 16;
let columns = canvas.width / fontSize;

const draw = () => {
    ctx.fillStyle = 'rgba(0, 0, 0, 0.05)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.fillStyle = '#0F0';
    ctx.font = `${fontSize}px monospace`;

    letters.map((y_pos, index) => {
        const text = String.fromCharCode(65 + Math.random() * 33);
        const x_pos = index * fontSize;

        ctx.fillText(text, x_pos, y_pos);

        if (y_pos > 758 + Math.random() * 1e4) letters[index] = 0;
        letters[index] = y_pos + fontSize;
    });
};

setInterval(draw, 33);

// Your existing script for handling password and search functionality
document.getElementById('submitPassword').addEventListener('click', () => {
    const passwordInput = document.getElementById('passwordInput').value;
    const passwordContainer = document.getElementById('passwordContainer');
    const searchContainer = document.getElementById('searchContainer');

    // Add your password verification logic here
    if (passwordInput === 'your_password') { // Replace 'your_password' with the actual password
        passwordContainer.classList.add('hidden');
        searchContainer.classList.remove('hidden');
    } else {
        alert('Incorrect password. Please try again.');
    }
});

document.getElementById('searchButton').addEventListener('click', () => {
    const databaseSelect = document.getElementById('databaseSelect').value;
    const searchInput = document.getElementById('searchInput').value;
    const resultsContainer = document.getElementById('results');

    // Add your search logic here
    resultsContainer.innerHTML = `<div>Searching in ${databaseSelect} for "${searchInput}"...</div>`;

    // Simulate a search result for demonstration
    setTimeout(() => {
        resultsContainer.innerHTML = `<div>Results for "${searchInput}" in ${databaseSelect}:</div>
                                      <div>Result 1</div>
                                      <div>Result 2</div>
                                      <div>Result 3</div>`;
        resultsContainer.classList.add('expanded');
    }, 1000);
});
