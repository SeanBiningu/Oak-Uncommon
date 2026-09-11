# OAK Zimbabwe Partner Gathering

A web platform built for the **OAK Zimbabwe Foundation Partner Gathering** to manage attendee registration, QR-based daily check-in, live headcount, the event programme, and the partner directory.

The platform is designed for the OAK Partner Convening taking place at **Cresta Lodge, Msasa, Harare, from 9–11 November 2026**.

## Overview

The OAK Partner Gathering platform provides a simple and reliable way to manage event attendance and information.

Attendees can register online and receive a unique QR code that is used for daily check-in. The coordination team can scan QR codes using a smartphone camera through the browser and monitor the live attendance count.

The platform also provides a public programme page and partner directory.

## Features

### Attendee Registration

* Online registration form
* Captures:

  * Full name
  * Organization / sub-partner
  * Role
  * Contact details
  * Dietary needs
  * Accessibility needs
  * Travel needs
* Registration validation
* Consent statement
* Unique QR code generated for each attendee

### Digital Attendee Pass

Each registered attendee receives a digital pass containing:

* Name
* Organization
* QR code

### QR Check-in

* Browser-based QR scanner
* Works with a smartphone camera
* Records attendance for each event day
* Prevents double-counting on the same day
* No special scanning hardware required

### Live Headcount

The coordination team can view:

* Current attendance
* Daily check-ins
* Attendee information
* Searchable attendee records
* CSV export for accommodation planning

### Event Programme

* Day-by-day programme
* Session times
* Session locations
* Session details
* Daily documentation posts
* Notes and curated photos

### Partner Directory

* Partner organizations
* Sub-partners
* Organization logos
* Website links

### Admin

Only authorized coordination team members can access administrative functionality.

Admins can manage:

* Attendees
* Check-ins
* Programme content
* Partner directory content
* Event documentation

## Tech Stack

* **Next.js** — Application framework
* **TypeScript** — Type-safe development
* **Tailwind CSS** — Styling and responsive UI
* **Supabase** — PostgreSQL database, authentication and file storage
* **qrcode.react** — QR code generation
* **html5-qrcode** — Browser-based QR scanning
* **Vercel** — Deployment

## Project Structure

```text
project/
├── app/
│   ├── page.tsx
│   ├── register/
│   ├── programme/
│   ├── partners/
│   └── admin/
│
├── components/
│   ├── QRScanner
│   ├── QRCode
│   ├── RegistrationForm
│   ├── Headcount
│   └── ...
│
├── lib/
│   └── supabase/
│
├── public/
│   └── ...
│
├── .env.local
├── package.json
├── README.md
└── ...
```

## Getting Started

### 1. Clone the repository

```bash
git clone YOUR_REPOSITORY_URL
```

### 2. Navigate into the project

```bash
cd YOUR_PROJECT_FOLDER
```

### 3. Install dependencies

```bash
npm install
```

### 4. Configure environment variables

Create a `.env.local` file in the root of the project.

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

Do not commit `.env.local` or any other file containing secrets to GitHub.

### 5. Start the development server

```bash
npm run dev
```

Open:

```text
http://localhost:3000
```

## Supabase

Supabase is used for:

* PostgreSQL database
* Admin authentication
* File storage
* Database access policies

The platform handles personal information, so access to attendee information must be protected at the database level.

Sensitive attendee information such as dietary, accessibility, travel and contact details should only be accessible to authorized administrators.

## Security

Security and privacy are important because the platform handles personal and organizational information.

The application should:

* Restrict attendee information to authorized admins
* Use Supabase Row Level Security (RLS)
* Protect sensitive database records
* Keep secrets in environment variables
* Prevent sensitive information from being returned through public APIs
* Prevent duplicate daily check-ins
* Require admin authentication for administrative functionality

## Event Workflow

```text
Attendee
   │
   ▼
Registration
   │
   ▼
Unique QR Code
   │
   ▼
Digital Attendee Pass
   │
   ▼
QR Scan at Event
   │
   ▼
Daily Check-in Recorded
   │
   ▼
Live Headcount Updated
```

## User Access

### Public Users

Public users can access:

* Registration
* Attendee pass
* Event programme
* Partner directory

### Administrators

Authorized administrators can access:

* Admin dashboard
* Attendee records
* QR scanner
* Daily check-ins
* Live headcount
* Programme management
* Partner management
* Documentation management

Attendees do not require accounts or passwords. They are identified through their unique QR code.

## Responsive Design

The platform is designed as a responsive web application and should work across:

* Desktop computers
* Tablets
* Smartphones

The QR scanner is designed to work through a smartphone browser without requiring a native mobile application.

## Deployment

The application is deployed using **Vercel**, with Supabase providing the backend services.

Before deploying:

1. Configure the required environment variables.
2. Confirm the Supabase database is configured.
3. Confirm Row Level Security policies are enabled.
4. Test registration.
5. Test Q
