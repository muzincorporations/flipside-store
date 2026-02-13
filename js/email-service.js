// ============================================
// EMAIL NOTIFICATION SERVICE (EmailJS)
// ============================================

// Initialize EmailJS
(function () {
    // Check if EmailSDK is loaded
    if (window.emailjs) {
        // REPLACE WITH YOUR EMAILJS PUBLIC KEY
        emailjs.init("YOUR_PUBLIC_KEY");
    }
})();

const EmailService = {
    // Send Order Confirmation Email
    async sendOrderConfirmation(order) {
        if (!window.emailjs) {
            console.log("⚠️ EmailJS not loaded. Skipping email.");
            return;
        }

        try {
            const templateParams = {
                to_email: order.email,
                to_name: order.shipping ? order.shipping.firstName : "Customer",
                order_id: order.orderId,
                order_total: order.total.toFixed(2),
                order_items: order.cart.map(item => item.name).join(", "),
                order_status: order.status === 'pending_payment' ? 'Pending Payment' : 'Paid',
                track_link: `${window.location.origin}/track.html`, // Dynamic link to tracking page
            };

            // REPLACE WITH YOUR SERVICE ID AND TEMPLATE ID
            await emailjs.send('YOUR_SERVICE_ID', 'YOUR_TEMPLATE_ID', templateParams);
            console.log("✅ Confirmation Email Sent!");
            return true;

        } catch (error) {
            console.error("❌ Failed to send email:", error);
            return false;
        }
    }
};
