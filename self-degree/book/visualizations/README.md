# Self-Degree Book Visualizations

This directory contains 8 data visualization SVG files created for the Self-Degree book, designed to illustrate key concepts, comparisons, and frameworks.

## Files

| File | Type | Description |
|------|------|-------------|
| `compass-4-pillars.svg` | Diagram | The 4-Pillar Compass showing Direction, Credentials, Network, and Resources |
| `cost-comparison.svg` | Bar Chart | Cost comparison between Traditional Degree, Self-Degree, Community College, and Bootcamp |
| `2-sigma-problem.svg` | Bell Curve | Bloom's 2 Sigma Problem showing learning outcome distribution |
| `roi-breakeven.svg` | Line Chart | Investment breakeven timeline showing when each path pays off |
| `skills-hiring-trend.svg` | Line Chart | Rise of skills-first hiring from 2015-2025 |
| `credential-stack.svg` | Matrix | Credential comparison across Cost, Time, Signal Quality, and Flexibility |
| `learning-format-comparison.svg` | Icons | Four learning format icons compared side by side |
| `self-degree-cycle.svg` | Cycle Diagram | The Self-Degree Sprint iterative cycle |

## Color Palette

| Color | Hex | Usage |
|-------|-----|-------|
| Navy | `#0d1b2a` | Primary text, main elements, high contrast |
| Gold | `#c9a84c` | Highlights, Self-Degree emphasis, accents |
| White/Cream | `#f5f0e8` | Background, light elements |
| Gray | `#7a7a7a` | Secondary comparisons, muted elements |
| Blue | `#2563eb` | ROI chart: 4-Year Degree line |
| Green | `#16a34a` | ROI chart: Coding Bootcamp line |

## File Naming Convention

All files follow the pattern: `<descriptor>.svg`

- Use lowercase with hyphens
- Descriptive but concise names
- Consistent with book terminology

## Dimensions

- **ViewBox:** `0 0 800 500` for all files
- **Default display size:** 800x500 pixels
- **Scalable:** Yes, SVG is resolution-independent

## Usage Notes

### Recommended Sizing by Context

| Context | Width | Notes |
|---------|-------|-------|
| Full page | 700-800px | Main content display |
| Half page | 350-400px | Sidebar layouts |
| Thumbnail | 150-200px | Grid previews |
| Print | Use viewBox, scale to container | High DPI output |

### Page Reference Suggestions

| Visualization | Suggested Location |
|---------------|-------------------|
| compass-4-pillars.svg | Chapter 2: Framework Overview |
| cost-comparison.svg | Chapter 3: Cost Analysis |
| 2-sigma-problem.svg | Chapter 4: Learning Science |
| roi-breakeven.svg | Chapter 3: ROI Analysis |
| skills-hiring-trend.svg | Chapter 1: Introduction |
| credential-stack.svg | Chapter 3: Credential Comparison |
| learning-format-comparison.svg | Chapter 4: Learning Methods |
| self-degree-cycle.svg | Chapter 5: The Sprint Process |

### Styling Notes

- All SVG files use `system-ui, -apple-system, sans-serif` as font fallback
- stroke-width: 2-3px for lines (consistent visual weight)
- Navy circles with gold accents for key markers
- Clean, minimal, premium editorial aesthetic
- Background always includes cream `#f5f0e8` base

### Accessibility

- All files include `<title>` and `<desc>` elements
- Sufficient color contrast maintained
- Text labels are readable at standard display sizes

### Technical Notes

- Valid XML with proper UTF-8 encoding
- No external dependencies
- All gradients/patterns defined in `<defs>`
- Marker definitions for arrowheads where needed
- All paths use proper closing tags

## Customization Tips

1. **Changing Colors:** Update the hex values in the fill/stroke attributes
2. **Resizing:** Change the width/height attributes while keeping viewBox="0 0 800 500"
3. **Animation:** SVG supports CSS animations (not included by default for simplicity)

## Credits

Created as part of the Self-Degree book project.
Style guide: Navy + Gold + Cream editorial aesthetic.
