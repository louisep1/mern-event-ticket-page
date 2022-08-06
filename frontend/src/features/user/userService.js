import axios from 'axios'

const API_URL = '/api/user/'

const signIn = async signInData => {
  const { data } = await axios.post(`${API_URL}/signIn`, signInData)
  if (data) {
    // console.log(data)
    localStorage.setItem(
      'user',
      JSON.stringify({
        // address: data.address,
        // contactNo: data.contactNo,
        email: data.email,
        name: data.name,
        seller: data.seller,
        token: data.token,
        _id: data._id,
      })
    )
  }
  return data
}

const signUp = async signUpData => {
  const { data } = await axios.post(`${API_URL}/signUp`, signUpData)
  if (data) {
    localStorage.setItem(
      'user',
      JSON.stringify({
        email: data.email,
        name: data.name,
        seller: data.seller,
        token: data.token,
        _id: data._id,
      })
    )
  }
  return data
}

const signOut = async () => {
  localStorage.removeItem('user')
}

const updateUser = async (updatedData, userId, token) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  }

  const { data } = await axios.put(
    `${API_URL}update/${userId}`,
    updatedData,
    config
  )

  if (data && !updatedData.updateAddress) {
    localStorage.setItem(
      'user',
      JSON.stringify({
        email: data.email,
        name: data.name,
        seller: data.seller,
        token: data.token,
        _id: data._id,
      })
    )
  }

  return data
}

const getUser = async (userId, token) => {
  // config stuff
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  }

  const { data } = await axios.get(`${API_URL}${userId}`, config)
  return data
}

// Basket:
const addToBasket = async (itemData, userId, token) => {
  // config stuff
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  }

  const { data } = await axios.put(`${API_URL}/${userId}`, itemData, config)
  return data
}

const removeFromBasket = async (basketId, userId, token) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  }

  const { data } = await axios.put(
    `${API_URL}/${userId}/delete`,
    basketId,
    config
  )
  return data
}

const clearBasket = async (userId, token) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  }

  const { data } = await axios.put(`${API_URL}/${userId}/deleteAll`, {}, config)
  return data
}

// Order
const createOrder = async (orderData, token) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  }

  const { data } = await axios.post(`${API_URL}orders/new`, orderData, config)
  return data
}

// Seller
const getSeller = async (sellerId, token) => {
  // config stuff
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  }

  const { data } = await axios.get(`${API_URL}seller/${sellerId}`, config)
  return data
}

const userService = {
  signIn,
  signUp,
  signOut,
  updateUser,
  getUser,
  addToBasket,
  removeFromBasket,
  clearBasket,
  createOrder,
  getSeller,
}

export default userService
