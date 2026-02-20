// ============================================
// FLIPSIDE CONFIGURATION
// ============================================
// Edit this file to customize your store settings

const CONFIG = {
    // Business Information
    businessName: "FlipSide",
    businessEmail: "muzincorporations@gmail.com",
    businessPhone: "",

    // Social Media & Community Links
    social: {
        twitter: "https://twitter.com/flipside",
        instagram: "https://instagram.com/flipside",
        discord: "https://discord.gg/flipside",
        tiktok: "",
        youtube: "",
        linktree: "",
        telegram: "",
        whatsapp: ""
    },

    // Commission Settings for Resellers
    defaultCommissionRate: 20, // Default percentage commission (20% = 0.20)

    // Payment Settings
    payment: {
        // PayPal Settings
        paypal: {
            enabled: true,
            friendsAndFamily: true, // Set to true to use F&F manual verification
            email: "muzincorporations", // Your PayPal username or email
            clientId: "YOUR_PAYPAL_CLIENT_ID", // Replace with your PayPal Client ID
            currency: "GBP" // UK currency
        },

        // Bank Transfer (UK)
        bank: {
            enabled: false,
            accountName: "",
            sortCode: "",
            accountNumber: ""
        },

        // Bitcoin Settings
        bitcoin: {
            enabled: false,
            walletAddress: "" // Add your BTC wallet address when ready
        },

        // Ethereum Settings
        ethereum: {
            enabled: false,
            walletAddress: ""
        }
    },

    // Shipping Settings
    shipping: {
        // Default shipping rates (can be overridden per product)
        defaultFee: 4.99, // UK shipping in GBP
        freeShippingThreshold: 50, // Free shipping on orders over £50

        // UK Only for now
        regions: {
            uk: {
                name: "United Kingdom",
                fee: 4.99,
                estimatedDays: "2-3"
            }
        },

        // Restrict to UK only
        ukOnly: true
    },

    // Admin Settings
    admin: {
        // WARNING: In production, use proper authentication!
        // This is a simple password for demo purposes
        password: "Zohan", // Change this password!
        sessionTimeout: 3600000 // 1 hour in milliseconds
    },

    // Feature Flags
    features: {
        resellersEnabled: true,
        reviewsEnabled: true, // Enable product reviews
        wishlistEnabled: true, // Enable wishlist feature
        guestCheckoutEnabled: true // Allow checkout without account
    },

    // Email Templates (for notifications)
    emailTemplates: {
        orderConfirmation: {
            subject: "Order Confirmation - FlipSide",
            enabled: false // Set to true when email service is configured
        },
        resellerWelcome: {
            subject: "Welcome to FlipSide Reseller Program!",
            enabled: false
        }
    },

    // Email Configuration (EmailJS)
    email: {
        emailjs: {
            publicKey: 'NkVeUIFOgTtpiv52Z',
            serviceId: 'service_zi1knre',
            templateId: 'template_9dvardd'
        }
    }
};

// Export for use in other files
if (typeof module !== 'undefined' && module.exports) {
    module.exports = CONFIG;
}

// Apply Brand Settings if defined (user-editable file)
(function applyBrandSettings() {
    if (typeof BRAND_SETTINGS !== 'undefined') {
        if (BRAND_SETTINGS.business) {
            if (BRAND_SETTINGS.business.name) CONFIG.businessName = BRAND_SETTINGS.business.name;
            if (BRAND_SETTINGS.business.email) CONFIG.businessEmail = BRAND_SETTINGS.business.email;
            if (BRAND_SETTINGS.business.phone) CONFIG.businessPhone = BRAND_SETTINGS.business.phone;
        }
        if (BRAND_SETTINGS.social) {
            CONFIG.social = { ...CONFIG.social, ...BRAND_SETTINGS.social };
        }
        if (BRAND_SETTINGS.crypto) {
            if (BRAND_SETTINGS.crypto.btc) CONFIG.payment.bitcoin.walletAddress = BRAND_SETTINGS.crypto.btc;
            if (BRAND_SETTINGS.crypto.eth) CONFIG.payment.ethereum.walletAddress = BRAND_SETTINGS.crypto.eth;
        }
        if (BRAND_SETTINGS.bank) {
            CONFIG.payment.bank = { ...CONFIG.payment.bank, ...BRAND_SETTINGS.bank };
        }
        if (BRAND_SETTINGS.paypal) {
            CONFIG.payment.paypal = { ...CONFIG.payment.paypal, ...BRAND_SETTINGS.paypal };
        }
        if (BRAND_SETTINGS.shipping) {
            if (BRAND_SETTINGS.shipping.defaultFee !== undefined) CONFIG.shipping.defaultFee = BRAND_SETTINGS.shipping.defaultFee;
            if (BRAND_SETTINGS.shipping.freeThreshold !== undefined) CONFIG.shipping.freeShippingThreshold = BRAND_SETTINGS.shipping.freeThreshold;
        }
        if (BRAND_SETTINGS.reseller && BRAND_SETTINGS.reseller.defaultCommission !== undefined) {
            CONFIG.defaultCommissionRate = BRAND_SETTINGS.reseller.defaultCommission;
        }
    }
})();

// Load persistent settings from localStorage if they exist 
// (fallback for when Firebase is not used or hasn't loaded yet)
(function loadPersistentSettings() {
    const savedConfig = localStorage.getItem('flipside_config');
    if (savedConfig) {
        try {
            const parsed = JSON.parse(savedConfig);
            if (parsed.businessName) CONFIG.businessName = parsed.businessName;
            if (parsed.businessEmail) CONFIG.businessEmail = parsed.businessEmail;
            if (parsed.businessPhone) CONFIG.businessPhone = parsed.businessPhone;
            if (parsed.defaultCommissionRate) CONFIG.defaultCommissionRate = parsed.defaultCommissionRate;
            if (parsed.social) CONFIG.social = parsed.social;
            if (parsed.payment) CONFIG.payment = parsed.payment;
            if (parsed.shipping) CONFIG.shipping = parsed.shipping;
        } catch (e) {
            console.error("Error loading saved config:", e);
        }
    }
})();
