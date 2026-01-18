// Weapon database (populated from weaponData.js)
let weapons = [];
let filteredWeapons = [];
let currentSort = { column: 'name', direction: 'asc' };

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
        row.innerHTML = `
            <td class="weapon-name" onclick="showWeaponDetails('${weapon.name.replace(/'/g, "\\'")}')">${weapon.name}</td>
            <td>${weapon.Slot || '-'}</td>
            <td>${weapon.Art || '-'}</td>
            <td>${weapon.DamageType || '-'}</td>
            <td class="rarity-${(weapon.Rarity || '').toLowerCase()}">${weapon.Rarity || '-'}</td>
            <td>${weapon.AttuneVirtue || '-'}</td>
            <td>${weapon.AttuneTier || '-'}</td>
            <td>${weapon.virtueAttuneCap || '-'}</td>
            <td>${weapon.ReqVirtue || '0'}</td>
            <td>${weapon.baseAttack}</td>
            <td>${weapon.maxAttack}</td>
            <td>${weapon.baseStagger}</td>
            <td>${weapon.maxStagger}</td>
            <td>${weapon.smiteChance}</td>
        `;
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
    
    // Build detailed stats HTML
    let statsHTML = '';
    if (weapon.Stats) {
        statsHTML = `
            <h3>Combat Statistics</h3>
            <div class="stats-grid">
                <div class="stat-section">
                    <h4>Level 0 Stats</h4>
                    ${Object.entries(weapon.Stats.Lvl0 || {}).map(([key, value]) => 
                        `<p><strong>${key}:</strong> ${value}</p>`
                    ).join('')}
                </div>
                <div class="stat-section">
                    <h4>Level 30 Stats</h4>
                    ${Object.entries(weapon.Stats.Lvl30 || {}).map(([key, value]) => 
                        `<p><strong>${key}:</strong> ${value}</p>`
                    ).join('')}
                </div>
            </div>
            
            ${weapon.Stats.AttuneCaps ? `
            <h4>Attunement Caps</h4>
            <div class="attune-caps">
                ${Object.entries(weapon.Stats.AttuneCaps).filter(([key, value]) => value !== null && value !== undefined).map(([key, value]) => 
                    `<p><strong>${key}:</strong> ${value}</p>`
                ).join('')}
            </div>
            ` : ''}
        `;
    }
    
    modalBody.innerHTML = `
        <h2>${weapon.name}</h2>
        <div class="weapon-details">
            <div class="detail-row">
                <span class="detail-label">Slot:</span>
                <span class="detail-value">${weapon.Slot || '-'}</span>
            </div>
            <div class="detail-row">
                <span class="detail-label">Art:</span>
                <span class="detail-value">${weapon.Art || '-'}</span>
            </div>
            <div class="detail-row">
                <span class="detail-label">Damage Type:</span>
                <span class="detail-value">${weapon.DamageType || '-'}</span>
            </div>
            <div class="detail-row">
                <span class="detail-label">Rarity:</span>
                <span class="detail-value rarity-${(weapon.Rarity || '').toLowerCase()}">${weapon.Rarity || '-'}</span>
            </div>
            <div class="detail-row">
                <span class="detail-label">Attune Virtue:</span>
                <span class="detail-value">${weapon.AttuneVirtue || '-'}</span>
            </div>
            <div class="detail-row">
                <span class="detail-label">Attune Tier:</span>
                <span class="detail-value">${weapon.AttuneTier || '-'}</span>
            </div>
            <div class="detail-row">
                <span class="detail-label">Required Virtue:</span>
                <span class="detail-value">${weapon.ReqVirtue || '0'}</span>
            </div>
            <div class="detail-row">
                <span class="detail-label">Smite Chance:</span>
                <span class="detail-value">${weapon.Stats?.Smite || '-'} (${weapon.smiteChance})</span>
            </div>
            ${weapon.Stats?.VirtueAttuneCap ? `
            <div class="detail-row">
                <span class="detail-label">Virtue Attune Cap:</span>
                <span class="detail-value">${weapon.Stats.VirtueAttuneCap}</span>
            </div>
            ` : ''}
        </div>
        
        <h3>Description</h3>
        <p class="weapon-description">${weapon.Description || 'No description available.'}</p>
        
        ${statsHTML}
    `;
    
    // Show modal
    document.getElementById('weapon-modal').style.display = 'block';
}

function closeModal() {
    document.getElementById('weapon-modal').style.display = 'none';
}
