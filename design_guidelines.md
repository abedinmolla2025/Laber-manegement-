# Labor Management Application - Design Guidelines

## Design Approach
**System-Based Approach**: Modern SaaS utility interface inspired by Linear and Notion's data management patterns. Focus on clarity, efficiency, and data accuracy with clean typography and structured layouts.

## Core Design Elements

### A. Color Palette

**Light Mode:**
- Background: 0 0% 100% (pure white)
- Surface: 240 10% 98% (subtle gray for cards/tables)
- Border: 240 6% 90% (light borders)
- Text Primary: 240 10% 10% (near black)
- Text Secondary: 240 5% 45% (muted gray)
- Primary Action: 217 91% 60% (professional blue)
- Success: 142 71% 45% (green for positive balances)
- Warning: 38 92% 50% (orange for alerts)
- Danger: 0 84% 60% (red for delete actions)

**Dark Mode:**
- Background: 240 10% 8% (deep charcoal)
- Surface: 240 8% 12% (elevated surface)
- Border: 240 6% 20% (subtle borders)
- Text Primary: 0 0% 98% (off-white)
- Text Secondary: 240 5% 65% (muted text)
- Primary Action: 217 91% 65% (bright blue)

### B. Typography
- **Font Family**: 'Inter', 'Noto Sans Bengali' for Bengali support, system-ui fallback
- **Headings**: font-semibold, text-2xl (page titles), text-lg (section headers)
- **Body Text**: font-normal, text-base (14-16px)
- **Table Data**: font-medium, text-sm for numbers, tabular-nums for alignment
- **Labels**: font-medium, text-sm, uppercase tracking-wide for form labels

### C. Layout System
**Spacing Units**: Use Tailwind units of 2, 4, 6, 8, 12, 16, 20 consistently
- Component padding: p-6 to p-8
- Section spacing: mb-8 to mb-12
- Form field gaps: gap-6
- Table cell padding: px-6 py-4

**Container Structure**:
- Max width: max-w-7xl mx-auto
- Page padding: px-6 lg:px-8
- Cards/Surfaces: rounded-lg with subtle shadow

### D. Component Library

**Data Table**:
- Clean borders with hover states on rows
- Sticky header with subtle shadow on scroll
- Right-aligned numeric columns (duty amounts, advances)
- Zebra striping (subtle alternating row colors) for readability
- Row actions on hover (edit, delete icons)
- Empty state with illustration and call-to-action

**Forms & Inputs**:
- Input fields: border-2, rounded-lg, px-4 py-3, focus ring in primary color
- Dropdown selectors: Custom styled with chevron icon, clear visual feedback
- Number inputs: Right-aligned text for consistency with table
- Add button: Primary blue, rounded-lg, px-6 py-3, with plus icon
- Delete button: Ghost style, red text/icon, confirm dialog before action

**Action Buttons**:
- Primary: bg-blue-600, text-white, hover:bg-blue-700
- Secondary: border-2, transparent bg, hover:bg-surface
- Danger: bg-red-600 for confirmations
- Icon buttons: p-2, hover:bg-surface, rounded-md

**Cards**:
- Summary cards for totals: p-6, bg-surface, border, rounded-lg
- Metric display: Large numbers (text-3xl), labels above (text-sm)
- Visual hierarchy through spacing and typography scale

**Navigation**:
- Top header: Company name/logo left, user controls right
- Clear page title with breadcrumb if needed
- Action bar: Add Labor button prominent, filters/search on right

### E. Functional Features

**Dashboard Layout**:
- Summary cards row: Total Laborers, Total Duty Amount, Total Advances, Net Payable
- Main data table below with full-width layout
- Quick add form in slide-over panel or modal

**Duty Entry Interface**:
- Date picker (default: today)
- Labor selector (searchable dropdown)
- Rate multiplier: Visual radio buttons or segmented control (1x, 1.5x, 2x)
- Base rate input with currency symbol
- Auto-calculated total displayed prominently

**Advance Payment**:
- Quick add via modal/drawer
- Date, amount, optional note fields
- Running total visible in laborer detail view

**Calculations Display**:
- Auto-updating totals with smooth number transitions
- Net payment: (Total Duty - Total Advance) with color coding
- Positive balance: green, negative: orange warning

**Data Management**:
- Inline editing for quick updates
- Bulk actions with checkbox selection
- Export functionality (CSV, PDF) for reports
- Search and filter: by name, date range, payment status

## Visual Polish
- Smooth transitions (transition-colors duration-150)
- Subtle shadows for depth (shadow-sm for cards, shadow-md for modals)
- Loading states: Skeleton screens for table rows
- Success/error toasts: Top-right corner, auto-dismiss
- Confirmation modals: Centered, backdrop blur, clear action buttons

## Responsive Behavior
- Desktop (lg:): Multi-column layout, side-by-side forms
- Tablet (md:): Stacked sections, scrollable table
- Mobile: Card-based layout for labor entries, swipe actions for delete