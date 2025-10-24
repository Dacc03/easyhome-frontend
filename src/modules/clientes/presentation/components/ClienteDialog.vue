<script setup>
import { ref, watch } from 'vue';
import InputGroupAddon from 'primevue/inputgroupaddon';

// Props y Emits
const props = defineProps({
  visible: {
    type: Boolean,
    required: true
  },
  cliente: {
    type: Object,
    default: null
  },
  isEdit: {
    type: Boolean,
    default: false
  }
});

const emit = defineEmits(['update:visible', 'save']);

// State
const loading = ref(false);
const form = ref({
  nombresApellidos: '',
  dni: '',
  edad: null,
  ingresoFamiliar: 0,
  aporte: 0,
  estadoCivil: '',
  vivienda: {
    proyecto: '',
    tipoVivienda: '',
    valorVivienda: 0,
    modalidadVivienda: '',
    cuotaInicial: 0,
    cuotaInicialPorcentaje: 0,
    tipoVIS: '',
    ubicacion: ''
  }
});

const errors = ref({
  nombresApellidos: '',
  dni: '',
  edad: '',
  ingresoFamiliar: '',
  aporte: '',
  estadoCivil: '',
  viviendaProyecto: '',
  viviendaTipo: '',
  viviendaValor: '',
  viviendaModalidad: '',
  viviendaCuotaInicial: '',
  viviendaTipoVIS: '',
  viviendaUbicacion: ''
});

const estadosCiviles = [
  { label: 'Soltero/a', value: 'Soltero' },
  { label: 'Casado/a', value: 'Casado' },
  { label: 'Divorciado/a', value: 'Divorciado' },
  { label: 'Viudo/a', value: 'Viudo' },
  { label: 'Conviviente', value: 'Conviviente' }
];

const tiposVivienda = [
  { label: 'Casa Independiente', value: 'Casa Independiente' },
  { label: 'Departamento', value: 'Departamento' },
  { label: 'Casa en Condominio', value: 'Casa en Condominio' },
  { label: 'Dúplex', value: 'Dúplex' },
  { label: 'Triplex', value: 'Triplex' },
  { label: 'Townhouse', value: 'Townhouse' },
  { label: 'Loft', value: 'Loft' },
  { label: 'Quinta', value: 'Quinta' },
  { label: 'Casa de Playa', value: 'Casa de Playa' },
  { label: 'Casa de Campo', value: 'Casa de Campo' }
];

const modalidadesVivienda = [
  { label: 'Crédito Hipotecario Tradicional', value: 'Credito Hipotecario Tradicional' },
  { label: 'Crédito MiVivienda', value: 'Credito MiVivienda' },
  { label: 'Crédito Nuevo Crédito MiVivienda', value: 'Credito Nuevo Credito MiVivienda' },
  { label: 'Techo Propio', value: 'Techo Propio' },
  { label: 'Fondo MiVivienda', value: 'Fondo MiVivienda' }
];

const tiposVIS = [
  { label: 'VIS (Vivienda de Interés Social)', value: 'VIS' },
  { label: 'No VIS', value: 'No VIS' }
];

// Funciones helper
function resetForm() {
  form.value = {
    nombresApellidos: '',
    dni: '',
    edad: null,
    ingresoFamiliar: 0,
    aporte: 0,
    estadoCivil: '',
    vivienda: {
      proyecto: '',
      tipoVivienda: '',
      valorVivienda: 0,
      modalidadVivienda: '',
      cuotaInicial: 0,
      cuotaInicialPorcentaje: 0,
      tipoVIS: '',
      ubicacion: ''
    }
  };
}

function resetErrors() {
  errors.value = {
    nombresApellidos: '',
    dni: '',
    edad: '',
    ingresoFamiliar: '',
    aporte: '',
    estadoCivil: '',
    viviendaProyecto: '',
    viviendaTipo: '',
    viviendaValor: '',
    viviendaModalidad: '',
    viviendaCuotaInicial: '',
    viviendaTipoVIS: '',
    viviendaUbicacion: ''
  };
}

// Watch
watch(() => props.cliente, (newCliente) => {
  if (newCliente && props.isEdit) {
    form.value = {
      nombresApellidos: newCliente.nombresApellidos || '',
      dni: newCliente.dni || '',
      edad: newCliente.edad || null,
      ingresoFamiliar: newCliente.ingresoFamiliar || 0,
      aporte: newCliente.aporte || 0,
      estadoCivil: newCliente.estadoCivil || '',
      vivienda: {
        proyecto: newCliente.vivienda?.proyecto || '',
        tipoVivienda: newCliente.vivienda?.tipoVivienda || '',
        valorVivienda: newCliente.vivienda?.valorVivienda || 0,
        modalidadVivienda: newCliente.vivienda?.modalidadVivienda || '',
        cuotaInicial: newCliente.vivienda?.cuotaInicial || 0,
        cuotaInicialPorcentaje: newCliente.vivienda?.cuotaInicialPorcentaje || 0,
        tipoVIS: newCliente.vivienda?.tipoVIS || '',
        ubicacion: newCliente.vivienda?.ubicacion || ''
      }
    };
  } else {
    resetForm();
  }
  resetErrors();
}, { immediate: true });

// Métodos de validación y manejo
function handleDniInput(event) {
  const value = event.target.value;
  form.value.dni = value.replace(/[^0-9]/g, '').substring(0, 8);
}

// Calcular porcentaje de cuota inicial cuando cambia el valor o la cuota
function calcularPorcentajeCuotaInicial() {
  if (form.value.vivienda.valorVivienda > 0 && form.value.vivienda.cuotaInicial > 0) {
    form.value.vivienda.cuotaInicialPorcentaje = Math.round(
        (form.value.vivienda.cuotaInicial / form.value.vivienda.valorVivienda) * 100
    );
  } else {
    form.value.vivienda.cuotaInicialPorcentaje = 0;
  }
}

// Calcular cuota inicial cuando cambia el porcentaje
function calcularCuotaInicialDesdePorcentaje() {
  if (form.value.vivienda.valorVivienda > 0 && form.value.vivienda.cuotaInicialPorcentaje > 0) {
    form.value.vivienda.cuotaInicial = Math.round(
        (form.value.vivienda.valorVivienda * form.value.vivienda.cuotaInicialPorcentaje) / 100
    );
  } else {
    form.value.vivienda.cuotaInicial = 0;
  }
}

function validateForm() {
  let isValid = true;
  resetErrors();

  // Validar datos del cliente
  if (!form.value.nombresApellidos || form.value.nombresApellidos.trim() === '') {
    errors.value.nombresApellidos = 'El nombre y apellidos es requerido';
    isValid = false;
  } else if (form.value.nombresApellidos.trim().length < 3) {
    errors.value.nombresApellidos = 'Debe tener al menos 3 caracteres';
    isValid = false;
  }

  if (!form.value.dni) {
    errors.value.dni = 'El DNI es requerido';
    isValid = false;
  } else if (form.value.dni.length !== 8) {
    errors.value.dni = 'El DNI debe tener exactamente 8 dígitos';
    isValid = false;
  }

  if (!form.value.edad || form.value.edad <= 0) {
    errors.value.edad = 'La edad es requerida y debe ser mayor a 0';
    isValid = false;
  } else if (form.value.edad < 18) {
    errors.value.edad = 'Debe ser mayor de edad (18 años o más)';
    isValid = false;
  }

  if (!form.value.ingresoFamiliar || form.value.ingresoFamiliar <= 0) {
    errors.value.ingresoFamiliar = 'El ingreso familiar debe ser mayor a 0';
    isValid = false;
  }

  if (!form.value.aporte || form.value.aporte <= 0) {
    errors.value.aporte = 'El aporte debe ser mayor a 0';
    isValid = false;
  }

  if (!form.value.estadoCivil) {
    errors.value.estadoCivil = 'El estado civil es requerido';
    isValid = false;
  }

  // Validar datos de vivienda
  if (!form.value.vivienda.proyecto || form.value.vivienda.proyecto.trim() === '') {
    errors.value.viviendaProyecto = 'El proyecto/nombre de la vivienda es requerido';
    isValid = false;
  }

  if (!form.value.vivienda.tipoVivienda) {
    errors.value.viviendaTipo = 'El tipo de vivienda es requerido';
    isValid = false;
  }

  if (!form.value.vivienda.valorVivienda || form.value.vivienda.valorVivienda <= 0) {
    errors.value.viviendaValor = 'El valor de la vivienda debe ser mayor a 0';
    isValid = false;
  }

  if (!form.value.vivienda.modalidadVivienda) {
    errors.value.viviendaModalidad = 'La modalidad de vivienda es requerida';
    isValid = false;
  }

  if (form.value.vivienda.cuotaInicial === null || form.value.vivienda.cuotaInicial < 0) {
    errors.value.viviendaCuotaInicial = 'La cuota inicial debe ser mayor o igual a 0';
    isValid = false;
  }

  if (!form.value.vivienda.tipoVIS) {
    errors.value.viviendaTipoVIS = 'El tipo de VIS es requerido';
    isValid = false;
  }

  if (!form.value.vivienda.ubicacion || form.value.vivienda.ubicacion.trim() === '') {
    errors.value.viviendaUbicacion = 'La ubicación es requerida';
    isValid = false;
  }

  return isValid;
}

function handleSubmit() {
  if (validateForm()) {
    emit('save', { ...form.value });
  }
}

function handleClose() {
  emit('update:visible', false);
  setTimeout(() => {
    resetForm();
    resetErrors();
  }, 300);
}
</script>

<template>
  <Dialog
      :visible="visible"
      :style="{ width: '900px', maxHeight: '90vh' }"
      :header="isEdit ? 'Editar Cliente' : 'Nuevo Cliente'"
      :modal="true"
      :blockScroll="true"
      :appendTo="'body'"
      class="cliente-dialog"
      :contentStyle="{ overflow: 'auto' }"
      @update:visible="handleClose"
  >
    <div class="form-container">
      <div class="p-fluid">
        <!-- SECCIÓN: DATOS DEL CLIENTE -->
        <div class="section-header mb-3">
          <h3 class="section-title">Datos del Cliente</h3>
          <Divider />
        </div>

        <div class="grid">
          <!-- Nombres y Apellidos -->
          <div class="col-12">
            <div class="field">
              <label for="nombresApellidos" class="font-semibold">
                Nombres y Apellidos <span class="text-red-500">*</span>
              </label>
              <InputText
                  id="nombresApellidos"
                  v-model="form.nombresApellidos"
                  :class="{ 'p-invalid': errors.nombresApellidos }"
                  placeholder="Ingrese nombres y apellidos completos"
              />
              <small v-if="errors.nombresApellidos" class="p-error">
                {{ errors.nombresApellidos }}
              </small>
            </div>
          </div>

          <!-- DNI -->
          <div class="col-12 md:col-6">
            <div class="field">
              <label for="dni" class="font-semibold">
                DNI <span class="text-red-500">*</span>
              </label>
              <InputText
                  id="dni"
                  v-model="form.dni"
                  :class="{ 'p-invalid': errors.dni }"
                  placeholder="Ingrese DNI (8 dígitos)"
                  maxlength="8"
                  @input="handleDniInput"
              />
              <small v-if="errors.dni" class="p-error">
                {{ errors.dni }}
              </small>
            </div>
          </div>

          <!-- Edad -->
          <div class="col-12 md:col-6">
            <div class="field">
              <label for="edad" class="font-semibold">
                Edad <span class="text-red-500">*</span>
              </label>
              <InputNumber
                  id="edad"
                  v-model="form.edad"
                  :min="18"
                  :max="100"
                  :class="{ 'p-invalid': errors.edad }"
                  placeholder="Ingrese edad"
              />
              <small v-if="errors.edad" class="p-error">
                {{ errors.edad }}
              </small>
            </div>
          </div>

          <!-- Estado Civil -->
          <div class="col-12 md:col-6">
            <div class="field">
              <label for="estadoCivil" class="font-semibold">
                Estado Civil <span class="text-red-500">*</span>
              </label>
              <Dropdown
                  id="estadoCivil"
                  v-model="form.estadoCivil"
                  :options="estadosCiviles"
                  optionLabel="label"
                  optionValue="value"
                  placeholder="Seleccione estado civil"
                  :class="{ 'p-invalid': errors.estadoCivil }"
                  class="w-full"
                  appendTo="body"
                  :panelStyle="{ zIndex: 10000 }"
              />
              <small v-if="errors.estadoCivil" class="p-error">
                {{ errors.estadoCivil }}
              </small>
            </div>
          </div>

          <!-- Ingreso Familiar -->
          <div class="col-12 md:col-6">
            <div class="field">
              <label for="ingresoFamiliar" class="font-semibold">
                Ingreso Familiar (S/.) <span class="text-red-500">*</span>
              </label>
              <InputNumber
                  id="ingresoFamiliar"
                  v-model="form.ingresoFamiliar"
                  mode="currency"
                  currency="PEN"
                  locale="es-PE"
                  :minFractionDigits="2"
                  :class="{ 'p-invalid': errors.ingresoFamiliar }"
                  placeholder="0.00"
              />
              <small v-if="errors.ingresoFamiliar" class="p-error">
                {{ errors.ingresoFamiliar }}
              </small>
            </div>
          </div>

          <!-- Aporte -->
          <div class="col-12 md:col-6">
            <div class="field">
              <label for="aporte" class="font-semibold">
                Aporte (S/.) <span class="text-red-500">*</span>
              </label>
              <InputNumber
                  id="aporte"
                  v-model="form.aporte"
                  mode="currency"
                  currency="PEN"
                  locale="es-PE"
                  :minFractionDigits="2"
                  :class="{ 'p-invalid': errors.aporte }"
                  placeholder="0.00"
              />
              <small v-if="errors.aporte" class="p-error">
                {{ errors.aporte }}
              </small>
            </div>
          </div>
        </div>

        <!-- SECCIÓN: DATOS DE LA VIVIENDA -->
        <div class="section-header mb-3 mt-4">
          <h3 class="section-title">Datos de la Vivienda</h3>
          <Divider />
        </div>

        <div class="grid">
          <!-- Proyecto/Nombre de la vivienda -->
          <div class="col-12 md:col-6">
            <div class="field">
              <label for="proyecto" class="font-semibold">
                Proyecto/Nombre de la Vivienda <span class="text-red-500">*</span>
              </label>
              <InputText
                  id="proyecto"
                  v-model="form.vivienda.proyecto"
                  :class="{ 'p-invalid': errors.viviendaProyecto }"
                  placeholder="Ej: Residencial Los Pinos"
              />
              <small v-if="errors.viviendaProyecto" class="p-error">
                {{ errors.viviendaProyecto }}
              </small>
            </div>
          </div>

          <!-- Tipo de Vivienda -->
          <div class="col-12 md:col-6">
            <div class="field">
              <label for="tipoVivienda" class="font-semibold">
                Tipo de Vivienda <span class="text-red-500">*</span>
              </label>
              <Dropdown
                  id="tipoVivienda"
                  v-model="form.vivienda.tipoVivienda"
                  :options="tiposVivienda"
                  optionLabel="label"
                  optionValue="value"
                  placeholder="Seleccionar tipo"
                  :class="{ 'p-invalid': errors.viviendaTipo }"
                  class="w-full"
                  appendTo="body"
                  :panelStyle="{ zIndex: 10000 }"
              />
              <small v-if="errors.viviendaTipo" class="p-error">
                {{ errors.viviendaTipo }}
              </small>
            </div>
          </div>

          <!-- Valor de la vivienda -->
          <div class="col-12 md:col-6">
            <div class="field">
              <label for="valorVivienda" class="font-semibold">
                Valor de la vivienda (S/.) <span class="text-red-500">*</span>
              </label>
              <InputNumber
                  id="valorVivienda"
                  v-model="form.vivienda.valorVivienda"
                  mode="currency"
                  currency="PEN"
                  locale="es-PE"
                  :minFractionDigits="2"
                  :class="{ 'p-invalid': errors.viviendaValor }"
                  placeholder="0.00"
                  @input="calcularPorcentajeCuotaInicial"
              />
              <small v-if="errors.viviendaValor" class="p-error">
                {{ errors.viviendaValor }}
              </small>
            </div>
          </div>

          <!-- Modalidad de Vivienda -->
          <div class="col-12 md:col-6">
            <div class="field">
              <label for="modalidadVivienda" class="font-semibold">
                Modalidad de Vivienda <span class="text-red-500">*</span>
              </label>
              <Dropdown
                  id="modalidadVivienda"
                  v-model="form.vivienda.modalidadVivienda"
                  :options="modalidadesVivienda"
                  optionLabel="label"
                  optionValue="value"
                  placeholder="Seleccionar el tipo de vivienda"
                  :class="{ 'p-invalid': errors.viviendaModalidad }"
                  class="w-full"
                  appendTo="body"
                  :panelStyle="{ zIndex: 10000 }"
              />
              <small v-if="errors.viviendaModalidad" class="p-error">
                {{ errors.viviendaModalidad }}
              </small>
            </div>
          </div>

          <!-- ¿Cuánto darás de cuota inicial? -->
          <div class="col-12 md:col-6">
            <div class="field">
              <label for="cuotaInicial" class="font-semibold">
                ¿Cuánto darás de cuota inicial? (S/.) <span class="text-red-500">*</span>
              </label>
              <div class="flex gap-2">
                <InputGroup class="flex-1">
                  <InputGroupAddon>
                    <span>{{ form.vivienda.cuotaInicialPorcentaje }}%</span>
                  </InputGroupAddon>
                  <InputNumber
                      id="cuotaInicial"
                      v-model="form.vivienda.cuotaInicial"
                      mode="currency"
                      currency="PEN"
                      locale="es-PE"
                      :minFractionDigits="2"
                      :class="{ 'p-invalid': errors.viviendaCuotaInicial }"
                      placeholder="0.00"
                      @input="calcularPorcentajeCuotaInicial"
                  />
                </InputGroup>
              </div>
              <small v-if="errors.viviendaCuotaInicial" class="p-error">
                {{ errors.viviendaCuotaInicial }}
              </small>
            </div>
          </div>

          <!-- Tipo de VIS -->
          <div class="col-12 md:col-6">
            <div class="field">
              <label for="tipoVIS" class="font-semibold">
                Tipo de VIS <span class="text-red-500">*</span>
              </label>
              <Dropdown
                  id="tipoVIS"
                  v-model="form.vivienda.tipoVIS"
                  :options="tiposVIS"
                  optionLabel="label"
                  optionValue="value"
                  placeholder="Seleccionar el tipo de VIS"
                  :class="{ 'p-invalid': errors.viviendaTipoVIS }"
                  class="w-full"
                  appendTo="body"
                  :panelStyle="{ zIndex: 10000 }"
              />
              <small v-if="errors.viviendaTipoVIS" class="p-error">
                {{ errors.viviendaTipoVIS }}
              </small>
            </div>
          </div>

          <!-- Ubicación -->
          <div class="col-12">
            <div class="field">
              <label for="ubicacion" class="font-semibold">
                Ubicación <span class="text-red-500">*</span>
              </label>
              <InputText
                  id="ubicacion"
                  v-model="form.vivienda.ubicacion"
                  :class="{ 'p-invalid': errors.viviendaUbicacion }"
                  placeholder="Ej: San Isidro, Lima"
              />
              <small v-if="errors.viviendaUbicacion" class="p-error">
                {{ errors.viviendaUbicacion }}
              </small>
            </div>
          </div>
        </div>-12">
        <div class="field">
          <label for="precio" class="font-semibold">
            Precio (S/.) <span class="text-red-500">*</span>
          </label>
          <InputNumber
              id="precio"
              v-model="form.vivienda.precio"
              mode="currency"
              currency="PEN"
              locale="es-PE"
              :minFractionDigits="2"
              :class="{ 'p-invalid': errors.viviendaPrecio }"
              placeholder="0.00"
          />
          <small v-if="errors.viviendaPrecio" class="p-error">
            {{ errors.viviendaPrecio }}
          </small>
        </div>
      </div>
    </div>
    <template #footer>
      <div class="flex justify-content-end gap-2">
        <Button
            label="Cancelar"
            icon="pi pi-times"
            class="p-button-text p-button-secondary"
            @click="handleClose"
            :disabled="loading"
        />
        <Button
            :label="isEdit ? 'Actualizar' : 'Guardar'"
            icon="pi pi-check"
            class="p-button-success"
            @click="handleSubmit"
            :loading="loading"
        />
      </div>
    </template>
  </Dialog>
</template>

<style scoped>
.form-container {
  padding: 0;
}

.section-header {
  margin-top: 1rem;
  margin-bottom: 2rem;
}

.section-title {
  font-size: 1.375rem;
  font-weight: 700;
  color: #059669;
  margin: 0 0 0.75rem 0;
}

.field {
  margin-bottom: 2rem;
}

.field label {
  display: block;
  margin-bottom: 0.875rem;
  color: #374151;
  font-size: 0.9375rem;
  font-weight: 600;
}

.p-error {
  color: #ef4444;
  font-size: 0.75rem;
  display: block;
  margin-top: 0.5rem;
}

.text-red-500 {
  color: #ef4444;
}

.font-semibold {
  font-weight: 600;
}
</style>

<style>
/* Estilos globales para el Dialog - SIN SCOPED para que funcionen correctamente */
.cliente-dialog.p-dialog {
  background: white;
  border-radius: 12px;
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
  padding: 0;
}

.cliente-dialog.p-dialog .p-dialog-header {
  background: #f9fafb;
  border-bottom: 1px solid #e5e7eb;
  padding: 2.5rem 4rem;
  border-radius: 12px 12px 0 0;
}

.cliente-dialog.p-dialog .p-dialog-title {
  font-weight: 700;
  font-size: 1.75rem;
  color: #1f2937;
  letter-spacing: -0.025em;
}

.cliente-dialog.p-dialog .p-dialog-content {
  padding: 3rem 4rem !important;
  background: white;
  max-height: 70vh;
  overflow-y: auto;
}

.cliente-dialog.p-dialog .p-dialog-footer {
  padding: 2.5rem 4rem;
  background: #f9fafb;
  border-top: 1px solid #e5e7eb;
  border-radius: 0 0 12px 12px;
  gap: 1rem;
}

/* InputText */
.cliente-dialog .p-inputtext {
  border: 1px solid #d1d5db !important;
  border-radius: 8px;
  padding: 0.75rem 1rem;
  transition: all 0.2s ease;
  font-size: 0.875rem;
}

.cliente-dialog .p-inputtext:hover {
  border-color: #059669 !important;
}

.cliente-dialog .p-inputtext:focus {
  border-color: #059669 !important;
  box-shadow: 0 0 0 0.2rem rgba(5, 150, 105, 0.25) !important;
}

.cliente-dialog .p-inputtext.p-invalid {
  border-color: #ef4444 !important;
}

/* InputNumber */
.cliente-dialog .p-inputnumber-input {
  border: 1px solid #d1d5db !important;
  border-radius: 8px;
  padding: 0.75rem 1rem;
  transition: all 0.2s ease;
  font-size: 0.875rem;
}

.cliente-dialog .p-inputnumber:not(.p-disabled):hover .p-inputnumber-input {
  border-color: #059669 !important;
}

.cliente-dialog .p-inputnumber.p-inputnumber-focus .p-inputnumber-input {
  border-color: #059669 !important;
  box-shadow: 0 0 0 0.2rem rgba(5, 150, 105, 0.25) !important;
}

.cliente-dialog .p-inputnumber.p-invalid .p-inputnumber-input {
  border-color: #ef4444 !important;
}

/* Dropdown */
.cliente-dialog .p-dropdown {
  width: 100%;
  border: 1px solid #d1d5db !important;
  border-radius: 8px;
  transition: all 0.2s ease;
  padding: 0.25rem;
  background: white;
}

.cliente-dialog .p-dropdown .p-dropdown-label {
  padding: 0.5rem 0.75rem;
  font-size: 0.875rem;
}

.cliente-dialog .p-dropdown:hover {
  border-color: #059669 !important;
}

.cliente-dialog .p-dropdown.p-focus {
  border-color: #059669 !important;
  box-shadow: 0 0 0 0.2rem rgba(5, 150, 105, 0.25) !important;
}

.cliente-dialog .p-dropdown.p-invalid {
  border-color: #ef4444 !important;
}

/* Buttons */
.cliente-dialog .p-button {
  padding: 0.875rem 2rem;
  font-size: 0.9375rem;
  font-weight: 600;
  border-radius: 8px;
  transition: all 0.2s ease;
}

.cliente-dialog .p-button.p-button-success {
  background: #059669;
  border-color: #059669;
}

.cliente-dialog .p-button.p-button-success:enabled:hover {
  background: #047857;
  border-color: #047857;
  transform: translateY(-1px);
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.cliente-dialog .p-button.p-button-text {
  padding: 0.875rem 2rem;
}

.cliente-dialog .p-button.p-button-text:hover {
  background: #f3f4f6;
}

/* Divider */
.cliente-dialog .p-divider.p-divider-horizontal {
  margin: 1rem 0 2rem 0;
}

/* Dialog Mask */
.p-dialog-mask {
  background-color: rgba(0, 0, 0, 0.5) !important;
}
</style>

<style>
/* Estilos globales para el Dropdown Panel - sin scoped */

/* Panel del dropdown con máxima prioridad */
body > .p-dropdown-panel,
.p-dropdown-panel {
  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05) !important;
  border: 1px solid #e5e7eb !important;
  border-radius: 8px !important;
  margin-top: 8px !important;
  min-width: 250px !important;
  z-index: 10000 !important;
  background: white !important;
  overflow: visible !important;
  position: absolute !important;
}

/* Wrapper de los items */
body > .p-dropdown-panel .p-dropdown-items-wrapper,
.p-dropdown-panel .p-dropdown-items-wrapper {
  max-height: 300px !important;
  overflow-y: auto !important;
}

/* Lista de items */
body > .p-dropdown-panel .p-dropdown-items,
.p-dropdown-panel .p-dropdown-items {
  padding: 0.5rem 0 !important;
  list-style: none !important;
  margin: 0 !important;
}

/* Cada item individual */
body > .p-dropdown-panel .p-dropdown-item,
.p-dropdown-panel .p-dropdown-item {
  padding: 0.75rem 1rem !important;
  font-size: 0.875rem !important;
  transition: all 0.15s ease !important;
  cursor: pointer !important;
  color: #374151 !important;
  background: white !important;
  border: none !important;
  margin: 0 !important;
  display: block !important;
  width: 100% !important;
  text-align: left !important;
  line-height: 1.5 !important;
  white-space: nowrap !important;
}

/* Hover del item */
body > .p-dropdown-panel .p-dropdown-item:not(.p-highlight):not(.p-disabled):hover,
.p-dropdown-panel .p-dropdown-item:not(.p-highlight):not(.p-disabled):hover {
  background: #f3f4f6 !important;
  color: #059669 !important;
}

/* Item seleccionado */
body > .p-dropdown-panel .p-dropdown-item.p-highlight,
.p-dropdown-panel .p-dropdown-item.p-highlight {
  background: #059669 !important;
  color: white !important;
}

/* Focus del item */
body > .p-dropdown-panel .p-dropdown-item.p-focus,
.p-dropdown-panel .p-dropdown-item.p-focus {
  outline: none !important;
  background: #f3f4f6 !important;
  color: #059669 !important;
}

/* Focus + Highlight */
body > .p-dropdown-panel .p-dropdown-item.p-highlight.p-focus,
.p-dropdown-panel .p-dropdown-item.p-highlight.p-focus {
  background: #047857 !important;
  color: white !important;
}

/* Mensaje vacío */
body > .p-dropdown-panel .p-dropdown-empty-message,
.p-dropdown-panel .p-dropdown-empty-message {
  padding: 0.75rem 1rem !important;
  color: #6b7280 !important;
  font-size: 0.875rem !important;
}

/* Asegurar que el dialog tenga z-index menor */
.cliente-dialog.p-dialog {
  z-index: 1100 !important;
}

.p-dialog-mask {
  z-index: 1099 !important;
}
</style>