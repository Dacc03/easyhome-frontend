// src/modules/iam/application/use-cases/SignOut.js

/**
 * Caso de uso: Cerrar sesión (Sign Out)
 */
export class SignOut {
    constructor(repository) {
        this.repository = repository;
    }

    /**
     * Ejecuta el caso de uso
     * @returns {Promise<void>}
     */
    async execute() {
        try {
            await this.repository.logout();
        } catch (error) {
            console.error('Error en SignOut:', error);
            throw error;
        }
    }
}