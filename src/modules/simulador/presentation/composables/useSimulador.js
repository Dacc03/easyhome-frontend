// src/modules/simulador/presentation/composables/useSimulador.js

import { ref, computed } from 'vue';
import { SimuladorRepositoryImpl } from '/src/modules/simulador/infrastructure/repositories/SimuladorRepositoryImpl.js';
import { CalcularSimulacion } from '/src/modules/simulador/application/use-cases/CalcularSimulacion.js';
import { GuardarSimulacion } from '/src/modules/simulador/application/use-cases/GuardarSimulacion.js';

/**
 * Composable para manejar la lógica del simulador
 */
export const useSimulador = () => {
    // State
    const simulacionActual = ref(null);
    const historialSimulaciones = ref([]);
    const loading = ref(false);
    const error = ref(null);
    const entidadesFinancieras = ref([]);
    const programasVivienda = ref([]);

    // Repository & Use Cases
    const repository = new SimuladorRepositoryImpl();
    const calcularSimulacion = new CalcularSimulacion(repository);
    const guardarSimulacion = new GuardarSimulacion(repository);

    // Computed
    const tieneSimulacion = computed(() => simulacionActual.value !== null);
    const tieneCronograma = computed(() =>
        simulacionActual.value?.cronogramaPagos?.length > 0
    );

    // Methods

    /**
     * Calcula una nueva simulación
     */
    const calcular = async (datosSimulacion) => {
        loading.value = true;
        error.value = null;
        try {
            const resultado = await calcularSimulacion.execute(datosSimulacion);
            simulacionActual.value = resultado;
            return resultado;
        } catch (e) {
            error.value = e.message || 'Error al calcular la simulación';
            console.error('Error en calcular:', e);
            throw e;
        } finally {
            loading.value = false;
        }
    };

    /**
     * Guarda la simulación actual en el historial
     */
    const guardar = async () => {
        if (!simulacionActual.value) {
            throw new Error('No hay simulación para guardar');
        }

        loading.value = true;
        error.value = null;
        try {
            const simulacionGuardada = await guardarSimulacion.execute(simulacionActual.value);
            historialSimulaciones.value.unshift(simulacionGuardada);
            return simulacionGuardada;
        } catch (e) {
            error.value = e.message || 'Error al guardar la simulación';
            console.error('Error en guardar:', e);
            throw e;
        } finally {
            loading.value = false;
        }
    };

    /**
     * Obtiene el historial de simulaciones
     */
    const fetchHistorial = async () => {
        loading.value = true;
        error.value = null;
        try {
            const simulaciones = await repository.findAll();
            historialSimulaciones.value = simulaciones;
            return simulaciones;
        } catch (e) {
            error.value = e.message || 'Error al cargar el historial';
            console.error('Error en fetchHistorial:', e);
            throw e;
        } finally {
            loading.value = false;
        }
    };

    /**
     * Carga una simulación del historial
     */
    const cargarSimulacion = async (id) => {
        loading.value = true;
        error.value = null;
        try {
            const simulacion = await repository.findById(id);
            simulacionActual.value = simulacion;
            return simulacion;
        } catch (e) {
            error.value = e.message || 'Error al cargar la simulación';
            console.error('Error en cargarSimulacion:', e);
            throw e;
        } finally {
            loading.value = false;
        }
    };

    /**
     * Elimina una simulación del historial
     */
    const eliminarSimulacion = async (id) => {
        loading.value = true;
        error.value = null;
        try {
            await repository.delete(id);
            historialSimulaciones.value = historialSimulaciones.value.filter(
                sim => sim.id !== id
            );
        } catch (e) {
            error.value = e.message || 'Error al eliminar la simulación';
            console.error('Error en eliminarSimulacion:', e);
            throw e;
        } finally {
            loading.value = false;
        }
    };

    /**
     * Limpia la simulación actual
     */
    const limpiarSimulacion = () => {
        simulacionActual.value = null;
        error.value = null;
    };

    /**
     * Obtiene las entidades financieras
     */
    const fetchEntidadesFinancieras = async () => {
        try {
            const entidades = await repository.getEntidadesFinancieras();
            entidadesFinancieras.value = entidades;
            return entidades;
        } catch (e) {
            console.error('Error al obtener entidades financieras:', e);
            return [];
        }
    };

    /**
     * Obtiene los programas de vivienda
     */
    const fetchProgramasVivienda = async () => {
        try {
            const programas = await repository.getProgramasVivienda();
            programasVivienda.value = programas;
            return programas;
        } catch (e) {
            console.error('Error al obtener programas de vivienda:', e);
            return [];
        }
    };

    /**
     * Exporta el cronograma a Excel (simulado)
     */
    const exportarCronograma = () => {
        if (!simulacionActual.value?.cronogramaPagos) {
            throw new Error('No hay cronograma para exportar');
        }

        // Aquí se podría implementar la exportación real a Excel
        // Por ahora solo retornamos los datos formateados
        const datos = simulacionActual.value.cronogramaPagos.map(pago => ({
            'N° Cuota': pago.numeroCuota,
            'Fecha': pago.fechaPago,
            'Saldo Inicial': `S/ ${pago.saldoInicial.toFixed(2)}`,
            'Cuota Base': `S/ ${pago.cuotaBase.toFixed(2)}`,
            'Interés': `S/ ${pago.interes.toFixed(2)}`,
            'Amortización': `S/ ${pago.amortizacion.toFixed(2)}`,
            'Seguros': `S/ ${pago.seguros.toFixed(2)}`,
            'Cuota Total': `S/ ${pago.cuotaTotal.toFixed(2)}`,
            'Saldo Final': `S/ ${pago.saldoFinal.toFixed(2)}`
        }));

        return datos;
    };

    /**
     * Limpia los errores
     */
    const clearError = () => {
        error.value = null;
    };

    return {
        // State
        simulacionActual,
        historialSimulaciones,
        loading,
        error,
        entidadesFinancieras,
        programasVivienda,

        // Computed
        tieneSimulacion,
        tieneCronograma,

        // Methods
        calcular,
        guardar,
        fetchHistorial,
        cargarSimulacion,
        eliminarSimulacion,
        limpiarSimulacion,
        fetchEntidadesFinancieras,
        fetchProgramasVivienda,
        exportarCronograma,
        clearError
    };
};