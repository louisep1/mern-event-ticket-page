import { configureStore } from '@reduxjs/toolkit'
import eventReducer from '../features/event/eventSlice'
import userReducer from '../features/user/userSlice'

export const store = configureStore({
  reducer: {
    event: eventReducer,
    user: userReducer,
  },
})
