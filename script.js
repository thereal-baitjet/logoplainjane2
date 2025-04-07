// Initialize Supabase client
const supabaseUrl = 'https://spbmnwqrduizhwsiqssg.supabase.co';
const supabaseKey = 'SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNwYm1ud3FyZHVpemh3c2lxc3NnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDM5OTY5MDYsImV4cCI6MjA1OTU3MjkwNn0.cJpLpHFVKSOj0GdIUWVmHuqpvoN468r4U8f8TLh5dEE';
const supabase = window.supabase.createClient(supabaseUrl, supabaseKey);

// Your existing logos array with starter logos
let logos = [
    {
        id: 1,
        title: "Abstract Geometric Logo",
        description: "A modern abstract logo with geometric shapes in vibrant colors. Perfect for tech companies and startups.",
        image_url: "https://cdn.pixabay.com/photo/2017/03/16/21/18/logo-2150297_1280.png",
        tags: ["abstract", "geometric", "modern", "tech", "colorful"],
        designer: "Jane Smith",
        year: "2022",
        category: "Technology",
        colors: ["blue", "purple", "orange"]
    },
    {
        id: 2,
        title: "Minimalist Coffee Shop Logo",
        description: "A clean, minimalist logo for an artisanal coffee shop. Features a simple coffee cup icon with elegant typography.",
        image_url: "https://cdn.pixabay.com/photo/2016/11/26/19/04/coffee-1861608_1280.png",
        tags: ["minimalist", "coffee", "food", "beverage", "simple"],
        designer: "Mark Johnson",
        year: "2021",
        category: "Food & Beverage",
        colors: ["brown", "beige", "white"]
    },
    {
        id: 3,
        title: "Vintage Photography Logo",
        description: "A vintage-inspired logo for a professional photographer. Features a classic camera icon with retro typography.",
        image_url: "https://cdn.pixabay.com/photo/2016/11/19/14/16/camera-1839371_1280.jpg",
        tags: ["vintage", "photography", "retro", "camera", "professional"],
        designer: "Sarah Williams",
        year: "2020",
        category: "Photography",
        colors: ["black", "gold", "cream"]
    },
    {
        id: 4,
        title: "Eco-Friendly Nature Logo",
        description: "An organic, eco-friendly logo for environmental organizations or sustainable products. Features a leaf motif.",
        image_url: "https://cdn.pixabay.com/photo/2017/01/13/14/55/leaves-1977740_1280.png",
        tags: ["eco", "nature", "organic", "green", "leaf"],
        designer: "David Green",
        year: "2023",
        category: "Environment",
        colors: ["green", "brown", "white"]
    },
    {
        id: 5,
        title: "Bold Fitness Brand Logo",
        description: "A bold, energetic logo for a fitness brand or gym. Features dynamic shapes suggesting movement and strength.",
        image_url: "https://cdn.pixabay.com/photo/2016/06/09/18/36/logo-1446293_1280.png",
        tags: ["fitness", "gym", "bold", "energetic", "sports"],
        designer: "Michael Strong",
        year: "2022",
        category: "Fitness",
        colors: ["red", "black", "white"]
    },
    {
        id: 6,
        title: "Luxury Fashion Logo",
        description: "An elegant, sophisticated logo for a luxury fashion brand. Features refined typography and a minimalist icon.",
        image_url: "https://cdn.pixabay.com/photo/2017/01/31/23/42/animal-2028258_1280.png",
        tags: ["luxury", "fashion", "elegant", "sophisticated", "minimalist"],
        designer: "Sophia Chen",
        year: "2021",
        category: "Fashion",
        colors: ["black", "gold", "white"]
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
const categoryFilter = document.getElementById('category-filter');
const yearFilter = document.getElementById('year-filter');
const colorFilter = document.getElementById('color-filter');
const clearFilters = document.getElementById('clear-filters');

// Load logos from Supabase
async function loadLogosFromSupabase() {
    try {
        // First check if Supabase is properly initialized
        if (!supabase) {
            console.error("Supabase client not initialized");
            throw new Error("Supabase client not initialized");
        }
        
        console.log("Attempting to load logos from Supabase...");
        
        // Query the logos table
        const { data, error } = await supabase
            .from('logos')
            .select('*')
            .order('id', { ascending: false });
        
        if (error) throw error;
        
        if (data && data.length > 0) {
            console.log(`Loaded ${data.length} logos from Supabase`);
            logos = data;
        } else {
            console.log("No logos found in Supabase, using starter logos");
            // If no logos in database yet, upload the initial set
            for (const logo of logos) {
                try {
                    const { error } = await supabase
                        .from('logos')
                        .insert([logo]);
                    
                    if (error) throw error;
                    console.log(`Added starter logo: ${logo.title}`);
                } catch (error) {
                    console.error(`Error adding starter logo ${logo.title}:`, error);
                }
            }
        }
        
        initializeFilters();
        displayLogos();
    } catch (error) {
        console.error("Error loading logos from Supabase:", error);
        console.log("Using starter logos instead");
        initializeFilters();
        displayLogos();
    }
}
// Upload logo to Supabase
async function handleLogoUpload(event) {
    console.log("Upload function called");
    
    const file = event.target.files[0];
    console.log("File selected:", file ? file.name : "No file");
    
    if (!file) return;
    
    if (!file.type.match('image.*')) {
        alert('Please upload an image file');
        return;
    }
    
    try {
        // Create a loading indicator
        const loadingIndicator = document.createElement('div');
        loadingIndicator.className = 'loading-indicator';
        loadingIndicator.innerHTML = '<p>Uploading logo...</p>';
        document.body.appendChild(loadingIndicator);
        
        // Create a unique filename
        const fileName = `${Date.now()}_${file.name}`;
        const filePath = `logos/${fileName}`;
        
        console.log("Uploading file to Supabase Storage...");
        // Upload file to Supabase Storage
        const { data: uploadData, error: uploadError } = await supabase
            .storage
            .from('logo-images')  // Your bucket name
            .upload(filePath, file);
        
        if (uploadError) throw uploadError;
        console.log("File uploaded successfully");
        
        // Update loading indicator
        loadingIndicator.innerHTML = '<p>Processing logo...</p>';
        
        // Get the public URL
        const { data: publicUrlData } = supabase
            .storage
            .from('logo-images')
            .getPublicUrl(filePath);
        
        const downloadURL = publicUrlData.publicUrl;
        console.log("Got public URL:", downloadURL);
        
        // Remove loading indicator
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
            title: logoName,
            description: logoDescription || 'Custom uploaded logo',
            image_url: downloadURL,
            tags: logoTags ? logoTags.split(',').map(tag => tag.trim().toLowerCase()) : ['custom', 'uploaded'],
            designer: logoDesigner || 'Unknown',
            year: logoYear || new Date().getFullYear().toString(),
            category: logoCategory || 'Custom',
            colors: logoColors ? logoColors.split(',').map(color => color.trim().toLowerCase()) : ['black', 'white']
        };
        
        console.log("Saving logo data to Supabase...");
        // Save to Supabase Database
        const { error: insertError } = await supabase
            .from('logos')
            .insert([newLogo]);
        
        if (insertError) throw insertError;
        console.log("Logo data saved successfully");
        
        // Reload logos
        await loadLogosFromSupabase();
        
        // Reset file input
        logoUpload.value = '';
        
    } catch (error) {
        console.error("Error in logo upload process:", error);
        alert('Upload failed. Please try again.');
        
        // Remove loading indicator if it exists
        const loadingIndicator = document.querySelector('.loading-indicator');
        if (loadingIndicator) {
            document.body.removeChild(loadingIndicator);
        }
    }
}

// Initialize filters
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
                <img src="${logo.image_url}" alt="${logo.title}" class="logo-img">
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
    modalImg.src = logo.image_url;
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

// Search input enter key
searchInput.addEventListener('keyup', (e) => {
    if (e.key === 'Enter') {
        searchAndFilterLogos();
    }
});

// Logo upload
logoUpload.addEventListener('change', handleLogoUpload);

// Close modal
closeModal.addEventListener('click', closeModalFunc);
window.addEventListener('click', (e) => {
    if (e.target === modal) {
        closeModalFunc();
    }
});

// Filter changes
categoryFilter.addEventListener('change', searchAndFilterLogos);
yearFilter.addEventListener('change', searchAndFilterLogos);
colorFilter.addEventListener('change', searchAndFilterLogos);

// Clear filters
clearFilters.addEventListener('click', resetFilters);

// Initialize the app
document.addEventListener('DOMContentLoaded', () => {
    // Show loading indicator
    const loadingIndicator = document.createElement('div');
    loadingIndicator.className = 'loading-indicator';
    loadingIndicator.innerHTML = '<p>Loading logos...</p>';
    document.body.appendChild(loadingIndicator);
    
    // Load logos from Supabase
    loadLogosFromSupabase()
        .finally(() => {
            // Remove loading indicator when done (whether successful or not)
            if (document.body.contains(loadingIndicator)) {
                document.body.removeChild(loadingIndicator);
            }

            // Display logos
            displayLogos();
        });
});