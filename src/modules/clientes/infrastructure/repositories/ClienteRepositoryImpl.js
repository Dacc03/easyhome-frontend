// src/modules/clientes/infrastructure/repositories/ClienteRepositoryImpl.js

import axios from 'axios';
import { ClienteRepository } from '../../domain/repositories/ClienteRepository.js';

baseUrl: import.meta.env.VITE_API_BASE_URL;
export class ClienteRepositoryImpl extends ClienteRepository {
    constructor() {
        super();
        this.baseUrl = import.meta.env.VITE_API_BASE_URL;
        this.endpoint = `${this.baseUrl}/clientes`;
    }

    /**
     * Obtiene el ID del usuario actual
     * @private
     */
    getCurrentUserId() {
        const userStr = localStorage.getItem('user');
        if (!userStr) {
            throw new Error('No hay usuario autenticado');
        }
        try {
            const user = JSON.parse(userStr);
            return user.id;
        } catch (error) {
            throw new Error('Error al obtener usuario actual');
        }
    }

    /**
     * Verifica si el usuario es admin
     * @private
     */
    isAdmin() {
        const userStr = localStorage.getItem('user');
        if (!userStr) return false;
        try {
            const user = JSON.parse(userStr);
            return user.role === 'admin';
        } catch (error) {
            return false;
        }
    }

    /**
     * Obtiene todos los clientes del usuario actual
     * @returns {Promise<Array>}
     */
    async findAll() {
        try {
            const userId = this.getCurrentUserId();

            // Si es admin, ver todos los clientes; si no, solo los suyos
            const params = this.isAdmin() ? {} : { userId };

            const response = await axios.get(this.endpoint, { params });
            return response.data;
        } catch (error) {
            console.error('Error al obtener clientes:', error);
            this.handleError(error, 'Error al obtener la lista de clientes');
        }
    }

    /**
     * Obtiene un cliente por su ID
     * @param {number} id - ID del cliente
     * @returns {Promise<Object|null>}
     */
    async findById(id) {
        try {
            const response = await axios.get(`${this.endpoint}/${id}`);
            const cliente = response.data;

            // Verificar que el cliente pertenece al usuario actual (excepto admin)
            if (!this.isAdmin()) {
                const userId = this.getCurrentUserId();
                if (cliente.userId !== userId) {
                    throw new Error('No tienes permiso para ver este cliente');
                }
            }

            return cliente;
        } catch (error) {
            if (error.response?.status === 404) {
                return null;
            }
            console.error('Error al obtener cliente por ID:', error);
            this.handleError(error, 'Error al obtener el cliente');
        }
    }

    /**
     * Crea un nuevo cliente
     * @param {Object} cliente - Datos del cliente
     * @returns {Promise<Object>}
     */
    async create(cliente) {
        try {
            const userId = this.getCurrentUserId();

            // Agregar userId al cliente
            const clienteConUserId = {
                ...cliente,
                userId
            };

            const response = await axios.post(this.endpoint, clienteConUserId);
            return response.data;
        } catch (error) {
            console.error('Error al crear cliente:', error);
            this.handleError(error, 'Error al crear el cliente');
        }
    }

    /**
     * Actualiza un cliente existente
     * @param {number} id - ID del cliente
     * @param {Object} cliente - Datos actualizados del cliente
     * @returns {Promise<Object>}
     */
    async update(id, cliente) {
        try {
            // Verificar que el cliente pertenece al usuario actual (excepto admin)
            if (!this.isAdmin()) {
                const clienteExistente = await this.findById(id);
                const userId = this.getCurrentUserId();

                if (clienteExistente.userId !== userId) {
                    throw new Error('No tienes permiso para actualizar este cliente');
                }
            }

            const response = await axios.put(`${this.endpoint}/${id}`, cliente);
            return response.data;
        } catch (error) {
            console.error('Error al actualizar cliente:', error);
            this.handleError(error, 'Error al actualizar el cliente');
        }
    }

    /**
     * Elimina un cliente
     * @param {number} id - ID del cliente
     * @returns {Promise<void>}
     */
    async delete(id) {
        try {
            // Verificar que el cliente pertenece al usuario actual (excepto admin)
            if (!this.isAdmin()) {
                const clienteExistente = await this.findById(id);
                const userId = this.getCurrentUserId();

                if (clienteExistente.userId !== userId) {
                    throw new Error('No tienes permiso para eliminar este cliente');
                }
            }

            await axios.delete(`${this.endpoint}/${id}`);
        } catch (error) {
            console.error('Error al eliminar cliente:', error);
            this.handleError(error, 'Error al eliminar el cliente');
        }
    }

    /**
     * Busca clientes por un término de búsqueda
     * @param {string} query - Término de búsqueda
     * @returns {Promise<Array>}
     */
    async search(query) {
        try {
            const userId = this.getCurrentUserId();

            // Obtener todos los clientes del usuario
            const params = this.isAdmin() ? {} : { userId };
            const response = await axios.get(this.endpoint, { params });

            // Filtrar localmente por el término de búsqueda
            const clientes = response.data;
            const queryLower = query.toLowerCase();

            return clientes.filter(cliente =>
                cliente.nombresApellidos.toLowerCase().includes(queryLower) ||
                cliente.dni.includes(queryLower) ||
                cliente.estadoCivil.toLowerCase().includes(queryLower)
            );
        } catch (error) {
            console.error('Error al buscar clientes:', error);
            this.handleError(error, 'Error al buscar clientes');
        }
    }

    /**
     * Maneja los errores de las peticiones HTTP
     * @param {Error} error - Error capturado
     * @param {string} defaultMessage - Mensaje por defecto
     * @throws {Error}
     */
    handleError(error, defaultMessage) {
        if (error.response) {
            const message = error.response.data?.message || defaultMessage;
            throw new Error(message);
        } else if (error.request) {
            throw new Error('No se pudo conectar con el servidor. Verifique su conexión.');
        } else {
            throw new Error(error.message || defaultMessage);
        }
    }
}