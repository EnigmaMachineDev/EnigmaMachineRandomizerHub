# Coding Rules & Standards for Enigma Machine Randomizer Hub

## Separation of Concerns

### **CRITICAL RULE: Always maintain strict separation between HTML, CSS, and JavaScript**

#### **HTML Files (Structure Only)**
- ✅ **DO:** Use semantic HTML5 elements
- ✅ **DO:** Include only structural markup
- ✅ **DO:** Link to external CSS files: `<link rel="stylesheet" href="style.css">`
- ✅ **DO:** Link to external JavaScript files: `<script src="script.js"></script>`
- ❌ **DON'T:** Include inline styles (`<div style="...">`)
- ❌ **DON'T:** Include `<style>` tags in HTML
- ❌ **DON'T:** Include inline JavaScript (`onclick="..."`)
- ❌ **DON'T:** Include `<script>` tags with code (except external file references)

**Example - Good:**
```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>Randomizer</title>
    <link rel="stylesheet" href="style.css">
</head>
<body>
    <div class="container">
        <button class="btn" id="generate">Generate</button>
    </div>
    <script src="script.js"></script>
</body>
</html>
```

**Example - Bad:**
```html
<!-- DON'T DO THIS -->
<head>
    <style>
        .btn { color: red; }
    </style>
</head>
<body>
    <button style="color: red" onclick="generate()">Generate</button>
    <script>
        function generate() { /* ... */ }
    </script>
</body>
```

#### **CSS Files (Styling Only)**
- ✅ **DO:** Keep all styling in external `.css` files
- ✅ **DO:** Use semantic class names (`.category-header`, `.options-grid`)
- ✅ **DO:** Group related styles together with comments
- ✅ **DO:** Use CSS variables for repeated values (colors, spacing)
- ❌ **DON'T:** Include JavaScript logic
- ❌ **DON'T:** Use inline styles in HTML
- ❌ **DON'T:** Duplicate styles across files (use shared CSS)

**File Structure:**
- `style.css` - Main randomizer styles
- `options.css` - Options page specific styles (if needed)

**Example - Good:**
```css
/* Button Styles */
.btn {
    background-color: #66cc66;
    color: #222222;
    border: none;
    padding: 10px 20px;
    border-radius: 5px;
    cursor: pointer;
    transition: background-color 0.3s ease;
}

.btn:hover {                     
    background-color: #88e888;
}
```

#### **JavaScript Files (Behavior Only)**
- ✅ **DO:** Keep all behavior/logic in external `.js` files
- ✅ **DO:** Use event listeners (not inline handlers)
- ✅ **DO:** Use meaningful function and variable names
- ✅ **DO:** Add comments for complex logic
- ✅ **DO:** Use `DOMContentLoaded` to ensure DOM is ready
- ❌ **DON'T:** Manipulate styles directly (use CSS classes instead)
- ❌ **DON'T:** Include inline event handlers in HTML
- ❌ **DON'T:** Generate large amounts of CSS in JavaScript

**Example - Good:**
```javascript
document.addEventListener('DOMContentLoaded', () => {
    const generateBtn = document.getElementById('generate');
    
    generateBtn.addEventListener('click', () => {
        generateLoadout();
    });
    
    function generateLoadout() {
        // Logic here
    }
});
```

**Example - Bad:**
```javascript
// DON'T DO THIS
document.getElementById('btn').onclick = function() { /* ... */ };
element.style.backgroundColor = 'red'; // Use CSS classes instead
```

## File Organization

### **Standard Randomizer Structure:**
```
RandomizerName/
├── index.html          # Main page (structure only)
├── style.css           # Main styles
├── script.js           # Main behavior
├── randomizer.json     # Data file
├── options.html        # Options page (structure only)
├── options.css         # Options styles (optional, or use shared)
└── options.js          # Options behavior
```

### **Shared Resources:**
```
templates/
├── options.css         # Shared options page styles
├── options-clean.html  # Clean HTML template (no inline styles)
└── collapsible-options.js  # Shared options JavaScript
```

## Specific Guidelines

### **Options Pages:**
1. **HTML:** Use `options-clean.html` template (no inline styles)
2. **CSS:** Link to both `style.css` and `options.css`
3. **JavaScript:** Use `options.js` with appropriate storage key

### **Main Randomizer Pages:**
1. **HTML:** Structure only, link external CSS/JS
2. **CSS:** All styling in `style.css`
3. **JavaScript:** All logic in `script.js`

### **Data Files:**
1. Use `randomizer.json` for data
2. Keep data separate from logic
3. Use consistent JSON structure

## CSS Class Naming Conventions

### **Use semantic, descriptive names:**
- `.container` - Main content wrapper
- `.section` - Content section
- `.section-header` - Section title area
- `.item-container` - Item display area
- `.reroll-btn` - Reroll button
- `.options-link` - Link to options page
- `.back-button` - Navigation back button

### **Options Page Classes:**
- `.options-container` - Options page wrapper
- `.options-header` - Header with buttons
- `.category-section` - Collapsible category
- `.category-header` - Category title (clickable)
- `.category-controls` - Per-category buttons
- `.options-grid` - Checkbox grid
- `.option-item` - Individual checkbox item

## JavaScript Best Practices

### **Event Listeners:**
```javascript
// ✅ Good
element.addEventListener('click', handleClick);

// ❌ Bad
element.onclick = handleClick;
```

### **DOM Manipulation:**
```javascript
// ✅ Good - Use CSS classes
element.classList.add('active');
element.classList.remove('hidden');
element.classList.toggle('collapsed');

// ❌ Bad - Direct style manipulation
element.style.display = 'none';
element.style.backgroundColor = 'red';
```

### **Data Loading:**
```javascript
// ✅ Good - Async/await or promises
fetch('randomizer.json')
    .then(res => res.json())
    .then(data => {
        initializeData(data);
    })
    .catch(error => console.error('Error:', error));
```

## localStorage Keys

### **Use unique, descriptive keys:**
- Format: `{randomizer}Options`
- Examples: `eldenRingOptions`, `darkSouls3Options`, `coffeeOptions`

## Comments

### **HTML Comments:**
```html
<!-- Main content section -->
<!-- Categories will be populated by JavaScript -->
```

### **CSS Comments:**
```css
/* Button Styles */
/* Collapsible Category Styles */
/* Mobile Responsive */
```

### **JavaScript Comments:**
```javascript
// Load saved options from localStorage
// Filter items based on enabled status
// Generate random loadout
```

## Responsive Design

### **Use CSS media queries (not JavaScript):**
```css
@media (max-width: 768px) {
    .options-grid {
        grid-template-columns: 1fr;
    }
}
```

## Accessibility

1. Use semantic HTML elements
2. Include proper labels for form elements
3. Ensure sufficient color contrast
4. Make interactive elements keyboard accessible
5. Use ARIA attributes when appropriate

## Performance

1. Minimize DOM manipulation
2. Use event delegation for dynamic content
3. Debounce/throttle frequent events
4. Load scripts at end of body or use `defer`

## Version Control

1. Keep commits focused and atomic
2. Write descriptive commit messages
3. Don't commit minified or inline-styled files
4. Use `.gitignore` for build artifacts

## Summary Checklist

Before committing any randomizer:
- [ ] No inline styles in HTML
- [ ] No `<style>` tags in HTML
- [ ] No inline JavaScript in HTML
- [ ] All CSS in external `.css` files
- [ ] All JavaScript in external `.js` files
- [ ] Event listeners used (not inline handlers)
- [ ] CSS classes used for styling (not `element.style`)
- [ ] Semantic HTML elements used
- [ ] Proper file organization
- [ ] Consistent naming conventions
- [ ] Comments added for complex logic
- [ ] Responsive design in CSS
- [ ] localStorage key is unique

## When to Break These Rules

**NEVER.** These rules ensure:
- Maintainability
- Reusability
- Performance
- Debugging ease
- Team collaboration
- Code quality

If you think you need to break these rules, reconsider your approach.
