document.getElementById('submitPassword').addEventListener('click', function() {
    const passwordInput = document.getElementById('passwordInput').value;
    const obfuscatedPassword = atob('QW1zZkAyMjY=');

    if (passwordInput === obfuscatedPassword) {
        document.getElementById('passwordContainer').classList.add('hidden');
        document.getElementById('searchContainer').classList.remove('hidden');
    } else {
        alert('Incorrect password. Please try again.');
    }
});

document.getElementById('searchButton').addEventListener('click', function() {
    searchDatabase();
});

document.getElementById('searchInput').addEventListener('keypress', function(event) {
    if (event.key === 'Enter') {
        searchDatabase();
    }
});

function searchDatabase() {
    const searchInput = document.getElementById('searchInput').value;
    const databaseSelect = document.getElementById('databaseSelect').value;
    const resultsContainer = document.getElementById('results');
    resultsContainer.innerHTML = '';
    resultsContainer.classList.remove('expanded'); // Reset state
    resultsContainer.style.opacity = 0; // Hide results initially

    fetch(`/search?q=${encodeURIComponent(searchInput)}`)
        .then(response => response.json())
        .then(results => {
            console.log(results); // Log the results for debugging

            if (results.length === 0) {
                const noResultsDiv = document.createElement('div');
                noResultsDiv.textContent = 'No results found.';
                resultsContainer.appendChild(noResultsDiv);
            } else {
                results.forEach(row => {
                    const resultDiv = document.createElement('div');

                    resultDiv.innerHTML = `
                        <p><strong>Full Name:</strong> ${row.full_name}</p>
                        <p><strong>Phone Number:</strong> ${row.phone}</p>
                        <p><strong>Email:</strong> ${row.email}</p>
                        <p><strong>Birthday:</strong> ${row.birthday}</p>
                        <p><strong>Gender:</strong> ${row.gender}</p>
                        <p><strong>Locale:</strong> ${row.locale}</p>
                        <p><strong>Hometown:</strong> ${row.hometown}</p>
                        <p><strong>Location:</strong> ${row.location}</p>
                        <p><strong>Profile Link:</strong> <a href="${row.link}" target="_blank">${row.link}</a></p>
                    `;

                    resultsContainer.appendChild(resultDiv);
                });
            }

            resultsContainer.classList.add('expanded'); // Add class to expand container
            setTimeout(() => {
                resultsContainer.style.opacity = 1; // Make results visible
            }, 100); // Small delay to allow for transition
        })
        .catch(error => {
            console.error('Error fetching results:', error);
        });
}
