// ============================================
// FLIPSIDE BARCODE GENERATION LOGIC
// ============================================
// Ported from Barcode Gen Bot to stand-alone JS
// Handles store-specific formatting for barcodes

const BarcodeGenerator = {
    // Utility: Pad string with leading zeros
    padLeft(str, length) {
        return str.toString().padStart(length, '0');
    },

    // Utility: Parse £1.50 or 1.50 into 150 pence
    parsePriceToPence(priceInput) {
        const cleaned = (priceInput || '').replace(/[^\d.]/g, '').trim();
        if (cleaned.includes('.')) {
            const [pounds, pence = '0'] = cleaned.split('.');
            const totalPence = parseInt(pounds || '0') * 100 + parseInt(pence.padEnd(2, '0').substring(0, 2));
            return totalPence;
        }
        return parseInt(cleaned || '0');
    },

    // Utility: Format 150 pence to £1.50
    formatPenceToPrice(pence) {
        const pounds = Math.floor(pence / 100);
        const remainingPence = pence % 100;
        return `£${pounds}.${String(remainingPence).padStart(2, '0')}`;
    },

    // Utility: Ensure barcode is 13 digits
    cleanBarcode(input) {
        if (!input) input = '';
        let cleaned = input.replace(/\D/g, '');
        if (cleaned.length > 13) cleaned = cleaned.slice(0, 13);
        else if (cleaned.length < 13) cleaned = cleaned.padStart(13, '0');
        return cleaned;
    },

    // Luhn algorithm for Asda check digit
    luhnCalculate(partcode) {
        let len = partcode.length + 1;
        let parity = len % 2;
        let sum = 0;
        for (let i = partcode.length - 1; i >= 0; i--) {
            let d = parseInt(partcode.charAt(i));
            if ((i + 1) % 2 === parity) d *= 2;
            if (d > 9) d -= 9;
            sum += d;
        }
        let checksum = (10 - (sum % 10)) % 10;
        return checksum;
    },

    // Standard check digit for Sainsburys
    calculateCheckDigit(input) {
        let sum = 0;
        for (let i = 0; i < input.length; i++) {
            const digit = parseInt(input[input.length - 1 - i], 10);
            const weight = (i % 2 === 0) ? 3 : 1;
            sum += digit * weight;
        }
        return (10 - (sum % 10)) % 10;
    },

    // STORE GENERATORS
    generate(store, barcodeInput, priceInput) {
        const cleaned = this.cleanBarcode(barcodeInput);
        const pencePrice = this.parsePriceToPence(priceInput);
        let fullBarcode = '';
        const displayPrice = this.formatPenceToPrice(pencePrice);

        switch (store.toLowerCase()) {
            case 'asda':
                const paddedPriceAsda = this.padLeft(pencePrice, 2);
                const baseAsda = `330${cleaned}000${paddedPriceAsda}2056`;
                fullBarcode = `${baseAsda}${this.luhnCalculate(baseAsda)}`;
                break;

            case 'morrisons':
                fullBarcode = `92${cleaned}00003${pencePrice}00027`;
                break;

            case 'sainsburys':
                const paddedPriceSains = this.padLeft(pencePrice, 6);
                const baseSains = `91${cleaned}${paddedPriceSains}`;
                fullBarcode = `${baseSains}${this.calculateCheckDigit(baseSains)}`;
                break;

            case 'waitrose':
                const paddedPriceWait = this.padLeft(pencePrice, 2);
                fullBarcode = `10${cleaned}00${paddedPriceWait}`;
                break;

            case 'savers':
                fullBarcode = `97${cleaned}000${pencePrice}0`;
                break;

            default:
                throw new Error('Unsupported store');
        }

        return {
            barcode: fullBarcode,
            displayPrice: displayPrice
        };
    }
};

// Export if in Node, otherwise keep global
if (typeof module !== 'undefined' && module.exports) {
    module.exports = BarcodeGenerator;
}
