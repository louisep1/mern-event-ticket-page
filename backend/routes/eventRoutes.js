const express = require('express')
const router = express.Router()
const {
  getEvents,
  getMyEvents,
  postEvent,
  updateEvent,
  deleteEvent,
  updateAvailableTickets,
} = require('../controllers/eventControllers')
const { verifyToken } = require('../middleware/authMiddleware')

router.route('/').get(getEvents).post(verifyToken, postEvent)
router.get('/:id', verifyToken, getMyEvents)

router
  .route('/update/:id')
  .put(verifyToken, updateEvent)
  .delete(verifyToken, deleteEvent)
// this is the event ID

router.put('/availableTickets/:id', verifyToken, updateAvailableTickets)
// this id is also the event ID

module.exports = router
