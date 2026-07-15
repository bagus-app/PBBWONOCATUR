/**
 * SIPBB - Tab Beranda
 * Menampilkan statistik agregat dan chart donut
 */

let statusChartInstance = null;

/**
 * Render Tab Beranda
 */
function renderBeranda() {
    const container = document.getElementById('tab-beranda');
    const s = statsData;
    
    container.innerHTML = `
        <!-- Banner -->
        <div class="bg-gradient-to-br from-primary-700 via-primary-800 to-primary-900 rounded-2xl p-4 sm:p-6 md:p-8 text-white mb-4 sm:mb-6 shadow-xl shadow-primary-200/50">
            <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4">
                <div class="flex-1">
                    <h2 class="text-xl sm:text-2xl md:text-3xl font-bold mb-1">Selamat Datang</h2>
                    <p class="text-xs sm:text-sm text-primary-100">Sistem Informasi Pajak Bumi & Bangunan</p>
                </div>
                <div class="flex flex-col sm:flex-row md:flex-col items-start md:items-end gap-3">
                    <div class="text-left md:text-right">
                        <p class="text-[10px] sm:text-xs text-primary-200 uppercase tracking-wider font-semibold">Tahun Pajak</p>
                        <p class="text-2xl sm:text-3xl font-bold">${infoData.tahun || '2026'}</p>
                    </div>
                    <div class="flex items-center gap-2 px-3 py-1.5 bg-white/15 backdrop-blur rounded-lg border border-white/20">
                        <i class="fas fa-sync-alt text-xs text-primary-200"></i>
                        <div>
                            <p class="text-[9px] sm:text-[10px] text-primary-200 uppercase tracking-wider">Update</p>
                            <p class="text-xs sm:text-sm font-semibold text-white">${infoData.tanggal_update || '-'}</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <!-- Quick Search -->
        <div class="bg-white rounded-xl sm:rounded-2xl shadow-sm border border-slate-100 p-3 sm:p-5 mb-4 sm:mb-6">
            <label class="text-xs sm:text-sm font-semibold text-slate-700 mb-2 block">
                <i class="fas fa-search text-primary-500 mr-1"></i> Pencarian Cepat
            </label>
            <div class="relative">
                <input type="text" id="quickSearch" oninput="handleQuickSearch(this.value)" 
                    placeholder="Ketik NOP atau Nama WP..." 
                    class="w-full pl-9 sm:pl-11 pr-4 py-2.5 sm:py-3 text-sm sm:text-base border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition">
                <i class="fas fa-search absolute left-3 sm:left-4 top-1/2 -translate-y-1/2 text-slate-400 text-sm"></i>
            </div>
            <div id="quick-results" class="hidden mt-3 sm:mt-4 space-y-2 sm:space-y-3"></div>
        </div>

        <!-- Stats Row 1: Utama -->
        <div class="grid grid-cols-2 lg:grid-cols-4 gap-2.5 sm:gap-4 mb-2.5 sm:mb-4">
            <div class="stat-card bg-white p-3 sm:p-5 rounded-xl sm:rounded-2xl shadow-sm border border-slate-100">
                <div class="flex items-start justify-between">
                    <div class="flex-1 min-w-0">
                        <p class="text-[10px] sm:text-xs font-semibold text-slate-400 uppercase tracking-wider">Total WP</p>
                        <p class="text-lg sm:text-2xl font-extrabold text-slate-800 mt-1 sm:mt-2 truncate">${formatNumber(s.total_wp)}</p>
                        <p class="text-[9px] sm:text-[10px] text-slate-400 mt-0.5 hidden sm:block">wajib pajak</p>
                    </div>
                    <div class="w-8 h-8 sm:w-10 sm:h-10 bg-blue-50 text-blue-600 rounded-lg flex items-center justify-center flex-shrink-0 ml-2">
                        <i class="fas fa-users text-xs sm:text-sm"></i>
                    </div>
                </div>
            </div>
            
            <div class="stat-card bg-white p-3 sm:p-5 rounded-xl sm:rounded-2xl shadow-sm border border-slate-100">
                <div class="flex items-start justify-between">
                    <div class="flex-1 min-w-0">
                        <p class="text-[10px] sm:text-xs font-semibold text-slate-400 uppercase tracking-wider">Lunas</p>
                        <p class="text-lg sm:text-2xl font-extrabold text-success-600 mt-1 sm:mt-2 truncate">${formatNumber(s.total_lunas)}</p>
                        <p class="text-[9px] sm:text-[10px] text-slate-400 mt-0.5 hidden sm:block">telah membayar</p>
                    </div>
                    <div class="w-8 h-8 sm:w-10 sm:h-10 bg-success-50 text-success-600 rounded-lg flex items-center justify-center flex-shrink-0 ml-2">
                        <i class="fas fa-check-circle text-xs sm:text-sm"></i>
                    </div>
                </div>
            </div>
            
            <div class="stat-card bg-white p-3 sm:p-5 rounded-xl sm:rounded-2xl shadow-sm border border-slate-100">
                <div class="flex items-start justify-between">
                    <div class="flex-1 min-w-0">
                        <p class="text-[10px] sm:text-xs font-semibold text-slate-400 uppercase tracking-wider">Tunggakan</p>
                        <p class="text-lg sm:text-2xl font-extrabold text-danger-600 mt-1 sm:mt-2 truncate">${formatNumber(s.total_tunggakan)}</p>
                        <p class="text-[9px] sm:text-[10px] text-slate-400 mt-0.5 hidden sm:block">belum membayar</p>
                    </div>
                    <div class="w-8 h-8 sm:w-10 sm:h-10 bg-danger-50 text-danger-600 rounded-lg flex items-center justify-center flex-shrink-0 ml-2">
                        <i class="fas fa-exclamation-circle text-xs sm:text-sm"></i>
                    </div>
                </div>
            </div>
            
            <div class="stat-card bg-gradient-to-br from-primary-600 to-primary-800 text-white p-3 sm:p-5 rounded-xl sm:rounded-2xl shadow-lg shadow-primary-200">
                <div class="flex items-start justify-between">
                    <div class="flex-1 min-w-0">
                        <p class="text-[10px] sm:text-xs font-semibold text-primary-100 uppercase tracking-wider">Kepatuhan</p>
                        <p class="text-lg sm:text-2xl font-extrabold text-white mt-1 sm:mt-2 truncate">${s.persentase_kepatuhan}%</p>
                        <p class="text-[9px] sm:text-[10px] text-primary-200 mt-0.5 hidden sm:block">rasio kepatuhan</p>
                    </div>
                    <div class="w-8 h-8 sm:w-10 sm:h-10 bg-white/20 text-white rounded-lg flex items-center justify-center flex-shrink-0 ml-2">
                        <i class="fas fa-chart-pie text-xs sm:text-sm"></i>
                    </div>
                </div>
            </div>
        </div>

        <!-- Stats Row 2: Finansial (NOMINAL UTUH) -->
        <div class="grid grid-cols-2 lg:grid-cols-4 gap-2.5 sm:gap-4 mb-4 sm:mb-6">
            <div class="stat-card bg-white p-2.5 sm:p-4 rounded-xl sm:rounded-2xl shadow-sm border border-slate-100 flex items-center gap-2 sm:gap-3">
                <div class="w-8 h-8 sm:w-9 sm:h-9 bg-emerald-50 text-emerald-600 rounded-lg flex items-center justify-center flex-shrink-0">
                    <i class="fas fa-file-invoice-dollar text-xs sm:text-sm"></i>
                </div>
                <div class="flex-1 min-w-0">
                    <p class="text-[9px] sm:text-[10px] font-semibold text-slate-400 uppercase">Total Pokok</p>
                    <p class="text-xs sm:text-sm font-bold text-slate-800">${formatRupiah(s.nominal_pokok)}</p>
                </div>
            </div>
            
            <div class="stat-card bg-white p-2.5 sm:p-4 rounded-xl sm:rounded-2xl shadow-sm border border-slate-100 flex items-center gap-2 sm:gap-3">
                <div class="w-8 h-8 sm:w-9 sm:h-9 bg-red-50 text-red-500 rounded-lg flex items-center justify-center flex-shrink-0">
                    <i class="fas fa-exclamation-triangle text-xs sm:text-sm"></i>
                </div>
                <div class="flex-1 min-w-0">
                    <p class="text-[9px] sm:text-[10px] font-semibold text-slate-400 uppercase">Total Denda</p>
                    <p class="text-xs sm:text-sm font-bold text-danger-600">${formatRupiah(s.nominal_denda)}</p>
                </div>
            </div>
            
            <div class="stat-card bg-white p-2.5 sm:p-4 rounded-xl sm:rounded-2xl shadow-sm border border-slate-100 flex items-center gap-2 sm:gap-3">
                <div class="w-8 h-8 sm:w-9 sm:h-9 bg-purple-50 text-purple-600 rounded-lg flex items-center justify-center flex-shrink-0">
                    <i class="fas fa-money-bill-wave text-xs sm:text-sm"></i>
                </div>
                <div class="flex-1 min-w-0">
                    <p class="text-[9px] sm:text-[10px] font-semibold text-slate-400 uppercase">Tunggakan</p>
                    <p class="text-xs sm:text-sm font-bold text-slate-800">${formatRupiah(s.nominal_tunggakan)}</p>
                </div>
            </div>
            
            <div class="stat-card bg-white p-2.5 sm:p-4 rounded-xl sm:rounded-2xl shadow-sm border border-slate-100 flex items-center gap-2 sm:gap-3">
                <div class="w-8 h-8 sm:w-9 sm:h-9 bg-cyan-50 text-cyan-600 rounded-lg flex items-center justify-center flex-shrink-0">
                    <i class="fas fa-hand-holding-usd text-xs sm:text-sm"></i>
                </div>
                <div class="flex-1 min-w-0">
                    <p class="text-[9px] sm:text-[10px] font-semibold text-slate-400 uppercase">Realisasi</p>
                    <p class="text-xs sm:text-sm font-bold text-success-600">${formatRupiah(s.nominal_realisasi)}</p>
                </div>
            </div>
        </div>

        <!-- Chart Donut -->
        <div class="bg-white rounded-xl sm:rounded-2xl shadow-sm border border-slate-100 p-4 sm:p-6">
            <h3 class="text-sm sm:text-base font-bold text-slate-800 mb-3 sm:mb-4 flex items-center gap-2">
                <i class="fas fa-chart-pie text-primary-500"></i> Status Pembayaran WP
            </h3>
            <div class="relative h-56 sm:h-64 md:h-72">
                <canvas id="statusChart"></canvas>
            </div>
        </div>
    `;
    
    // Render chart setelah DOM siap
    setTimeout(() => renderStatusChart(), 100);
}

/**
 * Render Chart Donut Status Pembayaran
 */
function renderStatusChart() {
    const canvas = document.getElementById('statusChart');
    if (!canvas) return;
    
    const s = statsData;
    const isMobile = window.innerWidth < 640;
    
    if (statusChartInstance) statusChartInstance.destroy();
    
    statusChartInstance = new Chart(canvas.getContext('2d'), {
        type: 'doughnut',
        data: {
            labels: ['Lunas', 'Tunggakan', 'Belum Terdata'],
            datasets: [{
                data: [s.total_lunas, s.total_tunggakan, s.total_wp - s.total_lunas - s.total_tunggakan],
                backgroundColor: ['#16a34a', '#dc2626', '#cbd5e1'],
                borderWidth: 0,
                hoverOffset: 8
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            cutout: isMobile ? '60%' : '65%',
            plugins: {
                legend: {
                    position: 'bottom',
                    labels: {
                        usePointStyle: true,
                        padding: isMobile ? 10 : 15,
                        font: { size: isMobile ? 10 : 12, weight: '500' }
                    }
                },
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            const total = context.dataset.data.reduce((a, b) => a + b, 0);
                            const percentage = ((context.raw / total) * 100).toFixed(1);
                            return `${context.label}: ${context.raw} WP (${percentage}%)`;
                        }
                    }
                }
            }
        }
    });
}

/**
 * Handle Quick Search (Beranda)
 */
function handleQuickSearch(query) {
    const container = document.getElementById('quick-results');
    if (!container) return;
    
    if (!query || query.length < 3) {
        container.classList.add('hidden');
        container.innerHTML = '';
        return;
    }
    
    const q = query.toLowerCase();
    const results = appData.filter(row => {
        const nop = (row['NOP'] || '').toLowerCase();
        const nama = (row['NAMA WAJIB PAJAK'] || row['NAMA SPPT'] || '').toLowerCase();
        return nop.includes(q) || nama.includes(q);
    }).slice(0, 5);
    
    if (results.length === 0) {
        container.innerHTML = `<div class="text-center py-6 text-slate-500 bg-slate-50 rounded-xl text-sm">Data tidak ditemukan</div>`;
    } else {
        container.innerHTML = results.map(renderResultCard).join('');
    }
    container.classList.remove('hidden');
}

/**
 * Render Result Card (digunakan di Beranda & Cek PBB)
 */
function renderResultCard(row) {
    const nop = row['NOP'] || '-';
    const nama = row['NAMA WAJIB PAJAK'] || row['NAMA SPPT'] || '-';
    const alamat = row['ALAMAT OBJEK PAJAK'] || '-';
    const status = row['STATUS'] || 'BELUM TERDATA';
    
    let nominal = 0;
    let detailInfo = '';
    
    if (status === 'TUNGGAKAN') {
        nominal = num(row['PAJAK TERHUTANG']) || num(row['POKOK PAJAK']);
        const pokok = num(row['POKOK PAJAK']);
        const denda = num(row['DENDA']);
        detailInfo = `
            <div class="mt-2 pt-2 border-t border-slate-100 text-xs text-slate-500">
                <div class="flex justify-between"><span>Pokok:</span><span class="font-semibold text-slate-700">${formatRupiah(pokok)}</span></div>
                <div class="flex justify-between"><span>Denda:</span><span class="font-semibold text-danger-600">${formatRupiah(denda)}</span></div>
            </div>`;
    } else if (status === 'LUNAS') {
        nominal = num(row['PEMBAYARAN']) || num(row['KETETAPAN_R']);
        const tglBayar = row['TGL PEMBAYARAN'] || '-';
        const petugas = row['PETUGAS PUNGUT'] || '-';
        detailInfo = `
            <div class="mt-2 pt-2 border-t border-slate-100 text-xs text-slate-500">
                <div class="flex justify-between"><span>Tgl Bayar:</span><span class="font-semibold text-slate-700">${escapeHtml(tglBayar)}</span></div>
                <div class="flex justify-between"><span>Petugas:</span><span class="font-semibold text-slate-700 truncate ml-2">${escapeHtml(petugas)}</span></div>
            </div>`;
    } else {
        nominal = num(row['PAJAK YG HARUS DIBAYAR']);
    }
    
    let badgeClass = 'badge-lunas', badgeIcon = 'fa-check-circle', badgeText = 'LUNAS';
    if (status === 'TUNGGAKAN') {
        badgeClass = 'badge-tunggakan';
        badgeIcon = 'fa-exclamation-circle';
        badgeText = 'TUNGGAKAN';
    } else if (status === 'BELUM TERDATA') {
        badgeClass = 'bg-slate-100 text-slate-500 border border-slate-200';
        badgeIcon = 'fa-minus-circle';
        badgeText = 'BELUM TERDATA';
    }
    
    return `
        <div class="result-card">
            <div class="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2 sm:gap-4">
                <div class="flex-1 min-w-0">
                    <div class="flex flex-wrap items-center gap-1.5 sm:gap-2 mb-1.5 sm:mb-2">
                        <span class="badge badge-nop">${escapeHtml(nop)}</span>
                        <span class="badge ${badgeClass}">
                            <i class="fas ${badgeIcon}"></i> ${badgeText}
                        </span>
                    </div>
                    <h4 class="font-bold text-slate-800 text-sm sm:text-base md:text-lg truncate">${escapeHtml(nama)}</h4>
                    <p class="text-xs sm:text-sm text-slate-500 mt-1 flex items-start gap-1 sm:gap-1.5">
                        <i class="fas fa-map-marker-alt mt-0.5 text-slate-400 flex-shrink-0"></i>
                        <span class="line-clamp-2">${escapeHtml(alamat)}</span>
                    </p>
                    ${detailInfo}
                </div>
                <div class="text-left sm:text-right border-t sm:border-t-0 sm:border-l border-slate-100 pt-2 sm:pt-0 sm:pl-4">
                    <p class="text-[10px] sm:text-xs text-slate-500 uppercase tracking-wide font-semibold">Nominal</p>
                    <p class="text-sm sm:text-lg md:text-xl font-bold text-slate-800 mt-0.5 sm:mt-1">${formatRupiah(nominal)}</p>
                </div>
            </div>
        </div>`;
}