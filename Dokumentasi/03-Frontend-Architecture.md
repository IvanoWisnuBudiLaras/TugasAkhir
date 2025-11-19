# Frontend Architecture - Smoethievibes Web App

## Overview
Frontend Smoethievibes dibangun menggunakan Next.js 14 dengan React 18, TypeScript, dan Tailwind CSS untuk membuat aplikasi web modern dengan optimal performance dan SEO.

## Technology Stack
- **Framework**: Next.js 14 (React 18)
- **Language**: TypeScript
- **Styling**: Tailwind CSS dengan PostCSS
- **State Management**: React Context API dan useState/useReducer
- **Data Fetching**: SWR untuk client-side dan Server Components untuk server-side
- **Form Handling**: React Hook Form dengan Zod validation
- **UI Components**: Headless UI untuk accessible components
- **GraphQL Client**: Apollo Client untuk GraphQL integration
- **HTTP Client**: Axios untuk REST API calls

## Folder Structure & Kegunaan

### /src/app/
**Kegunaan**: Next.js App Router structure (Next.js 13+ feature)

#### Root Layout (/src/app/layout.tsx)
- **Kegunaan**: Root layout yang membungkus seluruh aplikasi
- Setup global providers (Theme, Auth, Apollo)
- Konfigurasi metadata dan SEO tags
- Setup font dan global styles

#### Page Routes
- **/src/app/page.tsx**: Homepage dengan hero section dan product showcase
- **/src/app/products/page.tsx**: Product listing page dengan filtering
- **/src/app/products/[id]/page.tsx**: Product detail page
- **/src/app/cart/page.tsx**: Shopping cart management
- **/src/app/checkout/page.tsx**: Checkout process
- **/src/app/auth/login/page.tsx**: User login page
- **/src/app/auth/register/page.tsx**: User registration page
- **/src/app/profile/page.tsx**: User profile management
- **/src/app/admin/**: Admin dashboard routes (protected)

### /src/components/
**Kegunaan**: Reusable React components yang terorganisir per fitur

#### /src/components/common/
- **Header.tsx**: Navigation header dengan responsive menu
- **Footer.tsx**: Footer dengan links dan informasi kontak
- **Button.tsx**: Reusable button component dengan variants
- **Input.tsx**: Form input component dengan validation
- **Card.tsx**: Card component untuk product display
- **LoadingSpinner.tsx**: Loading state indicator
- **ErrorBoundary.tsx**: Error handling component

#### /src/components/products/
- **ProductCard.tsx**: Individual product display card
- **ProductGrid.tsx**: Grid layout untuk product listing
- **ProductFilter.tsx**: Filter sidebar untuk product search
- **ProductDetail.tsx**: Detailed product information
- **ProductReviews.tsx**: Customer reviews section
- **AddToCartButton.tsx**: Add to cart functionality

#### /src/components/cart/
- **CartItem.tsx**: Individual cart item display
- **CartSummary.tsx**: Cart total dan checkout button
- **QuantitySelector.tsx**: Quantity adjustment component
- **CartDrawer.tsx**: Slide-out cart drawer

#### /src/components/auth/
- **LoginForm.tsx**: User login form dengan validation
- **RegisterForm.tsx**: User registration form
- **AuthProvider.tsx**: Authentication context provider
- **ProtectedRoute.tsx**: Route protection component

#### /src/components/checkout/
- **CheckoutForm.tsx**: Multi-step checkout process
- **ShippingForm.tsx**: Shipping address form
- **PaymentForm.tsx**: Payment method selection
- **OrderSummary.tsx**: Order review dan confirmation

#### /src/components/admin/
- **AdminLayout.tsx**: Admin dashboard layout
- **ProductManagement.tsx**: CRUD operations untuk products
- **OrderManagement.tsx**: Order processing dan status
- **UserManagement.tsx**: User account management
- **AnalyticsDashboard.tsx**: Sales dan performance metrics

### /src/hooks/
**Kegunaan**: Custom React hooks untuk logic reusability

- **useAuth.ts**: Authentication state dan methods
- **useCart.ts**: Shopping cart management
- **useProducts.ts**: Product data fetching dan filtering
- **useOrders.ts**: Order history dan status
- **useLocalStorage.ts**: Local storage utility
- **useDebounce.ts**: Input debouncing untuk search
- **useToast.ts**: Toast notification system

### /src/contexts/
**Kegunaan**: React Context untuk global state management

- **AuthContext.tsx**: User authentication state
- **CartContext.tsx**: Shopping cart state
- **ThemeContext.tsx**: Dark/light mode theme
- **NotificationContext.tsx**: Global notification system

### /src/services/
**Kegunaan**: API service layer untuk backend communication

- **api.ts**: Axios instance dengan interceptors
- **auth.service.ts**: Authentication API calls
- **product.service.ts**: Product data fetching
- **cart.service.ts**: Cart operations
- **order.service.ts**: Order processing
- **user.service.ts**: User profile management

### /src/types/
**Kegunaan**: TypeScript type definitions

- **auth.types.ts**: Authentication related types
- **product.types.ts**: Product data structures
- **cart.types.ts**: Cart item dan state types
- **order.types.ts**: Order dan transaction types
- **user.types.ts**: User profile types
- **api.types.ts**: Generic API response types

### /src/utils/
**Kegunaan**: Utility functions

- **format.ts**: Currency, date, dan text formatting
- **validation.ts**: Form validation helpers
- **constants.ts**: App constants dan configuration
- **helpers.ts**: Generic utility functions
- **seo.ts**: SEO meta tag helpers

### /src/styles/
**Kegunaan**: Global styles dan Tailwind configuration

- **globals.css**: Global CSS dengan Tailwind directives
- **components.css**: Reusable component styles
- **variables.css**: CSS custom properties

### /public/
**Kegunaan**: Static assets

- **images/**: Product images, logos, icons
- **fonts/**: Custom font files
- **favicon.ico**: App favicon
- **robots.txt**: SEO robots configuration

## State Management Architecture

### Client State
- **Cart**: Managed by CartContext dengan localStorage persistence
- **Auth**: Managed by AuthContext dengan JWT token handling
- **Theme**: Managed by ThemeContext dengan user preference
- **Notifications**: Managed by NotificationContext dengan queue system

### Server State
- **Products**: Fetched menggunakan SWR dengan caching strategy
- **User Data**: Fetched dengan proper authentication headers
- **Orders**: Real-time updates menggunakan polling atau WebSocket

## Performance Optimizations

### Code Splitting
- Dynamic imports untuk heavy components
- Route-based code splitting otomatis oleh Next.js
- Component lazy loading untuk modals dan complex UI

### Image Optimization
- Next.js Image component untuk automatic optimization
- Responsive images dengan proper sizing
- WebP format untuk better compression

### Caching Strategy
- SWR untuk client-side data caching
- Static page generation untuk content yang jarang berubah
- Proper cache headers untuk static assets

## SEO Configuration

### Metadata
- Dynamic meta tags untuk setiap page
- Open Graph tags untuk social media sharing
- Structured data untuk better search engine understanding

### Performance
- Core Web Vitals optimization
- Mobile-first responsive design
- Accessibility best practices

## Environment Variables
```
NEXT_PUBLIC_API_URL=http://localhost:3000/api
NEXT_PUBLIC_GRAPHQL_URL=http://localhost:3000/graphql
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-secret-key
```

## Development Commands
```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Run linting
npm run lint

# Run tests
npm run test
```

## Best Practices
1. Gunakan TypeScript untuk semua component dan function
2. Implement proper error boundaries
3. Gunakan loading states untuk async operations
4. Optimize images dan assets
5. Implement proper accessibility (a11y)
6. Gunakan semantic HTML elements
7. Test di multiple devices dan browsers
8. Monitor performance dengan analytics