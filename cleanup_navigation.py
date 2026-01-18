#!/usr/bin/env python3
"""
Script to clean up remaining hardcoded navigation elements.
"""

import os
import re
from pathlib import Path

def cleanup_html_file(filepath):
    """Remove all hardcoded navigation from a single HTML file."""
    
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()
    
    original_content = content
    
    # Pattern 1: Remove hamburger button
    content = re.sub(r'\s*<!-- Hamburger Menu Button -->\s*', '', content)
    content = re.sub(r'\s*<button class="sidebar-toggle"[^>]*>.*?</button>\s*', '', content, flags=re.DOTALL)
    
    # Pattern 2: Remove nav-placeholder div and its fetch script
    pattern = r'\s*<!-- Navigation Sidebar -->\s*<div id="nav-placeholder"></div>\s*<script>\s*fetch\([^)]+\).*?</script>\s*'
    content = re.sub(pattern, '', content, flags=re.DOTALL)
    
    # Pattern 3: Alternative nav-placeholder pattern
    pattern2 = r'\s*<div id="nav-placeholder"></div>\s*<script>\s*fetch\([^)]+\).*?</script>\s*'
    content = re.sub(pattern2, '', content, flags=re.DOTALL)
    
    # Pattern 4: Remove standalone hamburger buttons without comments
    content = re.sub(r'\s*<button class="sidebar-toggle" id="sidebar-toggle">☰</button>\s*', '', content)
    
    # Only write if content changed
    if content != original_content:
        with open(filepath, 'w', encoding='utf-8') as f:
            f.write(content)
        print(f"✓ Cleaned: {filepath}")
        return True
    else:
        print(f"⊘ Already clean: {filepath}")
        return False

def main():
    """Main function to clean all HTML files."""
    
    # Get the repository root
    repo_root = Path(__file__).parent
    
    # Find all index.html files in subdirectories
    html_files = []
    
    for item in repo_root.iterdir():
        if item.is_dir() and not item.name.startswith('.') and item.name != 'templates':
            for html_file in item.glob('*.html'):
                html_files.append(html_file)
    
    print(f"Found {len(html_files)} HTML files to clean\n")
    
    cleaned_count = 0
    for html_file in sorted(html_files):
        if cleanup_html_file(html_file):
            cleaned_count += 1
    
    print(f"\n{'='*60}")
    print(f"Summary: Cleaned {cleaned_count} out of {len(html_files)} files")
    print(f"{'='*60}")

if __name__ == '__main__':
    main()
