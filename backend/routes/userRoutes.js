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
const { protect } = require('../middleware/authMiddleware')

router.post('/signUp', signUp)
router.post('/signIn', signIn)
router.get('/seller/:id', protect, getSeller) // this is the seller's id
router.route('/:id').put(protect, addToBasket).get(protect, getUser) // this :id is the user's _id
router.put('/update/:id', protect, updateUser) // user id
router.put('/:id/delete', protect, deleteFromBasket) // deletes a single item - user id ?
router.put('/:id/deleteAll', protect, clearBasket) // deletes all - user id ?
// not technically a delete request, because not deleting the entire thing, just updating a part of it to delete a part of it - so maybe needs to be a put request with a different route instead of delete request

router.post('/orders/new', protect, createOrder)
// another route for get single order ?

module.exports = router
