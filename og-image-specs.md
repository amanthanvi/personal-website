# OG Image Specifications for ogimagemaker.com

## Image Settings
- **Dimensions:** 1200 x 630 pixels
- **Format:** PNG or JPG

## Text Content

### Main Title
```
Aman Thanvi
```

### Subtitle
```
Cybersecurity Specialist | Active Secret Clearance | M.Eng UMD
```

### Key Points (use as bullet points or badges)
- DOJ USTP - Information Technology Cybersecurity Specialist
- IEEE CAI 2025 Published Author  
- 6+ Years Federal & Private Sector Experience
- MIT Lincoln Lab • CISA • NASA • Nasdaq

## Design Recommendations

### Color Scheme
- **Background:** Dark navy (#0A1628) or deep blue gradient
- **Primary Text:** White (#FFFFFF)
- **Accent Color:** Cyan (#00D9FF) or DOJ Blue (#003F87)
- **Secondary Elements:** Light gray (#E5E5E5)

### Typography
- **Main Title:** Bold, Sans-serif (e.g., Inter, Montserrat)
- **Subtitle:** Regular weight, slightly smaller
- **Bullet Points:** Clean, readable font

### Visual Elements
- Consider adding subtle security-themed graphics:
  - Network nodes pattern in background
  - Shield or lock icon (subtle, not overwhelming)
  - Circuit board pattern (very faint)
- Keep it professional and clean
- Ensure high contrast for readability

### Layout Suggestions
- Center-aligned text
- Adequate padding around edges
- Clear visual hierarchy
- Professional, government-appropriate aesthetic

## File Placement
Once created, save the image as:
- `static/images/og-default.png`

Then update in `config/_default/params.toml`:
```toml
defaultSocialImage = "images/og-default.png"
```