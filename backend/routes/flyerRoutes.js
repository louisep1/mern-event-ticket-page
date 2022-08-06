const path = require('path')
const express = require('express')
const multer = require('multer')

const router = express.Router()

// Config:
const storage = multer.diskStorage({
  destination(req, file, cb) {
    cb(null, 'flyers/')
  },
  filename(req, file, cb) {
    cb(
      null,
      `${file.fieldname}-${Date.now()}${path.extname(file.originalname)}`
    )
  },
})

// CheckFileType function that gets passed in our middleware below - so that not just any file can be uploaded by user
function checkFileType(file, cb) {
  // expression:
  const filetypes = /jpg|jpeg|png/

  // test (true or false) to make sure actual extension of file matches ine of the file types above:
  // path.extname() bit is same as in config for naming the file
  const extname = filetypes.test(path.extname(file.originalname).toLowerCase())

  // check mimetype e.g. image/jpeg
  const mimetype = filetypes.test(file.mimetype)

  if (extname && mimetype) {
    return cb(null, true)
  } else {
    cb('Images only!')
  }
}

// Middleware to our route:
const flyer = multer({
  storage,
  fileFilter: function (req, file, cb) {
    checkFileType(file, cb)
  },
})

// Route / endpoint
// .single as one image
// named this image so need to call image in frontend
router.post('/', flyer.single('image'), (req, res) => {
  res.send(`/${req.file.path}`)
  console.log(req.file.path)
})

module.exports = router
