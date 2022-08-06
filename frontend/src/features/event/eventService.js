import axios from 'axios'

const API_URL = '/api/event/'

const getEvents = async () => {
  const { data } = await axios.get(API_URL)
  return data
}

// const getEvent = async eventId => {
//   const { data } = await axios.get(API_URL + eventId)
//   return data
// }

const getMyEvents = async (token, userId) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  }

  const { data } = await axios.get(`${API_URL}/${userId}`, config)
  return data
}

const postEvent = async (newEventData, token) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  }

  const { data } = await axios.post(API_URL, newEventData, config)
  return data
}

const updateEvent = async (updatedEvent, eventId, token) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  }

  const { data } = await axios.put(
    `${API_URL}update/${eventId}`,
    updatedEvent,
    config
  )
  return data
}

const deleteEvent = async (eventId, token) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  }

  const { data } = await axios.delete(`${API_URL}update/${eventId}`, config)
  return data
}

const updateAvailableTickets = async (eventData, token) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  }

  const { data } = await axios.put(
    `${API_URL}availableTickets/${eventData.item}`,
    { quantity: eventData.quantity },
    config
  )
  return data
}

const eventService = {
  getEvents,
  // getEvent,
  getMyEvents,
  postEvent,
  updateEvent,
  deleteEvent,
  updateAvailableTickets,
}

export default eventService
