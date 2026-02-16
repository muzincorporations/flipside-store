// ============================================
// FIREBASE INTEGRATION
// ============================================
// This file handles all Firebase operations for the FlipSide platform

// Firebase configuration
// REPLACE THESE VALUES with your Firebase project details
const firebaseConfig = {
    apiKey: "AIzaSyCGr9Wnp8jA8XCqNVG187y3SuU7_JF-3dk",
    authDomain: "flipside-store.firebaseapp.com",
    projectId: "flipside-store",
    storageBucket: "flipside-store.firebasestorage.app",
    messagingSenderId: "815772306124",
    appId: "1:815772306124:web:3dea5682743dc416181069",
    measurementId: "G-XM3J22KZ47"
};

// Check if Firebase is configured
let firebaseEnabled = false;
let db = null;

// Initialize Firebase
function initFirebase() {
    try {
        // Check if config is set
        if (!firebaseConfig.apiKey || firebaseConfig.apiKey.startsWith("YOUR_")) {
            console.log("Firebase not configured. Using local data.");
            return false;
        }

        // Initialize Firebase
        if (!firebase.apps.length) {
            firebase.initializeApp(firebaseConfig);
        }

        db = firebase.firestore();
        firebaseEnabled = true;
        console.log("✅ Firebase connected successfully");
        return true;
    } catch (error) {
        console.error("Firebase initialization error:", error);
        return false;
    }
}

// ===== PRODUCTS OPERATIONS =====

// Save products to Firebase
async function saveProductsToFirebase(products) {
    if (!firebaseEnabled) {
        console.log("Firebase not enabled. Changes saved locally only.");
        return false;
    }

    try {
        const batch = db.batch();

        // Clear existing products
        const productsRef = db.collection('products');
        const snapshot = await productsRef.get();
        snapshot.forEach(doc => batch.delete(doc.ref));

        // Add new products
        products.forEach(product => {
            const docRef = productsRef.doc(product.id.toString());
            batch.set(docRef, product);
        });

        await batch.commit();
        console.log("✅ Products saved to Firebase");
        return true;
    } catch (error) {
        console.error("Error saving products:", error);
        return false;
    }
}

// Load products from Firebase
async function loadProductsFromFirebase() {
    if (!firebaseEnabled) {
        // Return local products as fallback
        return getAllProducts();
    }

    try {
        const snapshot = await db.collection('products').get();
        const products = [];

        snapshot.forEach(doc => {
            products.push(doc.data());
        });

        // Sort by ID
        products.sort((a, b) => a.id - b.id);

        console.log(`✅ Loaded ${products.length} products from Firebase`);
        return products;
    } catch (error) {
        console.error("Error loading products:", error);
        // Fallback to local products
        return getAllProducts();
    }
}

// Add a single product
async function addProductToFirebase(product) {
    if (!firebaseEnabled) {
        console.log("Firebase not enabled. Add product to products.js manually.");
        return false;
    }

    try {
        await db.collection('products').doc(product.id.toString()).set(product);
        console.log("✅ Product added to Firebase");
        return true;
    } catch (error) {
        console.error("Error adding product:", error);
        return false;
    }
}

// Update a single product
async function updateProductInFirebase(productId, updates) {
    if (!firebaseEnabled) {
        console.log("Firebase not enabled.");
        return false;
    }

    try {
        await db.collection('products').doc(productId.toString()).update(updates);
        console.log("✅ Product updated in Firebase");
        return true;
    } catch (error) {
        console.error("Error updating product:", error);
        return false;
    }
}

// Delete a product
async function deleteProductFromFirebase(productId) {
    if (!firebaseEnabled) {
        console.log("Firebase not enabled.");
        return false;
    }

    try {
        await db.collection('products').doc(productId.toString()).delete();
        console.log("✅ Product deleted from Firebase");
        return true;
    } catch (error) {
        console.error("Error deleting product:", error);
        return false;
    }
}

// ===== CONFIGURATION OPERATIONS =====

// Save config to Firebase
async function saveConfigToFirebase(config) {
    // Always save to localStorage as a primary/fallback source
    localStorage.setItem('flipside_config', JSON.stringify(config));

    if (!firebaseEnabled) {
        console.log("Firebase not enabled. Changes saved locally.");
        return true; // Return true because it was saved locally
    }

    try {
        await db.collection('settings').doc('config').set(config);
        console.log("✅ Configuration saved to Firebase");
        return true;
    } catch (error) {
        console.error("Error saving config:", error);
        return true; // Still return true because it saved to localStorage
    }
}

// Load config from Firebase
async function loadConfigFromFirebase() {
    // Check localStorage first for immediate results or if Firebase is disabled
    const savedConfig = localStorage.getItem('flipside_config');
    let localConfig = CONFIG;
    if (savedConfig) {
        try {
            localConfig = JSON.parse(savedConfig);
        } catch (e) {
            console.error("Error parsing local config:", e);
        }
    }

    if (!firebaseEnabled) {
        return localConfig;
    }

    try {
        const doc = await db.collection('settings').doc('config').get();

        if (doc.exists) {
            console.log("✅ Configuration loaded from Firebase");
            const cloudConfig = doc.data();
            // Sync cloud config back to localStorage
            localStorage.setItem('flipside_config', JSON.stringify(cloudConfig));
            return cloudConfig;
        } else {
            // Use local config as default
            return localConfig;
        }
    } catch (error) {
        console.error("Error loading config:", error);
        return localConfig;
    }
}

// ===== ORDERS OPERATIONS =====

// Save order to Firebase
async function saveOrderToFirebase(order) {
    if (!firebaseEnabled) {
        // Save to localStorage as fallback
        const orders = JSON.parse(localStorage.getItem('orders') || '[]');
        orders.push(order);
        localStorage.setItem('orders', JSON.stringify(orders));
        return true;
    }

    try {
        await db.collection('orders').add(order);
        console.log("✅ Order saved to Firebase");
        return true;
    } catch (error) {
        console.error("Error saving order:", error);
        return false;
    }
}

// Update an order (e.g., mark as paid)
async function updateOrderInFirebase(orderId, updates) {
    if (!firebaseEnabled) {
        const orders = JSON.parse(localStorage.getItem('orders') || '[]');
        const index = orders.findIndex(o => o.orderId === orderId);
        if (index !== -1) {
            orders[index] = { ...orders[index], ...updates };
            localStorage.setItem('orders', JSON.stringify(orders));
            return true;
        }
        return false;
    }

    try {
        // Find the document with the specific orderId field
        const snapshot = await db.collection('orders').where('orderId', '==', orderId).get();
        if (snapshot.empty) return false;

        const docId = snapshot.docs[0].id;
        await db.collection('orders').doc(docId).update(updates);
        console.log("✅ Order updated in Firebase");
        return true;
    } catch (error) {
        console.error("Error updating order:", error);
        return false;
    }
}

// Listen to a specific order for status changes
function listenToOrder(orderId, callback) {
    if (!firebaseEnabled) {
        // Fallback: poll localStorage
        const poll = setInterval(() => {
            const orders = JSON.parse(localStorage.getItem('orders') || '[]');
            const order = orders.find(o => o.orderId === orderId);
            if (order) {
                callback(order);
            }
        }, 3000);
        return () => clearInterval(poll);
    }

    // Firestore real-time listener
    return db.collection('orders').where('orderId', '==', orderId)
        .onSnapshot(snapshot => {
            if (!snapshot.empty) {
                callback({ id: snapshot.docs[0].id, ...snapshot.docs[0].data() });
            }
        }, error => {
            console.error("Error listening to order:", error);
        });
}

// Delete an order
async function deleteOrderFromFirebase(orderId) {
    if (!firebaseEnabled) {
        const orders = JSON.parse(localStorage.getItem('orders') || '[]');
        const filtered = orders.filter(o => o.orderId !== orderId);
        localStorage.setItem('orders', JSON.stringify(filtered));
        return true;
    }

    try {
        // Find the document with the specific orderId field
        const snapshot = await db.collection('orders').where('orderId', '==', orderId).get();
        if (snapshot.empty) return false;

        const docId = snapshot.docs[0].id;
        await db.collection('orders').doc(docId).delete();
        console.log("✅ Order deleted from Firebase");
        return true;
    } catch (error) {
        console.error("Error deleting order:", error);
        return false;
    }
}

// Load all orders from Firebase
async function loadOrdersFromFirebase() {
    if (!firebaseEnabled) {
        return JSON.parse(localStorage.getItem('orders') || '[]');
    }

    try {
        const snapshot = await db.collection('orders').orderBy('timestamp', 'desc').get();
        const firestoreOrders = [];

        snapshot.forEach(doc => {
            firestoreOrders.push({ id: doc.id, ...doc.data() });
        });

        // Merge with local orders (avoiding duplicates)
        const localOrders = JSON.parse(localStorage.getItem('orders') || '[]');
        const combinedOrders = [...firestoreOrders];

        localOrders.forEach(localOrder => {
            // Only add if not already in Firestore list (by orderId)
            if (!combinedOrders.find(o => o.orderId === localOrder.orderId)) {
                combinedOrders.push(localOrder);
            }
        });

        // Sort combined list by timestamp
        combinedOrders.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));

        console.log(`✅ Loaded ${combinedOrders.length} orders (${firestoreOrders.length} remote, ${localOrders.length} local)`);
        return combinedOrders;
    } catch (error) {
        console.error("Error loading orders:", error);
        return JSON.parse(localStorage.getItem('orders') || '[]');
    }
}

// ===== RESELLERS OPERATIONS =====

// Save reseller to Firebase
async function saveResellerToFirebase(reseller) {
    if (!firebaseEnabled) {
        // Save to localStorage as fallback
        const resellers = JSON.parse(localStorage.getItem('allResellers') || '[]');
        resellers.push(reseller);
        localStorage.setItem('allResellers', JSON.stringify(resellers));
        return true;
    }

    try {
        await db.collection('resellers').doc(reseller.id).set(reseller);
        console.log("✅ Reseller saved to Firebase");
        return true;
    } catch (error) {
        console.error("Error saving reseller:", error);
        return false;
    }
}

// Load all resellers from Firebase
async function loadResellersFromFirebase() {
    if (!firebaseEnabled) {
        return JSON.parse(localStorage.getItem('allResellers') || '[]');
    }

    try {
        const snapshot = await db.collection('resellers').get();
        const resellers = [];

        snapshot.forEach(doc => {
            resellers.push(doc.data());
        });

        console.log(`✅ Loaded ${resellers.length} resellers from Firebase`);
        return resellers;
    } catch (error) {
        console.error("Error loading resellers:", error);
        return JSON.parse(localStorage.getItem('allResellers') || '[]');
    }
}

// Update reseller stats
async function updateResellerStats(resellerId, stats) {
    if (!firebaseEnabled) {
        return false;
    }

    try {
        await db.collection('resellers').doc(resellerId).update(stats);
        console.log("✅ Reseller stats updated");
        return true;
    } catch (error) {
        console.error("Error updating reseller:", error);
        return false;
    }
}

// Delete reseller
async function deleteResellerFromFirebase(resellerId) {
    if (!firebaseEnabled) {
        const resellers = JSON.parse(localStorage.getItem('allResellers') || '[]');
        const filtered = resellers.filter(r => r.id !== resellerId);
        localStorage.setItem('allResellers', JSON.stringify(filtered));
        return true;
    }

    try {
        await db.collection('resellers').doc(resellerId).delete();
        console.log("✅ Reseller deleted from Firebase");
        return true;
    } catch (error) {
        console.error("Error deleting reseller:", error);
        return false;
    }
}

// ===== APPLICATIONS OPERATIONS =====

// Save application to Firebase
async function saveApplicationToFirebase(application) {
    if (!firebaseEnabled) {
        const applications = JSON.parse(localStorage.getItem('resellerApplications') || '[]');
        applications.push(application);
        localStorage.setItem('resellerApplications', JSON.stringify(applications));
        return true;
    }

    try {
        await db.collection('applications').add(application);
        console.log("✅ Application saved to Firebase");
        return true;
    } catch (error) {
        console.error("Error saving application:", error);
        return false;
    }
}

// Load all applications from Firebase
async function loadApplicationsFromFirebase() {
    if (!firebaseEnabled) {
        return JSON.parse(localStorage.getItem('resellerApplications') || '[]');
    }

    try {
        const snapshot = await db.collection('applications').orderBy('appliedAt', 'desc').get();
        const applications = [];

        snapshot.forEach(doc => {
            applications.push({ id: doc.id, ...doc.data() });
        });

        console.log(`✅ Loaded ${applications.length} applications from Firebase`);
        return applications;
    } catch (error) {
        console.error("Error loading applications:", error);
        return JSON.parse(localStorage.getItem('resellerApplications') || '[]');
    }
}

// Delete an application
async function deleteApplicationFromFirebase(appId) {
    if (!firebaseEnabled) {
        // Fallback for simple index-based deletion (used in admin.html usually)
        return true;
    }

    try {
        await db.collection('applications').doc(appId).delete();
        console.log("✅ Application deleted from Firebase");
        return true;
    } catch (error) {
        console.error("Error deleting application:", error);
        return false;
    }
}

// ===== UTILITY FUNCTIONS =====

// Sync local products to Firebase (for initial setup)
async function syncLocalToFirebase() {
    if (!firebaseEnabled) {
        console.log("Cannot sync: Firebase not enabled");
        return false;
    }

    try {
        // Sync products
        const localProducts = getAllProducts();
        await saveProductsToFirebase(localProducts);

        // Sync config
        await saveConfigToFirebase(CONFIG);

        console.log("✅ Local data synced to Firebase");
        return true;
    } catch (error) {
        console.error("Error syncing to Firebase:", error);
        return false;
    }
}

// ===== AUTOMATION BRIDGE (AUTO-F&F) =====

/**
 * Validates and matches an incoming payment signal (from Zapier) to a pending order.
 * @param {Object} paymentSignal - { amount, senderName, senderEmail, note, timestamp }
 * @returns {Promise<Object>} - The matched order object or null
 */
async function matchIncomingPayment(paymentSignal) {
    if (!paymentSignal || !paymentSignal.amount) return null;

    try {
        const ordersRef = db.collection('orders');
        const pendingOrders = await ordersRef.where('status', '==', 'pending_payment').get();

        if (pendingOrders.empty) {
            console.log("No pending orders to match.");
            return null;
        }

        let matchedData = null;

        // Clean up amount (handle strings like "£10.50 GBP")
        const signalAmount = parseFloat(paymentSignal.amount.toString().replace(/[^0-9.]/g, ''));

        for (const doc of pendingOrders.docs) {
            const order = doc.data();
            const orderId = doc.id;

            // 1. EXACT ID MATCH (Strongest Signal)
            // Check if the Order ID is present in the payment note
            if (paymentSignal.note && paymentSignal.note.includes(order.orderId)) {
                console.log(`✅ MATCH FOUND (Order ID): ${order.orderId}`);
                matchedData = { id: orderId, ...order };
                break;
            }

            // 2. FUZZY MATCH (Fallback)
            // Match exact amount AND (sender email OR customer name)
            const amountMatch = Math.abs(order.total - signalAmount) < 0.05; // 5 cent tolerance

            // Helper for case-insensitive check
            const safeLower = (str) => (str || '').toLowerCase();

            const emailMatch = safeLower(order.email) === safeLower(paymentSignal.senderEmail);
            const nameMatch = order.shipping && (
                safeLower(order.shipping.firstName) === safeLower(paymentSignal.senderName) ||
                safeLower(order.shipping.lastName) === safeLower(paymentSignal.senderName)
            );

            if (amountMatch && (emailMatch || nameMatch)) {
                console.log(`⚠️ FUZZY MATCH (Amount + Metadata): ${order.orderId}`);
                matchedData = { id: orderId, ...order };
                break;
            }
        }

        return matchedData;

    } catch (error) {
        console.error("Error matching payment:", error);
        return null;
    }
}

/**
 * Simulates an incoming payment (Use for Testing or Manual Injection)
 * @param {Object} paymentData 
 */
async function simulateIncomingPayment(paymentSignal) {
    if (!firebaseEnabled) return false;

    try {
        const paymentsRef = db.collection('incoming_payments');
        // Add processed: false flag so the listener picks it up
        await paymentsRef.add({
            ...paymentSignal,
            processed: false,
            timestamp: new Date().toISOString()
        });
        console.log("🧪 Simulated payment injected successfully.");
        return true;
    } catch (error) {
        console.error("Error simulating payment:", error);
        return false;
    }
}

/**
 * Starts the Background Automation Listener
 * Watches 'incoming_payments' collection for new docs where processed == false
 */
function startAutomationListener(onMatchFound) {
    if (!firebaseEnabled) return;

    const paymentsRef = db.collection('incoming_payments');

    // Listen for UNPROCESSED payments
    // In a real production app, this would run on a backend server (Cloud Function)
    // But running it in the Admin Dashboard is a valid "Serverless" workaround for small scale
    return paymentsRef.where('processed', '==', false).onSnapshot((snapshot) => {
        snapshot.docChanges().forEach(async (change) => {
            if (change.type === "added") {
                const signalDoc = change.doc;
                const signal = signalDoc.data();

                console.log("🔔 New Payment Signal Received:", signal);

                // Attempt to match
                const matchedOrder = await matchIncomingPayment(signal);

                if (matchedOrder) {
                    // Determine if digital only
                    const isDigitalOnly = matchedOrder.cart.every(item => {
                        const product = products.find(p => p.id === item.id);
                        return product ? product.type === 'digital' : item.type === 'digital';
                    });

                    const newStatus = isDigitalOnly ? 'completed' : 'paid';

                    // 1. Update Order Status
                    await updateOrderInFirebase(matchedOrder.orderId, {
                        status: newStatus,
                        payment_verified_by: 'automation_bridge',
                        payment_signal_id: signalDoc.id
                    });

                    // 2. Mark Signal as Processed so we don't process it again
                    await paymentsRef.doc(signalDoc.id).update({
                        processed: true,
                        matched_order_id: matchedOrder.orderId,
                        processed_at: new Date().toISOString()
                    });

                    console.log(`🚀 Automation Success: Order ${matchedOrder.orderId} updated to ${newStatus}`);

                    if (onMatchFound) onMatchFound(matchedOrder.orderId, newStatus);
                } else {
                    console.log("No match found for this signal yet.");
                }
            }
        });
    });
}

// ===== REVIEWS OPERATIONS =====

// Save a review to Firebase
async function saveReviewToFirebase(review) {
    if (!firebaseEnabled) {
        // Mock save to local storage
        const reviews = JSON.parse(localStorage.getItem('product_reviews') || '[]');
        reviews.push(review);
        localStorage.setItem('product_reviews', JSON.stringify(reviews));
        return true;
    }

    try {
        await db.collection('reviews').add({
            ...review,
            timestamp: new Date().toISOString(),
            status: 'pending' // Reviews can be moderated
        });
        console.log("✅ Review saved to Firebase");
        return true;
    } catch (error) {
        console.error("Error saving review:", error);
        return false;
    }
}

// Load reviews for a specific product
async function loadReviewsFromFirebase(productId) {
    if (!firebaseEnabled) {
        const reviews = JSON.parse(localStorage.getItem('product_reviews') || '[]');
        return reviews.filter(r => r.productId.toString() === productId.toString());
    }

    try {
        const snapshot = await db.collection('reviews')
            .where('productId', '==', productId.toString())
            .where('status', '==', 'approved')
            .orderBy('timestamp', 'desc')
            .get();

        const reviews = [];
        snapshot.forEach(doc => {
            reviews.push({ id: doc.id, ...doc.data() });
        });
        return reviews;
    } catch (error) {
        console.error("Error loading reviews:", error);
        // Fallback to local
        const reviews = JSON.parse(localStorage.getItem('product_reviews') || '[]');
        return reviews.filter(r => r.productId.toString() === productId.toString());
    }
}

// Load all reviews (for Admin moderation)
async function loadAllReviewsFromFirebase() {
    if (!firebaseEnabled) return [];
    try {
        const snapshot = await db.collection('reviews').orderBy('timestamp', 'desc').get();
        const reviews = [];
        snapshot.forEach(doc => {
            reviews.push({ id: doc.id, ...doc.data() });
        });
        return reviews;
    } catch (error) {
        console.error("Error loading all reviews:", error);
        return [];
    }
}

// Update review status (approve/reject)
async function updateReviewStatus(reviewId, status) {
    if (!firebaseEnabled) return false;
    try {
        await db.collection('reviews').doc(reviewId).update({ status });
        return true;
    } catch (error) {
        console.error("Error updating review:", error);
        return false;
    }
}

// Check Firebase connection status
function isFirebaseConnected() {
    return firebaseEnabled;
}

// Export functions for use in other files
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        initFirebase,
        isFirebaseConnected,
        saveProductsToFirebase,
        loadProductsFromFirebase,
        addProductToFirebase,
        updateProductInFirebase,
        deleteProductFromFirebase,
        saveConfigToFirebase,
        loadConfigFromFirebase,
        saveOrderToFirebase,
        updateOrderInFirebase,
        deleteOrderFromFirebase,
        listenToOrder,
        loadOrdersFromFirebase,
        saveResellerToFirebase,
        loadResellersFromFirebase,
        updateResellerInFirebase,
        deleteResellerFromFirebase,
        updateResellerStats,
        saveApplicationToFirebase,
        loadApplicationsFromFirebase,
        deleteApplicationFromFirebase,
        syncLocalToFirebase,
        simulateIncomingPayment,
        startAutomationListener,
        saveReviewToFirebase,
        loadReviewsFromFirebase,
        loadAllReviewsFromFirebase,
        updateReviewStatus
    };
}
