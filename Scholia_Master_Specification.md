---
name: Scholia Master Specification
purpose: Single Source of Truth for AI Agents
version: 1
---

# Scholia

> **Your Digital Sanctuary for Thought**

Scholia is a Medium-inspired personal knowledge hub for writers,
researchers, developers, and lifelong learners. It combines the elegance
of an editorial publishing platform with the organization of a modern
notebook application.

------------------------------------------------------------------------

# Product Vision

Scholia should feel like a premium digital library rather than a
productivity dashboard.

The experience emphasizes:

-   Calm writing
-   Long-form thinking
-   Personal knowledge management
-   Editorial reading
-   Minimal distractions
-   Beautiful typography

Inspirations:

-   Medium
-   Substack
-   Bear Notes
-   Readwise Reader
-   Apple Books

Avoid:

-   Jira
-   Trello
-   ClickUp
-   Notion-style heavy dashboards
-   Glassmorphism
-   Overly colorful SaaS UI

------------------------------------------------------------------------

# Design System

## Brand

**Style**

Minimalist Editorial

The interface should disappear behind the content.

------------------------------------------------------------------------

## Color System

Primary Green

-   #006E05

Paper

-   #FFFFFF

Canvas

-   #FAFAFA

Primary Text

-   #242424

Secondary Text

-   #6B6B6B

Borders

-   #E6E6E6

Use white paper for reading surfaces and canvas background for
application chrome.

Green is reserved for:

-   Primary buttons
-   Active navigation
-   Success
-   Important actions

Avoid unnecessary accent colors.

------------------------------------------------------------------------

## Typography

### Content

Font: Source Serif 4

Use for:

-   Article titles
-   Reading content
-   Landing page branding

### Interface

Font: Inter

Use for:

-   Sidebar
-   Buttons
-   Forms
-   Navigation
-   Metadata

### Code

JetBrains Mono

------------------------------------------------------------------------

## Typography Scale

Display Large

-   48px
-   Source Serif 4
-   Bold

Headline

-   32px

Sub Heading

-   24px

Reading Text

-   20px
-   Line Height 32px

UI Body

-   16px

Label

-   14px

Caps Label

-   12px

------------------------------------------------------------------------

## Layout

Sidebar

-   280px
-   Canvas background

Reading Column

-   Max Width 720px

Spacing

-   stack-sm 8px
-   stack-md 16px
-   stack-lg 32px
-   stack-xl 64px

Generous whitespace everywhere.

------------------------------------------------------------------------

## Shape Language

Buttons

4px radius

Tags

2px radius

Containers

Square corners preferred.

------------------------------------------------------------------------

## Elevation

Avoid shadows.

Prefer:

-   tonal separation
-   subtle borders

Modals may use:

0 4px 20px rgba(0,0,0,0.05)

------------------------------------------------------------------------

# Components

## Buttons

Primary

Green background

White text

No shadow

Secondary

Transparent

Thin charcoal border

Ghost

Text only

------------------------------------------------------------------------

## Inputs

Minimal.

Single bottom border.

Focused border becomes charcoal.

Labels sit above inputs.

------------------------------------------------------------------------

## Editor

Toolbar should remain hidden until text selection.

Cursor:

Thin charcoal.

Writing surface:

Completely distraction free.

------------------------------------------------------------------------

## Library View

Notes are displayed as editorial rows.

Each row contains:

-   Thumbnail
-   Title
-   Excerpt
-   Category
-   Reading time
-   Bookmark
-   Overflow menu

------------------------------------------------------------------------

# Screen Specification

## Login

### Left Panel

Purpose:

Brand introduction.

Contains:

-   Logo
-   Scholia
-   "Your Digital Sanctuary for Thought"
-   Decorative paper shapes
-   Quote: The Art of Curation

### Right Panel

Centered authentication.

Contains:

-   Email
-   Password
-   Forgot Password
-   Sign In
-   Google Login
-   Apple Login
-   Join the Library

Footer:

Established 2024

------------------------------------------------------------------------

## Dashboard

Sidebar:

-   Write
-   Knowledge
-   Work
-   Important
-   Archive
-   Settings
-   User Profile

Top Bar

-   Search
-   Notifications
-   Profile
-   Write Button

Hero

Collection

The Reading Room

Subtitle:

84 preserved ideas waiting for synthesis.

Filters

-   All Notes
-   Knowledge
-   Work
-   Important
-   Reading List

Article Row

-   Author
-   Date
-   Title
-   Excerpt
-   Reading Time
-   Category
-   Thumbnail
-   Bookmark

Footer

-   Privacy
-   Terms
-   Export Data

------------------------------------------------------------------------

## New Note

Heading

Start a new piece

Subtitle

Where does this idea belong?

Category Cards

Knowledge

Work

Important

Templates

-   Blank Page
-   Quick Journal
-   Project Brief
-   Research Note

Action

Browse Library

Quote

"The secret of getting ahead is getting started."

------------------------------------------------------------------------

## Publish Modal

Left

Story Preview

-   Image
-   Title
-   Description
-   Author

Right

Featured Image

Tags

Collection

Visibility Toggle

Publish Now

Schedule for later

------------------------------------------------------------------------

# Navigation Flow

Login

↓

Dashboard

↓

Write

↓

Editor

↓

Publish

↓

Published Story

------------------------------------------------------------------------

# UX Principles

-   Content first
-   Editorial layouts
-   Premium typography
-   Calm interface
-   Keyboard friendly
-   Responsive
-   Fast
-   Minimal clicks

------------------------------------------------------------------------

# Responsive

Desktop

Sidebar fixed.

720px reading column.

Tablet

Sidebar collapsible.

Mobile

Hidden drawer.

Margins 16px.

Content fills viewport.

------------------------------------------------------------------------

# Accessibility

-   Semantic HTML
-   Keyboard navigation
-   Visible focus states
-   WCAG AA contrast
-   Alt text for images

------------------------------------------------------------------------

# AI Implementation Rules

Always prioritize readability over feature density.

Every page should resemble a high-end publishing platform.

Never make Scholia feel like a corporate dashboard.

Prefer list layouts over card grids.

Do not use heavy shadows.

Do not use glassmorphism.

Do not overuse rounded corners.

Content is always more important than controls.

Typography should dominate the visual hierarchy.

Whitespace is a feature, not empty space.
