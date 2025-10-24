// src/modules/iam/presentation/stores/authStore.js

import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import { useRouter } from 'vue-router';
import { AuthRepositoryImpl } from './AuthRepositoryImpl.js';
import { SignIn } from '../model/SignIn.js';
import { SignUp } from '../model/SignUp.js';
import { SignOut } from '../model/SignOut.js';

export const useAuthStore = defineStore('auth', () => {
    // State
    const user = ref(null);
    const loading = ref(false);
    const error = ref(null);
    const isAuthenticated = ref(false);

    // Repository & Use Cases
    const repository = new AuthRepositoryImpl();
    const signInUseCase = new SignIn(repository);
    const signUpUseCase = new SignUp(repository);
    const signOutUseCase = new SignOut(repository);

    // Computed
    const currentUser = computed(() => user.value);
    const isAdmin = computed(() => user.value?.role === 'admin');
    const userName = computed(() => {
        if (user.value) {
            if (user.value.firstName && user.value.lastName) {
                return `${user.value.firstName} ${user.value.lastName}`;
            }
            return user.value.username || 'Usuario';
        }
        return 'Usuario';
    });
    const userRole = computed(() => {
        if (user.value) {
            return user.value.role === 'admin' ? 'Administrador' : 'Usuario';
        }
        return '';
    });

    // Actions
    const initAuth = async () => {
        const token = localStorage.getItem('token');
        const storedUser = localStorage.getItem('user');

        if (token && storedUser) {
            try {
                const result = await repository.verifyToken(token);
                if (result.valid) {
                    user.value = result.user;
                    isAuthenticated.value = true;
                } else {
                    await signOutUseCase.execute();
                    user.value = null;
                    isAuthenticated.value = false;
                }
            } catch (e) {
                console.error('Error al verificar token:', e);
                await signOutUseCase.execute();
                user.value = null;
                isAuthenticated.value = false;
            }
        }
    };

    const signIn = async (credentials) => {
        loading.value = true;
        error.value = null;
        try {
            const result = await signInUseCase.execute(credentials);
            user.value = result.user;
            isAuthenticated.value = true;
            return result;
        } catch (e) {
            error.value = e.message || 'Error al iniciar sesión';
            console.error('Error en signIn:', e);
            throw e;
        } finally {
            loading.value = false;
        }
    };

    const signUp = async (userData) => {
        loading.value = true;
        error.value = null;
        try {
            const result = await signUpUseCase.execute(userData);
            user.value = result.user;
            isAuthenticated.value = true;
            return result;
        } catch (e) {
            error.value = e.message || 'Error al registrar usuario';
            console.error('Error en signUp:', e);
            throw e;
        } finally {
            loading.value = false;
        }
    };

    const signOut = async () => {
        try {
            loading.value = true;
            error.value = null;

            await signOutUseCase.execute();

            user.value = null;
            isAuthenticated.value = false;

            return Promise.resolve();
        } catch (e) {
            error.value = e.message || 'Error al cerrar sesión';
            console.error('Error en signOut:', e);
            throw e;
        } finally {
            loading.value = false;
        }
    };

    const getProfile = async () => {
        loading.value = true;
        error.value = null;
        try {
            const profile = await repository.getProfile();
            user.value = profile;
            localStorage.setItem('user', JSON.stringify(profile));
            return profile;
        } catch (e) {
            error.value = e.message || 'Error al obtener perfil';
            console.error('Error al obtener perfil:', e);
            throw e;
        } finally {
            loading.value = false;
        }
    };

    const updateProfile = async (userData) => {
        loading.value = true;
        error.value = null;
        try {
            const updatedUser = await repository.updateProfile(userData);
            user.value = updatedUser;
            localStorage.setItem('user', JSON.stringify(updatedUser));
            return updatedUser;
        } catch (e) {
            error.value = e.message || 'Error al actualizar perfil';
            console.error('Error al actualizar perfil:', e);
            throw e;
        } finally {
            loading.value = false;
        }
    };

    const clearError = () => {
        error.value = null;
    };

    return {
        // State
        user,
        currentUser,
        loading,
        error,
        isAuthenticated,
        isAdmin,
        userName,
        userRole,

        // Actions
        initAuth,
        signIn,
        signUp,
        signOut,
        getProfile,
        updateProfile,
        clearError
    };
});