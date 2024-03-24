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

function checkFileType(file, cb) {
  const filetypes = /jpg|jpeg|png/

  // test (true or false) to make sure actual extension of file matches ione of the file types above:
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
router.post('/', flyer.single('image'), (req, res) => {
  res.send(`/${req.file.path}`)
})

module.exports = router
