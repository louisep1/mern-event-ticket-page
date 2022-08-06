const mongoose = require('mongoose')

const eventSchema = mongoose.Schema(
  {
    // go back and add the user reference
    eventName: {
      type: String,
      required: [true, 'Event name required'],
    },
    eventType: {
      type: String,
      required: [true, 'Event type required'],
    },
    // date: {
    //   type: Date,
    //   required: [true, 'Date and time required'],
    // },
    date: {
      type: String,
      required: [true, 'Date and time required'],
    },
    // ? changed date in event model - maybe date needs to be a string and not an actual date, because there was an error that it (type: Date) doesnt conform to the correct format and won't display on lenovo laptop on edit event page
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
