# Data Table Accessibility

## Keyboard Navigation

All interactive elements in the data table components support full keyboard navigation:

### Tab Navigation
- **Search Input**: Focusable via Tab key, accepts text input
- **Clear Button**: Focusable via Tab key when search has value
- **Sort Buttons**: All sortable column headers are focusable via Tab key
- **Previous Page Button**: Focusable via Tab key (disabled at first page)
- **Next Page Button**: Focusable via Tab key (disabled at last page)

### Keyboard Activation
All buttons support both Enter and Space key activation (provided by @base-ui/react):
- **Sort Buttons**: Press Enter or Space to toggle sort order
- **Clear Button**: Press Enter or Space to clear search
- **Pagination Buttons**: Press Enter or Space to navigate pages

### Focus Indicators
All interactive elements have visible focus indicators using the `focus-visible` pseudo-class:
- Focus ring appears with 2px width
- Ring color uses theme's ring color
- Ring offset of 2px for better visibility

## ARIA Labels

### Sort Buttons
- Dynamic aria-label describes current sort state and next action
- Example: "Sort by Name ascending" or "Sort by Name descending"
- aria-sort attribute indicates current sort direction: "ascending", "descending", or "none"

### Pagination Buttons
- "Go to previous page" label for Previous button
- "Go to next page" label for Next button
- Page status has role="status" and aria-live="polite" for screen reader announcements

### Search Input
- aria-label="Search table" for screen readers
- Clear button has aria-label="Clear search"

## Screen Reader Support

### Live Regions
- **Table Updates**: Hidden aria-live region announces result count changes
  - Example: "Showing 10 results" or "Showing 5 results for 'search term'"
- **Pagination Status**: Page number display has role="status" and aria-live="polite"
- **Loading State**: Loading skeleton has role="status" with screen reader text

### Empty States
- Empty state messages are announced to screen readers
- Different messages for "no data" vs "no search results"

## Manual Testing Checklist

To verify keyboard navigation:

1. **Tab Navigation**
   - [ ] Press Tab to move through all interactive elements in order
   - [ ] Verify focus indicators are visible on all elements
   - [ ] Verify tab order is logical (search → sort headers → pagination)

2. **Keyboard Activation**
   - [ ] Press Enter on sort button to change sort order
   - [ ] Press Space on sort button to change sort order
   - [ ] Press Enter on pagination buttons to navigate
   - [ ] Press Space on pagination buttons to navigate
   - [ ] Press Enter on clear button to clear search
   - [ ] Press Space on clear button to clear search

3. **Screen Reader Testing**
   - [ ] Verify sort button labels announce current state
   - [ ] Verify pagination status is announced on page change
   - [ ] Verify table update announcements work
   - [ ] Verify loading state is announced

4. **Focus Management**
   - [ ] Verify focus remains on interactive elements after activation
   - [ ] Verify disabled buttons cannot receive focus
   - [ ] Verify focus indicators have sufficient contrast

## Implementation Notes

- All buttons use `@base-ui/react/button` which provides built-in keyboard support
- Input uses `@base-ui/react/input` which provides standard input keyboard behavior
- Focus styles use Tailwind's `focus-visible` utilities for better UX
- ARIA attributes are dynamically updated based on component state
