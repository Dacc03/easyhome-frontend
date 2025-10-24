// src/modules/clientes/presentation/composables/useClientes.js

import { ref, computed } from 'vue';
import { ClienteRepositoryImpl } from '../../infrastructure/repositories/ClienteRepositoryImpl.js';
import { GetAllClientes } from '../../application/use-cases/GetAllClientes.js';
import { GetClienteById } from '../../application/use-cases/GetClienteById.js';
import { CreateCliente } from '../../application/use-cases/CreateCliente.js';
import { UpdateCliente } from '../../application/use-cases/UpdateCliente.js';
import { DeleteCliente } from '../../application/use-cases/DeleteCliente.js';
import { SearchClientes } from '../../application/use-cases/SearchClientes.js';

/**
 * Composable para manejar la lógica de clientes
 * Conecta la capa de presentación con los casos de uso
 */
export const useClientes = () => {
    // State
    const clientes = ref([]);
    const loading = ref(false);
    const error = ref(null);
    const searchQuery = ref('');

    // Repository & Use Cases
    const repository = new ClienteRepositoryImpl();
    const getAllClientes = new GetAllClientes(repository);
    const getClienteById = new GetClienteById(repository);
    const createCliente = new CreateCliente(repository);
    const updateCliente = new UpdateCliente(repository);
    const deleteCliente = new DeleteCliente(repository);
    const searchClientes = new SearchClientes(repository);

    // Computed
    const filteredClientes = computed(() => {
        if (!searchQuery.value || searchQuery.value.trim() === '') {
            return clientes.value;
        }

        const query = searchQuery.value.toLowerCase();
        return clientes.value.filter((cliente) => {
            return (
                cliente.nombresApellidos.toLowerCase().includes(query) ||
                cliente.dni.includes(query) ||
                cliente.estadoCivil.toLowerCase().includes(query)
            );
        });
    });

    const totalClientes = computed(() => filteredClientes.value.length);

    // Methods

    /**
     * Obtiene todos los clientes
     */
    const fetchClientes = async () => {
        loading.value = true;
        error.value = null;
        try {
            const data = await getAllClientes.execute();
            clientes.value = data;
        } catch (e) {
            error.value = e.message || 'Error al cargar clientes';
            console.error('Error fetching clientes:', e);
        } finally {
            loading.value = false;
        }
    };

    /**
     * Obtiene un cliente por ID
     * @param {number} id - ID del cliente
     */
    const fetchClienteById = async (id) => {
        loading.value = true;
        error.value = null;
        try {
            const cliente = await getClienteById.execute(id);
            return cliente;
        } catch (e) {
            error.value = e.message || 'Error al cargar el cliente';
            console.error('Error fetching cliente by id:', e);
            throw e;
        } finally {
            loading.value = false;
        }
    };

    /**
     * Crea un nuevo cliente
     * @param {Object} clienteData - Datos del cliente
     */
    const addCliente = async (clienteData) => {
        loading.value = true;
        error.value = null;
        try {
            const nuevoCliente = await createCliente.execute(clienteData);
            clientes.value.push(nuevoCliente);
            return nuevoCliente;
        } catch (e) {
            error.value = e.message || 'Error al crear cliente';
            console.error('Error creating cliente:', e);
            throw e;
        } finally {
            loading.value = false;
        }
    };

    /**
     * Actualiza un cliente existente
     * @param {number} id - ID del cliente
     * @param {Object} clienteData - Datos actualizados
     */
    const modifyCliente = async (id, clienteData) => {
        loading.value = true;
        error.value = null;
        try {
            const clienteActualizado = await updateCliente.execute(id, clienteData);
            const index = clientes.value.findIndex((c) => c.id === id);
            if (index !== -1) {
                clientes.value[index] = clienteActualizado;
            }
            return clienteActualizado;
        } catch (e) {
            error.value = e.message || 'Error al actualizar cliente';
            console.error('Error updating cliente:', e);
            throw e;
        } finally {
            loading.value = false;
        }
    };

    /**
     * Elimina un cliente
     * @param {number} id - ID del cliente
     */
    const removeCliente = async (id) => {
        loading.value = true;
        error.value = null;
        try {
            await deleteCliente.execute(id);
            clientes.value = clientes.value.filter((c) => c.id !== id);
        } catch (e) {
            error.value = e.message || 'Error al eliminar cliente';
            console.error('Error deleting cliente:', e);
            throw e;
        } finally {
            loading.value = false;
        }
    };

    /**
     * Busca clientes
     * @param {string} query - Término de búsqueda
     */
    const searchClientesQuery = async (query) => {
        loading.value = true;
        error.value = null;
        try {
            const data = await searchClientes.execute(query);
            clientes.value = data;
        } catch (e) {
            error.value = e.message || 'Error al buscar clientes';
            console.error('Error searching clientes:', e);
        } finally {
            loading.value = false;
        }
    };

    /**
     * Establece el término de búsqueda local (filtrado en cliente)
     * @param {string} query - Término de búsqueda
     */
    const setSearchQuery = (query) => {
        searchQuery.value = query;
    };

    /**
     * Limpia los errores
     */
    const clearError = () => {
        error.value = null;
    };

    return {
        // State
        clientes: filteredClientes,
        allClientes: clientes,
        loading,
        error,
        searchQuery,
        totalClientes,

        // Methods
        fetchClientes,
        fetchClienteById,
        addCliente,
        modifyCliente,
        removeCliente,
        searchClientesQuery,
        setSearchQuery,
        clearError
    };
};