# Dummy Payments App

A simple dummy payments application that allows users to search for other users and send payments to them.

## Technologies Used

- **Backend:**
  - Node.js
  - Express.js
  - MongoDB

- **Frontend:**
  - React
  - Tailwind CSS

## Getting Started

### Prerequisites

- **Node.js** installed on your machine.
- **MongoDB** installed and running.
- **Update .env** mongodb url and jwt secret

### Installation

1. **Clone the repository:**

   ```bash
   git clone https://github.com/shivtriv12/PaymentsApp.git

2. **Install Backend Dependencies:**

   ```bash
   cd be
   npm install
   

3. **Install Frontend Dependencies:**

   ```bash
   cd ../fe
   npm install

4. **Start the Backend Server:**
  ```bash
   npm run start

5. **Start the Frontend Server:**
  ```bash
   npm run dev


### Frontend Routes

- **`/signup`**

- **`/signin`**

- **`/dashboard`**
  
  - **Description:**  
    your balance.
    other users.
    search users.

- **`/send`**
  
  - **Description:**  
    button to send money to user selected in dashboard page.
