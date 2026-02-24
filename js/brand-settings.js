// ============================================
// FLIPSIDE BRAND & SETTINGS CONFIGURATION
// ============================================
// Edit this file to update your website's information.
// EVERYTHING IS OPTIONAL: If you leave a field blank (""), 
// it will automatically be hidden from the website.

const BRAND_SETTINGS = {
    // 🏢 BUSINESS INFORMATION
    business: {
        name: "FlipSide",
        email: "muzincorporations@gmail.com",
        phone: "", // e.g., "+44 123 456 7890"
    },

    // 📱 SOCIAL MEDIA & COMMUNITY LINKS
    // Paste your full URLs here
    social: {
        discord: "https://discord.gg/ygevaK4Adb",
        tiktok: "https://www.tiktok.com/@flipside.reselling",
        linktree: "https://linktr.ee/flipside.reselling",
        youtube: "https://www.youtube.com/@flipside.reselling",
        x: "",
        instagram: "",
        telegram: "https://t.me/+c0eOOxtvP6pmYjlk",
        whatsapp: ""
    },

    // 💰 CRYPTOCURRENCY WALLETS
    // These will be shown on the checkout page if enabled
    crypto: {
        btc: "", // Bitcoin Address
        eth: ""  // Ethereum Address
    },

    // 🏦 BANK TRANSFER (UK)
    bank: {
        enabled: false,
        accountName: "",
        sortCode: "",
        accountNumber: ""
    },

    // 💳 PAYPAL CONFIGURATION
    paypal: {
        enabled: true,
        friendsAndFamily: true, // Set to true for manual F&F payments, false for automated G&S
        email: "muzincorporations@gmail.com", // Your PayPal email for F&F
        clientId: "YOUR_PAYPAL_CLIENT_ID", // Only needed if friendsAndFamily is false
        currency: "GBP"
    },

    // 🚚 SHIPPING & FEES
    shipping: {
        defaultFee: 4.99,
        freeThreshold: 50.00
    },

    // 📈 RESELLER SETTINGS
    reseller: {
        defaultCommission: 10 // Percentage (20 = 20%)
    }
};

// Do not delete this line
if (typeof module !== 'undefined') module.exports = BRAND_SETTINGS;
