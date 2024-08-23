# Work in progress

# How to Run the Project

This document provides step-by-step instructions on how to set up and run the project locally.

## Prerequisites

Before you begin, ensure you have the following installed on your machine:

- **[Node.js](https://nodejs.org/):** version v20.10.0 or later
- **[npm](https://www.npmjs.com/) or [Yarn](https://yarnpkg.com/):** version 3.2.1 or later
- **[Make](https://www.gnu.org/software/make/manual/make.html):** version GNU Make 4.3  or later

## Installation

1. **Clone the repository:**

    ```bash
    git clone https://github.com/quinta-serie/sprint-review.git
    ```

2. **Navigate to the project directory:**

    ```bash
    cd sprint-review
    ```

3. **Install dependencies:**

    ```bash
    yarn install
    ```

## Configuration

2. **Navigate to the client path:**

    ```bash
    cd packages/client
    ```

1. **Create a `.env` file:**

    Copy the `.env.example` file to `.env`:

    ```bash
    cp .env.example .env
    ```

    Update the environment variables in the `.env` file as needed.

    > Note: to create your Firebase environment variables, consult the [documentation](how-to-contribute.md).

## Running the Project

1. **Start the development server:**

    ```bash
    make run client start
    ```

    The project should now be running at `http://localhost:3000`.


## Troubleshooting

- **Common Issue #1:**

  **Description:** Brief explanation of the issue.

  **Solution:** Steps to resolve the issue.

- **Common Issue #2:**

  **Description:** Brief explanation of the issue.

  **Solution:** Steps to resolve the issue.

## Additional Resources

- [Contribution Guide](https://link-to-contributing)