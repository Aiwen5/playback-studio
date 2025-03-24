# Playback Studio

Playback Studio is a digital journal designed to help music lovers track their physical music collections. Such as, cassettes, vinyl records, and CDs. The application allows users to add albums, customize album descriptions, and record their collections.

Features in the application include integrating the YouTube Data API v3 to automatically import album information and metadata, along with the ability to link digital versions of albums (from YouTube). The goal of Playback Studio is to create a modern, personalized space for collectors to organize and explore their music archives.

## Live Demo

If you’d like to view the hosted version of Playback Studio, visit:

👉 [https://playback-studio.vercel.app](https://playback-studio.vercel.app)

---

## Team Contributions

### Chelsea

#### UI/UX Design & Component Organization
- Designed all screens in Figma, ensuring a cohesive and user-friendly experience.
- Organized and structured components to maintain consistency across pages.
- Developed a scalable design system for easy modifications and future updates.

#### Front-End Development
- Implemented a dynamic scrolling mechanism at the top of every page to enhance the user experience and design.
- Ensured responsiveness across different devices.

#### Branding & Assets
- Designed essential visual assets, including favicons and branding elements.
- Ensured brand consistency across all pages and UI elements.

#### Project Management & Workflow Optimization
- Created a structured project timeline, ensuring clear task delegation and sprint planning.
- Designed and maintained a timetable to keep development and design processes aligned.
- Assisted in organizing sprints to optimize workflow efficiency and team productivity.

#### Documentation & Team Collaboration
- Contributed to the project report, refining key sections alongside the team.
- Provided input and feedback to maintain design and development alignment.

---

### Keona

#### Design
- Co-designed user interface screens in Figma, ensuring a cohesive and user-friendly experience.
- Created reusable components for the web application that aligned with the brand identity.
- Developed a web application layout with technical feasibility in mind to support a smooth developer handoff.
- Co-built a brand style guide and visual assets to maintain consistency across the application.
- Created a project timeline to help the team meet sprint goals and deadlines.

#### Front-End Development
- Developed global assets to support responsive design and scalability.
- Imported design assets into the codebase and ensured they rendered as intended.
- Assisted with component styling to align the UI with the design system.
- Supported the setup and organization of the project’s file structure.

#### Presentation Video Editing
- Edited the presentation showcase video.

---

### **Evan**

#### Back-End Development
- Set up and managed the Express.js server and routing logic.
- Connected and interacted with a PostgreSQL database using [Neon.tech](https://neon.tech).
- Handled API integration with the YouTube Data API to fetch metadata dynamically.
- Created route handlers for CRUD operations including:
  - Adding albums  
  - Viewing album details  
  - Deleting albums with custom confirmation prompts
- Implemented form validation for YouTube URL input using regex.

#### Middleware & Layout
- Integrated EJS layout middleware to standardize page structure.
- Ensured consistent UI behavior across all pages.

#### Features & Enhancements
- Set up a custom popup & toast system that lets the user confirm album deletions then notifies the user of the deletion.
- Built error handling and routing for invalid album pages.
- Implemented method override to support DELETE operations in forms.
- Styled and animated album deletion buttons and confirmation modals.
- Created minor animations and responsive layouts for album cards and details.
- Helped make the site fully responsive across four different breakpoints, ensuring consistent layout and readability on mobile, tablet, and desktop screens.

---

## How to Run the Application Locally

> ⚠️ This project uses environment variables to connect to external services (like the database and YouTube API). Make sure to set those up before starting the server.

### Requirements

- Node.js (v18 or higher recommended)
- Git
- A `.env` file (included in the submission)

### Steps

1. **Clone the repository:**

```bash
git clone https://github.com/Aiwen5/playback-studio.git
cd playback-studio
```

2. **Install dependencies:**
   
```bash
npm install
```

3. **Set up environment variables:**

> ⚠️ Obviously cant share the .env keys here

- Place the provided .env file into the root of the project.
- This file includes keys for:
- DB_URL (PostgreSQL [Neon.tech](https://neon.tech) connection string)
- YOUTUBE_API_KEY (API key for [YouTube Data API v3](https://developers.google.com/youtube/v3/getting-started))

4. **Start the development server:**

```bash
npm run dev
```

5. **Visit the app:**

   Open http://localhost:3000 in your browser.
