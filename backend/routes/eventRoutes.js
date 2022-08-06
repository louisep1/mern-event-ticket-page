const express = require('express')
const router = express.Router()
const {
  getEvents,
  getMyEvents,
  // getEvent,
  postEvent,
  updateEvent,
  deleteEvent,
  updateAvailableTickets,
} = require('../controllers/eventControllers')
const { protect } = require('../middleware/authMiddleware')

router.route('/').get(getEvents).post(protect, postEvent)
router.get('/:id', protect, getMyEvents)
// this id is the user's id (seller)

router
  .route('/update/:id')
  .put(protect, updateEvent)
  .delete(protect, deleteEvent)
// this is the event ID

router.put('/availableTickets/:id', protect, updateAvailableTickets)
// this id is also the event ID
// maybe can use this to get the ticket count and also check if enough

// Built but not using:
// router.route('/:id').get(getEvent)

module.exports = router
