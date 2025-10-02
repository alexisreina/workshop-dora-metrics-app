# Data Model: Navigation Layout

## Entities

### NavigationItem

**Purpose**: Represents a clickable navigation link in the sidebar
**Fields**:

- `id: string` - Unique identifier for the navigation item
- `label: string` - Display text (e.g., "Metrics 1", "Metrics 2")
- `route: string` - Target route path (e.g., "/metrics/1", "/metrics/2")
- `isActive: boolean` - Whether this item is currently selected
- `isVisible: boolean` - Whether this item should be displayed
- `order: number` - Display order in the navigation list

**Validation Rules**:

- `id` must be unique across all navigation items
- `label` must be non-empty string
- `route` must be valid URL path
- `order` must be positive integer

**State Transitions**:

- `isActive` changes when user navigates to different sections
- `isVisible` can be toggled for mobile/desktop display

### AppBranding

**Purpose**: Represents the application name and visual identity
**Fields**:

- `appName: string` - Display name ("DORA Metrics App")
- `logoUrl?: string` - Optional logo image URL
- `theme: string` - Theme identifier for styling

**Validation Rules**:

- `appName` must be non-empty string
- `logoUrl` must be valid URL if provided
- `theme` must match available theme options

### WelcomeContent

**Purpose**: Represents the descriptive content on the homepage
**Fields**:

- `title: string` - Main heading text
- `description: string` - Brief explanation of DORA metrics
- `features: string[]` - List of key features or benefits

**Validation Rules**:

- `title` must be non-empty string
- `description` must be non-empty string
- `features` must be array of non-empty strings

## State Management

### NavigationState

**Purpose**: Manages the overall navigation state
**Fields**:

- `currentRoute: string` - Currently active route
- `isSidebarOpen: boolean` - Mobile sidebar visibility state
- `isMobile: boolean` - Device type detection
- `navigationItems: NavigationItem[]` - List of all navigation items

**State Transitions**:

- `currentRoute` changes on navigation
- `isSidebarOpen` toggles on mobile hamburger click
- `isMobile` updates on window resize
- `navigationItems` can be updated for dynamic navigation

### MobileState

**Purpose**: Manages mobile-specific navigation behavior
**Fields**:

- `isMobile: boolean` - Current device type
- `sidebarOpen: boolean` - Sidebar visibility
- `breakpoint: string` - Current responsive breakpoint

**State Transitions**:

- `isMobile` changes on window resize
- `sidebarOpen` toggles with hamburger menu
- `breakpoint` updates with screen size changes

## Relationships

### NavigationItem ↔ AppBranding

- Navigation items are displayed within the app branding context
- App branding provides the visual framework for navigation

### NavigationItem ↔ WelcomeContent

- Navigation items can link to welcome content
- Welcome content provides context for navigation purpose

### NavigationState ↔ MobileState

- Navigation state includes mobile-specific behavior
- Mobile state influences navigation display and interaction

## Data Flow

### Navigation Flow

1. User clicks navigation item
2. `currentRoute` updates in NavigationState
3. `isActive` updates for all NavigationItems
4. UI re-renders with new active state
5. Route navigation occurs

### Mobile Interaction Flow

1. User clicks hamburger menu
2. `isSidebarOpen` toggles in MobileState
3. Sidebar visibility updates
4. Navigation items become accessible/hidden

### Responsive Flow

1. Window resize event occurs
2. `isMobile` updates in MobileState
3. Navigation layout adapts (sidebar vs. hamburger)
4. Navigation items reflow appropriately
