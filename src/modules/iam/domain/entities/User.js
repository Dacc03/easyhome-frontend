// src/modules/iam/domain/entities/User.js

/**
 * Entidad Usuario - Representa un usuario en el dominio
 */
export class User {
    constructor(data = {}) {
        this.id = data.id || null;
        this.username = data.username || '';
        this.email = data.email || '';
        this.password = data.password || '';
        this.firstName = data.firstName || '';
        this.lastName = data.lastName || '';
        this.role = data.role || 'user'; // 'admin' o 'user'
        this.isActive = data.isActive !== undefined ? data.isActive : true;
        this.createdAt = data.createdAt || null;
        this.updatedAt = data.updatedAt || null;
    }

    /**
     * Crea una nueva instancia de Usuario
     * @param {Object} data - Datos del usuario
     * @returns {User}
     */
    static create(data) {
        return new User(data);
    }

    /**
     * Valida los datos del usuario para registro
     * @returns {Object} { valid: boolean, errors: string[] }
     */
    validateForRegister() {
        const errors = [];

        // Validar username
        if (!this.username || this.username.trim().length === 0) {
            errors.push('El nombre de usuario es requerido');
        } else if (this.username.trim().length < 3) {
            errors.push('El nombre de usuario debe tener al menos 3 caracteres');
        } else if (!/^[a-zA-Z0-9_]+$/.test(this.username)) {
            errors.push('El nombre de usuario solo puede contener letras, números y guiones bajos');
        }

        // Validar email
        if (!this.email || this.email.trim().length === 0) {
            errors.push('El correo electrónico es requerido');
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(this.email)) {
            errors.push('El correo electrónico no es válido');
        }

        // Validar password
        if (!this.password || this.password.length === 0) {
            errors.push('La contraseña es requerida');
        } else if (this.password.length < 6) {
            errors.push('La contraseña debe tener al menos 6 caracteres');
        }

        // Validar nombres
        if (!this.firstName || this.firstName.trim().length === 0) {
            errors.push('El nombre es requerido');
        }

        if (!this.lastName || this.lastName.trim().length === 0) {
            errors.push('El apellido es requerido');
        }

        return {
            valid: errors.length === 0,
            errors
        };
    }

    /**
     * Valida los datos del usuario para login
     * @returns {Object} { valid: boolean, errors: string[] }
     */
    validateForLogin() {
        const errors = [];

        // Validar username o email
        if (!this.username || this.username.trim().length === 0) {
            errors.push('El nombre de usuario es requerido');
        }

        // Validar password
        if (!this.password || this.password.length === 0) {
            errors.push('La contraseña es requerida');
        }

        return {
            valid: errors.length === 0,
            errors
        };
    }

    /**
     * Convierte la entidad a un objeto para registro
     * @returns {Object}
     */
    toRegisterDTO() {
        return {
            username: this.username,
            email: this.email,
            password: this.password,
            firstName: this.firstName,
            lastName: this.lastName,
            role: this.role,
            isActive: this.isActive
        };
    }

    /**
     * Convierte la entidad a un objeto para login
     * @returns {Object}
     */
    toLoginDTO() {
        return {
            username: this.username,
            password: this.password
        };
    }

    /**
     * Convierte la entidad a un objeto plano (sin password)
     * @returns {Object}
     */
    toJSON() {
        return {
            id: this.id,
            username: this.username,
            email: this.email,
            firstName: this.firstName,
            lastName: this.lastName,
            role: this.role,
            isActive: this.isActive,
            createdAt: this.createdAt,
            updatedAt: this.updatedAt
        };
    }

    /**
     * Obtiene el nombre completo del usuario
     * @returns {string}
     */
    getFullName() {
        return `${this.firstName} ${this.lastName}`.trim();
    }

    /**
     * Verifica si el usuario es administrador
     * @returns {boolean}
     */
    isAdmin() {
        return this.role === 'admin';
    }
}