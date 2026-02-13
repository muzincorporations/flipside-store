/**
 * FLIPSIDE UTILITIES
 * Global functions for UX refinements, Social Proof, and Navigation
 */

document.addEventListener('DOMContentLoaded', () => {
    initPageProgress();
    initBackToTop();
    initSocialProof();
    syncFooterPolicies();
    initThemeToggle();
});

// 1. Page Progress Bar
function initPageProgress() {
    const bar = document.createElement('div');
    bar.className = 'page-progress';
    bar.style.width = '0%';
    document.body.appendChild(bar);

    window.addEventListener('scroll', () => {
        const winScroll = document.body.scrollTop || document.documentElement.scrollTop;
        const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
        const scrolled = (winScroll / height) * 100;
        bar.style.width = scrolled + "%";
    });
}

// 2. Back to Top Button
function initBackToTop() {
    const btn = document.createElement('div');
    btn.className = 'back-to-top';
    btn.innerHTML = '↑';
    btn.title = 'Back to Top';
    document.body.appendChild(btn);

    window.addEventListener('scroll', () => {
        if (window.pageYOffset > 300) {
            btn.classList.add('visible');
        } else {
            btn.classList.remove('visible');
        }
    });

    btn.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });
}

// 3. Social Proof Notifications (Real & Mocked)
function initSocialProof() {
    // Only show on home and product pages
    const validPages = ['index.html', 'products.html', ''];
    let currentPage = window.location.pathname.split('/').pop();
    if (currentPage === '') currentPage = 'index.html';
    if (!validPages.includes(currentPage)) return;

    const names = ['James W.', 'Sophia R.', 'Liam M.', 'Emma D.', 'Noah B.', 'Olivia S.', 'William T.', 'Isabella H.'];
    const locations = ['London', 'Manchester', 'Birmingham', 'Glasgow', 'Liverpool', 'Leeds', 'Sheffield'];
    const actions = ['purchased', 'pre-ordered', 'just got'];

    async function showProof() {
        let name, location, action, product;

        // Try to get real order if Firebase is enabled
        if (typeof firebaseEnabled !== 'undefined' && firebaseEnabled && typeof loadOrdersFromFirebase === 'function') {
            try {
                const orders = await loadOrdersFromFirebase();
                if (orders && orders.length > 0) {
                    const randomOrder = orders[Math.floor(Math.random() * Math.min(orders.length, 10))];
                    name = randomOrder.shipping ? (randomOrder.shipping.firstName + ' ' + (randomOrder.shipping.lastName ? randomOrder.shipping.lastName.charAt(0) + '.' : '')) : names[Math.floor(Math.random() * names.length)];
                    location = randomOrder.shipping ? randomOrder.shipping.city : locations[Math.floor(Math.random() * locations.length)];
                    action = 'purchased';
                    product = randomOrder.cart ? randomOrder.cart[0].name : 'Premium Product';
                }
            } catch (error) {
                console.warn("Social Proof: Failed to fetch real orders, falling back to mock.");
            }
        }

        // Fallback to mocked data if real data isn't available
        if (!name) {
            name = names[Math.floor(Math.random() * names.length)];
            location = locations[Math.floor(Math.random() * locations.length)];
            action = actions[Math.floor(Math.random() * actions.length)];
            const productNames = typeof products !== 'undefined' ? products.map(p => p.name) : ['Premium Digital Key', 'Limited Edition Tee'];
            product = productNames[Math.floor(Math.random() * productNames.length)];
        }

        const existing = document.querySelector('.social-proof');
        if (existing) existing.remove();

        const proof = document.createElement('div');
        proof.className = 'social-proof';
        proof.innerHTML = `
            <div class="social-proof-icon">💎</div>
            <div class="social-proof-content">
                <div class="social-proof-title">${name} from ${location}</div>
                <div class="social-proof-text">${action} <strong>${product}</strong></div>
                <div class="social-proof-time">Just now • Verified ✅</div>
            </div>
        `;
        document.body.appendChild(proof);

        setTimeout(() => {
            proof.classList.add('fade-out');
            setTimeout(() => proof.remove(), 500);
        }, 5000);
    }

    // Show first proof after 10 seconds, then every 45-60 seconds
    setTimeout(() => {
        showProof();
        setInterval(showProof, 45000 + Math.random() * 15000);
    }, 10000);
}

// 4. Global Footer Policy Sync
function syncFooterPolicies() {
    const footerInner = document.querySelector('.footer-bottom') || document.querySelector('footer .container');
    if (!footerInner) return;

    // Check if links already exist
    if (footerInner.innerHTML.includes('returns.html')) return;

    const policyLinks = document.createElement('div');
    policyLinks.style.marginTop = '15px';
    policyLinks.style.display = 'flex';
    policyLinks.style.justifyContent = 'center';
    policyLinks.style.gap = '20px';
    policyLinks.style.fontSize = '0.75rem';
    policyLinks.style.opacity = '0.6';

    policyLinks.innerHTML = `
        <a href="terms.html" style="color: inherit; text-decoration: none;">Terms of Service</a>
        <a href="privacy.html" style="color: inherit; text-decoration: none;">Privacy Policy</a>
        <a href="returns.html" style="color: inherit; text-decoration: none;">Return Policy</a>
    `;

    footerInner.appendChild(policyLinks);
}

// 5. Global Toast Helper (If not defined)
if (typeof showToast === 'undefined') {
    window.showToast = function (message, type = 'success') {
        const toast = document.createElement('div');
        toast.className = `toast toast-${type}`;
        toast.innerHTML = `<p class="toast-message">${message}</p>`;
        document.body.appendChild(toast);
        setTimeout(() => toast.remove(), 3000);
    };
}

// 6. Dark/Light Mode Toggle
function initThemeToggle() {
    const savedTheme = localStorage.getItem('theme') || 'dark';
    if (savedTheme === 'light') {
        document.body.classList.add('light-mode');
    }

    // Attempt to find a toggle button in the DOM, otherwise we can't do much
    // We will later add this button to all pages
    const toggleBtn = document.getElementById('themeToggle');
    if (toggleBtn) {
        updateThemeIcon(toggleBtn, savedTheme);
        toggleBtn.addEventListener('click', () => {
            const isLight = document.body.classList.toggle('light-mode');
            const newTheme = isLight ? 'light' : 'dark';
            localStorage.setItem('theme', newTheme);
            updateThemeIcon(toggleBtn, newTheme);
            showToast(`Switched to ${newTheme} mode`, 'info');
        });
    }
}

function updateThemeIcon(btn, theme) {
    btn.innerHTML = theme === 'light' ? '🌙' : '☀️';
    btn.title = `Switch to ${theme === 'light' ? 'Dark' : 'Light'} Mode`;
}
