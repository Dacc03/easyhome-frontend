// src/modules/iam/services/authGuard.js

/**
 * Guard de autenticación para proteger rutas
 * @param {Object} to - Ruta de destino
 * @param {Object} from - Ruta de origen
 * @param {Function} next - Función next
 */
export const authGuard = (to, from, next) => {
    const token = localStorage.getItem('token');
    const requiresAuth = to.matched.some(record => record.meta.requiresAuth);
    const isLoginPage = to.name === 'login';

    // Si la ruta requiere autenticación
    if (requiresAuth && !token) {
        // Redirigir al login y guardar la ruta intentada
        next({
            name: 'login',
            query: { redirect: to.fullPath }
        });
        return;
    }

    // Si está autenticado e intenta ir al login
    if (isLoginPage && token) {
        // Redirigir a la página principal
        next({ name: 'clientes' });
        return;
    }

    // Permitir navegación
    next();
};

/**
 * Guard de administrador para rutas que requieren rol de admin
 * @param {Object} to - Ruta de destino
 * @param {Object} from - Ruta de origen
 * @param {Function} next - Función next
 */
export const adminGuard = (to, from, next) => {
    const token = localStorage.getItem('token');
    const userStr = localStorage.getItem('user');

    if (!token || !userStr) {
        next({ name: 'login' });
        return;
    }

    try {
        const user = JSON.parse(userStr);

        if (user.role !== 'admin') {
            // Usuario no es administrador, redirigir a clientes
            next({ name: 'clientes' });
            return;
        }

        next();
    } catch (error) {
        console.error('Error al verificar rol de admin:', error);
        next({ name: 'login' });
    }
};