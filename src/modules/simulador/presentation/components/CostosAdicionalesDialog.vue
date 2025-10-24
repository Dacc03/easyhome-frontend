<script setup>
import { ref, watch } from 'vue';

const props = defineProps({
  visible: {
    type: Boolean,
    required: true
  },
  costos: {
    type: Object,
    default: () => ({})
  }
});

const emit = defineEmits(['update:visible', 'guardar']);

// State local
const formData = ref({
  entidadFinanciera: '',
  seguroDesgravamen: 0,
  tasacion: 0,
  seguroInmueble: 0,
  gastosNotariales: 0,
  comisionDesembolso: 0
});

// Opciones de entidades financieras
const entidadesOptions = [
  { label: 'Banco de Crédito del Perú', value: 'bcp' },
  { label: 'BBVA Continental', value: 'bbva' },
  { label: 'Interbank', value: 'interbank' },
  { label: 'Scotiabank', value: 'scotiabank' },
  { label: 'BanBif', value: 'banbif' },
  { label: 'Banco Pichincha', value: 'pichincha' },
  { label: 'Mibanco', value: 'mibanco' },
  { label: 'Caja Arequipa', value: 'cajaArequipa' },
  { label: 'Caja Huancayo', value: 'cajaHuancayo' },
  { label: 'Caja Piura', value: 'cajaPiura' }
];

// Watch para actualizar los datos cuando se abre el diálogo
watch(() => props.visible, (newVal) => {
  if (newVal) {
    formData.value = {
      entidadFinanciera: props.costos.entidadFinanciera || '',
      seguroDesgravamen: props.costos.seguroDesgravamen || 0,
      tasacion: props.costos.tasacion || 0,
      seguroInmueble: props.costos.seguroInmueble || 0,
      gastosNotariales: props.costos.gastosNotariales || 0,
      comisionDesembolso: props.costos.comisionDesembolso || 0
    };
  }
});

// Methods
const handleGuardar = () => {
  emit('guardar', { ...formData.value });
  handleClose();
};

const handleEditar = () => {
  // Permitir edición de los campos
  console.log('Modo edición activado');
};

const handleClose = () => {
  emit('update:visible', false);
};
</script>

<template>
  <Dialog
      :visible="visible"
      :style="{ width: '650px' }"
      header="Costos Adicionales"
      :modal="true"
      class="costos-dialog"
      @update:visible="handleClose"
  >
    <div class="costos-form">
      <div class="grid">
        <!-- Entidad Financiera -->
        <div class="col-12">
          <div class="field">
            <label for="entidad">Entidad Financiera</label>
            <Dropdown
                v-model="formData.entidadFinanciera"
                :options="entidadesOptions"
                optionLabel="label"
                optionValue="value"
                placeholder="Seleccionar estado civil"
                class="w-full"
            />
          </div>
        </div>

        <!-- Seguro de desgravamen -->
        <div class="col-12 md:col-6">
          <div class="field">
            <label for="desgravamen">Seguro de desgravamen</label>
            <InputNumber
                v-model="formData.seguroDesgravamen"
                mode="currency"
                currency="PEN"
                locale="es-PE"
                :minFractionDigits="2"
                class="w-full"
                placeholder="0.00"
            />
          </div>
        </div>

        <!-- Tasación -->
        <div class="col-12 md:col-6">
          <div class="field">
            <label for="tasacion">Tasación</label>
            <InputNumber
                v-model="formData.tasacion"
                mode="currency"
                currency="PEN"
                locale="es-PE"
                :minFractionDigits="2"
                class="w-full"
                placeholder="0.00"
            />
          </div>
        </div>

        <!-- Seguro de inmueble -->
        <div class="col-12 md:col-6">
          <div class="field">
            <label for="inmueble">Seguro de inmueble</label>
            <InputNumber
                v-model="formData.seguroInmueble"
                mode="currency"
                currency="PEN"
                locale="es-PE"
                :minFractionDigits="2"
                class="w-full"
                placeholder="0.00"
            />
          </div>
        </div>

        <!-- Gastos notariales y registrales -->
        <div class="col-12 md:col-6">
          <div class="field">
            <label for="notariales">Gastos notariales y registrales</label>
            <InputNumber
                v-model="formData.gastosNotariales"
                mode="currency"
                currency="PEN"
                locale="es-PE"
                :minFractionDigits="2"
                class="w-full"
                placeholder="0.00"
            />
          </div>
        </div>

        <!-- Comisión por desembolso -->
        <div class="col-12">
          <div class="field">
            <label for="comision">Comisión por desembolso</label>
            <InputNumber
                v-model="formData.comisionDesembolso"
                mode="currency"
                currency="PEN"
                locale="es-PE"
                :minFractionDigits="2"
                class="w-full"
                placeholder="0.00"
            />
          </div>
        </div>
      </div>
    </div>

    <template #footer>
      <div class="dialog-footer">
        <Button
            label="Editar"
            icon="pi pi-pencil"
            class="p-button-warning"
            @click="handleEditar"
        />
        <Button
            label="Guardar"
            icon="pi pi-check"
            class="p-button-success"
            @click="handleGuardar"
        />
      </div>
    </template>
  </Dialog>
</template>

<style scoped>
.costos-form {
  padding: 1rem 0;
}

.field {
  margin-bottom: 1.5rem;
}

.field label {
  display: block;
  margin-bottom: 0.5rem;
  color: #374151;
  font-weight: 600;
  font-size: 0.875rem;
}

.dialog-footer {
  display: flex;
  gap: 1rem;
  justify-content: center;
}
</style>

<style>
/* Estilos globales para el Dialog */
.costos-dialog.p-dialog {
  border-radius: 12px;
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
}

.costos-dialog.p-dialog .p-dialog-header {
  background: white;
  border-bottom: 1px solid #e5e7eb;
  padding: 1.5rem;
  border-radius: 12px 12px 0 0;
}

.costos-dialog.p-dialog .p-dialog-title {
  font-weight: 700;
  font-size: 1.25rem;
  color: #1f2937;
}

.costos-dialog.p-dialog .p-dialog-content {
  padding: 1.5rem;
  background: white;
}

.costos-dialog.p-dialog .p-dialog-footer {
  padding: 1.5rem;
  background: #f9fafb;
  border-top: 1px solid #e5e7eb;
  border-radius: 0 0 12px 12px;
}

/* Inputs y Dropdowns */
.costos-dialog .p-inputtext,
.costos-dialog .p-inputnumber-input,
.costos-dialog .p-dropdown {
  border: 1px solid #d1d5db;
  border-radius: 8px;
  padding: 0.75rem 1rem;
  transition: all 0.2s ease;
}

.costos-dialog .p-inputtext:hover,
.costos-dialog .p-inputnumber:hover .p-inputnumber-input,
.costos-dialog .p-dropdown:hover {
  border-color: #059669;
}

.costos-dialog .p-inputtext:focus,
.costos-dialog .p-inputnumber.p-inputnumber-focus .p-inputnumber-input,
.costos-dialog .p-dropdown.p-focus {
  border-color: #059669;
  box-shadow: 0 0 0 0.2rem rgba(5, 150, 105, 0.25);
}

/* Botones */
.costos-dialog .p-button {
  padding: 0.75rem 1.5rem;
  font-weight: 600;
  border-radius: 8px;
}

.costos-dialog .p-button-warning {
  background: #f59e0b;
  border-color: #f59e0b;
}

.costos-dialog .p-button-warning:hover {
  background: #d97706;
  border-color: #d97706;
}

.costos-dialog .p-button-success {
  background: #059669;
  border-color: #059669;
}

.costos-dialog .p-button-success:hover {
  background: #047857;
  border-color: #047857;
}
</style>