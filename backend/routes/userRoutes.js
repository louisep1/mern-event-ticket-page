const express = require('express')
const router = express.Router()
const {
  signUp,
  signIn,
  addToBasket,
  deleteFromBasket,
  clearBasket,
  getUser,
  updateUser,
  createOrder,
  getSeller,
} = require('../controllers/userController')
const { verifyToken } = require('../middleware/authMiddleware')

router.post('/signUp', signUp)
router.post('/signIn', signIn)
router.get('/seller/:id', verifyToken, getSeller) // this is the seller's id
router.route('/:id').put(verifyToken, addToBasket).get(verifyToken, getUser) // this :id is the user's _id
router.put('/update/:id', verifyToken, updateUser) // user id
router.put('/:id/delete', verifyToken, deleteFromBasket) // deletes a single item - user id
router.put('/:id/deleteAll', verifyToken, clearBasket) // deletes all - user id

router.post('/orders/new', verifyToken, createOrder)

module.exports = router
