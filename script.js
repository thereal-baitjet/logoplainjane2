
// Enhanced logo data with more metadata
let logos = [
    {
        id: 1,
        title: 'Google Logo',
        description: 'The iconic colorful logo of Google, representing the search engine giant.',
        imageUrl: 'https://www.google.com/images/branding/googlelogo/1x/googlelogo_color_272x92dp.png',
        tags: ['tech', 'colorful', 'search'],
        designer: 'Ruth Kedar',
        year: '1998',
        category: 'Technology',
        colors: ['blue', 'red', 'yellow', 'green']
    },
    {
        id: 2,
        title: 'Apple Logo',
        description: 'The minimalist apple silhouette logo representing Apple Inc.',
        imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/f/fa/Apple_logo_black.svg',
        tags: ['tech', 'minimal', 'black'],
        designer: 'Rob Janoff',
        year: '1977',
        category: 'Technology',
        colors: ['black']
    },
    {
        id: 3,
        title: 'Nike Logo',
        description: 'The famous Nike swoosh, one of the most recognizable logos in the world.',
        imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/a/a6/Logo_NIKE.svg',
        tags: ['sports', 'simple', 'iconic'],
        designer: 'Carolyn Davidson',
        year: '1971',
        category: 'Sports',
        colors: ['black']
    },
    {
        id: 4,
        title: 'Adidas Logo',
        description: 'The three stripes logo of Adidas, representing the sports apparel brand.',
        imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/2/20/Adidas_Logo.svg',
        tags: ['sports', 'stripes', 'apparel'],
        designer: 'Adi Dassler',
        year: '1949',
        category: 'Sports',
        colors: ['black']
    },
    {
        id: 5,
        title: 'Amazon Logo',
        description: 'The Amazon logo with the arrow from A to Z, representing customer satisfaction.',
        imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/a/a9/Amazon_logo.svg',
        tags: ['retail', 'ecommerce', 'orange'],
        designer: 'Turner Duckworth',
        year: '2000',
        category: 'Retail',
        colors: ['orange', 'black']
    },
    {
        id: 6,
        title: 'Microsoft Logo',
        description: 'The four-color window logo representing Microsoft Corporation.',
        imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/9/96/Microsoft_logo_%282012%29.svg',
        tags: ['tech', 'windows', 'colorful'],
        designer: 'Microsoft',
        year: '2012',
        category: 'Technology',
        colors: ['red', 'green', 'blue', 'yellow']
    },
    {
        id: 7,
        title: 'Coca-Cola Logo',
        description: 'The distinctive cursive script of the Coca-Cola logo.',
        imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/c/ce/Coca-Cola_logo.svg',
        tags: ['beverage', 'red', 'script'],
        designer: 'Frank M. Robinson',
        year: '1886',
        category: 'Food & Beverage',
        colors: ['red', 'white']
    },
    {
        id: 8,
        title: 'McDonald\'s Logo',
        description: 'The golden arches of McDonald\'s, one of the most recognized symbols worldwide.',
        imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/3/36/McDonald%27s_Golden_Arches.svg',
        tags: ['food', 'yellow', 'arches'],
        designer: 'Jim Schindler',
        year: '1962',
        category: 'Food & Beverage',
        colors: ['yellow', 'red']
    },
    {
        id: 9,
        title: 'Twitter Logo',
        description: 'The blue bird logo representing the social media platform Twitter.',
        imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/6/6f/Logo_of_Twitter.svg',
        tags: ['social', 'blue', 'bird'],
        designer: 'Martin Grasser',
        year: '2012',
        category: 'Social Media',
        colors: ['blue']
    },
    {
        id: 10,
        title: 'Facebook Logo',
        description: 'The simple "f" logo of Facebook in its signature blue color.',
        imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/c/cd/Facebook_logo_%28square%29.png',
        tags: ['social', 'blue', 'network'],
        designer: 'Facebook',
        year: '2005',
        category: 'Social Media',
        colors: ['blue', 'white']
    },
    {
        id: 11,
        title: 'Instagram Logo',
        description: 'The colorful camera icon logo of Instagram.',
        imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/e/e7/Instagram_logo_2016.svg',
        tags: ['social', 'camera', 'gradient'],
        designer: 'Instagram',
        year: '2016',
        category: 'Social Media',
        colors: ['purple', 'pink', 'orange', 'yellow']
    },
    {
        id: 12,
        title: 'Netflix Logo',
        description: 'The bold red Netflix logo representing the streaming service.',
        imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/0/08/Netflix_2015_logo.svg',
        tags: ['entertainment', 'red', 'streaming'],
        designer: 'Netflix',
        year: '2014',
        category: 'Entertainment',
        colors: ['red', 'black']
    }
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

// Initialize filters
function initializeFilters() {
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

// Upload functionality
function handleLogoUpload(event) {
    const file = event.target.files[0];
    
    if (!file) return;
    
    if (!file.type.match('image.*')) {
        alert('Please upload an image file');
        return;
    }
    
    const reader = new FileReader();
    
    reader.onload = function(e) {
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
            id: Date.now(), // Use timestamp as unique ID
            title: logoName,
            description: logoDescription || 'Custom uploaded logo',
            imageUrl: e.target.result,
            tags: logoTags ? logoTags.split(',').map(tag => tag.trim().toLowerCase()) : ['custom', 'uploaded'],
            designer: logoDesigner || 'Unknown',
            year: logoYear || new Date().getFullYear().toString(),
            category: logoCategory || 'Custom',
            colors: logoColors ? logoColors.split(',').map(color => color.trim().toLowerCase()) : ['black', 'white']
        };
            logos.unshift(newLogo);
        
            // Update filters with new data
            initializeFilters();
            displayLogos();
        
            // Reset file input
            logoUpload.value = '';
        };
    
        reader.readAsDataURL(file);
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

// Initialize the gallery
document.addEventListener('DOMContentLoaded', () => {
        initializeFilters();
        displayLogos();
});
        // Reset file input