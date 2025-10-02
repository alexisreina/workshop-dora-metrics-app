# Quickstart: Navigation Layout Testing

## Prerequisites

- Node.js 18+ installed
- npm or pnpm package manager
- Modern web browser (Chrome, Firefox, Safari, Edge)

## Setup Instructions

### 1. Install Dependencies

```bash
npm install
# or
pnpm install
```

### 2. Start Development Server

```bash
npm run dev
# or
pnpm dev
```

### 3. Open Application

Navigate to `http://localhost:3000` in your browser.

## Testing Scenarios

### Scenario 1: Desktop Navigation

**Given** the application is loaded on desktop
**When** I view the homepage
**Then** I should see:

- Top bar with "DORA Metrics App" title
- Sidebar with navigation items ("Metrics 1", "Metrics 2", etc.)
- Welcome page content explaining DORA metrics
- Current navigation item highlighted with background color

### Scenario 2: Mobile Navigation

**Given** the application is loaded on mobile device
**When** I view the homepage
**Then** I should see:

- Top bar with app name and hamburger menu icon
- Sidebar hidden by default
- Welcome page content
- Hamburger menu button in top bar

**When** I click the hamburger menu
**Then** I should see:

- Sidebar slides in from the left
- Navigation items become visible
- Hamburger menu icon changes to close icon

**When** I click the hamburger menu again
**Then** I should see:

- Sidebar slides out and hides
- Hamburger menu icon returns to original state

### Scenario 3: Navigation Item Clicking

**Given** I am on the homepage
**When** I click a navigation item (e.g., "Metrics 1")
**Then** I should see:

- Navigation item becomes highlighted
- Previous active item loses highlight
- Page navigates to the target route
- On mobile: sidebar closes automatically

### Scenario 4: Non-existent Navigation

**Given** I am on any page
**When** I click a navigation item that doesn't exist yet
**Then** I should see:

- Redirected to welcome page
- Notification message about page coming soon
- Welcome content displayed

### Scenario 5: Responsive Behavior

**Given** I am on desktop with sidebar visible
**When** I resize the window to mobile size
**Then** I should see:

- Sidebar automatically hides
- Hamburger menu appears in top bar
- Navigation items become accessible via hamburger menu

**When** I resize back to desktop size
**Then** I should see:

- Sidebar automatically shows
- Hamburger menu disappears
- Navigation items directly visible

## Validation Checklist

### Visual Elements

- [ ] Top bar displays "DORA Metrics App" prominently
- [ ] Sidebar contains placeholder navigation items
- [ ] Welcome page shows DORA metrics explanation
- [ ] Current navigation item has background color highlight
- [ ] Mobile hamburger menu is present and functional

### Functionality

- [ ] Navigation items are clickable
- [ ] Active state highlighting works correctly
- [ ] Mobile sidebar toggle works
- [ ] Responsive behavior adapts to screen size
- [ ] Non-existent navigation redirects to welcome page

### Accessibility

- [ ] Keyboard navigation works (Tab, Enter, Escape)
- [ ] Screen reader compatibility
- [ ] Focus management on mobile sidebar
- [ ] ARIA labels present on interactive elements
- [ ] Color contrast meets WCAG standards

### Performance

- [ ] Page loads in <2 seconds
- [ ] Navigation transitions are smooth (<100ms)
- [ ] No layout shift during responsive changes
- [ ] Smooth animations for mobile sidebar

## Troubleshooting

### Common Issues

**Sidebar not showing on mobile:**

- Check if hamburger menu is present
- Verify click handler is attached
- Check CSS for mobile-specific styles

**Navigation highlighting not working:**

- Verify active route detection
- Check CSS for highlight styles
- Ensure state management is working

**Responsive behavior not working:**

- Check window resize event listeners
- Verify breakpoint detection
- Ensure mobile state management

**Performance issues:**

- Check for unnecessary re-renders
- Verify CSS transitions are hardware accelerated
- Ensure minimal JavaScript execution

## Success Criteria

The navigation layout is working correctly when:

1. All visual elements are present and properly styled
2. Mobile and desktop navigation work as expected
3. Responsive behavior adapts correctly to screen size changes
4. Accessibility requirements are met
5. Performance targets are achieved
6. All test scenarios pass without errors
