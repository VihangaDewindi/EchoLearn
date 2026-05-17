# EchoLearn

EchoLearn is an AI-powered accessible e-learning platform designed for visually impaired and dyslexic learners. The platform combines accessibility-first design principles with artificial intelligence to provide a more inclusive and independent digital learning experience.

## Features

### Accessibility Features

* Voice navigation
* Text-to-speech lesson narration
* Dyslexic mode
* High contrast mode
* Keyboard accessibility
* Screen-reader friendly navigation

### AI-Powered Learning

* AI-generated adaptive quizzes
* Dynamic question generation
* Context-aware assessments
* Grade-level quiz adaptation

### Dashboards

* Student dashboard
* Parent dashboard
* Teacher dashboard
* Role-based access control

### Security Features

* JWT authentication
* bcrypt password hashing
* Protected routes
* Role-based authorization

---

# Technologies Used

## Frontend

* Next.js
* React.js
* Tailwind CSS

## Backend

* Node.js
* Express.js

## Database

* MongoDB Atlas

## Accessibility APIs

* Web Speech API

## Artificial Intelligence

* Groq API
* Groq-hosted Large Language Models

## Security

* JWT Authentication
* bcrypt

---

# System Architecture

The EchoLearn platform follows a full-stack web application architecture.

* The frontend was developed using Next.js and React.js.
* The backend REST API was implemented using Node.js and Express.js.
* MongoDB Atlas was used as the cloud-based NoSQL database.
* Accessibility interaction was implemented using the Web Speech API.
* AI-powered quiz generation was integrated using the Groq API.

---

# Main Functionalities

## Student Features

* Access lessons
* Listen to lesson narration
* Use voice navigation
* Attempt AI-generated quizzes
* Track achievements and progress

## Parent Features

* Monitor student progress
* View quiz performance
* Track lesson completion

## Teacher Features

* Monitor student analytics
* Review student performance
* Track engagement statistics

---

# Accessibility Implementation

EchoLearn was designed using accessibility-first principles.

The system includes:

* Voice-guided interaction
* Speech-based navigation
* Dyslexia-friendly typography
* High-contrast accessibility support
* Structured keyboard navigation
* Simplified educational interfaces

These features help improve independent interaction for visually impaired and dyslexic learners.

---

# AI Quiz Generation

The platform integrates AI-powered adaptive quiz generation using the Groq API.

Educational content is processed according to:

* Grade level
* Subject category
* Lesson context

Natural Language Processing (NLP) techniques and prompt engineering are used to dynamically generate contextual quiz questions.

Generated quizzes are validated according to:

* Educational relevance
* Difficulty appropriateness
* Lesson context consistency

---

# Installation Guide

## Prerequisites

Make sure the following are installed:

* Node.js
* npm
* MongoDB Atlas account

---

# Clone Repository

```bash
git clone https://github.com/your-username/echolearn.git
cd echolearn
```

---

# Install Dependencies

```bash
npm install
```

---

# Configure Environment Variables

Create a `.env` file and configure:

```env
MONGODB_URI=your_mongodb_connection
JWT_SECRET=your_secret_key
GROQ_API_KEY=your_groq_api_key
```

---

# Run Development Server

```bash
npm run dev
```

The application will run on:

```bash
http://localhost:3000
```

---

# Testing

The project was tested using:

* Functional testing
* Accessibility testing
* Performance testing
* Security testing
* Scenario-based testing

Accessibility testing included:

* Keyboard navigation
* Screen-reader compatibility
* Voice interaction validation

---

# Future Improvements

Potential future improvements include:

* Sinhala language support
* Tamil language support
* Mobile applications
* Offline learning support
* Advanced gamification
* Real-world user testing
* Machine learning personalization

---

# Research Focus

EchoLearn focuses on:

* Inclusive education
* Accessibility-first design
* AI-powered adaptive learning
* Independent learning support
* Educational accessibility in developing countries

---

# Author

Vihanga Dewindi

Final Year Software Engineering Student
(Final Year Computing Individual Project)

---

# License

This project was developed for academic and research purposes.
