// Armor database (populated from armorData.js)
let armorPieces = [];
let filteredArmor = [];
let currentSort = { column: 'name', direction: 'asc' };

function escapeHtml(str) {
    if (str === null || str === undefined) return '-';
    const div = document.createElement('div');
    div.textContent = String(str);
    return div.innerHTML;
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', function() {
    loadArmorData();
    setupEventListeners();
});

function loadArmorData() {
    // Convert armorData object to array for easier manipulation
    armorPieces = Object.entries(armorData).map(([name, data]) => ({
        name: name,
        ...data,
        // Extract stats for easier access
        physDef: data.Stats?.PhysicalDefence || 0,
        magDef: data.Stats?.MagickDefence || 0,
        totalDef: (data.Stats?.PhysicalDefence || 0) + (data.Stats?.MagickDefence || 0),
        stability: data.Stats?.StabilityIncrease || 0,
        reqVirtue: data.Stats?.VirtueReq || '',
        physAttune: data.Stats?.Attunements?.PhysicalAttunement || '',
        magAttune: data.Stats?.Attunements?.MagickAttunement || '',
        stabAttune: data.Stats?.Attunements?.StabilityAttunement || ''
    }));
    
    // Populate filter dropdowns with unique values
    populateFilters();
    
    // Initial display
    filteredArmor = [...armorPieces];
    updateDisplay();
}

function populateFilters() {
    // Get unique armor sets
    const sets = [...new Set(armorPieces.map(a => a.ArmorSet).filter(Boolean))].sort();
    
    // Populate Set filter
    const setFilter = document.getElementById('set-filter');
    sets.forEach(set => {
        const option = document.createElement('option');
        option.value = set;
        option.textContent = set;
        setFilter.appendChild(option);
    });
}

function setupEventListeners() {
    // Search input
    document.getElementById('search-input').addEventListener('input', filterArmor);
    
    // Filter dropdowns
    document.getElementById('slot-filter').addEventListener('change', filterArmor);
    document.getElementById('set-filter').addEventListener('change', filterArmor);
    document.getElementById('virtue-filter').addEventListener('change', filterArmor);
    document.getElementById('rarity-filter').addEventListener('change', filterArmor);
    
    // Clear filters button
    document.getElementById('clear-filters').addEventListener('click', clearFilters);
    
    // Sort headers
    document.querySelectorAll('.sortable').forEach(header => {
        header.addEventListener('click', () => sortTable(header.dataset.column));
    });
    
    // Modal close button
    document.querySelector('.close').addEventListener('click', closeModal);
    window.addEventListener('click', (e) => {
        const modal = document.getElementById('armor-modal');
        if (e.target === modal) closeModal();
    });
}

function getVirtueFromReq(reqStr) {
    if (!reqStr) return '';
    const match = reqStr.match(/\d+\s*([GCS])/);
    if (!match) return '';
    const map = { 'G': 'Grace', 'C': 'Courage', 'S': 'Spirit' };
    return map[match[1]] || '';
}

function formatVirtueReq(reqStr) {
    if (!reqStr) return 'None';
    const match = reqStr.match(/(\d+)\s*([GCS])/);
    if (!match) return reqStr || 'None';
    const num = parseInt(match[1]);
    const map = { 'G': 'Grace', 'C': 'Courage', 'S': 'Spirit' };
    const virtueName = map[match[2]] || match[2];
    if (num === 0) return virtueName;
    return reqStr;
}

function filterArmor() {
    const searchTerm = document.getElementById('search-input').value.toLowerCase();
    const slotFilter = document.getElementById('slot-filter').value;
    const setFilter = document.getElementById('set-filter').value;
    const virtueFilter = document.getElementById('virtue-filter').value;
    const rarityFilter = document.getElementById('rarity-filter').value;
    
    filteredArmor = armorPieces.filter(armor => {
        // Search filter
        if (searchTerm && !armor.name.toLowerCase().includes(searchTerm) &&
            !armor.Description?.toLowerCase().includes(searchTerm) &&
            !armor.ArmorSet?.toLowerCase().includes(searchTerm)) {
            return false;
        }
        
        // Slot filter
        if (slotFilter && armor.Slot !== slotFilter) return false;
        
        // Set filter
        if (setFilter && armor.ArmorSet !== setFilter) return false;
        
        // Virtue requirement filter
        if (virtueFilter) {
            const armorVirtue = getVirtueFromReq(armor.reqVirtue);
            if (virtueFilter === 'None') {
                if (armorVirtue !== '') return false;
            } else {
                if (armorVirtue !== virtueFilter) return false;
            }
        }
        
        // Rarity filter
        if (rarityFilter && armor.Rarity !== rarityFilter) return false;
        
        return true;
    });
    
    updateDisplay();
}

function clearFilters() {
    document.getElementById('search-input').value = '';
    document.getElementById('slot-filter').value = '';
    document.getElementById('set-filter').value = '';
    document.getElementById('virtue-filter').value = '';
    document.getElementById('rarity-filter').value = '';
    
    filteredArmor = [...armorPieces];
    updateDisplay();
}

function sortTable(column) {
    // Update sort direction
    if (currentSort.column === column) {
        currentSort.direction = currentSort.direction === 'asc' ? 'desc' : 'asc';
    } else {
        currentSort.column = column;
        currentSort.direction = 'asc';
    }
    
    // Map column names to actual property names
    const columnMap = {
        'name': 'name',
        'slot': 'Slot',
        'armorSet': 'ArmorSet',
        'rarity': 'Rarity',
        'physDef': 'physDef',
        'magDef': 'magDef',
        'totalDef': 'totalDef',
        'stability': 'stability',
        'reqVirtue': 'reqVirtue',
        'physAttune': 'physAttune',
        'magAttune': 'magAttune',
        'stabAttune': 'stabAttune'
    };
    
    const propertyName = columnMap[column] || column;
    
    // Sort filtered armor
    filteredArmor.sort((a, b) => {
        let aVal = a[propertyName];
        let bVal = b[propertyName];
        
        // Handle numeric columns
        if (['physDef', 'magDef', 'totalDef', 'stability'].includes(column)) {
            aVal = Number(aVal) || 0;
            bVal = Number(bVal) || 0;
        } else if (column === 'reqVirtue') {
            // Extract numeric value from virtue req string for sorting
            const aNum = aVal ? parseInt(aVal) : 0;
            const bNum = bVal ? parseInt(bVal) : 0;
            aVal = aNum;
            bVal = bNum;
        }
        
        // Handle string comparison
        if (typeof aVal === 'string') aVal = aVal.toLowerCase();
        if (typeof bVal === 'string') bVal = bVal.toLowerCase();
        
        if (aVal < bVal) return currentSort.direction === 'asc' ? -1 : 1;
        if (aVal > bVal) return currentSort.direction === 'asc' ? 1 : -1;
        return 0;
    });
    
    updateDisplay();
    updateSortIndicators();
}

function updateSortIndicators() {
    // Clear all indicators
    document.querySelectorAll('.sort-indicator').forEach(indicator => {
        indicator.textContent = '';
    });
    
    // Set current indicator
    const currentHeader = document.querySelector(`[data-column="${currentSort.column}"]`);
    if (currentHeader) {
        const indicator = currentHeader.querySelector('.sort-indicator');
        indicator.textContent = currentSort.direction === 'asc' ? '▲' : '▼';
    }
}

function updateDisplay() {
    const tbody = document.getElementById('armor-tbody');
    tbody.innerHTML = '';
    
    filteredArmor.forEach(armor => {
        const row = document.createElement('tr');
        
        const nameCell = document.createElement('td');
        nameCell.className = 'armor-name';
        nameCell.textContent = armor.name;
        nameCell.style.cursor = 'pointer';
        nameCell.addEventListener('click', () => showArmorDetails(armor.name));
        row.appendChild(nameCell);
        
        const slotCell = document.createElement('td');
        slotCell.textContent = armor.Slot || '-';
        row.appendChild(slotCell);
        
        const setCell = document.createElement('td');
        setCell.textContent = armor.ArmorSet || '-';
        row.appendChild(setCell);
        
        const rarityCell = document.createElement('td');
        rarityCell.className = `rarity-${(armor.Rarity || '').toLowerCase()}`;
        rarityCell.textContent = armor.Rarity || '-';
        row.appendChild(rarityCell);
        
        const physDefCell = document.createElement('td');
        physDefCell.textContent = armor.physDef;
        row.appendChild(physDefCell);
        
        const magDefCell = document.createElement('td');
        magDefCell.textContent = armor.magDef;
        row.appendChild(magDefCell);
        
        const totalDefCell = document.createElement('td');
        totalDefCell.textContent = armor.totalDef;
        row.appendChild(totalDefCell);
        
        const stabilityCell = document.createElement('td');
        stabilityCell.textContent = armor.stability;
        row.appendChild(stabilityCell);
        
        const reqVirtueCell = document.createElement('td');
        reqVirtueCell.textContent = formatVirtueReq(armor.reqVirtue);
        row.appendChild(reqVirtueCell);
        
        const physAttuneCell = document.createElement('td');
        physAttuneCell.textContent = armor.physAttune || '-';
        row.appendChild(physAttuneCell);
        
        const magAttuneCell = document.createElement('td');
        magAttuneCell.textContent = armor.magAttune || '-';
        row.appendChild(magAttuneCell);
        
        const stabAttuneCell = document.createElement('td');
        stabAttuneCell.textContent = armor.stabAttune || '-';
        row.appendChild(stabAttuneCell);
        
        tbody.appendChild(row);
    });
    
    // Update counts
    document.getElementById('filtered-count').textContent = filteredArmor.length;
    document.getElementById('total-count').textContent = armorPieces.length;
}

function showArmorDetails(armorName) {
    const armor = armorPieces.find(a => a.name === armorName);
    if (!armor) return;
    
    const modalBody = document.getElementById('modal-body');
    modalBody.innerHTML = '';
    
    const title = document.createElement('h2');
    title.textContent = armor.name;
    modalBody.appendChild(title);
    
    const detailsDiv = document.createElement('div');
    detailsDiv.className = 'armor-details';
    
    const details = [
        { label: 'Slot', value: armor.Slot || '-' },
        { label: 'Armor Set', value: armor.ArmorSet || '-' },
        { label: 'Rarity', value: armor.Rarity || '-', rarityClass: true },
        { label: 'Required Virtue', value: formatVirtueReq(armor.reqVirtue) }
    ];
    
    details.forEach(detail => {
        const row = document.createElement('div');
        row.className = 'detail-row';
        
        const label = document.createElement('span');
        label.className = 'detail-label';
        label.textContent = detail.label + ':';
        row.appendChild(label);
        
        const value = document.createElement('span');
        value.className = 'detail-value';
        if (detail.rarityClass) {
            value.className += ` rarity-${(armor.Rarity || '').toLowerCase()}`;
        }
        value.textContent = detail.value;
        row.appendChild(value);
        
        detailsDiv.appendChild(row);
    });
    
    modalBody.appendChild(detailsDiv);
    
    const descTitle = document.createElement('h3');
    descTitle.textContent = 'Description';
    modalBody.appendChild(descTitle);
    
    const descPara = document.createElement('p');
    descPara.className = 'armor-description';
    descPara.textContent = armor.Description || 'No description available.';
    modalBody.appendChild(descPara);
    
    if (armor.Stats) {
        const statsTitle = document.createElement('h3');
        statsTitle.textContent = 'Defence Statistics';
        modalBody.appendChild(statsTitle);
        
        const statsGrid = document.createElement('div');
        statsGrid.className = 'stats-grid';
        
        // Defence stats section
        const defSection = document.createElement('div');
        defSection.className = 'stat-section';
        const defTitle = document.createElement('h4');
        defTitle.textContent = 'Defence';
        defSection.appendChild(defTitle);
        
        const defStats = [
            { label: 'Physical Defence', value: armor.Stats.PhysicalDefence ?? 0 },
            { label: 'Magick Defence', value: armor.Stats.MagickDefence ?? 0 },
            { label: 'Stability Increase', value: armor.Stats.StabilityIncrease ?? 0 }
        ];
        
        defStats.forEach(stat => {
            const p = document.createElement('p');
            const strong = document.createElement('strong');
            strong.textContent = stat.label + ':';
            p.appendChild(strong);
            p.appendChild(document.createTextNode(' ' + stat.value));
            defSection.appendChild(p);
        });
        statsGrid.appendChild(defSection);
        
        // Attunements section
        if (armor.Stats.Attunements) {
            const attuneSection = document.createElement('div');
            attuneSection.className = 'stat-section';
            const attuneTitle = document.createElement('h4');
            attuneTitle.textContent = 'Attunements';
            attuneSection.appendChild(attuneTitle);
            
            const attuneStats = [
                { label: 'Physical', value: armor.Stats.Attunements.PhysicalAttunement || '-' },
                { label: 'Magick', value: armor.Stats.Attunements.MagickAttunement || '-' },
                { label: 'Stability', value: armor.Stats.Attunements.StabilityAttunement || '-' }
            ];
            
            attuneStats.forEach(stat => {
                const p = document.createElement('p');
                const strong = document.createElement('strong');
                strong.textContent = stat.label + ':';
                p.appendChild(strong);
                p.appendChild(document.createTextNode(' ' + stat.value));
                attuneSection.appendChild(p);
            });
            statsGrid.appendChild(attuneSection);
        }
        
        modalBody.appendChild(statsGrid);
    }
    
    // Show modal
    document.getElementById('armor-modal').style.display = 'block';
}

function closeModal() {
    document.getElementById('armor-modal').style.display = 'none';
}
