# **Automatic Identity Card Generator**

## **Project Overview**

The **Automatic Identity Card Generator** is a web application built using **Express.js and PHP** and **MySql Database** that automates the creation of personalized identity cards. By inputting personal details like name, photo, and designation, the application generates an identity card in multiple formats, such as PDF or image (PNG/JPEG). This tool is ideal for organizations, schools, and companies that need to create bulk ID cards efficiently.

![alt text](./uploads/work_preview.jpg)

<!-- ![alt text](https://github.com/[username]/[reponame]/blob/[branch]/image.jpg?raw=true) -->

## **Features**

- **User-friendly Interface:** A simple web form to input personal details like name, photo, designation, and department.
- **Dynamic Identity Card Generation:** Automatically generates identity cards with custom data.
- **Download Options:** Identity cards can be downloaded in multiple formats, including PDF and image formats (PNG/JPEG).
- **Template-Based Design:** Predefined templates for identity cards to maintain consistency.
- **Fast and Efficient:** Generates identity cards instantly after entering the required information.

## **Technologies Used**

- **Node.js:** JavaScript runtime used for the server-side code.
- **Express.js:** Web framework for building the REST API and serving web pages.
- **ejs:** Template engine to render HTML pages dynamically.
- **jsPDF**: For generating PDF files of the identity cards.
- **Mulder**: For handling file uploads (profile pictures).

## **Installation**

### 1. Clone the repository:

```bash
git clone https://github.com/yourusername/automatic-id-card-genarator-app.git
cd automatic-identity-card-generator
```

### 2. Install the necessary dependencies:

```bash
npm install
```

Ensure you have **Node.js** installed on your machine. You can check if Node.js is installed by running:

```bash
node -v
```

### 3. Run the server:

```bash
npm start
```

The application will start running on **http://localhost:3000**.

## **Usage**

1. **Visit the Web Application:** Once the server is up and running, open your browser and go to **http://localhost:3000**.
2. **Fill in the Details:**
   - Enter the necessary details like Name, Designation, Department, etc.
   - Upload a clear profile photo (PNG/JPEG).
3. **Generate Identity Card:**

   - After filling the form, click the **Generate** button to automatically create the identity card.
   - You will be presented with the generated card on the page.

4. **Download Options:**
   - You can choose to download the identity card in **PDF** format by clicking the respective download buttons.

## **Scripts**

- **`npm start`**: Starts the Express server.
- **`npm run dev`**: Starts the server with **Nodemon** for automatic restarts during development.

## **Contributing**

Contributions to the **Automatic Identity Card Generator** project are welcome! Please follow these steps:

1. Fork the repository.
2. Create a new branch for your changes (`git checkout -b feature-name`).
3. Commit your changes (`git commit -m 'Add new feature'`).
4. Push to the branch (`git push origin feature-name`).
5. Open a pull request.

## **License**

This project is licensed under the MIT License - see the [LICENSE](./LICENSE) file for details.

## **Acknowledgements**

- **Express.js**: The core framework used for routing and server setup.
- **jsPDF**: Library used to generate PDF identity cards.
- **Sharp/Pillow**: Libraries used for image processing and generating PNG/JPEG files of identity cards.
- **Multer**: Middleware used for handling file uploads.
