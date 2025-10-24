// src/utils/confirm-dialog-styles.js

/**
 * Aplica estilos personalizados al ConfirmDialog
 * Debe ser llamado después de que el dialog se muestre
 */
export function applyConfirmDialogStyles() {
    setTimeout(() => {
        // Encontrar el dialog y la máscara
        const dialog = document.querySelector('.p-confirm-dialog');
        const mask = document.querySelector('.p-confirm-dialog-mask');

        if (dialog) {
            dialog.style.cssText = `
        max-width: 500px !important;
        border-radius: 16px !important;
        box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25) !important;
        background: white !important;
        overflow: hidden !important;
        z-index: 9999 !important;
      `;
        }

        if (mask) {
            mask.style.cssText = `
        background-color: rgba(0, 0, 0, 0.75) !important;
        backdrop-filter: blur(4px) !important;
        z-index: 9998 !important;
        position: fixed !important;
        top: 0 !important;
        left: 0 !important;
        width: 100% !important;
        height: 100% !important;
      `;
        }
    }, 0);
}