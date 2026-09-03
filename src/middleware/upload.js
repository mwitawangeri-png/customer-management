const multer = require('multer');
const path = require('path');

const allowedMimeTypes = [

  'image/jpeg',
  'image/png',
  'image/webp',
  'application/pdf'
  //'application/octet-stream'
];

const fileFilter = (req, file, cb) =>{

    console.log('Incoming File MIME type:', file.mimetype)
    if (allowedMimeTypes.includes(file.mimetype)) {
      cb(null, true);  
    } else{
        cb(new Error('Invalid file type.'), false)
    }

};

const upload = multer({

    dest: path.join(__dirname, '../../uploads'),
    fileFilter: fileFilter,
    limits:{
        fileSize: 5*1024*1024
    }
});

module.exports = upload