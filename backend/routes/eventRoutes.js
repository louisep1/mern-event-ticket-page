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
const { protect } = require('../middleware/authMiddleware')

router.route('/').get(getEvents).post(protect, postEvent)
router.get('/:id', protect, getMyEvents)

router
  .route('/update/:id')
  .put(protect, updateEvent)
  .delete(protect, deleteEvent)
// this is the event ID

router.put('/availableTickets/:id', protect, updateAvailableTickets)
// this id is also the event ID

module.exports = router
