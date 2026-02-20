// ============================================
// EMAIL NOTIFICATION SERVICE (EmailJS)
// ============================================

// Initialize EmailJS
(function () {
    // Check if EmailSDK is loaded
    if (window.emailjs) {
        // EMAILJS PUBLIC KEY
        emailjs.init("NkVeUIFOgTtpiv52Z");
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

            // 1. Send Customer Confirmation
            await emailjs.send('service_zi1knre', 'template_9dvardd', templateParams);
            console.log("✅ Customer Confirmation Email Sent!");

            // 2. Send Admin Notification (Optional but recommended)
            await this.sendAdminNotification(order);

            return true;
        } catch (error) {
            console.error("❌ Failed to send customer email:", error);
            return false;
        }
    },

    // Send Admin Notification Email
    async sendAdminNotification(order) {
        try {
            const adminParams = {
                to_email: 'muzincorporations@gmail.com',
                order_id: order.orderId,
                order_total: order.total.toFixed(2),
                customer_name: order.shipping ? order.shipping.firstName : "Customer",
                customer_email: order.email,
                items: order.cart.map(item => item.name).join(", ")
            };

            // Using the same template or a different one if you prefer
            // For now, we reuse the confirmation template to keep it simple
            await emailjs.send('service_zi1knre', 'template_9dvardd', adminParams);
            console.log("✅ Admin Notification Sent!");
        } catch (error) {
            console.error("❌ Admin notification failed:", error);
        }
    }
};
