let logos = [
    // ... your starter logos ...
];

// DOM elements
const logoGallery = document.getElementById('logo-gallery');
const searchInput = document.getElementById('search-input');
const searchBtn = document.getElementById('search-btn');
const logoUpload = document.getElementById('logo-upload');
const modal = document.getElementById('logo-modal');
const modalImg = document.getElementById('modal-img');
const modalTitle = document.getElementById('modal-title');
const modalDescription = document.getElementById('modal-description');
const modalMetadata = document.getElementById('modal-metadata');
const modalTags = document.getElementById('modal-tags');
const closeModal = document.querySelector('.close-modal');
const filterContainer = document.getElementById('filter-container');
const categoryFilter = document.getElementById('category-filter');
const yearFilter = document.getElementById('year-filter');
const colorFilter = document.getElementById('color-filter');
const clearFilters = document.getElementById('clear-filters');

// Load logos from Firebase
function loadLogosFromFirebase() {
    // Check if Firebase is initialized
    if (typeof window.db === 'undefined') {
        console.warn('Firebase Firestore not initialized. Using default logos.');
        initializeFilters();
        displayLogos();
        return;
    }

    window.db.collection('logos').orderBy('id', 'desc').get()
        .then((querySnapshot) => {
            const loadedLogos = [];
            querySnapshot.forEach((doc) => {
                loadedLogos.push({ id: doc.id, ...doc.data() });
            });
            
            if (loadedLogos.length > 0) {
                logos = loadedLogos;
                console.log('Loaded logos from Firebase:', logos.length);
            } else {
                console.log('No logos found in Firebase. Using default logos.');
            }
            
            initializeFilters();
            displayLogos();
        })
        .catch((error) => {
            console.error("Error loading logos from Firebase:", error);
            initializeFilters();
            displayLogos();
        });
}

// Upload logo to Firebase
function handleLogoUpload(event) {
    console.log("Upload function called");
    
    // Check if Firebase is initialized
    if (typeof window.storage === 'undefined' || typeof window.db === 'undefined') {
        console.error('Firebase not initialized:', { 
            storage: typeof window.storage, 
            db: typeof window.db 
        });
        alert('Firebase not initialized. Cannot upload logos at this time.');
        return;
    }

    const file = event.target.files[0];
    console.log("File selected:", file ? file.name : "No file");
    
    if (!file) return;
    
    if (!file.type.match('image.*')) {
        alert('Please upload an image file');
        return;
    }
    
    // Create a loading indicator
    const loadingIndicator = document.createElement('div');
    loadingIndicator.className = 'loading-indicator';
    loadingIndicator.innerHTML = '<p>Uploading logo...</p>';
    document.body.appendChild(loadingIndicator);
    
    // Create a unique filename
    const fileName = `${Date.now()}_${file.name}`;
    const storageRef = window.storage.ref(`logos/${fileName}`);    
    // Upload file to Firebase Storage
    const uploadTask = storageRef.put(file);
    
    uploadTask.on('state_changed', 
        // Progress function
        (snapshot) => {
            const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
            console.log('Upload is ' + progress + '% done');
            loadingIndicator.innerHTML = `<p>Uploading logo... ${Math.round(progress)}%</p>`;
        }, 
        // Error function
        (error) => {
            console.error('Upload failed:', error);
            alert('Upload failed. Please try again.');
            document.body.removeChild(loadingIndicator);
        }, 
        // Complete function
        () => {
            // Get the download URL
            uploadTask.snapshot.ref.getDownloadURL().then((downloadURL) => {
                document.body.removeChild(loadingIndicator);
                
                // Create a dialog to get logo details
                const logoName = prompt('Enter a name for your logo:', file.name.split('.')[0]);
                if (!logoName) return; // User canceled
                
                const logoDescription = prompt('Enter a description for your logo:', 'Custom uploaded logo');
                const logoTags = prompt('Enter tags for your logo (comma separated):', 'custom, uploaded');
                const logoDesigner = prompt('Who designed this logo?', 'Unknown');
                const logoYear = prompt('What year was this logo created?', new Date().getFullYear().toString());
                const logoCategory = prompt('What category does this logo belong to?', 'Custom');
                const logoColors = prompt('What colors are in this logo? (comma separated)', 'black, white');
                
                const newLogo = {
                    id: Date.now(),
                    title: logoName,
                    description: logoDescription || 'Custom uploaded logo',
                    imageUrl: downloadURL,
                    tags: logoTags ? logoTags.split(',').map(tag => tag.trim().toLowerCase()) : ['custom', 'uploaded'],
                    designer: logoDesigner || 'Unknown',
                    year: logoYear || new Date().getFullYear().toString(),
                    category: logoCategory || 'Custom',
                    colors: logoColors ? logoColors.split(',').map(color => color.trim().toLowerCase()) : ['black', 'white']
                };
                
                // Save to Firebase Database
                window.db.collection('logos').add(newLogo)
                    .then(() => {
                        // Reload logos
                        loadLogosFromFirebase();
                        
                        // Reset file input
                        logoUpload.value = '';
                    })
                    .catch((error) => {
                        console.error("Error adding logo:", error);
                        alert('Error saving logo data. Please try again.');
                    });
            });
        }
    );
}

// Initialize the gallery
document.addEventListener('DOMContentLoaded', () => {
    // Check if Firebase is already initialized
    if (typeof window.db !== 'undefined') {
        loadLogosFromFirebase();
    } else {
        // If not, initialize filters and display default logos
        console.log('Firebase not yet initialized. Will be loaded later if available.');
        initializeFilters();
        displayLogos();
    }
});
function initializeFilters() {
    // Clear existing options first
    categoryFilter.innerHTML = '<option value="all">All Categories</option>';
    yearFilter.innerHTML = '<option value="all">All Years</option>';
    colorFilter.innerHTML = '<option value="all">All Colors</option>';
    
    // Get unique categories, years, and colors
    const categories = [...new Set(logos.map(logo => logo.category))];
    const years = [...new Set(logos.map(logo => logo.year))].sort((a, b) => b - a);
    const colors = [...new Set(logos.flatMap(logo => logo.colors))];
    
    // Populate category filter
    categories.forEach(category => {
        const option = document.createElement('option');
        option.value = category;
        option.textContent = category;
        categoryFilter.appendChild(option);
    });
    
    // Populate year filter
    years.forEach(year => {
        const option = document.createElement('option');
        option.value = year;
        option.textContent = year;
        yearFilter.appendChild(option);
    });
    
    // Populate color filter
    colors.forEach(color => {
        const option = document.createElement('option');
        option.value = color;
        option.textContent = color.charAt(0).toUpperCase() + color.slice(1);
        colorFilter.appendChild(option);
    });
}

// Display logos in the gallery
function displayLogos(logosToDisplay = logos) {
    logoGallery.innerHTML = '';
    
    if (logosToDisplay.length === 0) {
        logoGallery.innerHTML = '<p class="no-results">No logos found matching your search criteria.</p>';
        return;
    }
    
    logosToDisplay.forEach(logo => {
        const logoItem = document.createElement('div');
        logoItem.classList.add('logo-item');
        logoItem.dataset.id = logo.id;
        
        // Create tags HTML
        const tagsHTML = logo.tags.map(tag => 
            `<span class="logo-tag">#${tag}</span>`
        ).join('');
        
        // Create metadata preview
        const metadataPreview = `
            <div class="logo-metadata">
                <span class="metadata-item"><i class="fas fa-user-alt"></i> ${logo.designer}</span>
                <span class="metadata-item"><i class="fas fa-calendar-alt"></i> ${logo.year}</span>
            </div>
        `;
        
        logoItem.innerHTML = `
            <div class="logo-img-container">
                <img src="${logo.imageUrl}" alt="${logo.title}" class="logo-img">
                <div class="view-details">View Details</div>
            </div>
            <div class="logo-info">
                <div class="logo-title">${logo.title}</div>
                <div class="logo-description">${logo.description.substring(0, 80)}${logo.description.length > 80 ? '...' : ''}</div>
                ${metadataPreview}
                <div class="logo-tags">
                    ${tagsHTML}
                </div>
            </div>
        `;
        
        logoItem.addEventListener('click', () => openModal(logo));
        
        logoGallery.appendChild(logoItem);
    });
}

// Search and filter functionality
function searchAndFilterLogos() {
    const searchTerm = searchInput.value.toLowerCase().trim();
    const categoryValue = categoryFilter.value;
    const yearValue = yearFilter.value;
    const colorValue = colorFilter.value;
    
    let filteredLogos = logos;
    
    // Apply search term
    if (searchTerm !== '') {
        filteredLogos = filteredLogos.filter(logo => {
            return (
                logo.title.toLowerCase().includes(searchTerm) ||
                logo.description.toLowerCase().includes(searchTerm) ||
                logo.tags.some(tag => tag.includes(searchTerm)) ||
                logo.designer.toLowerCase().includes(searchTerm) ||
                logo.category.toLowerCase().includes(searchTerm) ||
                logo.colors.some(color => color.includes(searchTerm))
            );
        });
    }
    
    // Apply category filter
    if (categoryValue !== 'all') {
        filteredLogos = filteredLogos.filter(logo => logo.category === categoryValue);
    }
    
    // Apply year filter
    if (yearValue !== 'all') {
        filteredLogos = filteredLogos.filter(logo => logo.year === yearValue);
    }
    
    // Apply color filter
    if (colorValue !== 'all') {
        filteredLogos = filteredLogos.filter(logo => logo.colors.includes(colorValue));
    }
    
    displayLogos(filteredLogos);
}

// Reset all filters
function resetFilters() {
    searchInput.value = '';
    categoryFilter.value = 'all';
    yearFilter.value = 'all';
    colorFilter.value = 'all';
    displayLogos();
}

// Modal functionality
function openModal(logo) {
    modalImg.src = logo.imageUrl;
    modalTitle.textContent = logo.title;
    modalDescription.textContent = logo.description;
    
    // Add metadata to modal
    modalMetadata.innerHTML = `
        <div class="metadata-group">
            <h4>Designer</h4>
            <p>${logo.designer}</p>
        </div>
        <div class="metadata-group">
            <h4>Year</h4>
            <p>${logo.year}</p>
        </div>
        <div class="metadata-group">
            <h4>Category</h4>
            <p>${logo.category}</p>
        </div>
        <div class="metadata-group">
            <h4>Colors</h4>
            <div class="color-dots">
                ${logo.colors.map(color => `<span class="color-dot" style="background-color: ${color};" title="${color}"></span>`).join('')}
            </div>
        </div>
    `;
    
    // Clear and add tags to modal
    modalTags.innerHTML = '';
    logo.tags.forEach(tag => {
        const tagElement = document.createElement('span');
        tagElement.classList.add('modal-tag');
        tagElement.textContent = `#${tag}`;
        tagElement.addEventListener('click', () => {
            // When clicking a tag in the modal, search for that tag
            searchInput.value = tag;
            closeModalFunc();
            searchAndFilterLogos();
        });
        modalTags.appendChild(tagElement);
    });
    
    modal.style.display = 'block';
    document.body.style.overflow = 'hidden'; // Prevent scrolling when modal is open
}

function closeModalFunc() {
    modal.style.display = 'none';
    document.body.style.overflow = 'auto'; // Re-enable scrolling
}

// Event listeners
searchBtn.addEventListener('click', searchAndFilterLogos);
searchInput.addEventListener('keyup', event => {
    if (event.key === 'Enter') {
        searchAndFilterLogos();
    }
});

categoryFilter.addEventListener('change', searchAndFilterLogos);
yearFilter.addEventListener('change', searchAndFilterLogos);
colorFilter.addEventListener('change', searchAndFilterLogos);
clearFilters.addEventListener('click', resetFilters);

logoUpload.addEventListener('change', handleLogoUpload);
closeModal.addEventListener('click', closeModalFunc);
window.addEventListener('click', event => {
    if (event.target === modal) {
        closeModalFunc();
    }
});

// Add loading indicator styles
const style = document.createElement('style');
style.textContent = `
.loading-indicator {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.7);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 2000;
}

.loading-indicator p {
    background-color: white;
    padding: 20px;
    border-radius: 10px;
    font-weight: bold;
}
`;
document.head.appendChild(style);

// Export the initialization function so it can be called from the config file
window.initializeFirebase = initializeFirebase;
// Export the initialization function so it can be called from the config file
window.initializeFirebase = initializeFirebase

// At the end of your script.js
document.addEventListener('firebaseReady', () => {
  console.log('Firebase is ready, loading logos...')
  loadLogosFromFirebase()
})