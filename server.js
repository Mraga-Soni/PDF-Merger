const express = require('express')
const path = require('path')
const fs = require('fs')
const app = express()
const multer = require('multer')
const { mergePdfs } = require('./merge')

// Create uploads folder safely
const uploadPath = path.join(__dirname, 'uploads')
if (!fs.existsSync(uploadPath)) {
  fs.mkdirSync(uploadPath)
}

// Multer storage and validation
const upload = multer({
  dest: uploadPath,
  limits: { fileSize: 50 * 1024 * 1024 }, // 50MB
  fileFilter: (req, file, cb) => {
    if (file.mimetype !== 'application/pdf') {
      return cb(new Error('Only PDF files are allowed'))
    }
    cb(null, true)
  }
})

// Middleware & Static files
app.use('/static', express.static('public'))

// 1. Home route
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'templates/index.html'))
})

// 2. Merge route
app.post('/merge', (req, res) => {
  upload.array('pdfs')(req, res, async (err) => {

    // Handle multer errors
    if (err) {
      if (err instanceof multer.MulterError) {
        if (err.code === 'LIMIT_FILE_SIZE') {
          return res.redirect(`/?error=${encodeURIComponent('File too large. Max 50MB per file.')}`)
        }
      }
      return res.redirect(`/?error=${encodeURIComponent(err.message)}`)
    }

    try {
      if (!req.files || req.files.length < 2) {
        return res.redirect(`/?error=${encodeURIComponent('Please upload at least 2 PDF files')}`)
      }

      // Correct file paths
      let files = req.files.map(file => file.path)

      // Merge PDFs
      let outputFileName = await mergePdfs(files)

      // Redirect to merged PDF
      res.redirect(`/static/${outputFileName}.pdf`)

    } catch (error) {
      console.error("Merge Process Error:", error)

      return res.redirect(`/?error=${encodeURIComponent('Failed to merge PDFs. File might be corrupted.')}`)
    }
  })
})

// Start server
const port = process.env.PORT || 3000
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}
    Uploads directory: ${uploadPath}
    `)
})

// This Express.js server lets users upload multiple PDF files, merges them into one using a custom function, 
// and returns the final PDF. It uses Multer for file upload handling with validation and includes error handling 
// for file size, type, and merge issues.