// Weapon database (populated from weaponData.js)
let weapons = [];
let filteredWeapons = [];
let currentSort = { column: 'name', direction: 'asc' };

function escapeHtml(str) {
    if (str === null || str === undefined) return '-';
    const div = document.createElement('div');
    div.textContent = String(str);
    return div.innerHTML;
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', function() {
    loadWeaponData();
    setupEventListeners();
});

function loadWeaponData() {
    // Convert weaponData object to array for easier manipulation
    weapons = Object.entries(weaponData).map(([name, data]) => ({
        name: name,
        ...data,
        // Extract base stats for easier access
        baseAttack: data.Stats?.Lvl0?.Attack || 0,
        maxAttack: data.Stats?.Lvl30?.Attack || 0,
        baseStagger: data.Stats?.Lvl0?.Stagger || 0,
        maxStagger: data.Stats?.Lvl30?.Stagger || 0,
        smiteChance: data.Stats?.SmitePercent || '0%',
        virtueAttuneCap: data.Stats?.VirtueAttuneCap || 0
    }));
    
    // Populate filter dropdowns with unique values
    populateFilters();
    
    // Initial display
    filteredWeapons = [...weapons];
    updateDisplay();
}

function populateFilters() {
    // Get unique values for each filter type
    const arts = [...new Set(weapons.map(w => w.Art).filter(Boolean))].sort();
    const damageTypes = [...new Set(weapons.map(w => w.DamageType).filter(Boolean))].sort();
    
    // Populate Art filter
    const artFilter = document.getElementById('art-filter');
    arts.forEach(art => {
        const option = document.createElement('option');
        option.value = art;
        option.textContent = art;
        artFilter.appendChild(option);
    });
    
    // Populate Damage Type filter
    const damageFilter = document.getElementById('damage-filter');
    damageTypes.forEach(type => {
        const option = document.createElement('option');
        option.value = type;
        option.textContent = type;
        damageFilter.appendChild(option);
    });
}

function setupEventListeners() {
    // Search input
    document.getElementById('search-input').addEventListener('input', filterWeapons);
    
    // Filter dropdowns
    document.getElementById('slot-filter').addEventListener('change', filterWeapons);
    document.getElementById('art-filter').addEventListener('change', filterWeapons);
    document.getElementById('damage-filter').addEventListener('change', filterWeapons);
    document.getElementById('virtue-filter').addEventListener('change', filterWeapons);
    document.getElementById('rarity-filter').addEventListener('change', filterWeapons);
    
    // Clear filters button
    document.getElementById('clear-filters').addEventListener('click', clearFilters);
    
    // Sort headers
    document.querySelectorAll('.sortable').forEach(header => {
        header.addEventListener('click', () => sortTable(header.dataset.column));
    });
    
    // Modal close button
    document.querySelector('.close').addEventListener('click', closeModal);
    window.addEventListener('click', (e) => {
        const modal = document.getElementById('weapon-modal');
        if (e.target === modal) closeModal();
    });
}

function filterWeapons() {
    const searchTerm = document.getElementById('search-input').value.toLowerCase();
    const slotFilter = document.getElementById('slot-filter').value;
    const artFilter = document.getElementById('art-filter').value;
    const damageFilter = document.getElementById('damage-filter').value;
    const virtueFilter = document.getElementById('virtue-filter').value;
    const rarityFilter = document.getElementById('rarity-filter').value;
    
    filteredWeapons = weapons.filter(weapon => {
        // Search filter
        if (searchTerm && !weapon.name.toLowerCase().includes(searchTerm) &&
            !weapon.Description?.toLowerCase().includes(searchTerm)) {
            return false;
        }
        
        // Slot filter
        if (slotFilter && weapon.Slot !== slotFilter) return false;
        
        // Art filter
        if (artFilter && weapon.Art !== artFilter) return false;
        
        // Damage type filter
        if (damageFilter && weapon.DamageType !== damageFilter) return false;
        
        // Virtue filter
        if (virtueFilter && weapon.AttuneVirtue !== virtueFilter) return false;
        
        // Rarity filter
        if (rarityFilter && weapon.Rarity !== rarityFilter) return false;
        
        return true;
    });
    
    updateDisplay();
}

function clearFilters() {
    document.getElementById('search-input').value = '';
    document.getElementById('slot-filter').value = '';
    document.getElementById('art-filter').value = '';
    document.getElementById('damage-filter').value = '';
    document.getElementById('virtue-filter').value = '';
    document.getElementById('rarity-filter').value = '';
    
    filteredWeapons = [...weapons];
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
        'art': 'Art',
        'damageType': 'DamageType',
        'rarity': 'Rarity',
        'attuneVirtue': 'AttuneVirtue',
        'attuneTier': 'AttuneTier',
        'virtueAttuneCap': 'virtueAttuneCap',
        'reqVirtue': 'ReqVirtue',
        'baseAttack': 'baseAttack',
        'maxAttack': 'maxAttack',
        'baseStagger': 'baseStagger',
        'maxStagger': 'maxStagger',
        'smite': 'smiteChance'
    };
    
    const propertyName = columnMap[column] || column;
    
    // Sort filtered weapons
    filteredWeapons.sort((a, b) => {
        let aVal = a[propertyName];
        let bVal = b[propertyName];
        
        // Handle numeric columns
        if (['baseAttack', 'maxAttack', 'baseStagger', 'maxStagger', 'virtueAttuneCap'].includes(column)) {
            aVal = Number(aVal) || 0;
            bVal = Number(bVal) || 0;
        } else if (column === 'reqVirtue' || column === 'attuneTier') {
            // Handle empty strings as 0 for virtue requirements
            aVal = aVal === '' ? 0 : Number(aVal) || 0;
            bVal = bVal === '' ? 0 : Number(bVal) || 0;
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
    const tbody = document.getElementById('weapons-tbody');
    tbody.innerHTML = '';
    
    filteredWeapons.forEach(weapon => {
        const row = document.createElement('tr');
        
        const nameCell = document.createElement('td');
        nameCell.className = 'weapon-name';
        nameCell.textContent = weapon.name;
        nameCell.style.cursor = 'pointer';
        nameCell.addEventListener('click', () => showWeaponDetails(weapon.name));
        row.appendChild(nameCell);
        
        const slotCell = document.createElement('td');
        slotCell.textContent = weapon.Slot || '-';
        row.appendChild(slotCell);
        
        const artCell = document.createElement('td');
        artCell.textContent = weapon.Art || '-';
        row.appendChild(artCell);
        
        const damageCell = document.createElement('td');
        damageCell.textContent = weapon.DamageType || '-';
        row.appendChild(damageCell);
        
        const rarityCell = document.createElement('td');
        rarityCell.className = `rarity-${(weapon.Rarity || '').toLowerCase()}`;
        rarityCell.textContent = weapon.Rarity || '-';
        row.appendChild(rarityCell);
        
        const attuneVirtueCell = document.createElement('td');
        attuneVirtueCell.textContent = weapon.AttuneVirtue || '-';
        row.appendChild(attuneVirtueCell);
        
        const attuneTierCell = document.createElement('td');
        attuneTierCell.textContent = weapon.AttuneTier || '-';
        row.appendChild(attuneTierCell);
        
        const virtueCapCell = document.createElement('td');
        virtueCapCell.textContent = weapon.virtueAttuneCap || '-';
        row.appendChild(virtueCapCell);
        
        const reqVirtueCell = document.createElement('td');
        reqVirtueCell.textContent = weapon.ReqVirtue || '0';
        row.appendChild(reqVirtueCell);
        
        const baseAttackCell = document.createElement('td');
        baseAttackCell.textContent = weapon.baseAttack;
        row.appendChild(baseAttackCell);
        
        const maxAttackCell = document.createElement('td');
        maxAttackCell.textContent = weapon.maxAttack;
        row.appendChild(maxAttackCell);
        
        const baseStaggerCell = document.createElement('td');
        baseStaggerCell.textContent = weapon.baseStagger;
        row.appendChild(baseStaggerCell);
        
        const maxStaggerCell = document.createElement('td');
        maxStaggerCell.textContent = weapon.maxStagger;
        row.appendChild(maxStaggerCell);
        
        const smiteCell = document.createElement('td');
        smiteCell.textContent = weapon.smiteChance;
        row.appendChild(smiteCell);
        
        tbody.appendChild(row);
    });
    
    // Update counts
    document.getElementById('filtered-count').textContent = filteredWeapons.length;
    document.getElementById('total-count').textContent = weapons.length;
}

function showWeaponDetails(weaponName) {
    const weapon = weapons.find(w => w.name === weaponName);
    if (!weapon) return;
    
    const modalBody = document.getElementById('modal-body');
    modalBody.innerHTML = '';
    
    const title = document.createElement('h2');
    title.textContent = weapon.name;
    modalBody.appendChild(title);
    
    const detailsDiv = document.createElement('div');
    detailsDiv.className = 'weapon-details';
    
    const details = [
        { label: 'Slot', value: weapon.Slot || '-' },
        { label: 'Art', value: weapon.Art || '-' },
        { label: 'Damage Type', value: weapon.DamageType || '-' },
        { label: 'Rarity', value: weapon.Rarity || '-', rarityClass: true },
        { label: 'Attune Virtue', value: weapon.AttuneVirtue || '-' },
        { label: 'Attune Tier', value: weapon.AttuneTier || '-' },
        { label: 'Required Virtue', value: weapon.ReqVirtue || '0' },
        { label: 'Smite Chance', value: `${weapon.Stats?.Smite || '-'} (${weapon.smiteChance})` }
    ];
    
    if (weapon.Stats?.VirtueAttuneCap) {
        details.push({ label: 'Virtue Attune Cap', value: weapon.Stats.VirtueAttuneCap });
    }
    
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
            value.className += ` rarity-${(weapon.Rarity || '').toLowerCase()}`;
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
    descPara.className = 'weapon-description';
    descPara.textContent = weapon.Description || 'No description available.';
    modalBody.appendChild(descPara);
    
    if (weapon.Stats) {
        const statsTitle = document.createElement('h3');
        statsTitle.textContent = 'Combat Statistics';
        modalBody.appendChild(statsTitle);
        
        const statsGrid = document.createElement('div');
        statsGrid.className = 'stats-grid';
        
        if (weapon.Stats.Lvl0) {
            const lvl0Section = document.createElement('div');
            lvl0Section.className = 'stat-section';
            const lvl0Title = document.createElement('h4');
            lvl0Title.textContent = 'Level 0 Stats';
            lvl0Section.appendChild(lvl0Title);
            
            Object.entries(weapon.Stats.Lvl0).forEach(([key, value]) => {
                const p = document.createElement('p');
                const strong = document.createElement('strong');
                strong.textContent = key + ':';
                p.appendChild(strong);
                p.appendChild(document.createTextNode(' ' + value));
                lvl0Section.appendChild(p);
            });
            statsGrid.appendChild(lvl0Section);
        }
        
        if (weapon.Stats.Lvl30) {
            const lvl30Section = document.createElement('div');
            lvl30Section.className = 'stat-section';
            const lvl30Title = document.createElement('h4');
            lvl30Title.textContent = 'Level 30 Stats';
            lvl30Section.appendChild(lvl30Title);
            
            Object.entries(weapon.Stats.Lvl30).forEach(([key, value]) => {
                const p = document.createElement('p');
                const strong = document.createElement('strong');
                strong.textContent = key + ':';
                p.appendChild(strong);
                p.appendChild(document.createTextNode(' ' + value));
                lvl30Section.appendChild(p);
            });
            statsGrid.appendChild(lvl30Section);
        }
        
        modalBody.appendChild(statsGrid);
        
        if (weapon.Stats.AttuneCaps) {
            const capsTitle = document.createElement('h4');
            capsTitle.textContent = 'Attunement Caps';
            modalBody.appendChild(capsTitle);
            
            const capsDiv = document.createElement('div');
            capsDiv.className = 'attune-caps';
            
            Object.entries(weapon.Stats.AttuneCaps)
                .filter(([key, value]) => value !== null && value !== undefined)
                .forEach(([key, value]) => {
                    const p = document.createElement('p');
                    const strong = document.createElement('strong');
                    strong.textContent = key + ':';
                    p.appendChild(strong);
                    p.appendChild(document.createTextNode(' ' + value));
                    capsDiv.appendChild(p);
                });
            
            modalBody.appendChild(capsDiv);
        }
    }
    
    // Show modal
    document.getElementById('weapon-modal').style.display = 'block';
}

function closeModal() {
    document.getElementById('weapon-modal').style.display = 'none';
}
