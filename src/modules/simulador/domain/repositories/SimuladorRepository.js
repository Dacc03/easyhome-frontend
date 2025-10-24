// src/modules/simulador/domain/repositories/SimuladorRepository.js

/**
 * Interface del Repositorio de Simulador
 */
export class SimuladorRepository {
    /**
     * Guarda una simulación
     */
    async save(simulacion) {
        throw new Error('Method save() must be implemented');
    }

    /**
     * Obtiene el historial de simulaciones
     */
    async findAll() {
        throw new Error('Method findAll() must be implemented');
    }

    /**
     * Obtiene una simulación por ID
     */
    async findById(id) {
        throw new Error('Method findById() must be implemented');
    }

    /**
     * Elimina una simulación
     */
    async delete(id) {
        throw new Error('Method delete() must be implemented');
    }

    /**
     * Obtiene las entidades financieras disponibles
     */
    async getEntidadesFinancieras() {
        throw new Error('Method getEntidadesFinancieras() must be implemented');
    }

    /**
     * Obtiene los programas de vivienda disponibles
     */
    async getProgramasVivienda() {
        throw new Error('Method getProgramasVivienda() must be implemented');
    }
}