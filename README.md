# CICT IT Tech Portal - Setup Guide

A comprehensive department portal for the ISUFST CICT Student Council.

## Quick Start

```bash
# Clone the project
git clone [repository-url] cict-tech-portal
cd cict-tech-portal

# Install dependencies
composer install
npm install --legacy-peer-deps

# Environment setup
cp .env.example .env
php artisan key:generate

# Database
php artisan migrate
php artisan db:seed --class=RoleSeeder

# Run development server
npm run dev
php artisan serve
```

## Technology Stack

| Component | Technology |
|-----------|------------|
| Backend | Laravel 11 (PHP 8.3+) |
| Frontend | React 18 + Inertia.js + TypeScript |
| Styling | Tailwind CSS 3.4 (Maroon/Gold Glassmorphic) |
| Auth | Laravel Breeze |
| RBAC | Spatie Laravel-Permission |
| Storage | DigitalOcean Spaces |
| AI | Google Gemini API |

## Roles & Permissions

| Role | Description |
|------|-------------|
| `main-admin` | Full system access |
| `dean` | Oversight access |
| `sc-adviser` | Faculty advisory |
| `sc-president` | Near-admin for SC |
| `sc-officer` | Basic officer access |
| `sc-secretary` | Secretary-specific |
| `sc-treasurer` | Financial access |
| `student` | Student portal |
| `public` | Guest (landing only) |

## Environment Variables

```env
# App
APP_NAME="CICT IT Tech Portal"
APP_URL=http://localhost:8000

# Database
DB_CONNECTION=mysql
DB_HOST=your-host
DB_DATABASE=cict_portal
DB_USERNAME=your-user
DB_PASSWORD=your-password

# DigitalOcean Spaces
FILESYSTEM_DISK=do_spaces
DO_SPACES_KEY=your-key
DO_SPACES_SECRET=your-secret
DO_SPACES_ENDPOINT=https://sgp1.digitaloceanspaces.com
DO_SPACES_REGION=sgp1
DO_SPACES_BUCKET=cict-portal

# Gemini AI
GEMINI_API_KEY=your-api-key
```

## Project Structure

```
cict-tech-portal/
├── app/
│   ├── Http/Controllers/
│   │   ├── Admin/        # Admin controllers
│   │   ├── Officer/      # SC Officer controllers
│   │   ├── Student/      # Student portal
│   │   └── Public/       # Public pages
│   ├── Models/           # Eloquent models
│   └── Services/         # Business logic
├── resources/js/
│   ├── Components/
│   │   ├── UI/           # Glassmorphic components
│   │   ├── Layout/       # Layout templates
│   │   └── Chat/         # Chatbot components
│   ├── Pages/
│   │   ├── Public/       # Landing, announcements
│   │   ├── Admin/        # Admin dashboard
│   │   ├── Officer/      # President, Secretary, Treasurer
│   │   └── Student/      # Student portal
│   └── Hooks/            # React hooks
└── database/
    └── seeders/          # Role & data seeders
```

## Development Commands

```bash
# Start development
npm run dev          # Vite dev server
php artisan serve    # Laravel server

# Build for production
npm run build

# Testing
php artisan test
php artisan dusk

# Fresh database
php artisan migrate:fresh --seed
```

## Design System

The portal uses a **maroon and gold glassmorphic** design:

- **Primary**: Maroon (`#7f1d1d`)
- **Accent**: Gold (`#d4a017`)
- **Glass effects**: `backdrop-blur-xl`, `bg-white/10`

### CSS Classes

| Class | Description |
|-------|-------------|
| `.glass-card` | Glassmorphic card |
| `.btn-primary` | Maroon button |
| `.btn-gold` | Gold button |
| `.btn-glass` | Transparent button |
| `.text-gradient-gold` | Gold gradient text |

## Deployment (DigitalOcean)

1. Create a Droplet (Ubuntu 22.04)
2. Set up Managed MySQL Database
3. Create Spaces bucket for storage
4. Configure Nginx + PHP 8.3
5. Deploy via Git or CI/CD

---

© 2025 CICT Student Council - ISUFST Dingle Campus
