<script setup>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useToast } from 'primevue/usetoast';
import { useConfirm } from 'primevue/useconfirm';
import { useSimulador } from '../composables/useSimulador.js';

const router = useRouter();
const toast = useToast();
const confirm = useConfirm();

const {
  historialSimulaciones,
  loading,
  fetchHistorial,
  cargarSimulacion,
  eliminarSimulacion
} = useSimulador();

// State
const searchQuery = ref('');
const selectedSimulacion = ref(null);

// Methods
const formatCurrency = (value) => {
  return new Intl.NumberFormat('es-PE', {
    style: 'currency',
    currency: 'PEN',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(value || 0);
};

const formatDate = (dateString) => {
  if (!dateString) return 'N/A';
  const date = new Date(dateString);
  return new Intl.DateTimeFormat('es-PE', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  }).format(date);
};

const handleVerDetalle = async (simulacion) => {
  try {
    await cargarSimulacion(simulacion.id);
    router.push('/simulador');
    toast.add({
      severity: 'success',
      summary: 'Simulación cargada',
      detail: 'La simulación ha sido cargada correctamente',
      life: 3000
    });
  } catch (error) {
    toast.add({
      severity: 'error',
      summary: 'Error',
      detail: error.message || 'Error al cargar la simulación',
      life: 3000
    });
  }
};

const confirmEliminar = (simulacion) => {
  confirm.require({
    message: `¿Está seguro que desea eliminar esta simulación de ${simulacion.clienteNombre}?`,
    header: 'Confirmar Eliminación',
    icon: 'pi pi-exclamation-triangle',
    acceptLabel: 'Sí, eliminar',
    rejectLabel: 'Cancelar',
    acceptClass: 'p-button-danger',
    accept: () => handleEliminar(simulacion.id)
  });
};

const handleEliminar = async (id) => {
  try {
    await eliminarSimulacion(id);
    toast.add({
      severity: 'success',
      summary: 'Éxito',
      detail: 'Simulación eliminada correctamente',
      life: 3000
    });
  } catch (error) {
    toast.add({
      severity: 'error',
      summary: 'Error',
      detail: error.message || 'Error al eliminar la simulación',
      life: 3000
    });
  }
};

const volverAlSimulador = () => {
  router.push('/simulador');
};

// Lifecycle
onMounted(() => {
  fetchHistorial();
});
</script>

<template>
  <div class="historial-view">
    <!-- Header -->
    <div class="page-header">
      <h1 class="page-title">HISTORIAL DE SIMULACIONES</h1>
    </div>

    <!-- Content Card -->
    <div class="content-card">
      <!-- Toolbar -->
      <div class="toolbar">
        <div class="search-wrapper">
          <span class="p-input-icon-left">
            <i class="pi pi-search" />
            <InputText
                v-model="searchQuery"
                placeholder="Buscar por cliente o programa..."
                class="search-input"
            />
          </span>
        </div>

        <Button
            label="Volver al Simulador"
            icon="pi pi-arrow-left"
            class="p-button-secondary"
            @click="volverAlSimulador"
        />
      </div>

      <!-- Historial Table -->
      <DataTable
          :value="historialSimulaciones"
          :loading="loading"
          :paginator="true"
          :rows="10"
          :rowsPerPageOptions="[5, 10, 20, 50]"
          paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
          currentPageReportTemplate="Mostrando {first} a {last} de {totalRecords} simulaciones"
          responsiveLayout="scroll"
          stripedRows
          class="historial-table"
          dataKey="id"
          :globalFilterFields="['clienteNombre', 'programaObjetivo', 'entidadFinanciera']"
          :filters="{ global: { value: searchQuery, matchMode: 'contains' } }"
      >
        <template #empty>
          <div class="text-center py-5">
            <i class="pi pi-inbox" style="font-size: 3rem; color: #6b7280; opacity: 0.5"></i>
            <p class="text-secondary mt-3 mb-0">No hay simulaciones guardadas</p>
          </div>
        </template>

        <template #loading>
          <div class="flex flex-column align-items-center justify-content-center py-5">
            <ProgressSpinner style="width: 50px; height: 50px" strokeWidth="4" />
            <p class="text-secondary mt-3">Cargando historial...</p>
          </div>
        </template>

        <Column field="id" header="ID" :sortable="true" style="min-width: 4rem">
          <template #body="{ data }">
            <span class="font-semibold">#{{ data.id }}</span>
          </template>
        </Column>

        <Column field="clienteNombre" header="Cliente" :sortable="true" style="min-width: 12rem">
          <template #body="{ data }">
            <div class="flex align-items-center gap-2">
              <i class="pi pi-user text-primary"></i>
              <span>{{ data.clienteNombre }}</span>
            </div>
          </template>
        </Column>

        <Column field="programaObjetivo" header="Programa" :sortable="true" style="min-width: 10rem">
          <template #body="{ data }">
            <span class="programa-badge">{{ data.programaObjetivo }}</span>
          </template>
        </Column>

        <Column field="valorVivienda" header="Valor Vivienda" :sortable="true" style="min-width: 10rem">
          <template #body="{ data }">
            <span class="font-semibold">{{ formatCurrency(data.valorVivienda) }}</span>
          </template>
        </Column>

        <Column field="montoFinanciado" header="Monto Financiado" :sortable="true" style="min-width: 10rem">
          <template #body="{ data }">
            <span class="text-primary font-semibold">{{ formatCurrency(data.montoFinanciado) }}</span>
          </template>
        </Column>

        <Column field="cuotaMensual" header="Cuota Mensual" :sortable="true" style="min-width: 10rem">
          <template #body="{ data }">
            <span class="text-success font-semibold">{{ formatCurrency(data.cuotaMensual) }}</span>
          </template>
        </Column>

        <Column field="plazoPrestamo" header="Plazo" :sortable="true" style="min-width: 8rem">
          <template #body="{ data }">
            <span>{{ data.plazoPrestamo }} meses</span>
          </template>
        </Column>

        <Column field="tasaInteres" header="Tasa" :sortable="true" style="min-width: 8rem">
          <template #body="{ data }">
            <span class="tasa-badge">
              {{ data.tasaInteres }}% {{ data.tipoTasa }}
            </span>
          </template>
        </Column>

        <Column field="createdAt" header="Fecha de Creación" :sortable="true" style="min-width: 12rem">
          <template #body="{ data }">
            <span class="text-muted">{{ formatDate(data.createdAt) }}</span>
          </template>
        </Column>

        <Column header="Acciones" style="min-width: 10rem" :exportable="false">
          <template #body="{ data }">
            <div class="flex gap-2">
              <Button
                  icon="pi pi-eye"
                  class="p-button-rounded p-button-text p-button-info"
                  v-tooltip.top="'Ver Detalle'"
                  @click="handleVerDetalle(data)"
              />
              <Button
                  icon="pi pi-trash"
                  class="p-button-rounded p-button-text p-button-danger"
                  v-tooltip.top="'Eliminar'"
                  @click="confirmEliminar(data)"
              />
            </div>
          </template>
        </Column>
      </DataTable>
    </div>

    <!-- Toast -->
    <Toast />

    <!-- Confirm Dialog -->
    <ConfirmDialog />
  </div>
</template>

<style scoped>
.historial-view {
  max-width: 100%;
  margin: 0;
  padding: 0;
}

.page-header {
  text-align: center;
  margin-bottom: 1.5rem;
  padding-top: 1rem;
}

.page-title {
  font-size: 1.75rem;
  font-weight: 700;
  color: #1f2937;
  margin: 0;
  letter-spacing: -0.025em;
}

.content-card {
  background: white;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  padding: 2rem;
  margin: 0 1.5rem;
}

.toolbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
  gap: 1rem;
}

.search-wrapper {
  flex: 1;
  max-width: 400px;
}

.search-input {
  width: 100%;
  padding-left: 2.5rem;
}

.historial-table {
  font-size: 0.875rem;
}

.programa-badge {
  display: inline-block;
  padding: 0.375rem 0.875rem;
  border-radius: 16px;
  background: #dbeafe;
  color: #1e40af;
  font-size: 0.8125rem;
  font-weight: 600;
}

.tasa-badge {
  display: inline-block;
  padding: 0.375rem 0.875rem;
  border-radius: 16px;
  background: #fef3c7;
  color: #92400e;
  font-size: 0.8125rem;
  font-weight: 600;
}

.text-primary {
  color: #059669;
}

.text-success {
  color: #10b981;
}

.text-secondary {
  color: #6b7280;
}

.text-muted {
  color: #9ca3af;
  font-size: 0.8125rem;
}

.font-semibold {
  font-weight: 600;
}

/* Estilos de DataTable */
:deep(.p-datatable) {
  border-radius: 0;
  overflow: visible;
  box-shadow: none;
  border: none;
}

:deep(.p-datatable .p-datatable-thead > tr > th) {
  background: transparent;
  color: #374151;
  font-weight: 700;
  border-bottom: 1px solid #e5e7eb;
  padding: 0.875rem 1rem;
  font-size: 0.8125rem;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

:deep(.p-datatable .p-datatable-tbody > tr) {
  transition: all 0.2s ease;
  border-bottom: 1px solid #f3f4f6;
}

:deep(.p-datatable .p-datatable-tbody > tr:hover) {
  background: #f9fafb;
}

:deep(.p-datatable .p-datatable-tbody > tr > td) {
  padding: 1rem;
  font-size: 0.875rem;
  border: none;
}

/* Paginator */
:deep(.p-paginator) {
  background: #059669;
  color: white;
  padding: 1rem 1.5rem;
  border-radius: 8px;
  margin-top: 1rem;
}

:deep(.p-paginator .p-paginator-pages .p-paginator-page) {
  color: white;
  border-color: rgba(255, 255, 255, 0.3);
  min-width: 2.5rem;
  height: 2.5rem;
  margin: 0 0.25rem;
  border-radius: 6px;
}

:deep(.p-paginator .p-paginator-pages .p-paginator-page:hover) {
  background: rgba(255, 255, 255, 0.1);
}

:deep(.p-paginator .p-paginator-pages .p-paginator-page.p-highlight) {
  background: white;
  color: #059669;
  border-color: white;
}

/* Responsive */
@media (max-width: 768px) {
  .content-card {
    padding: 1rem;
    margin: 0 0.5rem;
  }

  .toolbar {
    flex-direction: column;
    gap: 1rem;
  }

  .search-wrapper {
    max-width: 100%;
  }
}

/* Botones */
:deep(.p-button-rounded) {
  width: 2rem;
  height: 2rem;
  padding: 0;
}

:deep(.p-button-text) {
  background: transparent;
}

:deep(.p-button-text:hover) {
  background: rgba(0, 0, 0, 0.04);
}

:deep(.p-button-text.p-button-info:hover) {
  background: rgba(6, 182, 212, 0.04);
}

:deep(.p-button-text.p-button-danger:hover) {
  background: rgba(239, 68, 68, 0.04);
}

:deep(.p-button-secondary) {
  background: #6b7280;
  border-color: #6b7280;
}

:deep(.p-button-secondary:hover) {
  background: #4b5563;
  border-color: #4b5563;
}
</style>