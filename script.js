const imageContainer = document.getElementById('image-container');
const loader = document.getElementById('loader');

let ready = false;
let imagesLoaded = 0;
let totalImages = 0;
let photosArray = [];

// Unsplash API
let isInitialLoad = true 
let count = 5;
const apiKey = '54wN2UwNX1siEhKT_KGh0M_Wf_XVkLMZkLiT5cryYMA';
let apiUrl = `https://api.unsplash.com/photos/random/?client_id=${apiKey}&count=${count}`;

// Method to check if all images from a current api request are loaded yet
function imageLoaded() {
    console.log('image loaded');
    imagesLoaded++;
    if(imagesLoaded === totalImages) {
        ready = true;
        loader.hidden = true;
    }
}

// Helper function for setting attributes on DOM elements
function setAttributes(element, attributes) {
    for(const key in attributes) {
        element.setAttribute(key, attributes[key]);
    }
}

// Create elements for links & photos, then add to DOM
function displayPhotos() {
    totalImages += photosArray.length;
    photosArray.forEach((photo) => {
        // Create <a> tag with link to Unsplash
        const item = document.createElement('a');
        setAttributes(item, {
            href: photo.links.html,
            target: '_blank',
        })
        // Create <img> tag for photo
        const img = document.createElement('img');
        setAttributes(img, {
            src: photo.urls.regular,
            alt: photo.alt_description,
            title: photo.alt_description,
        })
        img.addEventListener('load', imageLoaded);
        // Put <img> inside <a>, then put both inside image container element
        item.appendChild(img);
        imageContainer.appendChild(item);
    });
}

// Get photos from Unsplash API
async function getPhotos() {
    try {
        const response = await fetch(apiUrl);
        photosArray = await response.json(); 
        displayPhotos();
    } catch(error) {
        // Handle error here
    }
}

// Check if scrolling is near the bottom of the page -> to load more images
window.addEventListener('scroll', () => {
    if(window.innerHeight + window.scrollY >= document.body.offsetHeight - 1000 && ready) {
        ready = false;
        if(isInitialLoad) {
            count = 30;
            apiUrl = `https://api.unsplash.com/photos/random/?client_id=${apiKey}&count=${count}`;
            isInitialLoad = false;
        }
        getPhotos();
    }
});

// On Load
getPhotos();