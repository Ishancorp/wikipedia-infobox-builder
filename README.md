# Wikibox Builder

A React application for creating Wikipedia-style information boxes (infoboxes) with a drag-and-drop interface. Build professional-looking biographical and election infoboxes with live preview functionality.

## Features

- **Drag & Drop Interface**: Intuitive field management with drag-and-drop functionality
- **Live Preview**: Real-time visualization of your infobox as you build it
- **Multiple Templates**: Pre-built templates for common infobox types
- **Rich Text Formatting**: Support for Wikipedia-style markup including:
  - Bold text (`'''text'''`)
  - Italic text (`''text''`)
  - Links (`*text*`)
  - Superscript (`^{text}`)
  - Increase/decrease indicators (`{{increase}}`, `{{decrease}}`)
- **Image Support**: Upload images via file or URL with caption options
- **Flexible Field Types**: Various field types including text, lists, dates, links, and more

## Available Builders

### Biography Builder

Create biographical infoboxes with templates for:

- Personal Details (birth, death, political party, education, etc.)
- Political Office information
- Military Service records

### Election Builder

Create election infoboxes featuring:

- Electoral templates with multi-column support
- Candidate information with photos
- Vote tallies and percentages
- Interactive column management
- Header/footer sections with election maps

## Field Types

### Basic Fields

- **Text Field**: Standard text input with rich formatting support
- **Single Text**: Full-width text spanning both columns
- **Date**: Date picker input
- **Link**: URL and display text combination

### Visual Elements

- **Image**: Full-size images with optional captions
- **Thumbnail**: Small profile-style images
- **Inline Image**: Medium-sized images for candidate photos
- **Color**: Color fields for party identification

### Lists and Groups

- **List**: Bulleted lists with add/remove functionality
- **Tree List**: Hierarchical list structure
- **Group**: Container for organizing related fields

### Biography-Specific

- **Subheader**: Section divider with emphasis styling

### Election-Specific

- **Election Header**: Three-part header (previous ← current → next)
- **Election Footer**: Two-part footer for before/after election
- **Line**: Visual separator element
- **Electoral**: Special multi-column container for election data

## Getting Started

Go to <https://wikibox-builder.netlify.app/>.

## Use Locally

### Prerequisites

- Node.js and npm
- React Router DOM

### Installation

```bash
npm install
```

### Running the Application

```bash
npm start
```

Navigate to:

- `/biography` - Biography Builder
- `/election` - Election Builder
- `/` - Default (Biography Builder)

## Usage

### Creating an Infobox

1. **Set Title**: Enter your infobox title in the title field
2. **Add Fields**: Drag field types from the sidebar into the editor
3. **Configure Fields**:
   - Edit field labels by clicking on them
   - Fill in field values using the appropriate inputs
   - Reorder fields using the up/down arrows
   - Remove fields with the × button
4. **Use Templates**: Drag pre-built templates for quick setup
5. **Preview**: View real-time preview in the right panel

### Working with Groups

Groups allow you to organize related fields:

- Drag fields into the group's drop zone
- Collapse/expand groups for better organization
- Reorder fields within groups
- Use templates to create common group structures

### Electoral Templates (Election Builder)

Electoral templates provide multi-column layouts:

- **Column Management**: Switch between columns using arrow buttons
- **Header Rows**: Special full-width rows marked with ★
- **Field Movement**: Move fields between columns or make them headers
- **Column Operations**: Duplicate fields to other columns

### Image Handling

Images support both URL and file upload:

- **URL Mode**: Paste image URLs directly
- **File Mode**: Upload images from your device
- **Captions**: Toggle caption display and edit caption text

### Rich Text Formatting

Use Wikipedia-style markup in text fields:

- `*text*` - Creates blue link-style text
- `'''text'''` - Bold text
- `''text''` - Italic text
- `^{text}` - Superscript
- `{{increase}}` - Up arrow (▲)
- `{{decrease}}` - Down arrow (▼)
- `{{color | #ff0000 | }}` - Colors text corresponding color (in this case red)
- `--` - Em dash (—)
- `\*` - Literal asterisk (escaped)

## File Structure

```bash
src/
├── App.js                    # Main app with routing
├── infoboxes/
│   ├── biography/
│   │   ├── BiographyBuilder.jsx
│   │   └── BiographyBuilderPreview.css
│   └── election/
│       ├── ElectionBuilder.jsx
│       └── ElectionBuilderPreview.css
├── css/
│   └── WikiboxBuilderField.css
└── helpers/
    └── helpers.jsx           # Text parsing and image utilities
```

## Templates

### Biography Templates

- **Political Office Template**: Office details, tenure, predecessors/successors
- **Personal Details Template**: Birth, family, education, political affiliation
- **Military Service Template**: Service branch, rank, conflicts, awards

### Election Templates

- **Top Header Template**: Election navigation, voter information
- **Electoral Template**: Multi-column candidate comparison
- **Bottom Footer Template**: Results map, election transitions

## Styling

The application uses CSS classes prefixed with `wikibox-` for styling. Key style files:

- `BiographyBuilderPreview.css` - Biography-specific styles
- `ElectionBuilderPreview.css` - Election-specific styles  
- `WikiboxBuilderField.css` - Shared field styles

## Browser Compatibility

- Modern browsers with ES6+ support
- File upload requires FileReader API support
- Drag and drop requires HTML5 drag/drop API
