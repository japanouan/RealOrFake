# 📰 RealOrFake --- Fake News Detection Training Platform

RealOrFake is a full-stack web application that helps users **practice
identifying fake news vs real news** through daily interactive
challenges.\
The platform integrates a **deep learning fake-news detection model**
into a real application to simulate real-world AI usage.

This project was developed as part of the **Pattern Recognition
course**, focusing on **training an AI model and integrating it into a
production-like web system.**

------------------------------------------------------------------------

## 🎓 Academic Project Context

This project was built by a team of **4 Computer Engineering students**
under the theme:

> Real-world AI engagement --- training an AI model and deploying it in
> an actual application.

Goals: - Train an AI model from real datasets - Integrate AI into a
full-stack application - Deliver a usable real-world product

------------------------------------------------------------------------

## 🔗 Repository

https://github.com/ohmpy888/Project

------------------------------------------------------------------------

## 🎯 Problem Statement

Fake news spreads rapidly on social media, and many users lack the
skills to critically evaluate information.

RealOrFake aims to: - Train users to think critically when reading news\
- Simulate how AI detects fake news\
- Teach clue-based reasoning used in NLP models\
- Turn media literacy into a daily learning habit

------------------------------------------------------------------------

## ✨ Core Features

### 👤 User Role

-   Daily Challenge
      Each day, the system randomly selects a set of news articles from the dataset to generate the daily challenge.
      (Articles may repeat across different days.)
-   Interactive Clue Selection
      Users highlight words or phrases that influenced their decision.
-   Decision Making
      Users classify each article as Real or Fake.
-   Learning Feedback
      The system compares the user’s reasoning with AI-generated cluewords and explains common patterns found in fake vs real news.

### 🧑‍💻 Admin Role

-   Dataset Upload (CSV)
      Admin uploads news article datasets that will be used as the source pool for generating daily challenges.
-   Automatic AI Processing Pipeline
      - After upload, the system automatically:
      - Classifies articles (Real/Fake)
      - Extracts AI-generated cluewords
      - Stores processed articles for future daily challenge generation

------------------------------------------------------------------------

## 🧠 AI Model

Model Architecture: - CNN - BiLSTM - Attention Mechanism

Datasets: - LIAR Dataset - WELFake Dataset

Model outputs: - Real/Fake label - Important cluewords

------------------------------------------------------------------------

## 🏗 Tech Stack

  Layer      Technology
  ---------- ----------------------------
  Frontend   React
  Backend    FastAPI
  Database   Firebase Realtime Database
  AI Model   CNN + BiLSTM + Attention

------------------------------------------------------------------------

## 🔐 Authentication & Roles

-   User → daily challenge & feedback\
-   Admin → dataset upload & processing

------------------------------------------------------------------------

## ⚙️ Installation

### Prerequisites

-   Python 3.10+
-   Node.js 18+
-   Firebase project

### 1️⃣ Clone repository

``` bash
git clone https://github.com/ohmpy888/Project.git
cd Project
```

### 2️⃣ Backend Setup

``` bash
cd Backend
pip install -r requirements.txt
uvicorn app.main:app --reload
```

### 3️⃣ Frontend Setup

``` bash
cd Frontend
npm install
npm run dev
```
