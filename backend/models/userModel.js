const mongoose = require('mongoose')

const userSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Name required'],
    },
    email: {
      type: String,
      required: [true, 'Email required'],
    },
    contactNo: {
      type: String,
      required: [true, 'Contact Number required'],
    },
    password: {
      type: String,
      required: [true, 'Password required'],
    },
    seller: {
      type: Boolean,
      default: false,
    },
    address: {
      type: Object,
      default: {
        line1: '',
        line2: '',
        city: '',
        area: '',
        code: '',
        country: '',
      },
    },
    basket: [
      {
        item: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'Event',
        },
        quantity: {
          type: Number,
          default: 1,
        },
        ticketType: {
          type: String,
        },
        ticketPrice: {
          type: Number,
        },
        eventName: {
          type: String,
        },
        date: {
          type: String,
        },
        startTime: {
          type: String,
        },
        endTime: {
          type: String,
        },
        location: {
          type: String,
        },
        seller: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'User',
        },
      },
    ],
    // each order is an object -- with a tickets array and a payment object
    // tickets array is more or less same as basket but minus event info
    orders: [
      {
        tickets: [
          {
            item: {
              type: mongoose.Schema.Types.ObjectId,
              ref: 'Event',
            },
            quantity: {
              type: Number,
              default: 1,
            },
            ticketType: {
              type: String,
            },
            ticketPrice: {
              type: Number,
            },
            seller: {
              type: mongoose.Schema.Types.ObjectId,
              ref: 'User',
            },
          },
        ],
        payment: {
          total: {
            type: Number,
          },
          paymentMethod: {
            type: String,
          },
          paid: {
            type: Boolean,
            default: false,
          },
          orderedOn: {
            type: String,
          },
          paidOn: {
            type: String,
            default: '',
          },
          billingAddress: {
            line1: {
              type: String,
              required: true,
            },
            line2: {
              type: String,
            },
            city: {
              type: String,
              required: true,
            },
            area: {
              type: String,
              required: true,
            },
            code: {
              type: String,
              required: true,
            },
            country: {
              type: String,
              required: true,
            },
          },
        },
      },
    ],
  },
  {
    timestamps: true,
  }
)

module.exports = mongoose.model('User', userSchema)
