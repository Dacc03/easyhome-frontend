// src/modules/iam/application/use-cases/SignUp.js

import { User } from '/src/modules/iam/domain/entities/User.js';

/**
 * Caso de uso: Registrar usuario (Sign Up)
 */
export class SignUp {
    constructor(repository) {
        this.repository = repository;
    }

    /**
     * Ejecuta el caso de uso
     * @param {Object} userData - Datos del usuario
     * @returns {Promise<Object>}
     */
    async execute(userData) {
        try {
            const user = User.create(userData);
            const validation = user.validateForRegister();

            if (!validation.valid) {
                throw new Error(validation.errors.join(', '));
            }

            const result = await this.repository.register(user.toRegisterDTO());

            if (result.token) {
                localStorage.setItem('token', result.token);
                localStorage.setItem('user', JSON.stringify(result.user));
            }

            return result;
        } catch (error) {
            console.error('Error en SignUp:', error);
            throw error;
        }
    }
}