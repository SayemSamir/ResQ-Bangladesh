# MASTER CONTEXT — RESQ BANGLADESH

> **Purpose:** This document contains the complete working context, architecture, progress, decisions, conventions, and next steps for the ResQ Bangladesh project.
> **Important:** Always read this file before modifying the project or suggesting major architectural changes.

---

# 1. PROJECT OVERVIEW

## Project Name

**ResQ Bangladesh – Smart Disaster & Emergency Response System**

## Tagline

**"Connecting People, Saving Lives During Emergencies."**

## Project Type

Academic Software Engineering / CSE Project

## Project Vision

ResQ Bangladesh is a future-oriented smart disaster and emergency response platform designed for Bangladesh.

The system aims to connect:

* Citizens
* Emergency victims
* Volunteers
* Rescue teams
* Hospitals
* Fire and emergency services
* Local authorities
* Disaster management organizations

through a centralized digital platform.

The goal is to reduce emergency response time, improve communication, provide location-based assistance, and help authorities manage disasters more efficiently.

---

# 2. PROBLEM STATEMENT

Bangladesh frequently faces different types of disasters and emergencies, including:

* Floods
* Cyclones
* Storms
* Fires
* Earthquakes
* Landslides
* Road accidents
* Building collapses
* Waterlogging
* Medical emergencies
* Other local emergencies

During emergencies, people may face difficulties such as:

* Slow emergency response
* Lack of reliable information
* Difficulty finding nearby shelters
* Difficulty contacting rescue teams
* Poor coordination between volunteers and authorities
* Lack of real-time disaster information
* Lack of centralized emergency reporting
* Difficulty identifying affected areas
* Limited location-based emergency services

ResQ Bangladesh is intended to address these problems through a centralized intelligent digital system.

---

# 3. CORE OBJECTIVES

The main objectives are:

1. Provide fast emergency reporting.
2. Provide an SOS/emergency request system.
3. Connect victims with nearby responders.
4. Provide disaster-related alerts and notifications.
5. Help users find nearby emergency shelters.
6. Provide location-based emergency services.
7. Help volunteers coordinate rescue activities.
8. Help authorities monitor disaster situations.
9. Maintain disaster reports and response records.
10. Use AI and GIS technologies where appropriate.
11. Provide a scalable and secure architecture.
12. Design the system specifically with Bangladesh's disaster context in mind.

---

# 4. TARGET USERS

The system may support the following user categories:

## 4.1 Citizen / General User

Can:

* Register and log in
* Report disasters
* Send SOS requests
* Share location
* Find nearby shelters
* Find hospitals
* View disaster alerts
* View emergency information
* Track emergency requests

## 4.2 Volunteer

Can:

* Register as a volunteer
* View nearby emergency requests
* Accept rescue/help requests
* Update response status
* Share location
* Coordinate with other responders

## 4.3 Rescue Team

Can:

* Receive emergency requests
* View affected locations
* Prioritize incidents
* Update rescue status
* Coordinate response operations

## 4.4 Hospital / Medical Service

Can:

* Receive medical emergency requests
* View relevant emergency information
* Update availability
* Provide emergency assistance

## 4.5 Administrator / Authority

Can:

* Manage users
* Manage emergency reports
* Monitor disasters
* Manage shelters
* Manage hospitals
* Manage volunteers
* Monitor rescue activities
* Send alerts
* View analytics and reports

---

# 5. PROJECT LOCATION

Current project directory:

```text
F:\ResQ-Bangladesh
```

Current backend directory:

```text
F:\ResQ-Bangladesh\backend
```

---

# 6. CURRENT PROJECT STRUCTURE

The project is being developed as a modular full-stack system.

Expected high-level structure:

```text
ResQ-Bangladesh/
│
├── MASTER_CONTEXT.md
├── README.md
│
├── backend/
│   ├── app/
│   │   ├── main.py
│   │   ├── ...
│   │   └── ...
│   │
│   ├── venv/
│   └── ...
│
├── frontend/
│   └── ...
│
├── database/
│   └── ...
│
├── docs/
│   └── ...
│
└── ...
```

> **Note:** Do not assume that every directory listed above already exists. Check the actual project structure before creating or modifying files.

---

# 7. TECHNOLOGY STACK

## Backend

Current backend technology:

* Python
* FastAPI
* Uvicorn

Potential backend technologies:

* SQLAlchemy
* Pydantic
* JWT authentication
* PostgreSQL / MySQL
* REST API

## Frontend

Planned technologies may include:

* HTML5
* CSS3
* JavaScript
* Modern responsive UI
* API integration

Frameworks should only be introduced if they provide a clear benefit and are consistent with the project's academic requirements.

## Database

Database technology is not yet fully finalized.

Possible options:

* MySQL
* PostgreSQL

Database decisions must be documented before implementation.

## Future Technologies

Potential future integrations:

* AI / Machine Learning
* GIS
* Interactive maps
* Real-time location tracking
* Emergency notifications
* SMS services
* Weather/disaster APIs
* Data analytics
* Predictive disaster analysis

---

# 8. BACKEND STATUS

## FastAPI Setup

The FastAPI backend has been successfully configured.

The development server is started using:

```bash
python -m uvicorn app.main:app --reload
```

Current local server:

```text
http://127.0.0.1:8000
```

---

# 9. CURRENTLY CONFIRMED API

The Users API has been tested successfully.

Confirmed response:

```json
{
  "message": "Users API is working"
}
```

This confirms that:

* FastAPI is running.
* Uvicorn is working.
* The backend application can be started successfully.
* The current Users API endpoint is responding.

---

# 10. COMPLETED WORK

Current confirmed progress:

* [x] Project concept defined
* [x] Project name finalized
* [x] Project objective defined
* [x] Initial project directory created
* [x] Backend directory created
* [x] Python environment configured
* [x] FastAPI installed/configured
* [x] Uvicorn configured
* [x] Backend application started successfully
* [x] Users API created/tested
* [x] Users API returned successful response
* [x] MASTER_CONTEXT.md created

---

# 11. CURRENT DEVELOPMENT PHASE

## Phase 1 — Backend Foundation

Current phase:

**Backend setup and API foundation**

The immediate goal is to establish a clean backend architecture before implementing advanced disaster-response features.

---

# 12. IMMEDIATE NEXT TASKS

The recommended development sequence is:

## Step 1 — Backend Architecture

Create a clean modular backend structure.

Possible structure:

```text
backend/
│
├── app/
│   ├── main.py
│   │
│   ├── core/
│   │   ├── config.py
│   │   └── security.py
│   │
│   ├── database/
│   │   ├── connection.py
│   │   └── ...
│   │
│   ├── models/
│   │   └── ...
│   │
│   ├── schemas/
│   │   └── ...
│   │
│   ├── routes/
│   │   └── ...
│   │
│   └── services/
│       └── ...
│
└── ...
```

Do not create all of these files blindly. Introduce them gradually as the project requires them.

---

# 13. DATABASE DEVELOPMENT

Next database-related tasks:

* Select database
* Configure database connection
* Create database schema
* Create User model
* Create roles
* Create authentication-related fields
* Create emergency report model
* Create SOS model
* Create shelter model
* Create hospital model
* Create volunteer model
* Create disaster/event model

Database design should remain normalized, maintainable, and scalable.

---

# 14. AUTHENTICATION SYSTEM

Planned authentication features:

* User registration
* User login
* Password hashing
* JWT-based authentication
* Role-based authorization
* Logout/token handling
* Protected API endpoints
* Input validation

Possible user roles:

```text
citizen
volunteer
responder
hospital
authority
admin
```

Security must be considered from the beginning.

---

# 15. CORE SYSTEM MODULES

The planned system may contain the following modules.

## 15.1 User Management

Features:

* Registration
* Login
* Profile
* Role management
* Account status

## 15.2 Emergency Reporting

Users can report emergencies with:

* Disaster type
* Description
* Location
* Severity
* Number of affected people
* Images/evidence where appropriate
* Timestamp
* Contact information
* Current status

Possible status:

```text
pending
verified
assigned
in_progress
resolved
cancelled
```

---

# 16. SOS SYSTEM

The SOS system should allow users to quickly request emergency assistance.

Potential information:

```text
User
Location
Emergency Type
Severity
Timestamp
Description
Contact Information
Status
Assigned Responder
```

The system should prioritize speed and simplicity for emergency situations.

---

# 17. DISASTER MANAGEMENT

Supported disaster categories may include:

* Flood
* Cyclone
* Fire
* Earthquake
* Landslide
* Storm
* Accident
* Medical Emergency
* Building Collapse
* Other

The architecture should allow additional disaster types to be added later.

---

# 18. SHELTER MANAGEMENT

The system should eventually provide:

* Shelter name
* Location
* Capacity
* Current occupancy
* Availability
* Facilities
* Contact information
* Accessibility information

Users should be able to find nearby available shelters.

---

# 19. HOSPITAL / MEDICAL SERVICES

Potential hospital information:

* Hospital name
* Location
* Emergency contact
* Available beds
* Emergency department availability
* Ambulance availability
* Medical services
* Contact information

---

# 20. VOLUNTEER MANAGEMENT

Potential features:

* Volunteer registration
* Verification
* Skills
* Availability
* Current location
* Emergency assignment
* Response status
* Activity history

---

# 21. GIS / LOCATION FEATURES

A major future component is location-based emergency response.

Potential GIS features:

* User location
* Emergency location
* Nearby shelters
* Nearby hospitals
* Nearby responders
* Disaster hotspots
* Affected-area visualization
* Route assistance
* Geographic filtering

The system should avoid exposing unnecessary sensitive location data.

---

# 22. AI / MACHINE LEARNING FEATURES

AI should be introduced only where it provides meaningful value.

Potential AI features:

## Emergency Priority Prediction

Analyze:

* Severity
* Number of victims
* Disaster type
* Location
* Available responders

and assign a priority level.

Possible priorities:

```text
LOW
MEDIUM
HIGH
CRITICAL
```

## Disaster Risk Prediction

Potentially analyze historical and environmental data to identify high-risk areas.

## Emergency Text Classification

Automatically classify user reports into categories such as:

```text
Fire
Flood
Medical
Accident
Earthquake
Cyclone
Other
```

## Intelligent Resource Allocation

Potentially recommend suitable responders, hospitals, or shelters.

AI recommendations must not replace human emergency authorities in critical decisions.

---

# 23. NOTIFICATION SYSTEM

Future notification options:

* In-app notifications
* Push notifications
* Email
* SMS
* Emergency alerts

Potential alert categories:

```text
Disaster Warning
Emergency Alert
Shelter Update
Rescue Assignment
System Notification
Safety Information
```

---

# 24. ADMIN DASHBOARD

The future admin dashboard should provide:

* Total users
* Active emergencies
* Critical emergencies
* Active volunteers
* Available shelters
* Hospital availability
* Disaster statistics
* Response-time analytics
* Map visualization
* Emergency status monitoring

---

# 25. SECURITY REQUIREMENTS

Security is a major requirement.

The system should implement:

* Password hashing
* JWT authentication
* Role-based access control
* Input validation
* Secure API design
* SQL injection prevention
* Proper error handling
* Rate limiting where appropriate
* Secure file uploads
* Environment variables for secrets
* No hardcoded passwords/API keys
* Minimal exposure of sensitive user information

Never commit:

```text
.env
passwords
secret keys
JWT secrets
database credentials
API keys
```

to a public Git repository.

---

# 26. API DESIGN PRINCIPLES

APIs should be:

* RESTful
* Modular
* Consistent
* Validated
* Secure
* Well documented

Use appropriate HTTP methods:

```text
GET
POST
PUT/PATCH
DELETE
```

Use meaningful status codes.

Examples:

```text
200 OK
201 Created
400 Bad Request
401 Unauthorized
403 Forbidden
404 Not Found
422 Validation Error
500 Internal Server Error
```

---

# 27. DEVELOPMENT RULES

When working on this project:

1. Do not randomly rewrite working code.
2. Check existing files before creating new files.
3. Preserve the existing architecture unless there is a clear reason to change it.
4. Make changes incrementally.
5. Test every major backend change.
6. Explain the purpose of each new file.
7. Explain where each code block should be placed.
8. Provide exact commands for Windows PowerShell when required.
9. Avoid unnecessary dependencies.
10. Keep the code beginner-friendly but professionally structured.
11. Maintain security best practices.
12. Keep the system scalable for future features.

---

# 28. WINDOWS DEVELOPMENT ENVIRONMENT

Current development environment:

```text
Operating System: Windows
Terminal: PowerShell
Project Drive: F:
```

Backend path:

```text
F:\ResQ-Bangladesh\backend
```

Backend server command:

```bash
python -m uvicorn app.main:app --reload
```

---

# 29. TESTING APPROACH

Every major feature should be tested before moving to the next feature.

Testing should include:

* API endpoint testing
* Validation testing
* Authentication testing
* Authorization testing
* Database testing
* Error handling
* Frontend/API integration
* Responsive UI testing
* Security testing

For backend API testing, use tools such as:

* FastAPI Swagger UI
* Postman
* Browser for GET endpoints where appropriate

FastAPI documentation is normally available at:

```text
http://127.0.0.1:8000/docs
```

if enabled by the application.

---

# 30. ERROR HANDLING

When an error occurs:

1. Read the complete error message.
2. Identify the file causing the error.
3. Identify the root cause.
4. Avoid changing unrelated files.
5. Apply the smallest appropriate fix.
6. Restart the server if necessary.
7. Test the affected endpoint again.
8. Record the final solution in this document if the issue is important.

---

# 31. CURRENT KNOWN ISSUES

At the current stage:

* No critical backend issue is confirmed.
* Users API is working.
* Database integration is still pending.
* Authentication is still pending.
* Frontend integration is still pending.
* Advanced disaster-response modules are still pending.

---

# 32. CURRENT PRIORITY

### Highest Priority

**Build a clean and reliable backend foundation.**

Recommended order:

```text
Backend Structure
        ↓
Database
        ↓
User Model
        ↓
Registration
        ↓
Login
        ↓
Authentication
        ↓
Role Management
        ↓
Emergency Reporting
        ↓
SOS
        ↓
Shelter
        ↓
Hospital
        ↓
Volunteer
        ↓
GIS
        ↓
Notifications
        ↓
AI Features
        ↓
Frontend Integration
        ↓
Admin Dashboard
        ↓
Testing & Deployment
```

---

# 33. PROJECT QUALITY GOALS

The final project should be:

* Scalable
* Secure
* Modular
* Maintainable
* Responsive
* User-friendly
* API-driven
* Location-aware
* AI-assisted
* Suitable for Bangladesh
* Academically presentable
* Easy to demonstrate

---

# 34. ACADEMIC PROJECT REQUIREMENTS

The project should be suitable for:

* Software Development Project
* CSE academic presentation
* Demonstration
* Documentation
* Viva
* Future research extension

Documentation should eventually include:

* Introduction
* Problem statement
* Objectives
* Literature review
* Existing system analysis
* Proposed system
* Requirements
* System architecture
* Database design
* ER diagram
* Use case diagram
* Activity diagrams
* Sequence diagrams
* Class diagram
* API documentation
* UI/UX design
* Testing
* Results
* Limitations
* Future work
* Conclusion

---

# 35. IMPORTANT PROJECT DECISIONS

Current confirmed decisions:

* Project name: ResQ Bangladesh
* System type: Smart Disaster & Emergency Response System
* Backend: Python + FastAPI
* Development environment: Windows
* Backend development is currently in progress.
* Users API has already been tested successfully.
* The project should be developed incrementally rather than building everything at once.

---

# 36. SESSION UPDATE LOG

## 2026-08-10

### Completed

* FastAPI backend successfully configured.
* Uvicorn development server successfully started.
* Users API successfully tested.
* Confirmed API response:

```json
{
  "message": "Users API is working"
}
```

### Current State

Backend foundation is working.

### Immediate Next Step

Proceed with database architecture and user management.

---

# 37. HOW TO CONTINUE IN A NEW CHAT

If this project is continued in a new ChatGPT conversation:

1. Upload this `MASTER_CONTEXT.md`.
2. Tell the assistant that this is the current project context.
3. Ask the assistant to read the context before making changes.
4. If possible, also provide the current relevant project files when debugging.

Recommended message:

> I am continuing my ResQ Bangladesh project.
> Read the attached MASTER_CONTEXT.md first and understand the current project state.
> Do not restart the project from scratch.
> Continue from the current progress and tell me the next step.

---

# 38. CONTEXT UPDATE RULE

This file must be updated whenever a significant development milestone is completed.

Update this file when:

* A new module is completed.
* Database structure changes.
* New APIs are created.
* Authentication is implemented.
* A major bug is fixed.
* Architecture changes.
* New technology is introduced.
* A feature is removed or replaced.
* The development phase changes.

Every update should contain:

```text
Date
Completed Work
Current Status
Known Issues
Next Task
Important Decisions
```

---

# 39. CURRENT MASTER STATUS

```text
Project Planning       : IN PROGRESS
Backend Setup          : COMPLETED
FastAPI Setup          : COMPLETED
Uvicorn Setup          : COMPLETED
Users API              : WORKING
Database               : PENDING
Authentication         : PENDING
Emergency Reporting    : PENDING
SOS System             : PENDING
Volunteer System       : PENDING
Shelter System         : PENDING
Hospital System        : PENDING
GIS                    : PENDING
Notifications          : PENDING
AI Features            : PENDING
Frontend               : PENDING
Admin Dashboard        : PENDING
Testing                : PENDING
Deployment             : PENDING
```

---

# 40. FINAL DEVELOPMENT PRINCIPLE

**Build ResQ Bangladesh step by step.**

Do not attempt to implement every feature simultaneously.

First establish a reliable foundation:

```text
Architecture
→ Database
→ Authentication
→ Core APIs
→ Emergency System
→ Location Services
→ Notifications
→ AI/GIS
→ Frontend
→ Admin Dashboard
→ Testing
→ Deployment
```

Every new feature should integrate cleanly with the existing architecture.

**The primary objective is not just to make the system work, but to build a professional, secure, maintainable, scalable, and demonstrable disaster-response platform.**
