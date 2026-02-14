// ============================================
// FLIPSIDE PRODUCTS DATABASE
// ============================================
// Edit this file to add, remove, or modify products
// This is the EASY way to manage your products!

/* 
PRODUCT TEMPLATE - Copy and paste this to add new products:

{
  id: 1, // Unique number for each product
  name: "Product Name",
  type: "physical", // "physical" or "digital"
  price: 99.99, // Price in USD
  commission: 20, // Percentage commission for resellers (optional, defaults to config)
  image: "assets/products/product1.jpg", // Path to product image
  description: "Full product description goes here. Can be multiple paragraphs.",
  shortDescription: "Short one-line description for cards",
  category: "Category Name", // e.g., "Electronics", "Software", "Services"
  
  // For PHYSICAL products only:
  stock: 50, // Number in stock (null for unlimited)
  weight: 1.5, // Weight in pounds (for shipping calculation)
  shippingFee: 9.99, // Custom shipping fee (optional, uses default if not set)
  
  // For DIGITAL products only:
  downloadUrl: "https://example.com/download/product1", // Public link (optional)
  digitalContent: "LICENSE-KEY-12345", // The actual content/file to give after purchase
  fileSize: "150 MB", // Size of digital product
  
  // Optional fields:
  featured: true, // Show on homepage featured section
  onSale: false, // Show sale badge
  salePrice: 79.99, // Sale price (only if onSale is true)
  tags: ["trending", "popular"], // Tags for filtering
  images: [ // Additional images for gallery
    "assets/products/product1-1.jpg",
    "assets/products/product1-2.jpg"
  ]
}

*/

const PRODUCTS = [
    // ===== PRODUCTS (Alphabetical Order) =====

    {
        id: 1,
        name: "Digital Marketing Course",
        type: "digital",
        price: 149.99,
        commission: 30, // Higher commission for digital products (no shipping costs)
        image: "assets/products/marketing-course.jpg",
        description: "Complete digital marketing masterclass with 50+ hours of video content, downloadable resources, and lifetime access. Learn SEO, social media marketing, email campaigns, and more from industry experts.",
        shortDescription: "Complete digital marketing masterclass - 50+ hours",
        category: "Education",
        downloadUrl: "https://example.com/courses/digital-marketing",
        digitalContent: "https://flipside-storage.com/files/marketing-masterclass.zip",
        fileSize: "8.5 GB",
        featured: true,
        onSale: true,
        salePrice: 99.99,
        tags: ["digital", "education", "bestseller"]
    },

    {
        id: 2,
        name: "FlipSide Gen 4",
        type: "physical",
        price: 44.99,
        commission: 20,
        image: "assets/products/Airpods Gen 4.jpg",
        description: "The all-new FlipSide Gen 4 brings a fresh design and enhanced acoustic architecture. With a more contoured fit and improved battery life, these buds deliver deep bass and crisp highs for an immersive listening experience. Features sweat and water resistance (IPX4) and a compact charging case with USB-C support. Perfect for everyday use and active lifestyles.",
        shortDescription: "Premium rep 1:1 Airpods with enhanced sound",
        category: "Electronics",
        stock: 10,
        weight: 0.5,
        featured: true,
        onSale: false,
        tags: ["trending", "electronics", "audio"]
    },

    {
        id: 3,
        name: "FlipSide Pros 3rd Gen",
        type: "physical",
        price: 49.99,
        commission: 20,
        image: "assets/products/Airpod Pro 3s.webp",
        description: "Experience absolute 1:1 fidelity with the FlipSide Pros 3rd Gen. Featuring high-performance Active Noise Cancellation (ANC), spatial audio support, and a seamless magnetic charging case. These are the ultimate premium wireless earbuds for those who demand quality without the premium price tag. Includes a 12-month manufacturer warranty.",
        shortDescription: "Premium rep 1:1 Airpod Pros with ANC",
        category: "Electronics",
        stock: 10,
        weight: 0.5,
        featured: true,
        onSale: false,
        tags: ["trending", "electronics", "audio"]
    },

    {
        id: 4,
        name: "FlipSide Watch Ultra 2",
        type: "physical",
        price: 54.99,
        commission: 10,
        image: "assets/products/Apple Watch Ultra 2.jpg",
        description: "Experience the pinnacle of wearable technology with the FlipSide Watch Ultra 2. Engineered for endurance and adventure, it features a rugged aerospace-grade titanium case, a bright Always-On Retina display, and a customizable Action button. With advanced health monitoring, precise GPS tracking, and a long-lasting battery life, it's the ultimate companion for athletes and explorers alike.",
        shortDescription: "Premium 1:1 smartwatch with rugged design and advanced health features",
        category: "Electronics",
        stock: 10,
        weight: 0.5,
        featured: true,
        onSale: false,
        tags: ["trending", "electronics", "wearable"]
    },

    {
        id: 5,
        name: "Graphic Design Template Pack",
        type: "digital",
        price: 49.99,
        commission: 35,
        image: "assets/products/design-pack.jpg",
        description: "Professional graphic design templates for social media, presentations, and marketing materials. Includes 500+ customizable templates in various formats. Instant download and lifetime updates.",
        shortDescription: "500+ professional design templates - instant download",
        category: "Design",
        downloadUrl: "https://example.com/templates/design-pack",
        digitalContent: "ACCESS_CODE_DESIGN_2026",
        fileSize: "2.1 GB",
        featured: false,
        onSale: false,
        tags: ["digital", "design", "templates"]
    },

    {
        id: 6,
        name: "Premium Leather Wallet",
        type: "physical",
        price: 59.99,
        commission: 20,
        image: "assets/products/wallet.jpg",
        description: "Handcrafted genuine leather wallet with RFID protection. Features 8 card slots, 2 bill compartments, and a sleek minimalist design. Perfect gift for any occasion.",
        shortDescription: "Genuine leather wallet with RFID protection",
        category: "Accessories",
        stock: 75,
        weight: 0.3,
        featured: false,
        onSale: true,
        salePrice: 44.99,
        tags: ["accessories", "leather", "sale"]
    },

    {
        id: 7,
        name: "Smart Fitness Tracker",
        type: "physical",
        price: 79.99,
        commission: 20,
        image: "assets/products/fitness-tracker.jpg",
        description: "Track your fitness goals with this advanced fitness tracker. Monitor heart rate, sleep patterns, steps, calories, and more. Water-resistant with 7-day battery life. Compatible with iOS and Android.",
        shortDescription: "Advanced fitness tracker with heart rate monitoring",
        category: "Electronics",
        stock: 250,
        weight: 0.2,
        featured: false,
        onSale: false,
        tags: ["health", "fitness", "electronics"]
    }
];
// ===== HELPER FUNCTIONS =====
// Don't modify these unless you know what you're doing

// Get all products
function getAllProducts() {
    return PRODUCTS;
}

// Get product by ID
function getProductById(id) {
    return PRODUCTS.find(p => p.id === id);
}

// Get products by category
function getProductsByCategory(category) {
    return PRODUCTS.filter(p => p.category === category);
}

// Get products by type (physical/digital)
function getProductsByType(type) {
    return PRODUCTS.filter(p => p.type === type);
}

// Get featured products
function getFeaturedProducts() {
    return PRODUCTS.filter(p => p.featured === true);
}

// Get products on sale
function getSaleProducts() {
    return PRODUCTS.filter(p => p.onSale === true);
}

// Get all unique categories
function getAllCategories() {
    const categories = [...new Set(PRODUCTS.map(p => p.category))];
    return categories.sort();
}

// Calculate final price (with sale if applicable)
function getFinalPrice(product) {
    if (product.onSale && product.salePrice) {
        return product.salePrice;
    }
    return product.price;
}

// Check if product is in stock (only for physical products)
function isInStock(product) {
    if (product.type === 'digital') return true; // Digital products always available
    if (product.stock === null) return true; // Null means unlimited stock
    return product.stock > 0;
}

// Export for use in other files
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        PRODUCTS,
        getAllProducts,
        getProductById,
        getProductsByCategory,
        getProductsByType,
        getFeaturedProducts,
        getSaleProducts,
        getAllCategories,
        getFinalPrice,
        isInStock
    };
}
