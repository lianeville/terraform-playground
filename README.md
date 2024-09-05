# Playground - Image Uploading and Retrieval Site

Welcome to **Playground**, an image uploading and retrieval platform with dual backend servers written in Python and Go, allowing you to upload images and retrieve them through either backend separately. This project is designed to demonstrate backend and frontend interactions while managing infrastructure using Terraform.

## Table of Contents

-  [Technologies Used](#technologies-used)
-  [Features](#features)
-  [Project Structure](#project-structure)
-  [Installation and Setup](#installation-and-setup)
-  [Environment Variables](#environment-variables)
-  [Running the App Locally](#running-the-app-locally)
-  [Infrastructure as Code (IaC)](#infrastructure-as-code-iac)
-  [Contributing](#contributing)
-  [License](#license)

---

## Technologies Used

-  **Frontend**: Vanilla HTML, CSS, JavaScript
-  **Backends**:
   -  Python (Flask-based API)
   -  Go (Gin framework)
-  **IaC**: Terraform (AWS as the cloud provider)

## Features

-  Upload images through either the Python or Go backend.
-  Retrieve images separately from either backend.
-  Deploy and manage infrastructure with Terraform.

## Project Structure

```plaintext
.
├── backend
│   ├── go               # Go backend server (Gin framework)
│   └── python           # Python backend server (Flask)
├── frontend             # Frontend (HTML/CSS/JS)
└── infrastructure       # Terraform configuration files
```

## Installation and Setup

### Prerequisites

-  **Python**: v3.12.4
-  **Go**: v1.23.0
-  **Terraform**: v1.9.5
-  **Node.js**: Required for running `http-server` and `concurrently`

### Steps to Install

1. Clone the repository:

   ```bash
   git clone git@github.com:lianeville/terraform-practice.git
   cd terraform-practice
   ```

2. Install NPM packages:

   ```bash
   npm install i
   ```

3. Install the necessary Python dependencies:

   ```bash
   cd backend/python
   pip install -r requirements.txt
   ```

4. Install the Go dependencies:

   ```bash
   cd backend/go
   go mod download
   ```

## Environment Variables

The app requires some environment variables to function properly. These include:

-  `AWS_ACCESS_KEY_ID`
-  `AWS_SECRET_ACCESS_KEY`
-  `DIGITALOCEAN_TOKEN`

### Setting Environment Variables

You can set environment variables manually in your terminal, or consider using a `.env` file for consistency across different terminal types.

#### Example `.env` File

Create a file named `.env` in the root directory of your project with the following content:

```plaintext
AWS_ACCESS_KEY_ID=your_aws_access_key
AWS_SECRET_ACCESS_KEY=your_aws_secret_key
DIGITALOCEAN_TOKEN=your_digitalocean_token
```

You can then use a tool like `direnv` or `dotenv` to load these variables automatically in your shell.

# Running the App Locally

After setting up the environment variables, you can run the app with the following command:

```bash
concurrently "cd backend/go && air" "cd backend/python && nodemon app.py" "cd frontend && http-server -p 5050"
```
