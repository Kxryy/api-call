let currentImages = []; 
let previousImages = []; 
const imageContainer = document.getElementById('image-container');
const prevBtn = document.getElementById('prev-btn');
const nextBtn = document.getElementById('next-btn');

// Function to fetch images
function fetchImages() {
  const imagePromises = [];

  // Fetch 3 new images
  for (let i = 0; i < 3; i++) {
    imagePromises.push(
      fetch('https://nekos.best/api/v2/neko')
        .then(response => response.json())
        .then(json => {
          if (json.results && json.results[0].url) {
            return json.results[0].url; 
          }
        })
    );
  }

  // Once all images are fetched, update the current and previous image arrays
  Promise.all(imagePromises)
    .then(images => {
      previousImages = currentImages; // Store the current images in previous
      currentImages = images; // Update with the new images
      updateImages(); // Update the displayed images
    })
    .catch(error => console.error('Error fetching the images:', error));
}

// Function to update the displayed images in the container
function updateImages() {
  imageContainer.innerHTML = ''; // Clear current images in the container

  // Append new images to the container
  currentImages.forEach(imageUrl => {
    const img = document.createElement('img');
    img.src = imageUrl;
    img.alt = 'Neko Image';
    img.width = 300; 
    img.height = 300;
    imageContainer.appendChild(img);
  });

  // Update the pagination buttons
  updatePagination();
}

// Function to update the pagination buttons
function updatePagination() {
  prevBtn.disabled = previousImages.length === 0; // Disable prev if no previous images
  nextBtn.disabled = currentImages.length === 0; // Disable next if no current images
}

// Event listener for the "Next" button
nextBtn.addEventListener('click', () => {
  fetchImages(); // Fetch new images on click
});

// Event listener for the "Previous" button
prevBtn.addEventListener('click', () => {
  if (previousImages.length > 0) {
    currentImages = previousImages; // Move to the previous images
    previousImages = []; // Clear the previous images array
    updateImages(); // Update the displayed images
  }
});

// Fetch initial images when the page loads
fetchImages();
