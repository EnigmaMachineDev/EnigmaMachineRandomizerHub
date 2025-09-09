        let allTalismansData; // Global variable for all talismans
        let selectedTalismans = []; // Global variable for selected talismans
        let primaryWeaponData;
        let armorData;
        let spiritAshesData;
        let eldenRingSpellsData;
        let eldenRingCastingWeaponsData;

        // Function to reroll a single talisman
        window.rerollTalisman = (index) => {
            if (allTalismansData.length === 0) return;
            const talismansCopy = [...allTalismansData];
            const randomIndex = Math.floor(Math.random() * talismansCopy.length);
            const newTalisman = talismansCopy[randomIndex];
            selectedTalismans[index] = newTalisman;

            // Update the specific list item in the DOM
            const talismanListElement = document.getElementById('talismanList');
            if (talismanListElement) {
                const listItem = talismanListElement.children[index];
                if (listItem) {
                    listItem.querySelector('.item-content').innerHTML = `${newTalisman.name} <a href="${newTalisman.link}" target="_blank" style="color: #66bb6a;">(link)</a>`;
                }
            }
        };

        // Function to reroll all talismans
        window.rerollAllTalismans = () => {
            if (allTalismansData.length === 0) return;

            const numberOfTalismans = 4;
            selectedTalismans = [];
            const talismansCopy = [...allTalismansData];

            for (let i = 0; i < numberOfTalismans; i++) {
                if (talismansCopy.length === 0) break;
                const randomIndex = Math.floor(Math.random() * talismansCopy.length);
                selectedTalismans.push(talismansCopy.splice(randomIndex, 1)[0]);
            }

            const talismanListElement = document.getElementById('talismanList');
            if (talismanListElement) {
                selectedTalismans.forEach((talisman, index) => {
                    const listItem = talismanListElement.children[index];
                    if (listItem) {
                                                listItem.querySelector('.item-content').innerHTML = `${talisman.name} <a href="${talisman.link}" target="_blank" style="color: #66bb6a;">(link)</a>`;
                    }
                });
            }
        };

        // Function to reroll the primary weapon
        window.rerollWeapon = () => {
            if (!primaryWeaponData) return;
            const weaponNames = Object.keys(primaryWeaponData);
            const randomWeaponName = weaponNames[Math.floor(Math.random() * weaponNames.length)];
            const randomWeaponLink = primaryWeaponData[randomWeaponName];
            document.getElementById('primaryWeapon').innerHTML = `${randomWeaponName} <a href="${randomWeaponLink}" target="_blank" style="color: #66bb6a;">(link)</a>`;
        };

        // Function to reroll the armor set
        window.rerollArmor = () => {
            if (!armorData) return;
            const armorTypes = ['light', 'medium', 'heavy'];
            const randomArmorType = armorTypes[Math.floor(Math.random() * armorTypes.length)];
            const selectedArmorSets = armorData[randomArmorType];
            const randomArmorSet = selectedArmorSets[Math.floor(Math.random() * selectedArmorSets.length)];
            const armorSetName = randomArmorSet.name;
            const armorSetLink = randomArmorSet.link;
                        document.getElementById('armorSet').innerHTML = `${armorSetName} <a href="${armorSetLink}" target="_blank" style="color: #66bb6a;">(link)</a>`;
        };

        // Function to reroll the spirit ashes
        window.rerollSpiritAshes = () => {
            if (!spiritAshesData) return;
            const numberOfSpiritAshes = Math.floor(Math.random() * 5) + 1; // Random number between 1 and 5
            const selectedSpiritAshes = [];
            const spiritAshesCopy = [...spiritAshesData]; // Create a mutable copy

            for (let i = 0; i < numberOfSpiritAshes; i++) {
                if (spiritAshesCopy.length === 0) break; // No more unique ashes to pick
                const randomIndex = Math.floor(Math.random() * spiritAshesCopy.length);
                selectedSpiritAshes.push(spiritAshesCopy.splice(randomIndex, 1)[0]);
            }

            let spiritAshesHtml = '<ul>';
            selectedSpiritAshes.forEach(ash => {
                spiritAshesHtml += `<li>${ash.name} <a href="${ash.link}" target="_blank" style="color: #66bb6a;">(link)</a></li>`;
            });
            spiritAshesHtml += '</ul>';

            document.getElementById('spiritAshesList').innerHTML = spiritAshesHtml;
        };

        let currentSpellType = ''; // To store the current spell type for rerolling Staff/Seal

        function generateCasterWeaponData(spellType) {
            let casterWeaponName = 'None';
            let casterWeaponLink = '#';
            if (spellType === '(Sorceries)') {
                const staffs = eldenRingCastingWeaponsData.staffs;
                if (staffs.length > 0) {
                    const randomStaff = staffs[Math.floor(Math.random() * staffs.length)];
                    casterWeaponName = randomStaff.name;
                    casterWeaponLink = randomStaff.url;
                }
            } else if (spellType === '(Incantations)') {
                const seals = eldenRingCastingWeaponsData.seals;
                if (seals.length > 0) {
                    const randomSeal = seals[Math.floor(Math.random() * seals.length)];
                    casterWeaponName = randomSeal.name;
                    casterWeaponLink = randomSeal.url;
                }
            }
            return { casterWeaponName, casterWeaponLink };
        }

        function rerollCasterWeapon() {
            if (!eldenRingCastingWeaponsData || currentSpellType === '(None)') {
                document.getElementById('casterWeaponContainer').style.display = 'none';
                return;
            }
            document.getElementById('casterWeaponContainer').style.display = 'block';
            const { casterWeaponName, casterWeaponLink } = generateCasterWeaponData(currentSpellType);
            document.getElementById('casterWeapon').innerHTML = `${casterWeaponName} <a href="${casterWeaponLink}" target="_blank" style="color: #66bb6a;">(link)</a>`;
        }

        function generateSpellData() {
            if (!eldenRingSpellsData) return { spellsHtml: '<ul></ul>', currentSpellType: '(None)' };

            const spellRoll = Math.floor(Math.random() * 3) + 1;
            let selectedSpells = [];
            let spellsHtml = '<ul>';
            let newCurrentSpellType = '';

            if (spellRoll === 2) { // Sorceries
                newCurrentSpellType = '(Sorceries)';
                const sorceries = eldenRingSpellsData.filter(spell => spell.type === 'Sorcery');
                const numberOfSpells = Math.floor(Math.random() * 3) + 1;
                const spellsCopy = [...sorceries];
                for (let i = 0; i < numberOfSpells; i++) {
                    if (spellsCopy.length === 0) break;
                    const randomIndex = Math.floor(Math.random() * spellsCopy.length);
                    selectedSpells.push(spellsCopy.splice(randomIndex, 1)[0]);
                }
            } else if (spellRoll === 3) { // Incantations
                newCurrentSpellType = '(Incantations)';
                const incantations = eldenRingSpellsData.filter(spell => spell.type === 'Incantation');
                const numberOfSpells = Math.floor(Math.random() * 3) + 1;
                const spellsCopy = [...incantations];
                for (let i = 0; i < numberOfSpells; i++) {
                    if (spellsCopy.length === 0) break;
                    const randomIndex = Math.floor(Math.random() * spellsCopy.length);
                    selectedSpells.push(spellsCopy.splice(randomIndex, 1)[0]);
                }
            } else if (spellRoll === 1) { // None
                newCurrentSpellType = '(None)';
            }

            if (selectedSpells.length > 0) {
                selectedSpells.forEach(spell => {
                    spellsHtml += `<li>${spell.name} <a href="${spell.link}" target="_blank" style="color: #66bb6a;">(link)</a></li>`;
                });
            }
            spellsHtml += '</ul>';

            return { spellsHtml, currentSpellType: newCurrentSpellType };
        }

        // Function to reroll the spells
        window.rerollSpells = () => {
            if (!eldenRingSpellsData || !eldenRingCastingWeaponsData) return;
            
            const { spellsHtml, currentSpellType: newSpellType } = generateSpellData();
            currentSpellType = newSpellType;

            document.getElementById('spellsList').innerHTML = spellsHtml;
            document.getElementById('spellTypeLabel').textContent = `Spells: ${currentSpellType}`;

            rerollCasterWeapon();
        };

        document.getElementById('generateButton').addEventListener('click', async () => {
            const displayDiv = document.getElementById('characterDisplay');
            displayDiv.innerHTML = '<p>Generating character...</p>';

            try {
                const response = await fetch('elden_ring_weapons.json');
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                primaryWeaponData = await response.json();
            } catch (error) {
                console.error('Error fetching primary weapon data:', error);
                displayDiv.innerHTML = '<p style="color: red;">Failed to load primary weapon data.</p>';
                return;
            }
            const weaponNames = Object.keys(primaryWeaponData);
            const randomWeaponName = weaponNames[Math.floor(Math.random() * weaponNames.length)];
            const randomWeaponLink = primaryWeaponData[randomWeaponName];
            const randomWeapon = { name: randomWeaponName, link: randomWeaponLink };

            try {
                const response = await fetch('elden_ring_casting_weapons.json');
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                eldenRingCastingWeaponsData = await response.json();
            } catch (error) {
                console.error('Error fetching casting weapons data:', error);
                displayDiv.innerHTML = '<p style="color: red;">Failed to load casting weapons data.</p>';
                return;
            }

            try {
                const response = await fetch('elden_ring_spirit_ashes.json');
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                spiritAshesData = await response.json();
            } catch (error) {
                console.error('Error fetching spirit ashes data:', error);
                displayDiv.innerHTML = '<p style="color: red;">Failed to load spirit ashes data.</p>';
                return;
            }

            const numberOfSpiritAshes = Math.floor(Math.random() * 5) + 1; // Random number between 1 and 5
            const selectedSpiritAshes = [];
            const spiritAshesCopy = [...spiritAshesData]; // Create a mutable copy

            for (let i = 0; i < numberOfSpiritAshes; i++) {
                if (spiritAshesCopy.length === 0) break; // No more unique ashes to pick
                const randomIndex = Math.floor(Math.random() * spiritAshesCopy.length);
                selectedSpiritAshes.push(spiritAshesCopy.splice(randomIndex, 1)[0]);
            }

            let spiritAshesHtml = '<ul>';
            selectedSpiritAshes.forEach(ash => {
                spiritAshesHtml += `<li>${ash.name} <a href="${ash.link}" target="_blank" style="color: #66bb6a;">(link)</a></li>`;
            });
            spiritAshesHtml += '</ul>';

            // Fetch talismans data
            try {
                const response = await fetch('elden_ring_talismans.json');
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                allTalismansData = await response.json(); // Populate global allTalismansData
            } catch (error) {
                console.error('Error fetching talismans data:', error);
                displayDiv.innerHTML = '<p style="color: red;">Failed to load talismans data.</p>';
                return;
            }

            const numberOfTalismans = 4; // Always select 4 talismans
            selectedTalismans = []; // Reset for new generation

            const talismansCopy = [...allTalismansData];
            for (let i = 0; i < numberOfTalismans; i++) {
                if (talismansCopy.length === 0) break;
                const randomIndex = Math.floor(Math.random() * talismansCopy.length);
                selectedTalismans.push(talismansCopy.splice(randomIndex, 1)[0]);
            }

            // Construct talismansHtml for initial display
            talismansDisplayHtml = '';
            selectedTalismans.forEach((talisman, index) => {
                talismansDisplayHtml += `
                    <li><div class="item-content">${talisman.name} <a href="${talisman.link}" target="_blank" style="color: #66bb6a;">(link)</a></div><div class="item-reroll"><button class="reroll-button" onclick="rerollTalisman(${index})">&#x21bb;</button></div></li>
                `;
            });

            try {
                const response = await fetch('elden_ring_spells.json');
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                eldenRingSpellsData = await response.json();
            } catch (error) {
                console.error('Error fetching spells data:', error);
                displayDiv.innerHTML = '<p style="color: red;">Failed to load spells data.</p>';
                return;
            }

            const { spellsHtml: initialSpellsHtml, currentSpellType: initialSpellType } = generateSpellData();
            currentSpellType = initialSpellType;

            const { casterWeaponName, casterWeaponLink } = generateCasterWeaponData(currentSpellType);

            try {
                const response = await fetch('elden_ring_armor.json');
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                armorData = await response.json();
            } catch (error) {
                console.error('Error fetching armor data:', error);
                displayDiv.innerHTML = '<p style="color: red;">Failed to load armor data.</p>';
                return;
            }

            const armorTypes = ['light', 'medium', 'heavy'];
            const randomArmorType = armorTypes[Math.floor(Math.random() * armorTypes.length)];
            const selectedArmorSets = armorData[randomArmorType];
            const randomArmorSet = selectedArmorSets[Math.floor(Math.random() * selectedArmorSets.length)];
            const armorSetName = randomArmorSet.name;
            const armorSetLink = randomArmorSet.link;

            // Construct talismansHtml for initial display
            talismansDisplayHtml = '';
            selectedTalismans.forEach((talisman, index) => {
                talismansDisplayHtml += `
                    <li><div class="item-content">${talisman.name} <a href="${talisman.link}" target="_blank" style="color: #66bb6a;">(link)</a></div><div class="item-reroll"><button class="reroll-button" onclick="rerollTalisman(${index})">&#x21bb;</button></div></li>
                `;
            });

            let casterWeaponDisplay = '';
            if (currentSpellType !== '(None)') {
                casterWeaponDisplay = `
                    <div class="section-header">
                        <p><strong>Staff/Seal:</strong></p>
                        <button class="reroll-button" onclick="rerollCasterWeapon()">&#x21bb;</button>
                    </div>
                    <div class="item-content" id="casterWeapon"><a href="${casterWeaponLink}" target="_blank">${casterWeaponName}</a></div>
                `;
            }

            displayDiv.innerHTML = `
                <div class="grid-container">
                    <div class="section-header">
                        <p><strong>Primary Weapon:</strong></p>
                        <button class="reroll-button" onclick="rerollWeapon()">&#x21bb;</button>
                    </div>
                    <div class="item-content" id="primaryWeapon">${randomWeapon.name} <a href="${randomWeapon.link}" target="_blank" style="color: #66bb6a;">(link)</a></div>

                    <div class="section-header">
                        <p><strong>Spirit Ashes:</strong></p>
                        <button class="reroll-button" onclick="rerollSpiritAshes()">&#x21bb;</button>
                    </div>
                    <div class="item-list full-width-item" id="spiritAshesList">${spiritAshesHtml}</div>

                    <div class="section-header">
                        <p><strong>Armor Set:</strong></p>
                        <button class="reroll-button" onclick="rerollArmor()">&#x21bb;</button>
                    </div>
                    <div class="item-content" id="armorSet">${armorSetName} <a href="${armorSetLink}" target="_blank" style="color: #66bb6a;">(link)</a></div>

                    <div class="section-header">
                        <p><strong>Talismans:</strong></p>
                        <button class="reroll-button" onclick="rerollAllTalismans()">&#x21bb;</button>
                    </div>
                    <ul id="talismanList" class="full-width-item">${talismansDisplayHtml}</ul>

                    <div class="section-header">
                        <p><strong id="spellTypeLabel">Spells: ${initialSpellType}</strong></p>
                        <button class="reroll-button" onclick="rerollSpells()">&#x21bb;</button>
                    </div>
                    <div class="item-list full-width-item" id="spellsList">${initialSpellsHtml}</div>
                    <div id="casterWeaponContainer" class="full-width-item" style="margin-top: 10px; ${currentSpellType === '(None)' ? 'display: none;' : ''}">
                        <strong>Staff/Seal:</strong> <span id="casterWeapon">${casterWeaponName} <a href="${casterWeaponLink}" target="_blank" style="color: #66bb6a;">(link)</a></span>
                    </div>
                </div>
            `;
        });
