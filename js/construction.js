// Create a container for particles in the body
const particlesContainer = document.querySelector('.particles-container');

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

// Continuously generate shapes at random positions
setInterval(() => {
    createShape(Math.random() * window.innerWidth, Math.random() * window.innerHeight);
}, 1000); // Generates shapes every second