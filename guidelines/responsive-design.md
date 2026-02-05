# Responsive Design Guide for theGarage

## Overview

This guide provides comprehensive patterns and best practices for creating responsive UI components that work seamlessly across mobile, tablet, and desktop screen sizes.

## Breakpoint Strategy

### Tailwind CSS Breakpoints

```css
sm: 640px   /* Small phones to large tablets */
md: 768px   /* Tablets to small desktops */
lg: 1024px  /* Desktops */
xl: 1280px  /* Large desktops */
2xl: 1536px /* Extra large desktops */
```

### Target Devices

- **Mobile**: 320px - 639px (iPhone SE to iPhone 14 Pro Max)
- **Tablet**: 640px - 1023px (iPad Mini to iPad Pro)
- **Desktop**: 1024px+ (Laptops to large monitors)

## Core Responsive Patterns

### 1. Mobile-First Approach

Always design for mobile first, then enhance for larger screens.

```tsx
// ✅ Mobile-first pattern
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
  {/* Content */}
</div>

// ❌ Desktop-first (avoid)
<div className="grid grid-cols-3 md:grid-cols-2 lg:grid-cols-1">
  {/* Content */}
</div>
```

### 2. Responsive Grid Systems

#### Basic Grid Patterns

```tsx
// 2-column grid on tablet, 3 on desktop
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">

// 4-column grid on large desktops
<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">

// Asymmetric layout (sidebar + main)
<div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
  <div className="lg:col-span-1">Sidebar</div>
  <div className="lg:col-span-3">Main Content</div>
</div>
```

#### Responsive Card Grids

```tsx
// Job cards that adapt from 1 to 4 columns
<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
  {jobs.map(job => (
    <ResponsiveJobCard 
      key={job.id} 
      job={job}
      compact={true} // Compact version for mobile
    />
  ))}
</div>
```

### 3. Responsive Typography

#### Headings

```tsx
<h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl">
  Main Title
</h1>

<h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl">
  Section Title
</h2>

<h3 className="text-lg sm:text-xl md:text-2xl lg:text-3xl">
  Subsection Title
</h3>
```

#### Body Text

```tsx
<p className="text-sm sm:text-base md:text-lg leading-relaxed">
  Body content that scales appropriately
</p>
```

### 4. Responsive Spacing

#### Container Padding

```tsx
<div className="container mx-auto px-4 sm:px-6 lg:px-8 xl:px-12">
  {/* Content */}
</div>
```

#### Section Spacing

```tsx
<section className="py-8 sm:py-12 md:py-16 lg:py-20">
  {/* Section content */}
</section>
```

#### Component Spacing

```tsx
<div className="space-y-2 sm:space-y-4 md:space-y-6 lg:space-y-8">
  {/* Child elements */}
</div>
```

### 5. Responsive Navigation

#### Mobile Hamburger Menu

```tsx
const [isMenuOpen, setIsMenuOpen] = useState(false);

<nav className="bg-white shadow-sm">
  <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
    <div className="flex justify-between h-16">
      {/* Logo */}
      <div className="flex items-center">
        <h1 className="text-xl font-bold">theGarage</h1>
      </div>
      
      {/* Desktop Navigation */}
      <div className="hidden md:flex items-center space-x-8">
        <NavLink href="/">Home</NavLink>
        <NavLink href="/jobs">Jobs</NavLink>
        <NavLink href="/profile">Profile</NavLink>
      </div>
      
      {/* Mobile menu button */}
      <div className="md:hidden">
        <Button onClick={() => setIsMenuOpen(!isMenuOpen)}>
          <Menu className="h-6 w-6" />
        </Button>
      </div>
    </div>
    
    {/* Mobile Navigation */}
    {isMenuOpen && (
      <div className="md:hidden py-4 space-y-2">
        <MobileNavLink href="/">Home</MobileNavLink>
        <MobileNavLink href="/jobs">Jobs</MobileNavLink>
        <MobileNavLink href="/profile">Profile</MobileNavLink>
      </div>
    )}
  </div>
</nav>
```

#### Mobile Bottom Navigation

```tsx
<div className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t">
  <div className="grid grid-cols-5 gap-1">
    {navItems.map(item => (
      <button
        key={item.name}
        className="flex flex-col items-center py-2 px-1 text-xs"
      >
        <span className="text-lg mb-1">{item.icon}</span>
        <span>{item.name}</span>
      </button>
    ))}
  </div>
</div>
```

### 6. Responsive Forms

#### Form Layouts

```tsx
<form className="space-y-6">
  {/* Two-column on tablet and up */}
  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
    <div>
      <Label htmlFor="firstName">First Name</Label>
      <Input id="firstName" />
    </div>
    <div>
      <Label htmlFor="lastName">Last Name</Label>
      <Input id="lastName" />
    </div>
  </div>
  
  {/* Three-column on large screens */}
  <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
    <div className="lg:col-span-2">
      <Label htmlFor="email">Email</Label>
      <Input id="email" type="email" />
    </div>
    <div>
      <Label htmlFor="phone">Phone</Label>
      <Input id="phone" />
    </div>
  </div>
</form>
```

#### Responsive Buttons

```tsx
// Stack vertically on mobile, horizontally on larger screens
<div className="flex flex-col sm:flex-row gap-3">
  <Button className="w-full sm:w-auto">Primary Action</Button>
  <Button variant="outline" className="w-full sm:w-auto">Secondary Action</Button>
</div>
```

### 7. Responsive Tables

#### Mobile-First Tables

```tsx
<div className="overflow-x-auto">
  <table className="w-full">
    {/* Table content */}
  </table>
</div>

// Or use card layout on mobile
<div className="space-y-4 md:hidden">
  {data.map(item => (
    <Card key={item.id} className="p-4">
      {/* Mobile card representation of table row */}
    </Card>
  ))}
</div>

<table className="hidden md:table w-full">
  {/* Desktop table */}
</table>
```

### 8. Responsive Images & Media

#### Responsive Images

```tsx
<img
  src={imageUrl}
  alt="Description"
  className="w-full h-auto object-cover rounded-lg"
/>

// Fixed aspect ratio
<div className="aspect-w-16 aspect-h-9">
  <img src={imageUrl} alt="Description" className="object-cover" />
</div>
```

#### Responsive Videos

```tsx
<div className="aspect-w-16 aspect-h-9">
  <iframe
    src={videoUrl}
    className="w-full h-full"
    allowFullScreen
  />
</div>
```

## Component-Specific Patterns

### Job Cards

```tsx
// Use compact version on mobile
<ResponsiveJobCard 
  job={job}
  compact={window.innerWidth < 768}
/>

// Or use responsive classes
<Card className="p-4 md:p-6">
  {/* Card content with responsive spacing */}
</Card>
```

### Dashboard Layouts

```tsx
<ResponsiveDashboard>
  {/* Dashboard content that adapts to screen size */}
</ResponsiveDashboard>
```

### Modal/Dialog Patterns

```tsx
<Dialog>
  <DialogContent className="sm:max-w-md md:max-w-lg lg:max-w-2xl">
    {/* Modal content that scales */}
  </DialogContent>
</Dialog>
```

## Testing Strategy

### 1. Browser DevTools

- Use Chrome DevTools device emulation
- Test all breakpoints: 320px, 640px, 768px, 1024px, 1280px, 1536px
- Check touch interactions on mobile

### 2. Real Device Testing

- Test on actual mobile devices
- Test on tablets (iPad, Android tablets)
- Test on various desktop screen sizes

### 3. Common Issues to Check

- **Text readability**: Ensure text is not too small on mobile
- **Touch targets**: Buttons should be at least 44px × 44px
- **Horizontal scrolling**: Eliminate unwanted horizontal scroll
- **Content overflow**: Ensure content fits within viewport
- **Navigation**: Test mobile menu and bottom navigation

## Performance Considerations

### 1. Responsive Images

```tsx
<picture>
  <source media="(min-width: 1024px)" srcSet={largeImage} />
  <source media="(min-width: 768px)" srcSet={mediumImage} />
  <img src={smallImage} alt="Description" />
</picture>
```

### 2. Lazy Loading

```tsx
<img
  src={imageUrl}
  alt="Description"
  loading="lazy"
  className="w-full h-auto"
/>
```

### 3. CSS Optimization

- Use Tailwind's `purge` to remove unused CSS
- Minimize custom CSS
- Use CSS Grid and Flexbox efficiently

## Accessibility Considerations

### 1. Responsive Typography

- Ensure text remains readable at all sizes
- Use relative units where appropriate
- Maintain sufficient color contrast

### 2. Touch Targets

- Minimum touch target size: 44px × 44px
- Provide adequate spacing between interactive elements

### 3. Navigation

- Ensure mobile menu is keyboard accessible
- Provide focus indicators for touch interactions

## Implementation Checklist

### Mobile (< 640px)

- [ ] Single column layouts
- [ ] Hamburger menu or bottom navigation
- [ ] Compact card designs
- [ ] Touch-friendly buttons (≥44px)
- [ ] Readable text sizes (≥16px base)
- [ ] No horizontal scrolling

### Tablet (640px - 1023px)

- [ ] 2-3 column grids
- [ ] Larger touch targets
- [ ] More detailed card layouts
- [ ] Side navigation options
- [ ] Optimized form layouts

### Desktop (1024px+)

- [ ] Multi-column layouts
- [ ] Hover states and tooltips
- [ ] Side navigation
- [ ] Larger content areas
- [ ] Keyboard navigation support

## Common Responsive Issues & Solutions

### Issue: Horizontal Scroll on Mobile

**Solution**: Ensure containers don't exceed viewport width

```tsx
// ❌ Problem
<div className="w-full min-w-[1200px]">Too wide content</div>

// ✅ Solution
<div className="w-full overflow-x-auto">
  <div className="min-w-[1200px]">Wide content with scroll</div>
</div>
```

### Issue: Text Too Small on Mobile

**Solution**: Use responsive text sizing

```tsx
// ❌ Problem
<p className="text-xs">Too small text</p>

// ✅ Solution
<p className="text-sm sm:text-base">Responsive text size</p>
```

### Issue: Buttons Too Close Together

**Solution**: Add adequate spacing

```tsx
// ❌ Problem
<div className="space-x-1">
  <Button size="sm">Action 1</Button>
  <Button size="sm">Action 2</Button>
</div>

// ✅ Solution
<div className="flex flex-col sm:flex-row gap-3">
  <Button className="w-full sm:w-auto">Action 1</Button>
  <Button className="w-full sm:w-auto">Action 2</Button>
</div>
```

## Tools & Resources

### Development Tools

- Chrome DevTools Device Mode
- Firefox Responsive Design Mode
- BrowserStack for cross-device testing

### Design Tools

- Figma responsive design features
- Sketch responsive design plugins
- Adobe XD responsive resize

### Testing Tools

- Lighthouse for performance testing
- WebAIM for accessibility testing
- PageSpeed Insights for optimization

## Best Practices Summary

1. **Mobile-First**: Design for mobile first, then enhance
2. **Consistent Breakpoints**: Use Tailwind's standard breakpoints
3. **Flexible Grids**: Use responsive grid systems
4. **Readable Typography**: Scale text appropriately
5. **Touch-Friendly**: Ensure adequate touch targets
6. **Performance**: Optimize images and lazy load content
7. **Accessibility**: Maintain accessibility at all sizes
8. **Testing**: Test on real devices and browsers
9. **Progressive Enhancement**: Add features for larger screens
10. **Content Priority**: Prioritize important content on mobile

Remember: Responsive design is not just about fitting content on different screens—it's about providing the best user experience for each device context.
