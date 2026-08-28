# Task Management Application

A simple full-stack task management application that allows users to create, view, update, and delete tasks. Tasks are persisted using a database and the application includes input validation and error handling.


---

## Features

The application currently supports:

* Create a new task
* View a list of all tasks
* View an individual task
* Update an existing task
* Delete a task
* Persist tasks using a database
* Validate user input
* Handle common application and API errors
* Responsive user interface

### Task Fields

Each task contains:

* **Title** – The name of the task
* **Description** – Additional information about the task
* **Status** – The current state of the task
* **Due Date** – The date by which the task should be completed
* **Created Date** – The date the task was created

---

## Tech Stack

### Frontend

* Nextjs,
* TypeScript
* Tailwind
* Shadcn

### Backend

* Node.js
* Express 
* TypeScript
* Zod

### Database

* PostgreSQL 
* Prisma 

### Development Tools

* Git & GitHub

---

## Data Model

The core entity in the application is a `Task`.

```text
Task
├── id
├── title
├── description
├── status
├── dueDate
├── createdAt
└── updatedAt
```

### Task Fields

| Field         | Type               | Required | Description                    |
| ------------- | ------------------ | -------- | ------------------------------ |
| `id`          | [String/UUID/etc.] | Yes      | Unique identifier for the task |
| `title`       | String             | Yes      | Task title                     |
| `description` | String             | No       | Description of the task        |
| `status`      | [Enum/String]      | Yes      | Current task status            |
| `dueDate`     | Date               | Yes      | Task deadline                  |
| `createdAt`   | Date               | Yes      | Date the task was created      |
| `updatedAt`   | Date               | No       | Date the task was last updated |



### Task Statuses

The application supports the following task statuses:

* `[TODO]`
* `[IN_PROGRESS]`
* `[COMPLETED]`


---

## API Endpoints

The backend exposes endpoints for the main task management operations.

| Method   | Endpoint         | Description            |
| -------- | ---------------- | ---------------------- |
| `POST`   | `/api/tasks`     | Create a new task      |
| `GET`    | `/api/tasks`     | Retrieve all tasks     |
| `PATCH`  | `/api/tasks/:id` | Update a task          |
| `DELETE` | `/api/tasks/:id` | Delete a task          |



### Create Task

**Request**

```http
POST /api/tasks
Content-Type: application/json
```

```json
{
  "title": "Complete assessment",
  "description": "Finish the task management application",
  "status": "TODO",
  "dueDate": "2026-08-30"
}
```

**Response**

```json
{
  "id": "example-id",
  "title": "Complete assessment",
  "description": "Finish the task management application",
  "status": "TODO",
  "dueDate": "2026-08-30",
  "createdAt": "2026-08-28T10:00:00.000Z"
}
```

---

## Validation

The application validates task data before creating or updating tasks.

Examples of validation include:

* Title must not be empty
* Title must meet the application's maximum length
* Description must meet the application's allowed length
* Status must be one of the supported statuses
* Due date must be a valid date
* Required fields must be provided

Validation is performed on the **server side** so that invalid requests cannot bypass validation by directly calling the API.

[Add details about your specific validation library/implementation here.]

---

## Error Handling

The application handles common errors and returns appropriate responses.

Examples include:

| Status Code | Meaning                               |
| ----------- | ------------------------------------- |
| `200`       | Request completed successfully        |
| `201`       | Resource successfully created         |
| `400`       | Invalid request or validation failure |
| `404`       | Requested task was not found          |
| `500`       | Unexpected server error               |

The API returns meaningful error messages to help the client understand why a request failed.

[Describe your actual error response format here.]

Example:

```json
{
  "success": false,
  "message": "Task not found"
}
```

---

## Database & Persistence

Tasks are stored in `[DATABASE NAME]`.

The application uses Prisma ORM to communicate with the database.

Task data is persisted rather than being stored only in application memory. This means tasks remain available after the application is restarted.

### Database Setup



For example:

Start by running npm install on the backend folder by changing from the root directory to the backend directory and running `npm install`. 


then run `npx prisma generate`. This will instantiate the prisma model locally.

Then run `npx prisma db push` to push your changes to the database



---

## Environment Variables

Create a `.env` file in the appropriate directory and provide the required environment variables.

```env
DATABASE_URL="your-database-connection-string" for the backend 

NEXT_PUBLIC_API_URL="your-api-url" for the frontend 
```


---

## Prerequisites

Before running the application, make sure you have the following installed:

* Node.js 22.13.0
* `[npm/pnpm/yarn]`
* `[Database instance]`
* Git

---

## Installation

### 1. Clone the repository

```bash
git clone [YOUR_REPOSITORY_URL]
```

### 2. Navigate into the project

```bash
cd [PROJECT_DIRECTORY]
```

### 3. Install dependencies

```bash
[npm install / pnpm install / yarn install]
```

### 4. Configure environment variables

Create a `.env` file:

```bash
cp .env.example .env
```

Then update the values with your configuration.

### 5. Set up the database

```bash
[YOUR DATABASE SETUP COMMAND]
```

### 6. Start the application

```bash
[YOUR DEVELOPMENT COMMAND]
```

The application should now be available at:

```text
[YOUR LOCAL URL]
```

---

## Usage

Once the application is running:

1. Open the application in your browser.
2. Create a new task using the task creation form.
3. Provide the required task information.
4. Submit the form to create the task.
5. View the created task in the task list.
6. Edit the task when changes are required.
7. Delete the task when it is no longer needed.

The interface also provides appropriate feedback for loading, successful operations, validation errors, and failed requests where applicable.

---

## Technical Decisions

### TypeScript

TypeScript was used to provide static typing throughout the application. This helps identify potential errors during development and makes the structure of data such as tasks and API responses easier to understand.

### Database

PostgreSQL was selected because the application's data has a structured schema and PostgreSQL provides reliable relational data storage.

### ORM


Prisma was used as the ORM because it provides a type-safe interface for interacting with the database and simplifies database schema management and queries. It is also easy to set up and configure, and I find their documentation very rich and easy to understand. 


### API Architecture

The application uses a REST-style API to expose task management operations.

Each HTTP method represents a different operation:

* `POST` creates a task
* `GET` retrieves tasks
* `PATCH` updates an existing task
* `DELETE` removes a task

### Validation

Validation is performed before data is written to the database. This ensures that invalid data does not enter the system and provides predictable API behaviour.

### Separation of Responsibilities

The backend separates routes, controllers, services, and database access. Routes define the API endpoints, controllers handle HTTP requests and responses, services contain application logic, and the database layer handles persistence.

---

## Assumptions

The following assumptions were made while implementing the application:

1. The assessment does not require user authentication, so the application does not associate tasks with individual user accounts.
2. The application is designed around the task management functionality described in the assessment brief.


---

## Testing

### Manual Testing

The application was manually tested against the main task management flows:

* Creating a task
* Viewing the task list
* Updating a task
* Deleting a task
* Submitting invalid task data
* Attempting to access a task that does not exist


---


### Assessment Requirements

* [x] Create a task
* [x] View a list of tasks
* [x] View an individual task
* [x] Update a task
* [x] Delete a task
* [x] Persist tasks using a database
* [x] Handle invalid input
* [x] Handle common errors



---

## Future Improvements

If this application were to be developed further, potential improvements could include:

* User authentication and task ownership
* Pagination for large task lists
* More advanced filtering and sorting
* Automated unit and integration tests
* Improved accessibility
* Task search
* Notifications and reminders
* Production deployment and CI/CD
* More advanced task management features

These features were intentionally kept outside the core scope of this assessment.

---


## Author

**Damilola Hassan**


