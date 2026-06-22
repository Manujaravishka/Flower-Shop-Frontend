# Maison Florelle — Luxury Floral Atelier

A premium e-commerce frontend for a luxury floral brand. Built with **React 18**, **TypeScript**, **Vite 7**, **Tailwind CSS**, and **shadcn/ui**, featuring a refined design system with custom animations and glassmorphism aesthetics.

**Deployed Site:** [`https://flower-boquet-frontend.vercel.app`](https://flower-boquet-frontend.vercel.app)
**Backend API:** [`https://flower-shop-backend-rosy.vercel.app`](https://flower-shop-backend-rosy.vercel.app)

---

## Architecture

```
src/
  App.tsx               ← Routing, providers, lazy-loaded pages
  main.tsx              ← Application entry point
  index.css             ← Global styles, design tokens, animations

  contexts/             ← React contexts (Auth, Cart)
  hooks/                ← Custom hooks (use-mobile, use-toast)
  layouts/              ← Admin & customer account layouts
  lib/                  ← API client, env config, utilities
  pages/                ← Route pages (26 total)
  services/             ← Auth service
  components/           ← UI components
    ui/                 ← shadcn/ui primitives (~45 components)
    luxury/             ← Brand-specific components
    dashboard/          ← Admin dashboard tabs
```

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| **Framework** | React 18.x (lazy loading, Suspense) |
| **Build Tool** | Vite 7.x (SWC compiler) |
| **Language** | TypeScript 5.x |
| **Styling** | Tailwind CSS 3.x + CSS custom properties |
| **UI Library** | shadcn/ui (Radix primitives) |
| **Animation** | Framer Motion 12.x |
| **Routing** | React Router DOM 6.x |
| **Server State** | TanStack React Query 5.x |
| **Forms** | React Hook Form + Zod validation |
| **HTTP Client** | Axios (with interceptors) |
| **Charts** | Recharts 2.x |
| **Icons** | Lucide React |
| **Auth** | JWT + Google OAuth |
| **Deployment** | Vercel (SPA) |

---

## Pages

### Public (13)

| Route | Page | Description |
|-------|------|-------------|
| `/` | Index | Homepage with hero, featured products, gallery |
| `/login` | Login | Email/password + Google OAuth sign-in |
| `/register` | Register | New customer registration |
| `/verify-otp` | OtpVerification | OTP verification for passwordless login |
| `/oauth/google/callback` | GoogleOAuthCallback | Google OAuth redirect handler |
| `/oauth/callback` | GoogleCallback | Legacy OAuth callback |
| `/products` | Products | Product grid with filters, search, pagination |
| `/product/:id` | ProductDetail | Full product view with reviews |
| `/categories` | Categories | Category browsing |
| `/gallery` | Gallery | Image gallery |
| `/cart` | Cart | Shopping cart |
| `/checkout` | Checkout | Order checkout |
| `/order-success` | OrderSuccess | Order confirmation |
| `/customize` | Customize | Custom bouquet builder |

### Customer Account (5)

| Route | Page | Description |
|-------|------|-------------|
| `/account` | AccountHome | Account dashboard |
| `/account/profile` | AccountProfile | Edit profile |
| `/account/orders` | AccountOrders | Order history |
| `/account/orders/:id` | AccountOrderDetail | Order details |
| `/account/addresses` | AccountAddresses | Saved addresses |

### Admin (6)

| Route | Page | Description |
|-------|------|-------------|
| `/admin` | AdminDashboard | Analytics dashboard |
| `/admin/products` | AdminProducts | Product management |
| `/admin/orders` | AdminOrders | Order management |
| `/admin/orders/:id` | AdminOrderDetail | Order detail view |
| `/admin/users` | AdminUsers | Customer management |
| `/admin/gifts` | AdminGifts | Gift management |

---

## Design System

### Colors

| Token | Value | Usage |
|-------|-------|-------|
| `--primary` | `#4A1D6B` | Deep purple — brand primary |
| `--gold` | `#C8A24A` | Gold accents |
| `--rose` | `#F4C2C2` | Rose pink highlights |
| `--cream` | `#FFF8F0` | Warm cream backgrounds |
| `--sage` | Purple-based scale | UI surfaces |

### Typography

| Font | Usage |
|------|-------|
| **Inter** | Body text (sans-serif) |
| **Playfair Display** | Display headings |
| **Cormorant Garamond** | Serif elegance |

### Animations

| Animation | Description |
|-----------|-------------|
| `fade-in-up` | Section entrance |
| `float-slow` | Floating decorative elements |
| `aurora` | Aurora borealis gradient |
| `shimmer` | Loading shimmer |
| `marquee` | Scrolling text |
| `scale-in` | Card entrance |
| `stagger-1` through `stagger-6` | Staggered delay utilities |

---

## API Integration

All backend communication flows through a centralized Axios instance configured in `src/lib/axios.ts`:

```
axios instance ──→ request interceptor (attach Bearer token)
                ──→ response interceptor (401 → refresh → retry)
                ──→ 20s timeout
                ──→ baseURL from VITE_API_URL
```

API endpoints are organized by domain in `src/lib/api.ts`:

| Module | Base Path | Methods |
|--------|-----------|---------|
| `authApi` | `/auth` | register, login, getProfile, refreshTokens, logout |
| `giftApi` | `/gift` | getAll, getById, create, update, delete |
| `customerApi` | `/customer` | getAll, get, create, update, delete |
| `orderApi` | `/order` | getAll, get, getMine, create, updateStatus |
| `paymentApi` | `/payment` | process, updateStatus, getMine |
| `cartApi` | `/cart` | get, add, update, remove, clear |
| `libraryApi` | `/library` | getAll, get, create, updateTitle, delete |
| `reviewApi` | `/review` | create, getByProduct, getMy, update, delete |
| `dashboardApi` | `/dashboard` | getStats, getRevenueByMonth, getTopProducts |
| `aiApi` | `/ai` | generate |

---

## State Management

| State | Approach |
|-------|----------|
| **Auth state** | React Context (`AuthContext`) — user, role, tokens |
| **Cart state** | React Context (`CartContext`) — items, quantities |
| **Server data** | TanStack React Query — caching, refetching |
| **Form state** | React Hook Form + Zod schemas |

---

## Getting Started

### Prerequisites

- Node.js 22.x
- npm 10.x

### Installation

```bash
git clone <repo-url>
cd Flower-Shop-Frontend-main
npm install
```

### Environment Variables

Copy `.env.example` to `.env`:

```bash
cp .env.example .env
```

| Variable | Description | Default |
|----------|-------------|---------|
| `VITE_API_URL` | Backend API base URL | `https://flower-shop-backend-rosy.vercel.app/api/v1` |
| `VITE_GOOGLE_CLIENT_ID` | Google OAuth client ID | — |
| `VITE_FRONTEND_URL` | Deployed frontend URL | `http://localhost:5173` |

### Development

```bash
npm run dev
```

Dev server starts on `http://localhost:8080`.

### Build

```bash
npm run build
npm run preview   # Preview production build
```

---

## Deployment

### Vercel (SPA)

```json
{
  "rewrites": [
    { "source": "/(.*)", "destination": "/index.html" }
  ]
}
```

All routes serve `index.html` — client-side routing handles the rest.

1. Set `VITE_API_URL` in Vercel Dashboard (production environment)
2. Push to GitHub → Vercel auto-deploys

---

## Project Structure

### Components

| Component | Description |
|-----------|-------------|
| `Navbar.tsx` | Admin navigation |
| `ClientNavbar.tsx` | Customer navigation with cart badge |
| `Footer.tsx` | Site footer with newsletter |
| `ProtectedRoute.tsx` | Auth guard |
| `RoleRoute.tsx` | Role-based access guard |
| `ProductCard.tsx` | Product display card |
| `ProductCardEnhanced.tsx` | Enhanced card with badges |
| `CategoryCard.tsx` | Category display card |
| `ReviewSection.tsx` | Product reviews |
| `GoogleOAuthButton.tsx` | Google sign-in button |
| `WhatsAppButton.tsx` | Floating WhatsApp chat |

### Luxury Components

| Component | Variants |
|-----------|----------|
| `GradientOrbs.tsx` | default, hero, subtle, cinematic, panel |
| `GlassCard.tsx` | default, strong, subtle, cream |
| `MotionSection.tsx` | up, down, left, right, scale, fade |
| `LuxuryText.tsx` | Styled text component |
| `AnimatedButton.tsx` | Animated CTA button |
| `LuxuryBadge.tsx` | Status/feature badge |
| `SectionHeader.tsx` | Section title block |
| `StaggerContainer.tsx` | Stagger animation wrapper |
| `PageTransition.tsx` | Route transition wrapper |

### Dashboard Tabs

| Component | Description |
|-----------|-------------|
| `OrdersTab.tsx` | Order table with status management |
| `ProductsTab.tsx` | Product CRUD with image upload |
| `CustomersTab.tsx` | Customer management table |
| `LibraryTab.tsx` | Image gallery CRUD with lightbox |

### UI Components

~45 shadcn/ui components built on Radix primitives, including:
`accordion`, `alert-dialog`, `avatar`, `badge`, `button`, `calendar`, `card`, `carousel`, `chart`, `checkbox`, `command`, `dialog`, `drawer`, `dropdown-menu`, `form`, `input-otp`, `menubar`, `pagination`, `popover`, `radio-group`, `scroll-area`, `select`, `sheet`, `sidebar`, `skeleton`, `slider`, `sonner`, `switch`, `table`, `tabs`, `textarea`, `toast`, `toggle`, `tooltip`

---

## Authentication Flow

```
1. Customer registers or signs in
2. Backend returns { accessToken, refreshToken, user }
3. Access token stored in localStorage
4. Axios interceptor attaches Authorization: Bearer header
5. On 401 response → interceptor calls refresh endpoint
6. On 403 → auth cleared, redirect to /login
```

Google OAuth is also supported via `@react-oauth/google`.

---

## Performance

- **Code splitting**: All 26 pages lazy-loaded via `React.lazy()` + `Suspense`
- **Chunk count**: ~66 production chunks for optimal caching
- **SWC compiler**: Fast builds via `@vitejs/plugin-react-swc`
- **TanStack Query**: Automatic caching, deduplication, background refetching

---

## License

MIT
