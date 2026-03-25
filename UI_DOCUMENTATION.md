# BHRS UI Documentation

## Modern Healthcare Dashboard Design

This is a complete UI implementation for the Botho Health Records System with a clean, modern healthcare design inspired by dental clinic interfaces.

## Design System

### Color Palette

**Primary Colors:**
- Primary Blue: `#0073e6` (Medical blue)
- Light Blue: `#e6f2ff` (Backgrounds)
- Green: `#10b981` (Success states)
- Red: `#ef4444` (Alerts/Errors)
- Orange: `#f59e0b` (Warnings)
- Purple: `#8b5cf6` (Accents)

**Neutral Colors:**
- Gray scale from 50 to 900
- White backgrounds
- Soft shadows

### Typography

- Font Family: Inter (via Next.js font optimization)
- Headings: Bold, 2xl to 3xl
- Body: Regular, sm to base
- Labels: Medium, sm

### Components

#### 1. Sidebar
- Fixed left navigation
- Logo at top
- Active state highlighting
- Icon + text navigation items
- Logout at bottom

#### 2. Header
- Fixed top bar
- Page title
- Search functionality
- Notifications bell
- User profile dropdown

#### 3. StatCard
- Colored left border
- Icon in colored background
- Large number display
- Trend indicators
- Hover effects

#### 4. Table
- Striped rows
- Hover states
- Sortable columns
- Action buttons
- Responsive overflow

#### 5. Modal
- Overlay background
- Centered content
- Header with close button
- Body content area
- Footer with actions

#### 6. Forms
- Labeled inputs
- Focus states
- Validation styling
- Helper text
- Grouped layouts

### Pages

#### Login Page
- Split layout (branding + form)
- Gradient background
- Feature highlights
- Demo credentials display
- Password visibility toggle

#### Dashboard
- Welcome message
- 4 stat cards
- Chart placeholder
- Quick stats sidebar
- Recent patients table
- Upcoming appointments

#### Patients
- Search and filters
- Stats overview
- Sortable table
- Add patient button
- Patient detail view

#### Patient Profile
- Sidebar with patient info
- Contact information
- Medical information
- Emergency contact
- Medical history timeline
- Appointments list
- Add record modal

#### Appointments
- Calendar view placeholder
- Status filters
- Stats cards
- Appointments table
- Schedule modal

#### Medical Records
- Search functionality
- Records table
- Detail sidebar
- Print functionality

#### Admin Users
- User statistics
- Role-based badges
- Add user modal
- Permission descriptions

## Responsive Design

### Breakpoints
- Mobile: < 640px
- Tablet: 640px - 1024px
- Desktop: > 1024px

### Mobile Adaptations
- Collapsible sidebar
- Stacked layouts
- Hidden secondary info
- Touch-friendly buttons

## Icons

Using Heroicons v2:
- Outline style for UI elements
- Solid style for filled states
- 24x24 default size
- Consistent stroke width

## Animations

- Smooth transitions (200ms)
- Hover effects on interactive elements
- Modal fade in/out
- Button press states
- Loading spinners

## Accessibility

- Semantic HTML
- ARIA labels
- Keyboard navigation
- Focus indicators
- Color contrast compliance

## Usage

### Running the UI

```bash
npm install
npm run dev
```

Open http://localhost:3000

### Navigation Flow

1. Login → Dashboard
2. Dashboard → Any module
3. Patients → Patient Profile → Add Record
4. Appointments → Schedule New
5. Admin → User Management

### Customization

**Colors:**
Edit `tailwind.config.ts` to change color scheme

**Components:**
Modify files in `/src/components/`

**Pages:**
Update files in `/src/app/`

## Component Props

### DashboardLayout
```typescript
{
  children: ReactNode
  title: string
  userName?: string
  userRole?: string
}
```

### StatCard
```typescript
{
  title: string
  value: string | number
  icon: ReactNode
  trend?: { value: string, isPositive: boolean }
  color: 'blue' | 'green' | 'purple' | 'orange'
}
```

### Table
```typescript
{
  columns: Column[]
  data: any[]
  onRowClick?: (row: any) => void
}
```

### Modal
```typescript
{
  isOpen: boolean
  onClose: () => void
  title: string
  children: ReactNode
  footer?: ReactNode
}
```

## Best Practices

1. **Consistent Spacing:** Use Tailwind spacing scale
2. **Color Usage:** Stick to defined color palette
3. **Component Reuse:** Use shared components
4. **Responsive First:** Design mobile-first
5. **Accessibility:** Include ARIA labels
6. **Performance:** Optimize images and assets

## Future Enhancements

- [ ] Dark mode support
- [ ] Advanced charts integration
- [ ] Real-time notifications
- [ ] File upload components
- [ ] Print templates
- [ ] Export functionality
- [ ] Advanced filters
- [ ] Bulk operations

## Support

For UI issues or questions:
- Check component documentation
- Review Tailwind CSS docs
- Inspect browser console
- Test responsive breakpoints
