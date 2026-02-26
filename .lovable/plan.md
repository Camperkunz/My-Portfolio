

# Minimalist Monochrome Developer Portfolio

## Overview
A clean, single-page developer portfolio with a monochrome design. Four main sections with a project gallery that opens detailed views in modals.

## Structure

### 1. Layout & Navigation
- Fixed top navbar with name/logo and smooth-scroll links to each section
- Single-page layout with clear section dividers

### 2. Hero / Header
- Developer name, title ("Frontend Developer"), and a brief tagline
- Links to GitHub, LinkedIn, email

### 3. Work Experience Section
- Timeline-style list of positions
- Each entry: company, role, dates, brief description
- Sample data: 2-3 positions

### 4. Education Section
- Similar timeline layout
- Each entry: institution, degree, dates
- Sample data: 2 entries

### 5. Skills Section
- Grouped skill badges (e.g., Languages, Frameworks, Tools)
- Clean pill/badge style in monochrome

### 6. Projects Gallery Section
- Grid of project cards (image placeholder, title, short description, tech tags)
- Clicking a card opens a **modal** with full project details: description, tech stack, links (GitHub, live demo), screenshots
- Sample data: 4-6 projects

### 7. Footer
- Simple footer with copyright and social links

## Technical Approach
- TypeScript interfaces for all data (Experience, Education, Skill, Project)
- Centralized data file (`src/data/portfolio.ts`) with sample entries
- Component structure:
  - `Layout` (navbar + footer wrapper)
  - `HeroSection`
  - `ExperienceSection`
  - `EducationSection`
  - `SkillsSection`
  - `ProjectsSection` + `ProjectCard` + `ProjectModal`
- Monochrome color scheme using existing CSS variables (blacks, whites, grays)
- Smooth scroll navigation
- Responsive design (mobile-friendly)
- Uses existing shadcn Dialog component for project modals and Badge for skills/tags

