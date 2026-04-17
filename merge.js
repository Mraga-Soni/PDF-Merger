const path = require('path')
const PDFMerger = require('pdf-merger-js').default
const fs = require('fs')

// Ensure public directory exists for output
const publicPath = path.join(__dirname, 'public')
if (!fs.existsSync(publicPath)) {
    fs.mkdirSync(publicPath)
}

const mergePdfs = async (files) => {
    const merger = new PDFMerger()

    let validCount = 0;

    for (let file of files) {
        try {
            // 1. Validate File Signature (Check if it's actually a PDF)
            const buffer = Buffer.alloc(5)
            const fd = fs.openSync(file, 'r')
            fs.readSync(fd, buffer, 0, 5, 0)
            fs.closeSync(fd)

            if (buffer.toString() !== '%PDF-') {
                console.warn(`Skipping invalid PDF: ${file}`)
                // Delete invalid file immediately to save space
                if (fs.existsSync(file)) fs.unlinkSync(file);
                continue
            }

            // 2. Add to merger
            await merger.add(file)
            validCount++

        } catch (err) {
            console.error(`Error adding file ${file}:`, err.message)
            if (fs.existsSync(file)) fs.unlinkSync(file);
        }
    }

    // Check if we have enough files to proceed
    if (validCount < 2) {
        files.forEach(f => { if (fs.existsSync(f)) fs.unlinkSync(f); });
        throw new Error("Not enough valid PDF files to merge")
    }

    // 3. Generate Output Path
    const timestamp = new Date().getTime();
    const outputPath = path.join(publicPath, `${timestamp}.pdf`);

    // 4. Save merged file
    await merger.save(outputPath)

    // 5. Cleanup: Delete temporary uploaded files
    files.forEach(file => {
        if (fs.existsSync(file)) fs.unlinkSync(file)
    })

    // 6. Optional: Auto-delete the merged file after 30 minutes to save server space
    setTimeout(() => {
        if (fs.existsSync(outputPath)) {
            fs.unlink(outputPath, (err) => {
                if (err) console.error(`Cleanup error for ${timestamp}.pdf:`, err);
                else console.log(`Temporary file ${timestamp}.pdf deleted.`);
            });
        }
    }, 30 * 60 * 1000); 

    return timestamp;
}

module.exports = { mergePdfs }


// This module merges multiple valid PDF files into a single PDF using pdf-merger-js, 
// validates PDF signatures, manages temporary file deletion, and includes an 
// automatic cleanup task for the generated output.