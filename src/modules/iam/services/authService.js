// src/modules/iam/infrastructure/services/authService.js

/**
 * Servicio de utilidades para autenticación
 */
export class AuthService {
    /**
     * Obtiene el token del localStorage
     * @returns {string|null}
     */
    static getToken() {
        return localStorage.getItem('token');
    }

    /**
     * Guarda el token en el localStorage
     * @param {string} token
     */
    static setToken(token) {
        localStorage.setItem('token', token);
    }

    /**
     * Elimina el token del localStorage
     */
    static removeToken() {
        localStorage.removeItem('token');
    }

    /**
     * Obtiene los datos del usuario del localStorage
     * @returns {Object|null}
     */
    static getUser() {
        const userStr = localStorage.getItem('user');
        if (!userStr) return null;

        try {
            return JSON.parse(userStr);
        } catch (error) {
            console.error('Error al parsear usuario:', error);
            return null;
        }
    }

    /**
     * Guarda los datos del usuario en el localStorage
     * @param {Object} user
     */
    static setUser(user) {
        localStorage.setItem('user', JSON.stringify(user));
    }

    /**
     * Elimina los datos del usuario del localStorage
     */
    static removeUser() {
        localStorage.removeItem('user');
    }

    /**
     * Verifica si hay un usuario autenticado
     * @returns {boolean}
     */
    static isAuthenticated() {
        const token = this.getToken();
        const user = this.getUser();
        return !!(token && user);
    }

    /**
     * Limpia toda la información de autenticación
     */
    static clearAuth() {
        this.removeToken();
        this.removeUser();
    }

    /**
     * Decodifica un token JWT (simulado)
     * @param {string} token
     * @returns {Object|null}
     */
    static decodeToken(token) {
        try {
            const parts = token.split('.');
            if (parts.length !== 3) {
                return null;
            }
            return JSON.parse(atob(parts[1]));
        } catch (error) {
            console.error('Error al decodificar token:', error);
            return null;
        }
    }

    /**
     * Verifica si el token ha expirado
     * @param {string} token
     * @returns {boolean}
     */
    static isTokenExpired(token) {
        const payload = this.decodeToken(token);
        if (!payload || !payload.exp) {
            return true;
        }
        return payload.exp < Date.now();
    }

    /**
     * Verifica si el usuario es administrador
     * @returns {boolean}
     */
    static isAdmin() {
        const user = this.getUser();
        return user?.role === 'admin';
    }

    /**
     * Obtiene el nombre completo del usuario
     * @returns {string}
     */
    static getUserFullName() {
        const user = this.getUser();
        if (!user) return '';

        if (user.firstName && user.lastName) {
            return `${user.firstName} ${user.lastName}`;
        }

        return user.username || '';
    }

    /**
     * Verifica los permisos del usuario para una acción
     * @param {string} permission
     * @returns {boolean}
     */
    static hasPermission(permission) {
        const user = this.getUser();
        if (!user) return false;

        // Por ahora, solo admin tiene todos los permisos
        return user.role === 'admin';
    }
}