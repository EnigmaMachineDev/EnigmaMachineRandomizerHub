#!/usr/bin/env python3
"""
Script to update all CSS files to include sidebar layout adjustments.
"""

import os
import re
from pathlib import Path

def update_css_file(filepath):
    """Update a single CSS file to include sidebar layout."""
    
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()
    
    # Check if already has sidebar layout adjustments
    if 'body.sidebar-open' in content:
        print(f"✓ Already has sidebar CSS: {filepath}")
        return False
    
    original_content = content
    
    # Find the body style block
    body_pattern = r'(body\s*\{[^}]*\})'
    
    # CSS to add after body block
    sidebar_css = """
/* Adjust body layout for sidebar */
body.sidebar-open {
    margin-left: 250px;
}

body.sidebar-closed {
    margin-left: 0;
}
"""
    
    # Add sidebar CSS after body block
    if re.search(body_pattern, content):
        content = re.sub(body_pattern, r'\1' + sidebar_css, content, count=1)
    
    # Add responsive adjustments if not present
    if '@media (max-width: 768px)' in content:
        # Find the media query and add sidebar adjustments
        media_pattern = r'(@media \(max-width: 768px\)\s*\{)'
        sidebar_mobile = """
    body.sidebar-open,
    body.sidebar-closed {
        margin-left: 0;
    }
    
"""
        content = re.sub(media_pattern, r'\1\n' + sidebar_mobile, content, count=1)
    else:
        # Add new media query at the end
        responsive_css = """
/* Responsive Design */
@media (max-width: 768px) {
    body.sidebar-open,
    body.sidebar-closed {
        margin-left: 0;
    }
}

@media (min-width: 769px) {
    body.sidebar-open .page-content,
    body.sidebar-open .main-wrapper {
        margin-left: 0;
    }
}
"""
        content += '\n' + responsive_css
    
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
    """Main function to update all CSS files."""
    
    # Get the repository root
    repo_root = Path(__file__).parent
    
    # Find all style.css files in subdirectories
    css_files = []
    
    for item in repo_root.iterdir():
        if item.is_dir() and not item.name.startswith('.') and item.name != 'templates':
            # Check for style.css
            style_file = item / 'style.css'
            if style_file.exists():
                css_files.append(style_file)
            
            # Check for other common CSS file names
            for css_name in ['styles.css', 'main.css']:
                css_file = item / css_name
                if css_file.exists() and css_file not in css_files:
                    css_files.append(css_file)
    
    print(f"Found {len(css_files)} CSS files to check\n")
    
    updated_count = 0
    for css_file in sorted(css_files):
        if update_css_file(css_file):
            updated_count += 1
    
    print(f"\n{'='*60}")
    print(f"Summary: Updated {updated_count} out of {len(css_files)} files")
    print(f"{'='*60}")

if __name__ == '__main__':
    main()
