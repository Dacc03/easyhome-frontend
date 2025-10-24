// src/modules/simulador/application/use-cases/GuardarSimulacion.js

import { Simulacion } from '../../domain/entities/Simulacion.js';

/**
 * Caso de uso: Guardar simulación en el historial
 */
export class GuardarSimulacion {
    constructor(repository) {
        this.repository = repository;
    }

    /**
     * Ejecuta el guardado de la simulación
     */
    async execute(simulacionData) {
        try {
            const simulacion = Simulacion.create(simulacionData);
            const validation = simulacion.validate();

            if (!validation.valid) {
                throw new Error(validation.errors.join(', '));
            }

            // Agregar userId del usuario actual
            const userStr = localStorage.getItem('user');
            if (userStr) {
                const user = JSON.parse(userStr);
                simulacion.userId = user.id;
            }

            // Guardar en el repositorio
            const simulacionGuardada = await this.repository.save(simulacion.toJSON());
            return simulacionGuardada;
        } catch (error) {
            console.error('Error en GuardarSimulacion:', error);
            throw error;
        }
    }
}