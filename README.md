# PDFX - PDF Merger

A simple and fast web tool to **merge multiple PDF files** into one single document.

Built with ❤️ using Node.js and Express.

## ✨ Features

- Merge multiple PDF files
- Dark / Light mode toggle (with persistence)
- Client-side file validation (max 50MB per file)
- Clear error messages
- Clean and modern interface
  
## 🛠 Tech Stack

- **Backend**: Node.js + Express.js
- **Frontend**: HTML, CSS, JavaScript
- **PDF Library**: pdf-merger-js
- **File Upload**: Multer

## 🚀 How to Run Locally

1. Clone the repository:
   ```bash
   git clone https://github.com/Mraga-Soni/PDF-Merger.git
   cd PDF-Merger

2. Install dependencies:
   ```bash
   npm install
3. Start the server:
   ```bash
   node server.js
4. Or with nodemon (recommended for development):
   ```bash
   npx nodemon server.js
5. Open your browser and go to: http://localhost:3000

   ## 📁 Project Structure:
   ```text
   PDF-Merger/
   ├── public/          # Static files (CSS + JS)
   ├── templates/       # HTML files
   ├── uploads/         # Temporary files (ignored)
   ├── server.js        # Main server
   ├── merge.js         # PDF merging logic
   ├── .gitignore
   ├── package.json
   └── README.md

## 📌 Notes
- You need to upload at least 2 PDF files to merge.
- Temporary files are automatically cleaned up after merging.
  
##    
Made with ❤️ by Mraga Soni
