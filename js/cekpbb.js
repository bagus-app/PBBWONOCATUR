/**
 * SIPBB - Tab Cek PBB
 * Menampilkan form pencarian dan hasil detail
 */

/**
 * Render Tab Cek PBB
 */
function renderCekPBB() {
    const container = document.getElementById('tab-cek');
    
    container.innerHTML = `
        <div class="bg-white rounded-xl sm:rounded-2xl shadow-sm border border-slate-100 p-3 sm:p-6 mb-4 sm:mb-6">
            <h2 class="text-base sm:text-xl font-bold text-slate-800 mb-3 sm:mb-4 flex items-center gap-2">
                <i class="fas fa-search text-primary-600"></i> Cek Status Pajak
            </h2>
            <div class="flex flex-col sm:flex-row gap-2 sm:gap-3">
                <input type="text" id="detailSearch" oninput="handleDetailSearch(this.value)" 
                    placeholder="Masukkan NOP atau Nama WP..." 
                    class="flex-1 px-3 sm:px-4 py-2.5 sm:py-3 text-sm sm:text-base border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 transition">
                <button onclick="handleDetailSearch(document.getElementById('detailSearch').value)" 
                    class="px-4 sm:px-6 py-2.5 sm:py-3 bg-primary-600 text-white rounded-xl font-medium hover:bg-primary-700 transition active:scale-95 text-sm sm:text-base whitespace-nowrap">
                    <i class="fas fa-search mr-1 sm:mr-2"></i>Cari
                </button>
            </div>
        </div>
        
        <div id="detail-results" class="space-y-2 sm:space-y-4">
            <div class="text-center py-12 sm:py-16 text-slate-400 bg-white rounded-xl sm:rounded-2xl border border-slate-100">
                <i class="fas fa-file-invoice text-4xl sm:text-5xl mb-3 sm:mb-4 opacity-30"></i>
                <p class="text-sm sm:text-base font-medium px-4">Masukkan kata kunci untuk mencari</p>
                <p class="text-xs sm:text-sm mt-1 px-4">Cari berdasarkan NOP atau Nama WP</p>
            </div>
        </div>
    `;
}

/**
 * Handle Detail Search (Tab Cek PBB)
 */
function handleDetailSearch(query) {
    const container = document.getElementById('detail-results');
    if (!container) return;
    
    if (!query || query.length < 3) {
        container.innerHTML = `
            <div class="text-center py-12 sm:py-16 text-slate-400 bg-white rounded-xl sm:rounded-2xl border border-slate-100">
                <i class="fas fa-file-invoice text-4xl sm:text-5xl mb-3 sm:mb-4 opacity-30"></i>
                <p class="text-sm sm:text-base font-medium px-4">Masukkan minimal 3 karakter</p>
            </div>`;
        return;
    }
    
    const q = query.toLowerCase();
    const results = appData.filter(row => {
        const nop = (row['NOP'] || '').toLowerCase();
        const nama = (row['NAMA WAJIB PAJAK'] || row['NAMA SPPT'] || '').toLowerCase();
        return nop.includes(q) || nama.includes(q);
    });
    
    if (results.length === 0) {
        container.innerHTML = `
            <div class="text-center py-12 sm:py-16 text-slate-500 bg-white rounded-xl sm:rounded-2xl border border-slate-100">
                <i class="fas fa-search text-3xl sm:text-4xl mb-3 sm:mb-4 opacity-30"></i>
                <p class="text-sm sm:text-base font-medium px-4">Data "<strong>${escapeHtml(query)}</strong>" tidak ditemukan</p>
            </div>`;
    } else {
        container.innerHTML = `
            <div class="mb-3 sm:mb-4 text-xs sm:text-sm text-slate-600 px-1">
                Ditemukan <strong class="text-primary-600">${results.length}</strong> data
            </div>
            <div class="space-y-2 sm:space-y-3">${results.map(renderResultCard).join('')}</div>`;
    }
}