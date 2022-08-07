import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import eventService from './eventService'

const initialState = {
  events: [],
  sellerEvents: [],
  currency: '£',
  isLoading: false,
  isSuccess: false,
  isError: false,
  message: '',
}

export const getEvents = createAsyncThunk(
  '/api/event/get',
  async (__, thunkAPI) => {
    try {
      return await eventService.getEvents()
    } catch (error) {
      const message =
        (error.response &&
          error.response.data &&
          error.response.data.message) ||
        error.query ||
        error.toString()
      return thunkAPI.rejectWithValue(message)
    }
  }
)

export const getMyEvents = createAsyncThunk(
  '/api/event/seller-myEvents',
  async (__, thunkAPI) => {
    const token = await thunkAPI.getState().user.user.token
    const userId = await thunkAPI.getState().user.user._id
    try {
      return await eventService.getMyEvents(token, userId)
    } catch (error) {
      const message =
        (error.response &&
          error.response.data &&
          error.response.data.message) ||
        error.query ||
        error.toString()
      return thunkAPI.rejectWithValue(message)
    }
  }
)

export const postEvent = createAsyncThunk(
  '/api/event/postEvent',
  async (newEventData, thunkAPI) => {
    try {
      const token = await thunkAPI.getState().user.user.token
      return await eventService.postEvent(newEventData, token)
    } catch (error) {
      const message =
        (error.response &&
          error.response.data &&
          error.response.data.message) ||
        error.query ||
        error.toString()
      return thunkAPI.rejectWithValue(message)
    }
  }
)

export const updateEvent = createAsyncThunk(
  '/api/events/update/eventId',
  async (updatedEvent, thunkAPI) => {
    try {
      const token = await thunkAPI.getState().user.user.token
      return await eventService.updateEvent(
        updatedEvent,
        updatedEvent.eventId,
        token
      )
    } catch (error) {
      const message =
        (error.response &&
          error.response.data &&
          error.response.data.message) ||
        error.query ||
        error.toString()
      return thunkAPI.rejectWithValue(message)
    }
  }
)

export const deleteEvent = createAsyncThunk(
  '/api/event/deleteEvent',
  async (eventId, thunkAPI) => {
    try {
      const token = await thunkAPI.getState().user.user.token
      return await eventService.deleteEvent(eventId, token)
    } catch (error) {
      const message =
        (error.response &&
          error.response.data &&
          error.response.data.message) ||
        error.query ||
        error.toString()
      return thunkAPI.rejectWithValue(message)
    }
  }
)

export const updateAvailableTickets = createAsyncThunk(
  '/api/event/availableTickets/update',
  async (eventData, thunkAPI) => {
    try {
      const token = await thunkAPI.getState().user.user.token
      return await eventService.updateAvailableTickets(eventData, token)
    } catch (error) {
      const message =
        (error.response &&
          error.response.data &&
          error.response.data.message) ||
        error.query ||
        error.toString()
      return thunkAPI.rejectWithValue(message)
    }
  }
)

const eventSlice = createSlice({
  name: 'event',
  initialState,
  reducers: {
    reset: state => {
      state.isLoading = false
      state.isSuccess = false
      state.isError = false
      state.message = ''
      state.sellerEvents = null
      state.updateSuccess = false
      state.updateError = false
      state.createSuccess = false
      state.createError = false
    },
  },
  extraReducers: builder => {
    builder
      .addCase(getEvents.pending, state => {
        state.isLoading = true
      })
      .addCase(getEvents.fulfilled, (state, action) => {
        state.isLoading = false
        state.isSuccess = true
        state.events = action.payload
      })
      .addCase(getEvents.rejected, (state, action) => {
        state.isLoading = false
        state.isError = true
        state.message = action.payload
      })

      .addCase(postEvent.pending, state => {
        state.isLoading = true
      })
      .addCase(postEvent.fulfilled, (state, action) => {
        state.isLoading = false
        state.createSuccess = true
        state.events = [...state.events, action.payload]
      })
      .addCase(postEvent.rejected, (state, action) => {
        state.isLoading = false
        state.createError = true
        state.message = action.payload
      })

      .addCase(getMyEvents.pending, state => {
        state.isLoading = true
      })
      .addCase(getMyEvents.fulfilled, (state, action) => {
        state.isLoading = false
        state.getMySuccess = true
        state.sellerEvents = action.payload
      })
      .addCase(getMyEvents.rejected, (state, action) => {
        state.isLoading = false
        state.getMyError = true
        state.message = action.payload
      })

      .addCase(updateEvent.pending, state => {
        state.isLoading = true
      })
      .addCase(updateEvent.fulfilled, (state, action) => {
        state.isLoading = false
        state.updateSuccess = true
      })
      .addCase(updateEvent.rejected, (state, action) => {
        state.isLoading = false
        state.updateError = true
        state.message = action.payload
      })

      .addCase(deleteEvent.pending, state => {
        state.isLoading = true
      })
      .addCase(deleteEvent.fulfilled, (state, action) => {
        state.isLoading = false
        state.deleteSuccess = true
        state.sellerEvents = state.sellerEvents.filter(
          event => event._id !== action.payload
        )
      })
      .addCase(deleteEvent.rejected, (state, action) => {
        state.isLoading = false
        state.deleteError = true
        state.message = action.payload
      })

      .addCase(updateAvailableTickets.pending, state => {
        state.isLoading = true
      })
      .addCase(updateAvailableTickets.fulfilled, (state, action) => {
        state.isLoading = false
        state.isSuccess = true
      })
      .addCase(updateAvailableTickets.rejected, (state, action) => {
        state.isLoading = false
        state.isError = true
        state.message = action.payload
      })
  },
})

export const { reset } = eventSlice.actions
export default eventSlice.reducer
