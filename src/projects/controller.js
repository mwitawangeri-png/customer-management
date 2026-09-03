const puppeteer = require('puppeteer');

const generateProjectQuote = async (req, res) => {

    let browser;

    try{

        browser = await puppeteer.launch();
        const page = await browser.newPage();

        // Inject dummy HTML
        const htmlContent = `
            <html>
                <body>
                    <h1>Project Quote</h1>
                    <p>Estimated Cost: $1,500</p>
                </body>
            </html>
        `;
        await page.setContent(htmlContent);

        const pdfBuffer = await page.pdf({format: 'A4'});

        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader('Content-Disposition', 'attachment; filename="quote.pdf"')

        return res.send(pdfBuffer);

    }catch(error){

        console.error("Failed to generate PDF:", error);
        return res.status(500).json({ message: "Failed to generate PDF quote" });
    }finally{

        if (browser) {
            await browser.close();
        }
    }
}

const uploadFile = async (req, res) => {
    try {
        const file = req.file;

        // 1. Early return if Multer rejected the file or none was provided
        if (!file) {
            return res.status(400).json({
                message: "Failed to upload file. Ensure it is a valid format and under 5MB."
            });
        }

        // 2. Return success and the file details (so we can save the path to the DB later)
        return res.status(201).json({
            message: "File uploaded successfully",
            fileName: file.originalname,
            filePath: file.filename 
        });

    } catch (error) {
        console.error("Failed to upload file", error);
        return res.status(500).json({ message: "Internal server error during upload" });
    }
};
module.exports = { generateProjectQuote, uploadFile };