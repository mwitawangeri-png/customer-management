const puppeteer = require('puppeteer');
const multer = require('multer');

const allowedMimeTypes = [

  'image/jpeg',
  'image/png',
  'image/webp',
  'application/pdf'
];

const fileFilter = (req, file, cb) =>{
    if (allowedMimeTypes.includes(file.mimetype)) {
      cb(null, true);  
    }

}
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

module.exports = { generateProjectQuote };