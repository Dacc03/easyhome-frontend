// src/modules/simulador/application/use-cases/CalcularSimulacion.js

import { Simulacion } from '../../domain/entities/Simulacion.js';

/**
 * Caso de uso: Calcular simulación de plan de pagos
 */
export class CalcularSimulacion {
    constructor(repository) {
        this.repository = repository;
    }

    /**
     * Ejecuta el cálculo de la simulación
     */
    async execute(simulacionData) {
        try {
            const simulacion = Simulacion.create(simulacionData);
            const validation = simulacion.validate();

            if (!validation.valid) {
                throw new Error(validation.errors.join(', '));
            }

            // Calcular monto financiado
            simulacion.calculateMontoFinanciado();

            // Calcular cuota mensual y cronograma
            this.calcularCuotaYCronograma(simulacion);

            // Calcular indicadores financieros
            this.calcularIndicadoresFinancieros(simulacion);

            return simulacion;
        } catch (error) {
            console.error('Error en CalcularSimulacion:', error);
            throw error;
        }
    }

    /**
     * Calcula la cuota mensual y genera el cronograma de pagos
     */
    calcularCuotaYCronograma(simulacion) {
        const montoFinanciado = simulacion.montoFinanciado;
        const tasaMensual = simulacion.tipoTasa === 'TEA'
            ? this.convertirTEAaTEM(simulacion.tasaInteres)
            : simulacion.tasaInteres / 100;

        const plazoMeses = simulacion.plazoPrestamo;
        const periodoGracia = simulacion.periodoGracia || 0;

        // Fórmula de cuota fija (método francés)
        const cuotaPura = montoFinanciado * (tasaMensual * Math.pow(1 + tasaMensual, plazoMeses)) /
            (Math.pow(1 + tasaMensual, plazoMeses) - 1);

        // Agregar costos adicionales mensuales
        const costosAdicionales = this.calcularCostosAdicionalesMensuales(simulacion);
        simulacion.cuotaMensual = Math.round((cuotaPura + costosAdicionales) * 100) / 100;

        // Generar cronograma
        simulacion.cronogramaPagos = this.generarCronogramaPagos(
            simulacion,
            montoFinanciado,
            tasaMensual,
            cuotaPura,
            costosAdicionales
        );

        // Calcular total de intereses
        simulacion.totalIntereses = simulacion.cronogramaPagos.reduce(
            (total, pago) => total + pago.interes, 0
        );
    }

    /**
     * Convierte TEA a TEM
     */
    convertirTEAaTEM(tea) {
        return Math.pow(1 + tea / 100, 1/12) - 1;
    }

    /**
     * Calcula costos adicionales mensuales
     */
    calcularCostosAdicionalesMensuales(simulacion) {
        let costosMensuales = 0;

        // Seguro desgravamen (mensual)
        if (simulacion.seguroDesgravamen > 0) {
            costosMensuales += simulacion.seguroDesgravamen;
        }

        // Seguro inmueble (mensual)
        if (simulacion.seguroInmueble > 0) {
            costosMensuales += simulacion.seguroInmueble;
        }

        return costosMensuales;
    }

    /**
     * Genera el cronograma de pagos detallado
     */
    generarCronogramaPagos(simulacion, montoFinanciado, tasaMensual, cuotaPura, costosAdicionales) {
        const cronograma = [];
        let saldoInicial = montoFinanciado;
        const fechaInicio = new Date(simulacion.fechaInicioPago);
        const periodoGracia = simulacion.periodoGracia || 0;

        for (let i = 1; i <= simulacion.plazoPrestamo; i++) {
            const fechaPago = new Date(fechaInicio);
            fechaPago.setMonth(fechaPago.getMonth() + i);

            let interes = saldoInicial * tasaMensual;
            let amortizacion = 0;
            let cuotaBase = 0;

            if (i <= periodoGracia) {
                // Durante período de gracia solo se pagan intereses
                cuotaBase = interes;
                amortizacion = 0;
            } else {
                // Pago normal
                cuotaBase = cuotaPura;
                amortizacion = cuotaPura - interes;
            }

            const cuotaTotal = cuotaBase + costosAdicionales;
            const saldoFinal = saldoInicial - amortizacion;

            cronograma.push({
                numeroCuota: i,
                fechaPago: fechaPago.toISOString().split('T')[0],
                saldoInicial: Math.round(saldoInicial * 100) / 100,
                cuotaBase: Math.round(cuotaBase * 100) / 100,
                interes: Math.round(interes * 100) / 100,
                amortizacion: Math.round(amortizacion * 100) / 100,
                seguros: costosAdicionales,
                cuotaTotal: Math.round(cuotaTotal * 100) / 100,
                saldoFinal: Math.round(saldoFinal * 100) / 100
            });

            saldoInicial = saldoFinal;
        }

        return cronograma;
    }

    /**
     * Calcula indicadores financieros (TCEA, VAN, TIR)
     */
    calcularIndicadoresFinancieros(simulacion) {
        // Calcular TCEA (Tasa de Costo Efectivo Anual)
        const costosIniciales = simulacion.tasacion +
            simulacion.gastosNotariales +
            simulacion.comisionDesembolso;

        const flujosTotales = simulacion.cronogramaPagos.reduce(
            (total, pago) => total + pago.cuotaTotal, 0
        );

        const costoTotal = flujosTotales + costosIniciales + simulacion.cuotaInicial;
        const tasaEfectiva = (costoTotal / simulacion.valorVivienda - 1) * 100;

        simulacion.tcea = Math.round(tasaEfectiva * 100) / 100;

        // Calcular VAN (Valor Actual Neto) - simplificado
        const tasaDescuento = 0.10; // 10% anual
        let van = -simulacion.montoFinanciado;

        simulacion.cronogramaPagos.forEach((pago, index) => {
            van += pago.cuotaTotal / Math.pow(1 + tasaDescuento/12, index + 1);
        });

        simulacion.van = Math.round(van * 100) / 100;

        // Calcular TIR (Tasa Interna de Retorno) - simplificado
        simulacion.tir = this.calcularTIR(simulacion);
    }

    /**
     * Calcula la TIR usando método de Newton-Raphson simplificado
     */
    calcularTIR(simulacion) {
        // Implementación simplificada de TIR
        const flujos = [-simulacion.montoFinanciado];
        simulacion.cronogramaPagos.forEach(pago => {
            flujos.push(pago.cuotaTotal);
        });

        let tir = 0.1; // Estimación inicial 10%

        // Simplificación: usar la tasa mensual como aproximación
        if (simulacion.tipoTasa === 'TEA') {
            tir = this.convertirTEAaTEM(simulacion.tasaInteres) * 12 * 100;
        } else {
            tir = simulacion.tasaInteres * 12;
        }

        return Math.round(tir * 100) / 100;
    }
}