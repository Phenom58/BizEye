# BizEye - AI-Powered Business Intelligence for D2C Brands

> Transform raw business data into actionable intelligence — performance, sentiment, and predictions from one unified dashboard.

BizEye is a front-end prototype of an AI-powered business intelligence platform designed for small and growing direct-to-consumer (D2C) brands. It provides a clean, modern interface for visualizing sales performance, understanding customer sentiment, and acting on AI-generated forecasts — all without requiring a data science team.

---

## Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
- [Available Scripts](#available-scripts)
- [Application Flow](#application-flow)
- [Dashboard Sections](#dashboard-sections)
- [Design System](#design-system)
- [Roadmap](#roadmap)
- [License](#license)

---

## Overview

Small D2C brands often lack the resources to build dedicated analytics infrastructure. BizEye bridges that gap by providing an intuitive dashboard that surfaces the three pillars of business intelligence:

1. **Performance** — Which products are winning, which are declining, and where revenue is concentrated.
2. **Sentiment** — What customers are saying, how they feel, and which themes drive satisfaction or frustration.
3. **Predictive** — What will sell out, which customers are at risk of churning, and what demand looks like next month.

This repository contains the front-end prototype with dummy data, dummy authentication, and a fully interactive UI suitable for stakeholder demos and design validation.

---

## Features

### Landing Page

- Dark, modern hero section with animated entrance effects
- Floating business-themed background icons (charts, dollar signs, carts, rockets, and more) with aquarium-style swimming animation
- Three-pillar feature showcase (Performance, Sentiment, Predictive)
- Key statistics bar
- Audience segmentation section
- Call-to-action with dashboard launch

### Authentication

- Split-screen sign-in / sign-up page
- Clean form design with icon-led inputs
- Toggle between sign-in and sign-up modes
- Form validation with inline error messaging
- Loading state on submit
- Dummy authentication — any email and password (4+ characters) grants access

### Dashboard

- Persistent dark sidebar with navigation, upload CTA, and AI assistant card
- Sticky top bar with search, notifications, and user profile
- Four fully-built dashboard sections (see below)
- Responsive layout — sidebar collapses to an overlay on mobile

---

## Getting Started

### Prerequisites

- Node.js 18 or higher
- npm 9 or higher

### Installation

```bash
npm install
```

### Development Server

The development server starts automatically in this environment. If running locally outside this environment:

```bash
npm run dev
```

The app will be available at `http://localhost:5173`.

---

## Available Scripts

| Script              | Description                                  |
|---------------------|----------------------------------------------|
| `npm run dev`       | Start the Vite development server            |
| `npm run build`     | Build the project for production             |
| `npm run preview`   | Preview the production build locally         |
| `npm run typecheck` | Run TypeScript type checking (no emit)      |
| `npm run lint`      | Run ESLint across the project                |

---

```

The app uses simple state-based routing in `App.tsx` — no router library is needed for this prototype. The `Page` type (`'landing' | 'login' | 'dashboard'`) controls which screen is rendered.

---

## Dashboard Sections

### Overview

A high-level snapshot of the business:

- AI-generated summary banner with plain-language insights
- Four KPI cards (Revenue, Orders, Average Order Value, Customer Satisfaction)
- Revenue trend bar chart (last 6 months)
- Top products ranked by revenue
- Key insights with severity indicators (positive, warning, predictive)
- Recent activity feed

### Performance

Deep dive into product and sales performance:

- Summary cards (best seller, total SKUs, winning/declining product counts)
- Revenue by category with horizontal bar visualization
- Month-over-month comparison (this year vs last year)
- Full product performance table with units sold, revenue, growth %, and status badges

### Sentiment

Customer feedback intelligence:

- AI analysis banner with overall sentiment summary
- Sentiment breakdown donuts (Positive, Neutral, Negative) with percentages
- Sentiment by theme — AI-extracted topics scored 0-100 (Product Quality, Shipping Speed, Customer Service, etc.)
- Recent customer feedback cards with sentiment tags and source attribution

### Predictive

AI-powered forecasts and risk detection:

- AI forecast banner with plain-language summary
- 30-day forecast cards for Revenue, Orders, and New Customers with confidence scores
- Stockout prediction table — days until each product runs out, severity badges
- At-risk customer list with churn risk indicators and reasons

---

## Roadmap

This prototype is front-end only with dummy data. Planned next steps:

- [ ] Wire Supabase authentication (email/password)
- [ ] Build CSV upload flow with data parsing
- [ ] Connect dashboard widgets to live Supabase queries
- [ ] Implement AI insight generation via edge functions
- [ ] Add real-time sentiment analysis pipeline
- [ ] Build predictive forecasting models
- [ ] Add user settings and account management
- [ ] Implement role-based access control for teams

---

## License

This project is a prototype and is not currently licensed for distribution. All rights reserved.

