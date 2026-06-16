#  Salamander Tracker

##  Project Overview

This Salamander Tracker Project is a React-based frontend application designed to help users detect salamanders in video footage using interactive tools and visual feedback. 

This project focuses on building a responsive user-friendly interface that communicates with a backend system developed separately. While the backend handles video processing and detection logic, this frontend provides users with an intuitive way to interact with that data. 

---

## Features

- Browse available salamander videos from the server.
- View video thumbnails before processing.
- Select a target color using a color picker.
- Adjust color matching tolerance with a slider.
- Preview image binarization settings before processing.
- Submit video processing jobs with custom settings.
- Monitor processing job status.
- Display processing progress indicators.
- Handle processing failures with user-friendly error messages.
- Download generated CSV results.

---

## Tech Stack

- Frontend
  - React 
  - Vite
  - React Router for client-side routing
  - CSS and Tailwind CSS
  - CORS

- Backend
  - Node.js
  - Express

- Video Processing
  - Java
  - Maven

- Development Tools
  - Git
  - GitHub
  - Insomnia


---

# Setup Instructions

## Installation requirements

Before running the application, make sure the following software is installed:
  - Node.js
  - npm
  - Java
  - Maven
  - Git


## Required Repositories

This project requires two repositories:
  1. Salamander Tracker (Frontend)
  2. Centroid Finder (Backend and Video Processor)

Both repositories must be cloned to your local machine. 

Salamander Tracker: https://github.com/SouthBennett/salamander-tracker

Centroid Finder: https://github.com/SouthBennett/centroid-finder


## Start the Backend (Centroid Finder)

Navigate to the Centroid Finder project:
  1. Build the Java video processor
  - in the terminal, run:  cd processor
  - In terminal, run: mvn package
       on the command line and wait for  ("Build Success!")
  
  2. Start the backend server:
  - create .env file in project root directory:
  - copy and paste:
      PORT=3000
      VIDEO_DIR=../server/videos
      RESULTS_DIR=../server/results
      THUMBNAIL_DIR=../server/thumbnails
      JAR_PATH=../processor/target/centroidFinder-1.0-SNAPSHOT-jar-with-dependencies.jar


  - in the terminal, return to root directory run: cd .. 
  - navigate to server directory, run: cd server
  - npm install
  - npm run dev
  - ctrl + click link in terminal 

  The backend will run on http://localhost:3000


## Start the Frontend (Salamander Tracker)

Open a second terminal and navigate to the Salamander Tracker project.
  1. Install dependencies:
   - npm install

  2. Start the development server
    - npm run dev

The front end will run on: http://localhost:5173


## Using the Application
  1. Open the frontend in a web browser.
  2. Click on the videos tab.
  3. Select a Salamander Video.
  4. Adjust the target color and tolerance settings.
  5. Review the binarized preview image.
  6. Submit a processing job.
  7. Monitor job status while processing.
  8. Download the generated CSV results when processing is complete.

---

## Color Palette

This app uses the following colors throughout the user interface

1. Buttons
    - Blue (bg-blue-600)
2. Button Hover State
    - Blue (bg-blue-500)
3. Button Active State
    - Blue (bg-blue-700)
4. Page Background 
    - Zinc (bg-zinc-900)
5. Borders
    - Zinc (border-zinc-700)
6. Body Text
    - Zinc (text-zinc-300)
7. Error Messages
    - Red (text-red-500)

## Project Board

<p align="center">
  <img src="wireFrames/Home-Video-page.png" width="800" />
</p>
<p align="center">
  <img src="wireFrames/Video-detection-page.png" width="800" />
</p>

---

## Authors

- Connor Hughes
- Xavier Lewis
