/**
 * SIPBB - Main Application
 * Mengelola inisialisasi, routing tab, dan utility functions
 */

// ============================================
// GLOBAL STATE
// ============================================
let appData = [];      // Data lengkap WP
let infoData = {};     // Metadata desa
let statsData = {};    // Statistik agregat

// ============================================
// INITIALIZATION
// ============================================
document.addEventListener('DOMContentLoaded', initApp);

async function initApp() {
    showLoading();
    try {
        // Fetch semua data secara paralel
        const [info, stats, data] = await Promise.all([
            fetchInfo(),
            fetchStats(),
            fetchData()
        ]);

        infoData = info;
        statsData = stats;
        appData = data;

        // Update header
        updateHeader();

        // Render semua tab
        renderBeranda();
        renderCekPBB();

        // Tampilkan tab beranda
        showDashboard();
        switchTab('beranda');

    } catch (error) {
        console.error('Init error:', error);
        showError();
    }
}

// ============================================
// UI HELPERS
// ============================================
function showLoading() {
    document.getElementById('loading-screen').classList.remove('hidden');
    document.getElementById('error-screen').classList.add('hidden');
}

function showDashboard() {
    document.getElementById('loading-screen').classList.add('hidden');
    document.getElementById('error-screen').classList.add('hidden');
}

function showError() {
    document.getElementById('loading-screen').classList.add('hidden');
    document.getElementById('error-screen').classList.remove('hidden');
}

function updateHeader() {
    const desa = infoData.desa || 'WONOCATUR';
    const tahun = infoData.tahun || '2026';
    document.getElementById('headerInfo').textContent = `Desa ${desa} • ${tahun}`;
}

// ============================================
// UPDATE STATS (PERUBAHAN ADA DI SINI)
// ============================================
function updateStats() {
    const s = statsData;
    
    // Row 1: Statistik Utama
    document.getElementById('stat-wp').textContent = formatNumber(s.total_wp);
    document.getElementById('stat-lunas').textContent = formatNumber(s.total_lunas);
    document.getElementById('stat-tunggakan').textContent = formatNumber(s.total_tunggakan);
    document.getElementById('stat-kepatuhan').textContent = s.persentase_kepatuhan + '%';
    
    // Row 2: Finansial (MENAMPILKAN NOMINAL UTUH)
    document.getElementById('stat-pokok').textContent = formatRupiah(s.nominal_pokok || 0);
    document.getElementById('stat-denda').textContent = formatRupiah(s.nominal_denda || 0);
    document.getElementById('stat-total-tunggakan').textContent = formatRupiah(s.nominal_tunggakan || 0);
    document.getElementById('stat-realisasi').textContent = formatRupiah(s.nominal_realisasi || 0);
}

// ============================================
// TAB NAVIGATION
// ============================================
function switchTab(tabName) {
    // Hide all tabs
    ['beranda', 'cek', 'statistik'].forEach(t => {
        document.getElementById(`tab-${t}`).classList.add('hidden');
    });
    
    // Reset nav buttons
    document.querySelectorAll('.nav-btn').forEach(btn => btn.classList.remove('active'));
    document.querySelectorAll('.nav-mobile-btn').forEach(btn => btn.classList.remove('active'));
    
    // Show selected tab
    document.getElementById(`tab-${tabName}`).classList.remove('hidden');
    
    // Activate nav buttons
    const navBtn = document.getElementById(`nav-${tabName}`);
    const navMobileBtn = document.getElementById(`nav-mobile-${tabName}`);
    if (navBtn) navBtn.classList.add('active');
    if (navMobileBtn) navMobileBtn.classList.add('active');
    
    // Render statistik jika tab dibuka (lazy load)
    if (tabName === 'statistik') {
        setTimeout(() => renderStatistik(), 100);
    }
    
    // Scroll to top
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

// ============================================
// REFRESH DATA
// ============================================
async function refreshData() {
    const icon = document.getElementById('refreshIcon');
    icon.classList.add('fa-spin');
    
    try {
        await initApp();
        showToast('Data berhasil diperbarui!', 'success');
    } catch (error) {
        showToast('Gagal memperbarui data', 'error');
    } finally {
        icon.classList.remove('fa-spin');
    }
}

// ============================================
// UTILITY FUNCTIONS
// ============================================

function num(v) {
    if (v === null || v === undefined || v === '') return 0;
    const str = String(v).trim();
    if (str === '' || str === '0') return 0;
    
    const clean = str
        .replace(/\./g, '')
        .replace(/,/g, '.')
        .replace(/[^0-9.-]/g, '');
    
    const n = parseFloat(clean);
    return isNaN(n) ? 0 : n;
}

function formatNumber(n) {
    return (n || 0).toLocaleString('id-ID');
}

function formatRupiah(n) {
    return new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0
    }).format(n || 0);
}

function formatRupiahShort(n) {
    if (n >= 1e9) return 'Rp ' + (n / 1e9).toFixed(2) + ' M';
    if (n >= 1e6) return 'Rp ' + (n / 1e6).toFixed(2) + ' Jt';
    if (n >= 1e3) return 'Rp ' + (n / 1e3).toFixed(0) + ' rb';
    return 'Rp ' + (n || 0).toLocaleString('id-ID');
}

function showToast(message, type = 'success') {
    const toast = document.createElement('div');
    toast.className = `fixed bottom-20 md:bottom-6 right-4 md:right-6 px-4 py-3 rounded-lg shadow-lg text-white text-xs sm:text-sm font-medium z-[100] transition-all ${
        type === 'success' ? 'bg-success-600' : 'bg-danger-600'
    }`;
    toast.innerHTML = `<i class="fas ${type === 'success' ? 'fa-check-circle' : 'fa-exclamation-circle'} mr-2"></i>${message}`;
    document.body.appendChild(toast);
    
    setTimeout(() => {
        toast.style.opacity = '0';
        setTimeout(() => toast.remove(), 300);
    }, 3000);
}

function escapeHtml(str) {
    if (!str) return '';
    return String(str)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#039;');
}