<script setup>
import { provide, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from './modules/iam/services/authStore.js';

const router = useRouter();
const authStore = useAuthStore();

provide('router', router);

onMounted(async () => {
  try {
    await authStore.initAuth();
  } catch (error) {
    console.error('Error al inicializar autenticación:', error);
  }
});
</script>

<template>
  <div id="app">
    <router-view v-slot="{ Component }">
      <transition name="fade" mode="out-in">
        <component :is="Component" />
      </transition>
    </router-view>
  </div>
</template>

<style>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

#app {
  min-height: 100vh;
  background-color: #f3f4f6;
}
</style>