# Rana's Food Fantasy

## Current State
New project. No existing frontend or backend code.

## Requested Changes (Diff)

### Add
- Landing/home page for a cloud kitchen business called "Rana's Food Fantasy"
- Hero section with logo and tagline about homemade food, spices, and fresh vegetables
- About/services section listing: cloud kitchen meals, homemade food, spices, fresh vegetables delivered at home
- Menu/offerings section showcasing the three main categories (homemade food, spices, fresh vegetables)
- Contact section with phone number (8906465554), address (Durga Rani Apartment, Sarada Pally, Shiv Mandir, Siliguri-734011, West Bengal), and FSSAI registration number (22826080000159)
- Order/inquiry call-to-action (click-to-call button)
- Footer with business details and FSSAI number
- Admin panel to manage menu items (add, edit, delete) with category support
- Customer-facing menu page showing available items by category

### Modify
- Nothing (new project)

### Remove
- Nothing (new project)

## Implementation Plan
1. Backend: Menu item data store with CRUD operations. Categories: homemade food, spices, vegetables. Fields: name, description, price, category, available (bool).
2. Frontend: Multi-section landing page with hero (logo), services, menu listing by category, contact/location section, footer with FSSAI number.
3. Admin page (password-protected via authorization component) to manage menu items.
4. Order CTA: click-to-call button linking to the phone number.
