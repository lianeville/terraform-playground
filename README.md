# Playground - Image Uploading and Retrieval Site

Welcome to **Playground**, an image uploading and retrieval platform with dual backend servers written in Python and Go, allowing you to upload images and retrieve them through either backend separately.

## Table of Contents

-  [Technologies Used](#technologies-used)

-  [Features](#features)

-  [Project Structure](#project-structure)

-  [Installation and Setup](#installation-and-setup)

-  [Contributing](#contributing)

-  [License](#license)

## Technologies Used

-  **Frontend**: Vanilla HTML, CSS, JavaScript
-  **Backends**: Python & Go
-  **IaC**: Terraform (AWS as the cloud provider)

## Features

-  Upload images through either the Python or Go backend.

-  Retrieve images separately from either backend.

-  Deploy and manage infrastructure with Terraform.

## Project Structure

```plaintext

├── backend

│ ├── go # Go backend server

│ └── python # Python backend server

├── frontend # Frontend (HTML/CSS/JS)

└── infrastructure # Terraform configuration files

```

## Installation and Setup

### Prerequisites

-  **Python**: v3.12.4

-  **Go**: v1.23.0

-  **Terraform**: v1.9.5

-  **Node.js**: Required for running `http-server` and `concurrently`

---

### Steps to Install

1. Clone the repository:

```bash
git clone git@github.com:lianeville/terraform-playground.git
cd terraform-playground
```

2. Run startup script (Git Bash):

```bash
sh startup.sh
```

3. Follow the setup script, entering `AWS_ACCESS_KEY_ID`, `AWS_SECRET_ACCESS_KEY`, and `AWS_SECRET_ACCESS_KEY`.

4. Run the start script:

```bash
npm run start
```

## Contributing

If you'd like to contribute to Playground, please fork the repository and submit a pull request. All contributions are welcome!

## License

This project is licensed under the MIT License. See the `LICENSE` file for details.
