const asyncHandler = require('express-async-handler')
const Event = require('../models/eventModel')

// @ desc    Get all events from the database
// @route    GET /api/event/
// @access   Public
const getEvents = asyncHandler(async (req, res) => {
  const events = await Event.find({})
  res.status(200).json(events)
})

// @ desc    Get a specific seller's events
// @route    GET /api/event/:id (user's id)
// @access   Private
const getMyEvents = asyncHandler(async (req, res) => {
  // Check user making request is the same user:
  if (req.user.id === req.params.id) {
    const events = await Event.find({})

    const filtered = events.filter(
      event => event.createdBy.toString() === req.params.id
    )

    if (filtered) {
      res.status(200).json(filtered)
    } else {
      res.status(404)
      throw new Error('No events found under this seller')
    }
  } else {
    res.status(401)
    throw new Error(`Not authorized to view other sellers' events`)
  }
})

// @ desc    Add a new event to the database
// @route    POST /api/event/
// @access   Private
const postEvent = asyncHandler(async (req, res) => {
  const {
    eventName,
    eventType,
    date,
    startTime,
    endTime,
    priceFull,
    priceBasic,
    availableTickets,
    briefSummary,
    fullDescription,
    image,
    location,
    ticketPrices,
  } = req.body

  if (
    !eventName ||
    !eventType ||
    !date ||
    !startTime ||
    !endTime ||
    !priceFull ||
    !availableTickets ||
    !briefSummary ||
    !fullDescription ||
    !location ||
    !ticketPrices
  ) {
    res.status(401)
    throw new Error('Required input data missing')
  }

  if (req.user.seller) {
    const event = await Event.create({
      eventName,
      eventType,
      date,
      startTime,
      endTime,
      priceFull,
      priceBasic,
      availableTickets,
      totalTickets: availableTickets,
      briefSummary,
      fullDescription,
      image,
      location,
      ticketPrices,
      createdBy: req.user._id,
    })

    if (event) {
      res.status(200).json(event)
    } else {
      res.status(400)
      throw new Error('Event could not be created')
    }
  } else {
    res.status(401)
    throw new Error('Need to be logged in on a seller account')
  }
})

// @ desc    Update an event
// @route    Put /api/event/update/:id
// @access   Private
const updateEvent = asyncHandler(async (req, res) => {
  if (req.user.seller) {
    const checkMatch = await Event.findById(req.params.id)

    // Check logged in user matches the createdBy user:
    if (checkMatch.createdBy.toString() === req.user._id.toString()) {
      const event = await Event.findByIdAndUpdate(req.params.id, req.body)

      if (event) {
        res.status(200).json(event)
      } else {
        res.status(400)
        throw new Error('Event could not be updated')
      }
    } else {
      res.status(401)
      throw new Error(
        'Only the seller who owns the event can make changes to it'
      )
    }
  } else {
    res.status(401)
    throw new Error('Need to be logged in on a seller account')
  }
})

// @ desc    Delete an event
// @route    DELETE /api/event/update/:id
// @access   Private
const deleteEvent = asyncHandler(async (req, res) => {
  if (req.user.seller) {
    const checkMatch = await Event.findById(req.params.id)

    // !!! here need to add some kind of check to make sure nobody has actually bought any tickets for this event yet - additionally feature to be added in future
    if (checkMatch.createdBy.toString() === req.user._id.toString()) {
      await checkMatch.remove()

      res.status(200).json(req.params.id)
    } else {
      res.status(401)
      throw new Error(
        'Only the seller who owns the event can make changes to it'
      )
    }
  } else {
    res.status(401)
    throw new Error('Need to be logged in on a seller account')
  }
})

// @ desc    Update number of available tickets  !!! ideally move this to be included in the user controller with the rest of the order request
// @route    PUT /api/event/availableTickets/:id
// @access   Private
const updateAvailableTickets = asyncHandler(async (req, res) => {
  const { quantity } = req.body

  const event = await Event.findById(req.params.id)

  if (event && event.availableTickets < quantity) {
    res.status(404) // maybe not the right status code here
    throw new Error('Item not found/Not in stock')
  }

  if (event) {
    const updatedTickets = await Event.findByIdAndUpdate(req.params.id, {
      availableTickets: event.availableTickets - quantity,
    })

    if (updatedTickets) {
      res.status(200).json({ result: 'Tickets updated' })
    } else {
      res.status(400)
      throw new Error('Remaining available tickets could not be updated')
    }
  } else {
    res.status(404)
    throw new Error('Event not found')
  }
})

module.exports = {
  getEvents,
  getMyEvents,
  postEvent,
  updateEvent,
  deleteEvent,
  updateAvailableTickets,
}
