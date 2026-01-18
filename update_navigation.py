#!/usr/bin/env python3
"""
Script to update all HTML files to use the centralized navigation system.
Removes hardcoded navigation and adds the nav-loader.js script.
"""

import os
import re
from pathlib import Path

def update_html_file(filepath):
    """Update a single HTML file to use the dynamic navigation."""
    
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()
    
    # Check if already using nav-loader
    if 'nav-loader.js' in content:
        print(f"✓ Already updated: {filepath}")
        return False
    
    # Check if file has hardcoded navigation (sidebar or nav elements)
    if '<nav class="sidebar"' not in content and '<button class="sidebar-toggle"' not in content:
        print(f"⊘ No navigation found: {filepath}")
        return False
    
    original_content = content
    
    # Remove hardcoded navigation (hamburger button + sidebar nav)
    # Pattern 1: Remove from <button class="sidebar-toggle"> to </nav>
    pattern1 = r'<!-- Hamburger Menu Button -->.*?</nav>\s*'
    content = re.sub(pattern1, '', content, flags=re.DOTALL)
    
    # Pattern 2: Alternative pattern if comment is missing
    pattern2 = r'<button class="sidebar-toggle".*?</nav>\s*'
    content = re.sub(pattern2, '', content, flags=re.DOTALL)
    
    # Determine if this is a subdirectory file or root file
    is_subdir = str(filepath.parent) != str(Path(filepath).parent.parent)
    nav_loader_path = '../templates/nav-loader.js' if is_subdir else 'templates/nav-loader.js'
    nav_styles_path = '../templates/nav-styles.css' if is_subdir else 'templates/nav-styles.css'
    
    # Add nav-loader.js to head if not present
    if 'nav-loader.js' not in content:
        # Find the closing </head> tag and add script before it
        head_pattern = r'(</head>)'
        replacement = f'    <script src="{nav_loader_path}"></script>\n\\1'
        content = re.sub(head_pattern, replacement, content)
    
    # Add nav-styles.css to head if not present
    if 'nav-styles.css' not in content:
        # Find the last stylesheet link and add after it
        last_css_pattern = r'(<link rel="stylesheet"[^>]*>)(?!.*<link rel="stylesheet")'
        replacement = f'\\1\n    <link rel="stylesheet" href="{nav_styles_path}">'
        content = re.sub(last_css_pattern, replacement, content, flags=re.DOTALL)
    
    # Remove old nav-script.js references
    content = re.sub(r'\s*<script src="\.\.\/templates\/nav-script\.js"><\/script>', '', content)
    content = re.sub(r'\s*<script src="templates\/nav-script\.js"><\/script>', '', content)
    
    # Only write if content changed
    if content != original_content:
        with open(filepath, 'w', encoding='utf-8') as f:
            f.write(content)
        print(f"✓ Updated: {filepath}")
        return True
    else:
        print(f"⊘ No changes needed: {filepath}")
        return False

def main():
    """Main function to update all HTML files."""
    
    # Get the repository root
    repo_root = Path(__file__).parent
    
    # Find all index.html files in subdirectories (excluding root index.html)
    html_files = []
    
    # Get all subdirectories
    for item in repo_root.iterdir():
        if item.is_dir() and not item.name.startswith('.') and item.name != 'templates':
            index_file = item / 'index.html'
            if index_file.exists():
                html_files.append(index_file)
    
    # Also check for other HTML files in subdirectories
    for item in repo_root.iterdir():
        if item.is_dir() and not item.name.startswith('.') and item.name != 'templates':
            for html_file in item.glob('*.html'):
                if html_file not in html_files:
                    html_files.append(html_file)
    
    print(f"Found {len(html_files)} HTML files to check\n")
    
    updated_count = 0
    for html_file in sorted(html_files):
        if update_html_file(html_file):
            updated_count += 1
    
    print(f"\n{'='*60}")
    print(f"Summary: Updated {updated_count} out of {len(html_files)} files")
    print(f"{'='*60}")

if __name__ == '__main__':
    main()
