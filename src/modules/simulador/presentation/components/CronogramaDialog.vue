<script setup>
import { computed } from 'vue';

const props = defineProps({
  visible: {
    type: Boolean,
    required: true
  },
  cronograma: {
    type: Array,
    default: () => []
  }
});

const emit = defineEmits(['update:visible']);

// Computed
const cronogramaData = computed(() => {
  if (!props.cronograma || props.cronograma.length === 0) {
    return [];
  }

  // Limitar a las primeras 12 cuotas para la vista inicial
  return props.cronograma.slice(0, 12);
});

const totalData = computed(() => {
  if (!props.cronograma || props.cronograma.length === 0) {
    return {
      cuotaBase: 0,
      interes: 0,
      amortizacion: 0,
      cuotaTotal: 0
    };
  }

  return props.cronograma.reduce((acc, pago) => {
    acc.cuotaBase += pago.cuotaBase || 0;
    acc.interes += pago.interes || 0;
    acc.amortizacion += pago.amortizacion || 0;
    acc.cuotaTotal += pago.cuotaTotal || 0;
    return acc;
  }, {
    cuotaBase: 0,
    interes: 0,
    amortizacion: 0,
    cuotaTotal: 0
  });
});

// Methods
const formatCurrency = (value) => {
  return new Intl.NumberFormat('es-PE', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(value || 0);
};

const formatDate = (dateString) => {
  if (!dateString) return '';
  const date = new Date(dateString + 'T00:00:00');
  return date.toLocaleDateString('es-PE', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  });
};

const handleClose = () => {
  emit('update:visible', false);
};

const exportarExcel = () => {
  // Aquí se podría implementar la exportación real a Excel
  console.log('Exportando cronograma a Excel...');
};
</script>

<template>
  <Dialog
      :visible="visible"
      :style="{ width: '90%', maxWidth: '1200px' }"
      header="Cronograma de Pagos"
      :modal="true"
      class="cronograma-dialog"
      @update:visible="handleClose"
  >
    <div class="cronograma-container">
      <!-- Tabla de cronograma -->
      <div class="table-wrapper">
        <DataTable
            :value="cronogramaData"
            :paginator="false"
            responsiveLayout="scroll"
            class="cronograma-table"
            stripedRows
        >
          <Column field="numeroCuota" header="N°" style="min-width: 50px; text-align: center">
            <template #body="slotProps">
              <span class="font-semibold">{{ slotProps.data.numeroCuota }}</span>
            </template>
          </Column>

          <Column field="fechaPago" header="Fecha de Pago" style="min-width: 120px">
            <template #body="slotProps">
              {{ formatDate(slotProps.data.fechaPago) }}
            </template>
          </Column>

          <Column field="saldoInicial" header="Saldo Inicial" style="min-width: 120px; text-align: right">
            <template #body="slotProps">
              {{ formatCurrency(slotProps.data.saldoInicial) }}
            </template>
          </Column>

          <Column field="cuotaBase" header="Cuota Base" style="min-width: 120px; text-align: right">
            <template #body="slotProps">
              {{ formatCurrency(slotProps.data.cuotaBase) }}
            </template>
          </Column>

          <Column field="interes" header="Interés" style="min-width: 100px; text-align: right">
            <template #body="slotProps">
              <span class="text-warning">{{ formatCurrency(slotProps.data.interes) }}</span>
            </template>
          </Column>

          <Column field="amortizacion" header="Amortización" style="min-width: 120px; text-align: right">
            <template #body="slotProps">
              <span class="text-success">{{ formatCurrency(slotProps.data.amortizacion) }}</span>
            </template>
          </Column>

          <Column field="saldoFinal" header="Saldo Final" style="min-width: 120px; text-align: right">
            <template #body="slotProps">
              <span class="font-semibold">{{ formatCurrency(slotProps.data.saldoFinal) }}</span>
            </template>
          </Column>
        </DataTable>
      </div>

      <!-- Nota informativa -->
      <div v-if="cronograma.length > 12" class="info-note">
        <i class="pi pi-info-circle"></i>
        <span>Se muestran las primeras 12 cuotas de {{ cronograma.length }} cuotas totales</span>
      </div>

      <!-- Resumen total -->
      <div class="total-summary">
        <div class="summary-grid">
          <div class="summary-item">
            <span class="summary-label">Total Cuota Base:</span>
            <span class="summary-value">S/ {{ formatCurrency(totalData.cuotaBase) }}</span>
          </div>
          <div class="summary-item">
            <span class="summary-label">Total Intereses:</span>
            <span class="summary-value text-warning">S/ {{ formatCurrency(totalData.interes) }}</span>
          </div>
          <div class="summary-item">
            <span class="summary-label">Total Amortización:</span>
            <span class="summary-value text-success">S/ {{ formatCurrency(totalData.amortizacion) }}</span>
          </div>
          <div class="summary-item">
            <span class="summary-label">Total a Pagar:</span>
            <span class="summary-value font-bold">S/ {{ formatCurrency(totalData.cuotaTotal) }}</span>
          </div>
        </div>
      </div>
    </div>

    <template #footer>
      <div class="dialog-footer">
        <Button
            label="Exportar a Excel"
            icon="pi pi-file-excel"
            class="p-button-success"
            @click="exportarExcel"
        />
        <Button
            label="Cerrar"
            icon="pi pi-times"
            class="p-button-secondary"
            @click="handleClose"
        />
      </div>
    </template>
  </Dialog>
</template>

<style scoped>
.cronograma-container {
  padding: 0;
}

.table-wrapper {
  max-height: 400px;
  overflow-y: auto;
  margin-bottom: 1rem;
}

.info-note {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem;
  background: #fef3c7;
  border: 1px solid #fcd34d;
  border-radius: 8px;
  color: #92400e;
  font-size: 0.875rem;
  margin-bottom: 1rem;
}

.total-summary {
  background: #f9fafb;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  padding: 1.5rem;
  margin-top: 1rem;
}

.summary-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1rem;
}

.summary-item {
  display: flex;
  justify-content: space-between;
  padding: 0.5rem;
}

.summary-label {
  font-weight: 600;
  color: #6b7280;
}

.summary-value {
  font-size: 1.125rem;
  color: #374151;
}

.text-warning {
  color: #f59e0b;
}

.text-success {
  color: #059669;
}

.font-bold {
  font-weight: 700;
}

.font-semibold {
  font-weight: 600;
}

.dialog-footer {
  display: flex;
  gap: 1rem;
  justify-content: center;
}

/* Responsive */
@media (max-width: 768px) {
  .summary-grid {
    grid-template-columns: 1fr;
  }
}
</style>

<style>
/* Estilos globales para el Dialog */
.cronograma-dialog.p-dialog {
  border-radius: 12px;
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
}

.cronograma-dialog.p-dialog .p-dialog-header {
  background: linear-gradient(135deg, #059669 0%, #047857 100%);
  color: white;
  padding: 1.5rem;
  border-radius: 12px 12px 0 0;
}

.cronograma-dialog.p-dialog .p-dialog-title {
  font-weight: 700;
  font-size: 1.25rem;
  color: white;
}

.cronograma-dialog.p-dialog .p-dialog-header-icon {
  color: white;
}

.cronograma-dialog.p-dialog .p-dialog-content {
  padding: 1.5rem;
  background: white;
}

.cronograma-dialog.p-dialog .p-dialog-footer {
  padding: 1.5rem;
  background: #f9fafb;
  border-top: 1px solid #e5e7eb;
  border-radius: 0 0 12px 12px;
}

/* Tabla personalizada */
.cronograma-table.p-datatable .p-datatable-thead > tr > th {
  background: #f3f4f6;
  color: #374151;
  font-weight: 700;
  border-bottom: 2px solid #e5e7eb;
  padding: 0.75rem;
  font-size: 0.875rem;
}

.cronograma-table.p-datatable .p-datatable-tbody > tr > td {
  padding: 0.75rem;
  font-size: 0.875rem;
  border-bottom: 1px solid #f3f4f6;
}

.cronograma-table.p-datatable .p-datatable-tbody > tr:hover {
  background: #f9fafb;
}

/* Botones */
.cronograma-dialog .p-button {
  padding: 0.75rem 1.5rem;
  font-weight: 600;
  border-radius: 8px;
}

.cronograma-dialog .p-button-success {
  background: #059669;
  border-color: #059669;
}

.cronograma-dialog .p-button-success:hover {
  background: #047857;
  border-color: #047857;
}

.cronograma-dialog .p-button-secondary {
  background: #6b7280;
  border-color: #6b7280;
}

.cronograma-dialog .p-button-secondary:hover {
  background: #4b5563;
  border-color: #4b5563;
}
</style>