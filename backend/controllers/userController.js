const asyncHandler = require('express-async-handler')
const User = require('../models/userModel')
const Event = require('../models/eventModel')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs')

// @ desc    Sign in user
// @route    POST /api/user/signIn
// @access   Public
const signIn = asyncHandler(async (req, res) => {
  const { email, password } = req.body

  if (!email || !password) {
    res.status(400)
    throw new Error('Please enter all log in fields')
  }
  const user = await User.findOne({ email })

  if (user && (await bcrypt.compare(password, user.password))) {
    res.status(200).json({
      name: user.name,
      email,
      contactNo: user.contactNo,
      seller: user.seller,
      token: generateToken(user._id),
      _id: user._id,
      basket: user.basket,
      orders: user.orders,
      address: user.address,
    })
  } else {
    res.status(400)
    throw new Error('Invalid sign in details')
  }
})

// @ desc    Sign up new user
// @route    POST /api/user/signUp
// @access   Public
const signUp = asyncHandler(async (req, res) => {
  const { name, email, contactNo, password, seller } = req.body

  if (!name || !email || !contactNo || !password) {
    res.status(400)
    throw new Error('Please enter all user fields')
  }

  const userExists = await User.findOne({ email })
  if (userExists) {
    res.status(400)
    throw new Error('That user already exists.')
  }

  // hash and salt password here
  const salt = await bcrypt.genSalt(10)
  const hashedPassword = await bcrypt.hash(password, salt)

  const newUser = await User.create({
    name,
    email,
    contactNo,
    password: hashedPassword,
    seller,
  })

  if (newUser) {
    res.status(201).json({
      name,
      email,
      contactNo,
      seller,
      token: generateToken(newUser._id),
      _id: newUser._id,
      basket: newUser.basket,
      address: newUser.address,
      orders: newUser.orders,
    })
  } else {
    res.status(400)
    throw new Error('User could not be created')
  }
})

// @ desc    Update user's contact details and billing address
// @route    PUT /api/user/update/:id
// @access   Private
const updateUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id)

  const {
    name,
    contactNo,
    updateAddress,
    line1,
    line2,
    city,
    area,
    code,
    country,
  } = req.body

  if (user) {
    const updated =
      updateAddress === true
        ? await User.findByIdAndUpdate(req.user._id, {
            address: {
              line1,
              line2,
              city,
              area,
              code,
              country,
            },
          })
        : await User.findByIdAndUpdate(req.user._id, {
            name,
            contactNo,
          })

    if (updated) {
      res.status(200)
      res.json({
        name: updateAddress ? updated.name : name,
        email: updated.email,
        contactNo: updateAddress ? updated.contactNo : contactNo,
        seller: updated.seller,
        token: generateToken(user._id),
        _id: updated._id,
        basket: updated.basket,
        orders: updated.orders,
        address: updateAddress
          ? {
              line1,
              line2,
              city,
              area,
              code,
              country,
            }
          : updated.address,
      })
    } else {
      res.status(400)
      throw new Error('User could not be updated')
    }
  } else {
    res.status(404)
    throw new Error('User not found')
  }
})

// @ desc    Get up to date user details
// @route    GET /api/user/:id
// @access   Private
const getUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id)

  if (user) {
    res.json({
      name: user.name,
      email: user.email,
      contactNo: user.contactNo,
      seller: user.seller,
      token: generateToken(user._id),
      _id: user._id,
      basket: user.basket,
      orders: user.orders,
      address: user.address,
    })
  } else {
    res.status(404)
    throw new Error('User not found')
  }
})

// @ desc    Add item to a logged in user's basket
// @route    PUT /api/user/:id
// @access   Private
const addToBasket = asyncHandler(async (req, res) => {
  // add one type of item at a time
  // item is the id of the item/event, quantity is amount
  const { item, quantity, ticketType, ticketPrice, seller } = req.body

  if (!item || !quantity || !ticketType || !ticketPrice || !seller) {
    res.status(400)
    throw new Error('Nothing to add to basket')
  }

  const user = await User.findById(req.params.id)

  if (!user) {
    res.status(404)
    throw new Error('User not found')
  }

  const updated = await User.findByIdAndUpdate(user._id, {
    basket: [
      ...user.basket,
      {
        item,
        quantity,
        ticketType,
        ticketPrice,
        seller,
      },
    ],
  })

  if (updated) {
    res.status(200).json({
      basket: updated.basket,
    })
  }
})

// @ desc    Remove an item from logged in user's basket
// @route    PUT /api/user/:id/delete
// @access   Private
const deleteFromBasket = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id)
  if (!user) {
    res.status(404)
    throw new Error('User not found')
  }

  const removed = user.basket.filter(
    item => item._id.toString() !== req.body.basketId
  )

  const updated = await User.findByIdAndUpdate(user._id, {
    basket: removed,
  })

  if (updated) {
    res.status(200).json({
      name: user.name,
      email: user.email,
      contactNo: user.contactNo,
      seller: user.seller,
      token: generateToken(user._id),
      _id: user._id,
      orders: user.orders,
      basket: user.basket.filter(
        item => item._id.toString() !== req.body.basketId
      ),
    })
  } else {
    throw new Error('Item could not be removed from basket')
  }
})

// @ desc    Remove all items from basket
// @route    PUT /api/user/:id/deleteAll
// @access   Private
const clearBasket = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id)
  if (!user) {
    res.status(404)
    throw new Error('User not found')
  }

  const updated = await User.findByIdAndUpdate(user._id, {
    basket: [],
  })

  if (updated) {
    res.status(200).json({
      basket: [],
    })
  } else {
    throw new Error('Basket could not be cleared')
  }
})

const createOrder = asyncHandler(async (req, res) => {
  const { tickets, payment } = req.body

  const { total, paymentMethod, paid, paidOn, orderedOn, billingAddress } =
    payment

  const { line1, city, area, code, country } = billingAddress

  if (
    !total ||
    !paymentMethod ||
    !orderedOn ||
    !line1 ||
    !city ||
    !area ||
    !code ||
    !country
  ) {
    res.status(400)
    throw new Error('Insufficient order data')
  }

  // multiple ticket items in the ticket array so cannot destructure it - instead - check for data with map:
  tickets.map(ticket => {
    if (
      !ticket.item ||
      !ticket.quantity ||
      !ticket.ticketType ||
      !ticket.ticketPrice ||
      !ticket.seller
    ) {
      res.status(400)
      throw new Error('Insufficient order data')
    }
  })

  const enoughTickets = await Promise.all(
    tickets.map(async ticket => {
      const currentTicket = await Event.findById(ticket.item)
      if (currentTicket && currentTicket.availableTickets < ticket.quantity) {
        res.status(500)
        throw new Error('Not enough tickets available')
      }
      if (!currentTicket) {
        res.status(404)
        throw new Error('Event not found')
      }
    })
  )

  const user = await User.findById(req.user)

  if (!user) {
    res.status(404)
    throw new Error('User not found')
  }

  const updateUser = await User.findByIdAndUpdate(req.user, {
    orders: [
      ...user.orders,
      {
        tickets,
        payment,
      },
    ],
  })

  if (updateUser) {
    res.status(200).json({ jsonData: 'success' })
  } else {
    res.status(400)
    throw new Error('Order could not be created')
  }
})

// @ desc    Get seller's details
// @route    GET /api/user/seller/:id
// @access   Private
const getSeller = asyncHandler(async (req, res) => {
  const seller = await User.findById(req.params.id)
  if (seller) {
    res.json({
      name: seller.name,
      email: seller.email,
      contactNo: seller.contactNo,
      seller: seller.seller,
      _id: seller._id,
    })
  } else {
    res.status(404)
    throw new Error('Seller not found')
  }
})

const generateToken = id => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: '30d',
  })
}

module.exports = {
  signIn,
  signUp,
  getUser,
  updateUser,
  addToBasket,
  deleteFromBasket,
  clearBasket,
  createOrder,
  getSeller,
}
