document.addEventListener('DOMContentLoaded', () => {
    const translationEl = document.getElementById('translation-roll');
    const bookEl = document.getElementById('book-roll');
    const verseEl = document.getElementById('verse-roll');
    
    const rerollTranslationBtn = document.getElementById('reroll-translation');
    const rerollBookBtn = document.getElementById('reroll-book');
    const rerollVerseBtn = document.getElementById('reroll-verse');
    const generateAllBtn = document.getElementById('generate-all');

    const API_BASE = 'https://bible.helloao.org/api';
    
    let availableTranslations = [];
    let currentTranslation = null;
    let currentBooks = [];
    let currentBook = null;
    let currentChapter = null;

    // Initialize by loading available translations
    async function init() {
        try {
            translationEl.innerHTML = '<span class="loading">Loading translations...</span>';
            const response = await fetch(`${API_BASE}/available_translations.json`);
            
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            
            const data = await response.json();
            
            // Handle if data is an object with a translations property
            if (Array.isArray(data)) {
                availableTranslations = data;
            } else if (data.translations && Array.isArray(data.translations)) {
                availableTranslations = data.translations;
            } else {
                console.error('Unexpected data format:', data);
                throw new Error('Invalid data format');
            }
            
            if (availableTranslations.length > 0) {
                await randomizeAll();
            } else {
                translationEl.innerHTML = '<span class="error">No translations available</span>';
            }
        } catch (error) {
            console.error('Error loading translations:', error);
            translationEl.innerHTML = '<span class="error">Error loading translations</span>';
        }
    }

    function getRandomItem(array) {
        return array[Math.floor(Math.random() * array.length)];
    }

    async function setTranslation() {
        try {
            currentTranslation = getRandomItem(availableTranslations);
            const displayName = currentTranslation.full_name || currentTranslation.name || currentTranslation.abbreviation;
            const abbr = currentTranslation.abbreviation || currentTranslation.abbr || currentTranslation.id;
            translationEl.textContent = `${displayName} (${abbr})`;
            
            // Load books for this translation
            bookEl.innerHTML = '<span class="loading">Loading books...</span>';
            const response = await fetch(`${API_BASE}/${abbr}/books.json`);
            
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            
            const data = await response.json();
            
            // Handle different response formats
            if (Array.isArray(data)) {
                currentBooks = data;
            } else if (data.books && Array.isArray(data.books)) {
                currentBooks = data.books;
            } else {
                console.error('Unexpected books data format:', data);
                throw new Error('Invalid books data format');
            }
            
            return true;
        } catch (error) {
            console.error('Error setting translation:', error);
            translationEl.innerHTML = '<span class="error">Error loading translation</span>';
            return false;
        }
    }

    async function setBook() {
        if (currentBooks.length === 0) {
            bookEl.innerHTML = '<span class="error">No books available</span>';
            return false;
        }

        try {
            currentBook = getRandomItem(currentBooks);
            const bookName = currentBook.name || currentBook.full_name || currentBook.abbreviation;
            bookEl.textContent = bookName;
            return true;
        } catch (error) {
            console.error('Error setting book:', error);
            bookEl.innerHTML = '<span class="error">Error loading book</span>';
            return false;
        }
    }

    async function setVerse() {
        if (!currentBook || !currentTranslation) {
            verseEl.innerHTML = '<span class="error">Please select a translation and book first</span>';
            return;
        }

        try {
            verseEl.innerHTML = '<span class="loading">Loading verse...</span>';
            
            // Get a random chapter from the book
            const numChapters = currentBook.chapters || currentBook.chapter_count || 1;
            const randomChapter = Math.floor(Math.random() * numChapters) + 1;
            
            // Fetch the chapter data
            const abbr = currentTranslation.abbreviation || currentTranslation.abbr || currentTranslation.id;
            const bookAbbr = currentBook.abbreviation || currentBook.abbr || currentBook.id;
            const response = await fetch(`${API_BASE}/${abbr}/${bookAbbr}/${randomChapter}.json`);
            
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            
            const data = await response.json();
            
            // Handle different response formats
            let verses = [];
            if (Array.isArray(data)) {
                verses = data;
            } else if (data.verses && Array.isArray(data.verses)) {
                verses = data.verses;
            } else if (data.chapter && data.chapter.verses) {
                verses = data.chapter.verses;
            } else {
                console.error('Unexpected verse data format:', data);
                throw new Error('Invalid verse data format');
            }
            
            if (!verses || verses.length === 0) {
                verseEl.innerHTML = '<span class="error">No verses found in this chapter</span>';
                return;
            }

            // Get a random verse from the chapter
            const randomVerse = getRandomItem(verses);
            
            // Display the verse
            const bookName = currentBook.name || currentBook.full_name || currentBook.abbreviation;
            const verseNum = randomVerse.verse || randomVerse.number || randomVerse.id || randomVerse.verse_number;
            const verseText = randomVerse.text || randomVerse.content || randomVerse.verse_text || '';
            
            let result = '<div class="verse-display">';
            result += `<span class="verse-reference">${bookName} ${randomChapter}:${verseNum}</span>`;
            result += `<p class="verse-text">${verseText}</p>`;
            result += '</div>';
            
            verseEl.innerHTML = result;
        } catch (error) {
            console.error('Error loading verse:', error);
            verseEl.innerHTML = '<span class="error">Error loading verse</span>';
        }
    }

    async function randomizeAll() {
        const translationSuccess = await setTranslation();
        if (!translationSuccess) return;
        
        const bookSuccess = await setBook();
        if (!bookSuccess) return;
        
        await setVerse();
    }

    async function rerollTranslation() {
        const translationSuccess = await setTranslation();
        if (!translationSuccess) return;
        
        const bookSuccess = await setBook();
        if (!bookSuccess) return;
        
        await setVerse();
    }

    async function rerollBook() {
        if (currentBooks.length === 0) {
            // Need to load books first
            await setTranslation();
        }
        
        const bookSuccess = await setBook();
        if (!bookSuccess) return;
        
        await setVerse();
    }

    async function rerollVerse() {
        await setVerse();
    }

    // Event listeners
    rerollTranslationBtn.addEventListener('click', rerollTranslation);
    rerollBookBtn.addEventListener('click', rerollBook);
    rerollVerseBtn.addEventListener('click', rerollVerse);
    generateAllBtn.addEventListener('click', randomizeAll);

    // Initialize the app
    init();
});
