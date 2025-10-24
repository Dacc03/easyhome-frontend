import { Cliente } from '../../domain/entities/Cliente.js';

/**
 * Caso de uso: Actualizar un cliente existente
 */
export class UpdateCliente {
    constructor(repository) {
        this.repository = repository;
    }

    /**
     * Ejecuta el caso de uso
     * @param {number} id - ID del cliente
     * @param {Object} clienteData - Datos actualizados del cliente
     * @returns {Promise<Object>}
     */
    async execute(id, clienteData) {
        try {
            if (!id || id <= 0) {
                throw new Error('ID inválido');
            }

            // Verificar que el cliente existe
            const clienteExistente = await this.repository.findById(id);
            if (!clienteExistente) {
                throw new Error('Cliente no encontrado');
            }

            // Crear entidad con los datos actualizados y validar
            const cliente = Cliente.create({ ...clienteExistente, ...clienteData });
            const validation = cliente.validate();

            if (!validation.valid) {
                throw new Error(validation.errors.join(', '));
            }

            // Actualizar en el repositorio
            const clienteActualizado = await this.repository.update(id, cliente.toUpdateDTO());

            return clienteActualizado;
        } catch (error) {
            console.error('Error en UpdateCliente:', error);
            throw error;
        }
    }
}