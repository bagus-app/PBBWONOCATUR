/**
 * SIPBB - API Layer
 * Mengelola semua komunikasi dengan Google Apps Script
 */

// ============================================
// KONFIGURASI
// ============================================
const API_URL = "https://script.google.com/macros/s/AKfycbxkU0B_xCyoyI5pR9jXebclNxc4BaCQAh8OsWS8N5VTKSpp46x-EEFsiLQxDBixAE30wg/exec";

// ============================================
// API FUNCTIONS
// ============================================

/**
 * Fetch metadata desa
 */
async function fetchInfo() {
    try {
        const res = await fetch(`${API_URL}?action=info`);
        if (!res.ok) throw new Error('Network error');
        return await res.json();
    } catch (error) {
        console.error('fetchInfo error:', error);
        throw error;
    }
}

/**
 * Fetch statistik agregat (untuk Beranda)
 */
async function fetchStats() {
    try {
        const res = await fetch(`${API_URL}?action=stats`);
        if (!res.ok) throw new Error('Network error');
        return await res.json();
    } catch (error) {
        console.error('fetchStats error:', error);
        throw error;
    }
}

/**
 * Fetch data lengkap WP (untuk pencarian)
 */
async function fetchData() {
    try {
        const res = await fetch(`${API_URL}?action=data`);
        if (!res.ok) throw new Error('Network error');
        return await res.json();
    } catch (error) {
        console.error('fetchData error:', error);
        throw error;
    }
}

/**
 * Fetch data untuk tab Statistik
 */
async function fetchStatistik() {
    try {
        const res = await fetch(`${API_URL}?action=statistik`);
        if (!res.ok) throw new Error('Network error');
        return await res.json();
    } catch (error) {
        console.error('fetchStatistik error:', error);
        throw error;
    }
}