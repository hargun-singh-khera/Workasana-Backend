# Workasana Backend

Workasana Backend is the REST API service for the Workasana project management app. It handles user authentication, project management, task tracking, team management, tags, and reporting data for the Workasana frontend.

Built with Node.js, Express, MongoDB, Mongoose, and JWT-based authentication.

---

## Demo Link

Backend API: `https://workasana-backend-wheat.vercel.app`

Frontend Repository: `https://github.com/hargun-singh-khera/Workasana.git`

---

## Authentication

Most application routes are protected with JWT authentication. After login, the client should send the returned token in the request headers:

```http
Authorization: <token>
```

---

## Quick Start

```bash
git clone https://github.com/hargun-singh-khera/Workasana-Backend.git
cd Workasana-Backend
npm install
npm run dev
```

---

## Environment Variables

Create a `.env` file in the project root and add the following values:

```env
PORT=5000
MONGODB_URI=your_mongodb_connection_string
```

Do not commit real database credentials or production secrets to GitHub.

---

## Technologies

- Node.js
- Express.js
- MongoDB
- Mongoose
- JSON Web Token
- CORS

---

## Features

**Authentication**
- User signup and login
- JWT token generation on successful login
- Protected routes using token verification
- Authenticated user email lookup

**Users**
- Fetch registered users
- Use users as task owners

**Projects**
- Create projects
- Fetch all projects
- Fetch a single project by ID
- Delete projects
- Track project status as `In Progress` or `Completed`

**Tasks**
- Create tasks with project, team, owners, tags, due date, priority, and status
- Fetch all tasks
- Fetch task details with populated project, team, owner, and tag data
- Fetch tasks by project
- Update task details and status
- Delete tasks

**Teams**
- Create teams with members
- Fetch all teams
- Add members to an existing team
- Delete teams

**Tags**
- Create tags
- Fetch all tags
- Delete tags

**Reports**
- Get completed and pending task counts from the last week
- Get total pending and completed work duration
- Get closed-task summaries grouped by team, owner, and project

---

## API Reference

Base URL:

```bash
https://workasana-backend-wheat.vercel.app
```

For local development:

```bash
http://localhost:<PORT>
```

### Health Check

#### **GET /**

Check whether the API is running.

Sample Response:

```json
{
  "message": "HELLO"
}
```

---

## Auth Routes

### **POST /auth/signup**

Register a new user.

Sample Request:

```json
{
  "name": "Hargun Singh",
  "email": "hargun@example.com",
  "password": "password123"
}
```

Sample Response:

```json
{
  "message": "User registered successfully",
  "user": {
    "_id": "user_id",
    "name": "Hargun Singh",
    "email": "hargun@example.com"
  }
}
```

### **POST /auth/login**

Log in a user and return a JWT token.

Sample Request:

```json
{
  "email": "hargun@example.com",
  "password": "password123"
}
```

Sample Response:

```json
{
  "message": "User logged in successfully",
  "token": "jwt_token_here"
}
```

### **GET /auth/me**

Fetch the authenticated user's email.

Protected: Yes

Sample Response:

```json
{
  "email": "hargun@example.com"
}
```

---

## User Routes

### **GET /users**

Fetch all users.

Protected: Yes

Sample Response:

```json
{
  "message": "Users fetched successfully",
  "users": []
}
```

---

## Project Routes

### **GET /projects**

Fetch all projects.

Protected: Yes

Sample Response:

```json
{
  "message": "Projects fetched successfully",
  "projects": []
}
```

### **GET /project/:projectId**

Fetch details for a single project.

Protected: Yes

Sample Response:

```json
{
  "message": "Project fetched successfully",
  "project": {
    "_id": "project_id",
    "name": "Website Redesign",
    "description": "Update the marketing website",
    "status": "In Progress"
  }
}
```

### **POST /projects**

Create a new project.

Protected: Yes

Sample Request:

```json
{
  "name": "Website Redesign",
  "description": "Update the marketing website",
  "status": "In Progress"
}
```

Sample Response:

```json
{
  "message": "Project created successfully",
  "project": {
    "_id": "project_id",
    "name": "Website Redesign",
    "description": "Update the marketing website",
    "status": "In Progress"
  }
}
```

### **DELETE /project/:projectId**

Delete a project.

Protected: Yes

Sample Response:

```json
{
  "message": "Project deleted successfully"
}
```

---

## Task Routes

### **GET /tasks**

Fetch all tasks.

Protected: Yes

Sample Response:

```json
{
  "tasks": []
}
```

### **GET /task/:id**

Fetch details for a single task.

Protected: Yes

Sample Response:

```json
{
  "task": {
    "_id": "task_id",
    "name": "Create dashboard layout",
    "status": "To Do",
    "priority": "High"
  }
}
```

### **GET /tasks/project/:projectId**

Fetch all tasks for a project.

Protected: Yes

Sample Response:

```json
{
  "message": "Tasks fetched successfully",
  "tasks": []
}
```

### **POST /tasks**

Create a new task.

Protected: Yes

Sample Request:

```json
{
  "name": "Create dashboard layout",
  "project": "project_id",
  "team": "team_id",
  "owners": ["user_id"],
  "tags": ["tag_id"],
  "dueDate": "2026-06-15",
  "timeToComplete": 5,
  "priority": "High",
  "status": "To Do"
}
```

Sample Response:

```json
{
  "message": "Task created successfully",
  "task": {
    "_id": "task_id",
    "name": "Create dashboard layout"
  }
}
```

### **POST /task/:id**

Update a task.

Protected: Yes

Sample Request:

```json
{
  "status": "Completed"
}
```

Sample Response:

```json
{
  "message": "Task updated successfully",
  "task": {
    "_id": "task_id",
    "status": "Completed"
  }
}
```

### **DELETE /task/:id**

Delete a task.

Protected: Yes

Sample Response:

```json
{
  "message": "Task deleted successfully"
}
```

---

## Team Routes

### **GET /teams**

Fetch all teams.

Protected: Yes

Sample Response:

```json
{
  "message": "Teams fetched successfully",
  "teams": []
}
```

### **POST /teams**

Create a new team.

Protected: Yes

Sample Request:

```json
{
  "name": "Engineering",
  "description": "Product engineering team",
  "members": [
    {
      "name": "Hargun Singh"
    }
  ]
}
```

Sample Response:

```json
{
  "message": "Team created successfully",
  "team": {
    "_id": "team_id",
    "name": "Engineering"
  }
}
```

### **POST /teams/:teamId/member**

Add a member to an existing team.

Sample Request:

```json
{
  "name": "New Member"
}
```

Sample Response:

```json
{
  "message": "Member added to team successfully",
  "team": {
    "_id": "team_id",
    "name": "Engineering"
  }
}
```

### **DELETE /team/:teamId**

Delete a team.

Protected: Yes

Sample Response:

```json
{
  "message": "Team deleted successfully"
}
```

---

## Tag Routes

### **GET /tags**

Fetch all tags.

Protected: Yes

Sample Response:

```json
{
  "message": "Tags fetched successfully",
  "tags": []
}
```

### **POST /tags**

Create a new tag.

Protected: Yes

Sample Request:

```json
{
  "name": "Frontend"
}
```

Sample Response:

```json
{
  "message": "Tag created successfully",
  "tag": {
    "_id": "tag_id",
    "name": "Frontend"
  }
}
```

### **DELETE /tag/:tagId**

Delete a tag.

Protected: Yes

Sample Response:

```json
{
  "message": "Tag deleted successfully"
}
```

---

## Report Routes

### **GET /report/last-week**

Get completed and pending task counts from the last seven days.

Sample Response:

```json
{
  "message": "Tasks completed last week fetched successfully",
  "tasks": {
    "completedTasks": 4,
    "pendingTasks": 8
  }
}
```

### **GET /report/pending**

Get total estimated days of pending and completed work.

Sample Response:

```json
{
  "message": "Total days of pending work fetched successfully",
  "total": {
    "totalPendingDays": 14,
    "totalCompletedDays": 22
  }
}
```

### **GET /report/closed-tasks**

Get completed task summaries grouped by team, owner, and project.

Sample Response:

```json
{
  "message": "Closed tasks report fetched successfully",
  "tasks": [
    {
      "closedByTeam": [],
      "closedByOwners": [],
      "closedByProject": []
    }
  ]
}
```

---

## Data Models

**User**
- `name`
- `email`
- `password`

**Project**
- `name`
- `description`
- `status`: `In Progress`, `Completed`

**Task**
- `name`
- `project`
- `team`
- `owners`
- `tags`
- `dueDate`
- `timeToComplete`
- `priority`: `Low`, `Medium`, `High`
- `status`: `To Do`, `In Progress`, `Completed`, `Blocked`

**Team**
- `name`
- `description`
- `members`

**Tag**
- `name`

---

## Contact

For bugs, improvements, or feature requests, please reach out to hargunsinghkhera8@gmail.com.
