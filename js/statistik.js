/**
 * SIPBB - Tab Statistik (FINAL - ANTI UNDEFINED)
 */

let trenChartInstance = null;
let statistikLoaded = false;

async function renderStatistik() {
    if (statistikLoaded) return;
    
    const container = document.getElementById('tab-statistik');
    
    // Show loading
    container.innerHTML = `
        <div class="flex flex-col items-center justify-center py-20">
            <div class="relative w-12 h-12 mb-4">
                <div class="absolute inset-0 border-4 border-primary-100 rounded-full"></div>
                <div class="absolute inset-0 border-4 border-primary-500 rounded-full border-t-transparent animate-spin"></div>
            </div>
            <p class="text-sm text-slate-500">Memuat data statistik...</p>
        </div>`;
    
    try {
        const data = await fetchStatistik();
        
        // Pastikan data ada
        const topTercepat = data.top_tercepat || [];
        const rekapPetugas = data.rekap_petugas || [];
        const trenBulanan = data.tren_bulanan || { labels: [], data: [] };
        const topTunggakan = data.top_tunggakan || [];

        container.innerHTML = `
            <!-- Row 1: Top 10 Tercepat & Rekap Petugas -->
            <div class="grid grid-cols-1 xl:grid-cols-2 gap-3 sm:gap-6 mb-4 sm:mb-6">
                
                <!-- Top 10 Pembayaran Tercepat -->
                <div class="bg-white rounded-xl sm:rounded-2xl shadow-sm border border-slate-100 overflow-hidden flex flex-col">
                    <div class="px-3 sm:px-6 py-3 sm:py-4 border-b border-slate-100 bg-gradient-to-r from-success-50 to-white">
                        <h3 class="text-sm sm:text-base font-bold text-slate-800 flex items-center gap-2">
                            <i class="fas fa-bolt text-success-500"></i> Top 10 Pembayaran Tercepat
                        </h3>
                    </div>
                    <div class="overflow-x-auto flex-grow">
                        <table class="w-full text-left">
                            <thead class="bg-slate-50 text-[10px] sm:text-xs font-bold text-slate-500 uppercase tracking-wider sticky top-0">
                                <tr>
                                    <th class="px-3 py-2">Rank</th>
                                    <th class="px-3 py-2">Nama WP</th>
                                    <th class="px-3 py-2 hidden sm:table-cell">NOP</th>
                                    <th class="px-3 py-2">Tgl Bayar</th>
                                    <th class="px-3 py-2 text-right">Nominal</th>
                                </tr>
                            </thead>
                            <tbody id="tbody-tercepat" class="divide-y divide-slate-100 text-xs sm:text-sm"></tbody>
                        </table>
                    </div>
                </div>

                <!-- Rekap Petugas Pungut -->
                <div class="bg-white rounded-xl sm:rounded-2xl shadow-sm border border-slate-100 overflow-hidden flex flex-col">
                    <div class="px-3 sm:px-6 py-3 sm:py-4 border-b border-slate-100 bg-gradient-to-r from-purple-50 to-white">
                        <h3 class="text-sm sm:text-base font-bold text-slate-800 flex items-center gap-2">
                            <i class="fas fa-users-cog text-purple-500"></i> Rekap Kinerja Petugas
                        </h3>
                    </div>
                    <div class="overflow-x-auto flex-grow">
                        <table class="w-full text-left min-w-[600px]">
                            <thead class="bg-slate-50 text-[10px] sm:text-xs font-bold text-slate-500 uppercase tracking-wider sticky top-0">
                                <tr>
                                    <th class="px-3 py-2">No</th>
                                    <th class="px-3 py-2">Petugas</th>
                                    <th class="px-3 py-2 text-center">SPPT</th>
                                    <th class="px-3 py-2 text-center">Bayar</th>
                                    <th class="px-3 py-2 text-center">Belum</th>
                                    <th class="px-3 py-2 text-right">Terbayar</th>
                                    <th class="px-3 py-2 text-right">Sisa</th>
                                    <th class="px-3 py-2 text-center">%</th>
                                </tr>
                            </thead>
                            <tbody id="tbody-petugas" class="divide-y divide-slate-100 text-xs sm:text-sm"></tbody>
                        </table>
                    </div>
                </div>
            </div>

            <!-- Row 2: Tren Bulanan -->
            <div class="bg-white rounded-xl sm:rounded-2xl shadow-sm border border-slate-100 p-3 sm:p-6 mb-4 sm:mb-6">
                <h3 class="text-sm sm:text-base font-bold text-slate-800 mb-3 sm:mb-4 flex items-center gap-2">
                    <i class="fas fa-chart-line text-primary-500"></i> Tren Pembayaran Bulanan
                </h3>
                <div class="relative h-64 sm:h-72">
                    <canvas id="trenChart"></canvas>
                </div>
            </div>

            <!-- Row 3: Tabel Tunggakan Lengkap -->
            <div class="bg-white rounded-xl sm:rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
                <div class="px-3 sm:px-6 py-3 sm:py-4 border-b border-slate-100 bg-gradient-to-r from-warning-50 to-white flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                    <div>
                        <h3 class="text-sm sm:text-base font-bold text-slate-800 flex items-center gap-2">
                            <i class="fas fa-list text-warning-500"></i> Daftar Tunggakan Lengkap
                        </h3>
                        <p class="text-[10px] sm:text-xs text-slate-500 mt-0.5">${topTunggakan.length} data tunggakan</p>
                    </div>
                    <input type="text" id="tunggakanSearch" oninput="filterTunggakan()" 
                        placeholder="Cari Nama/NOP..." 
                        class="px-3 py-1.5 text-xs border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 w-full sm:w-48">
                </div>
                <div class="overflow-x-auto max-h-[500px] overflow-y-auto">
                    <table class="w-full text-left min-w-[800px]">
                        <thead class="bg-slate-50 text-[10px] sm:text-xs font-bold text-slate-500 uppercase tracking-wider sticky top-0">
                            <tr>
                                <th class="px-3 py-2">No</th>
                                <th class="px-3 py-2">NOP</th>
                                <th class="px-3 py-2">Nama WP</th>
                                <th class="px-3 py-2 hidden sm:table-cell">Alamat</th>
                                <th class="px-3 py-2 text-right">Pokok</th>
                                <th class="px-3 py-2 text-right hidden sm:table-cell">Denda</th>
                                <th class="px-3 py-2 text-right">Total</th>
                            </tr>
                        </thead>
                        <tbody id="tunggakan-body" class="divide-y divide-slate-100 text-xs sm:text-sm">
                            ${topTunggakan.map((row, i) => `
                                <tr class="table-row cursor-pointer hover:bg-slate-50" data-nama="${(row.nama || '').toLowerCase()}" data-nop="${(row.nop || '').toLowerCase()}" onclick="cariDariStatistik('${row.nop}')">
                                    <td class="px-3 py-2 text-slate-500">${i + 1}</td>
                                    <td class="px-3 py-2 font-mono text-[10px] sm:text-xs text-slate-500">${escapeHtml(row.nop)}</td>
                                    <td class="px-3 py-2 font-semibold text-slate-800">${escapeHtml(row.nama)}</td>
                                    <td class="px-3 py-2 text-slate-500 max-w-xs truncate hidden sm:table-cell">${escapeHtml(row.alamat)}</td>
                                    <td class="px-3 py-2 text-right text-slate-600">Rp ${formatNumber(row.pokok)}</td>
                                    <td class="px-3 py-2 text-right text-danger-600 hidden sm:table-cell">Rp ${formatNumber(row.denda)}</td>
                                    <td class="px-3 py-2 text-right font-bold text-danger-600">Rp ${formatNumber(row.total)}</td>
                                </tr>
                            `).join('')}
                        </tbody>
                    </table>
                </div>
            </div>
        `;
        
        // Render components
        setTimeout(() => {
            renderTopTercepat(topTercepat);
            renderRekapPetugas(rekapPetugas);
            renderTrenChart(trenBulanan);
        }, 100);
        
        statistikLoaded = true;
        
    } catch (error) {
        console.error('renderStatistik error:', error);
        container.innerHTML = `
            <div class="text-center py-16">
                <i class="fas fa-exclamation-circle text-4xl text-danger-500 mb-4"></i>
                <h3 class="text-lg font-bold text-slate-800">Gagal Memuat Data</h3>
                <p class="text-sm text-slate-500 mt-2 mb-4">${error.message}</p>
                <button onclick="statistikLoaded=false; renderStatistik()" class="px-4 py-2 bg-primary-600 text-white rounded-lg text-sm hover:bg-primary-700 transition">
                    <i class="fas fa-redo mr-1"></i> Coba Lagi
                </button>
            </div>`;
    }
}

// ============================================
// RENDER FUNCTIONS (DENGAN PENGAMANAN UNDEFINED)
// ============================================

function renderTopTercepat(data) {
    const tbody = document.getElementById('tbody-tercepat');
    if (!tbody) return;
    
    if (!data || data.length === 0) {
        tbody.innerHTML = `<tr><td colspan="5" class="px-4 py-8 text-center text-slate-500 text-sm">Tidak ada data</td></tr>`;
        return;
    }
    
    tbody.innerHTML = data.map((row, i) => {
        const rankClass = i < 3 ? 'rank-top' : 'rank-normal';
        const nama = (row.nama || '').length > 15 ? (row.nama || '').substring(0, 15) + '...' : (row.nama || '');
        const nominalDisplay = row.nominal ? formatRupiah(row.nominal) : 'Rp 0';
        
        return `
            <tr class="hover:bg-slate-50 cursor-pointer" onclick="cariDariStatistik('${row.nop}')">
                <td class="px-3 py-2"><span class="rank-badge ${rankClass}">${i + 1}</span></td>
                <td class="px-3 py-2 font-semibold text-slate-800">${escapeHtml(nama)}</td>
                <td class="px-3 py-2 font-mono text-[10px] text-slate-500 hidden sm:table-cell">${escapeHtml(row.nop)}</td>
                <td class="px-3 py-2 text-slate-600">${escapeHtml(row.tgl_bayar)}</td>
                <td class="px-3 py-2 text-right font-bold text-success-600">${nominalDisplay}</td>
            </tr>`;
    }).join('');
}

function renderRekapPetugas(data) {
    const tbody = document.getElementById('tbody-petugas');
    if (!tbody) return;
    
    if (!data || data.length === 0) {
        tbody.innerHTML = `<tr><td colspan="8" class="px-4 py-8 text-center text-slate-500 text-sm">Tidak ada data petugas</td></tr>`;
        return;
    }
    
    tbody.innerHTML = data.map((row, i) => {
        const nama = (row.nama || '').length > 20 ? (row.nama || '').substring(0, 20) + '...' : (row.nama || '');
        const persenVal = parseFloat(row.persentase) || 0;
        const persenClass = persenVal >= 80 ? 'bg-success-50 text-success-700' : 
                            persenVal >= 50 ? 'bg-warning-50 text-warning-700' : 'bg-danger-50 text-danger-700';
        
        return `
            <tr class="hover:bg-slate-50">
                <td class="px-3 py-2 text-slate-500">${i + 1}</td>
                <td class="px-3 py-2 font-semibold text-slate-800" title="${escapeHtml(row.nama)}">${escapeHtml(nama)}</td>
                <td class="px-3 py-2 text-center text-slate-600">${row.sppt_total || 0}</td>
                <td class="px-3 py-2 text-center text-success-600 font-medium">${row.sppt_bayar || 0}</td>
                <td class="px-3 py-2 text-center text-danger-600 font-medium">${row.sppt_belum || 0}</td>
                <td class="px-3 py-2 text-right font-bold text-slate-800">Rp ${formatNumber(row.nominal_bayar || 0)}</td>
                <td class="px-3 py-2 text-right text-slate-500">Rp ${formatNumber(row.sisa_ketetapan || 0)}</td>
                <td class="px-3 py-2 text-center">
                    <span class="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold ${persenClass}">
                        ${row.persentase || '0%'}
                    </span>
                </td>
            </tr>`;
    }).join('');
}

function renderTrenChart(data) {
    const canvas = document.getElementById('trenChart');
    if (!canvas) return;
    
    const isMobile = window.innerWidth < 640;
    if (trenChartInstance) trenChartInstance.destroy();
    
    trenChartInstance = new Chart(canvas.getContext('2d'), {
        type: 'line',
        data: {
            labels: data.labels || [],
            datasets: [{
                label: 'Pembayaran (Rp)',
                data: data.data || [],
                borderColor: '#2563eb',
                backgroundColor: 'rgba(37, 99, 235, 0.1)',
                borderWidth: 2,
                fill: true,
                tension: 0.4,
                pointRadius: isMobile ? 3 : 4,
                pointHoverRadius: 6
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: { display: false },
                tooltip: { callbacks: { label: ctx => 'Rp ' + formatNumber(ctx.raw) } }
            },
            scales: {
                x: { grid: { display: false }, ticks: { font: { size: isMobile ? 9 : 11 } } },
                y: {
                    beginAtZero: true,
                    grid: { color: '#f1f5f9' },
                    ticks: {
                        font: { size: isMobile ? 9 : 11 },
                        callback: v => v >= 1e9 ? (v/1e9).toFixed(1)+'M' : v >= 1e6 ? (v/1e6).toFixed(0)+'Jt' : v >= 1e3 ? (v/1e3).toFixed(0)+'rb' : v
                    }
                }
            }
        }
    });
}

function filterTunggakan() {
    const query = document.getElementById('tunggakanSearch').value.toLowerCase();
    const rows = document.querySelectorAll('#tunggakan-body tr');
    rows.forEach(row => {
        const nama = row.getAttribute('data-nama') || '';
        const nop = row.getAttribute('data-nop') || '';
        row.style.display = (nama.includes(query) || nop.includes(query)) ? '' : 'none';
    });
}

function cariDariStatistik(nop) {
    switchTab('cek');
    setTimeout(() => {
        const searchInput = document.getElementById('detailSearch');
        if (searchInput) {
            searchInput.value = nop;
            handleDetailSearch(nop);
        }
    }, 100);
}