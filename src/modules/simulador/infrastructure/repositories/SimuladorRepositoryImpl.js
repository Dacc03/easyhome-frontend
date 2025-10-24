// src/modules/simulador/infrastructure/repositories/SimuladorRepositoryImpl.js

import axios from 'axios';
import { SimuladorRepository } from '/src/modules/simulador/domain/repositories/SimuladorRepository.js';

export class SimuladorRepositoryImpl extends SimuladorRepository {
    constructor() {
        super();
        this.baseUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000';
        this.endpoint = `${this.baseUrl}/simulaciones`;
    }

    /**
     * Obtiene el ID del usuario actual
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
     * Guarda una simulación
     */
    async save(simulacion) {
        try {
            const userId = this.getCurrentUserId();

            const simulacionConDatos = {
                ...simulacion,
                userId,
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString()
            };

            const response = await axios.post(this.endpoint, simulacionConDatos);
            return response.data;
        } catch (error) {
            console.error('Error al guardar simulación:', error);
            this.handleError(error, 'Error al guardar la simulación');
        }
    }

    /**
     * Obtiene el historial de simulaciones del usuario
     */
    async findAll() {
        try {
            const userId = this.getCurrentUserId();

            const response = await axios.get(this.endpoint, {
                params: { userId }
            });

            // Ordenar por fecha de creación descendente
            const simulaciones = response.data.sort((a, b) =>
                new Date(b.createdAt) - new Date(a.createdAt)
            );

            return simulaciones;
        } catch (error) {
            console.error('Error al obtener simulaciones:', error);
            this.handleError(error, 'Error al obtener el historial de simulaciones');
        }
    }

    /**
     * Obtiene una simulación por ID
     */
    async findById(id) {
        try {
            const response = await axios.get(`${this.endpoint}/${id}`);
            const simulacion = response.data;

            // Verificar que la simulación pertenece al usuario actual
            const userId = this.getCurrentUserId();
            if (simulacion.userId !== userId) {
                throw new Error('No tienes permiso para ver esta simulación');
            }

            return simulacion;
        } catch (error) {
            if (error.response?.status === 404) {
                return null;
            }
            console.error('Error al obtener simulación por ID:', error);
            this.handleError(error, 'Error al obtener la simulación');
        }
    }

    /**
     * Elimina una simulación
     */
    async delete(id) {
        try {
            // Verificar que la simulación pertenece al usuario actual
            const simulacionExistente = await this.findById(id);
            const userId = this.getCurrentUserId();

            if (simulacionExistente.userId !== userId) {
                throw new Error('No tienes permiso para eliminar esta simulación');
            }

            await axios.delete(`${this.endpoint}/${id}`);
        } catch (error) {
            console.error('Error al eliminar simulación:', error);
            this.handleError(error, 'Error al eliminar la simulación');
        }
    }

    /**
     * Obtiene las entidades financieras disponibles
     */
    async getEntidadesFinancieras() {
        // Por ahora retornamos datos estáticos
        return [
            { value: 'bcp', label: 'Banco de Crédito del Perú' },
            { value: 'bbva', label: 'BBVA Continental' },
            { value: 'interbank', label: 'Interbank' },
            { value: 'scotiabank', label: 'Scotiabank' },
            { value: 'banbif', label: 'BanBif' },
            { value: 'pichincha', label: 'Banco Pichincha' },
            { value: 'mibanco', label: 'Mibanco' },
            { value: 'cajaArequipa', label: 'Caja Arequipa' },
            { value: 'cajaHuancayo', label: 'Caja Huancayo' },
            { value: 'cajaPiura', label: 'Caja Piura' },
            { value: 'estadoCivil', label: 'Seleccionar estado civil' }
        ];
    }

    /**
     * Obtiene los programas de vivienda disponibles
     */
    async getProgramasVivienda() {
        // Por ahora retornamos datos estáticos
        return [
            { value: 'techoPropio', label: 'Techo Propio' },
            { value: 'miVivienda', label: 'Nuevo Crédito MiVivienda' },
            { value: 'miViviendaVerde', label: 'MiVivienda Verde' },
            { value: 'convencional', label: 'Crédito Hipotecario Convencional' }
        ];
    }

    /**
     * Maneja los errores de las peticiones HTTP
     */
    handleError(error, defaultMessage) {
        if (error.message) {
            throw new Error(error.message);
        } else if (error.response) {
            const message = error.response.data?.message || defaultMessage;
            throw new Error(message);
        } else if (error.request) {
            throw new Error('No se pudo conectar con el servidor. Verifique su conexión.');
        } else {
            throw new Error(defaultMessage);
        }
    }
}