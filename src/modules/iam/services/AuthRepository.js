// src/modules/iam/domain/repositories/AuthRepository.js

export class AuthRepository {
    async register(userData) {
        throw new Error('Method register() must be implemented');
    }

    async login(credentials) {
        throw new Error('Method login() must be implemented');
    }

    async logout() {
        throw new Error('Method logout() must be implemented');
    }

    async verifyToken(token) {
        throw new Error('Method verifyToken() must be implemented');
    }

    async getProfile() {
        throw new Error('Method getProfile() must be implemented');
    }

    async updateProfile(userData) {
        throw new Error('Method updateProfile() must be implemented');
    }
}