const mongoose = require('mongoose')

const eventSchema = mongoose.Schema(
  {
    eventName: {
      type: String,
      required: [true, 'Event name required'],
    },
    eventType: {
      type: String,
      required: [true, 'Event type required'],
    },
    date: {
      type: String,
      required: [true, 'Date and time required'],
    },
    startTime: {
      type: String,
      required: [true, 'Date and time required'],
    },
    endTime: {
      type: String,
      required: [true, 'Date and time required'],
    },
    priceFull: {
      type: Number,
      required: [true, 'Full price required'],
    },
    priceBasic: {
      type: Number,
    },
    ticketPrices: [
      {
        ticketType: { type: String, required: [true, 'Need ticket type'] },
        ticketPrice: { type: Number, required: [true, 'Need ticket price'] },
      },
    ],
    availableTickets: {
      type: Number,
      required: [true, 'Available tickets required'],
    },
    totalTickets: {
      type: Number,
      required: [true, 'Total tickets required'],
    },
    briefSummary: {
      type: String,
      required: [true, 'Brief summary required'],
    },
    fullDescription: {
      type: String,
      required: [true, 'Full description required'],
    },
    image: {
      type: String,
      default: '/images/el-grande-event.jpg',
    },
    location: {
      type: String,
      required: [true, 'Location required'],
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
  },
  {
    timestamps: true,
  }
)

module.exports = mongoose.model('Event', eventSchema)
