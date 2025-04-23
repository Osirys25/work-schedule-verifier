# Work Schedule Verifier

## Project description
This project is designed to showcase my skills in developing REST APIs. Below you'll find a brief overview of the task requirements and instructions.

## Project Overview

The goal of this project is to create a REST API that provides two main services:

1. **Checking the 11-hour rest rule for a submitted schedule**: This service will verify if the submitted work schedule complies with the 11-hour rest rule.
2. **Returning a list of recent schedule verifications along with a list of errors**: This service will provide a history of recent schedule verifications and any associated errors.

## Requirements

- Docker
- docker-compose

## Getting Started 
To get started with the project, follow these steps:
1. Clone the repository:
   ```bash 
    git clone git@github.com:Osirys25/work-schedule-verifier.git 
   ```
2. Navigate to the project directory:
    ```bash 
    cd work-schedule-verifier
   ```

## Running the Project
To run the project, use the following command:
```bash 
    docker-compose up
```

# Useful information:
## Employee Shift Validation Endpoint
### Endpoint: /check/
This endpoint validates the provided employee shifts and returns any errors found.

## Request

**Method:** `POST`  
**URL:** `/check/`  
**Content-Type:** `application/json`

### Request Body

The request body should be a JSON object containing two properties: `employees` and `employeeShifts`.

#### employees

An array of employee objects. Each employee object should have the following properties:

- `id`: A unique identifier for the employee (string).
- `first_name`: The first name of the employee (string).
- `last_name`: The last name of the employee (string).
- `flexible_hours`: Indicates if the employee has flexible working hours (boolean).

#### employeeShifts

An array of employee shift objects. Each shift object should have the following properties:

- `employee_id`: The unique identifier of the employee (string).
- `start_time`: The start time of the shift (string, ISO 8601 format).
- `end_time`: The end time of the shift (string, ISO 8601 format).

Example body:
```json
{
   "employees": [
      {
         "id": "123",
         "first_name": "Jan",
         "last_name": "Kowalski",
         "flexible_hours": false
      },
      {
         "id": "124",
         "first_name": "Anna",
         "last_name": "Nowak",
         "flexible_hours": true
      }
   ],
   "employeeShifts": [
      {
         "employee_id": "123",
         "start_time": "2025-04-23T08:00:00Z",
         "end_time": "2025-04-23T16:00:00Z"
      },
      {
         "employee_id": "123",
         "start_time": "2025-04-24T06:00:00Z",
         "end_time": "2025-04-24T14:00:00Z"
      },
      {
         "employee_id": "124",
         "start_time": "2025-04-23T10:00:00Z",
         "end_time": "2025-04-23T18:00:00Z"
      }
   ]
}
```

### Responses

#### 200 OK

The request was successful, and the response contains the validation result.

Example response:

```json
{
  "is_schedule_valid": false,
  "violations": [
    {
      "employee_name": "Tomasz Lewandowski",
      "date": "2025-04-24",
      "details": "The break between shifts was only 9.00 hours."
    },
    {
      "employee_name": "Katarzyna Szymańska",
      "date": "2025-04-24",
      "details": "The break between shifts was only 8.00 hours."
    }
  ]
}
