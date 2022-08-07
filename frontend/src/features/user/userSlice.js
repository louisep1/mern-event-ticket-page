import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import userService from './userService'

const user = JSON.parse(localStorage.getItem('user'))

const initialState = {
  user: user ? user : null,
  isLoading: false,
  isSuccess: false,
  isError: false,
  message: '',
}

export const signIn = createAsyncThunk(
  '/api/user/signIn',
  async (signInData, thunkAPI) => {
    try {
      return await userService.signIn(signInData)
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

export const signUp = createAsyncThunk(
  '/api/user/signUp',
  async (signUpData, thunkAPI) => {
    try {
      return await userService.signUp(signUpData)
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

export const signOut = createAsyncThunk('/api/user/signOut', async () => {
  return await userService.signOut()
})

export const updateUser = createAsyncThunk(
  '/api/user/update',
  async (updatedData, thunkAPI) => {
    const token = await thunkAPI.getState().user.user.token
    const userId = await thunkAPI.getState().user.user._id
    try {
      return await userService.updateUser(updatedData, userId, token)
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

// getUser is it's own function, because it returns the user including the basket - the user stored in local storage does not include the basket
export const getUser = createAsyncThunk(
  '/api/user/getUser',
  async (__, thunkAPI) => {
    const token = await thunkAPI.getState().user.user.token
    const userId = await thunkAPI.getState().user.user._id
    try {
      return await userService.getUser(userId, token)
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

// Basket:
export const addToBasket = createAsyncThunk(
  '/api/user/addToBasket',
  async (itemData, thunkAPI) => {
    const token = await thunkAPI.getState().user.user.token
    const userId = await thunkAPI.getState().user.user._id
    try {
      return await userService.addToBasket(itemData, userId, token)
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

export const removeFromBasket = createAsyncThunk(
  '/api/user/removeItem',
  async (basketId, thunkAPI) => {
    const token = await thunkAPI.getState().user.user.token
    const userId = await thunkAPI.getState().user.user._id
    try {
      return await userService.removeFromBasket(basketId, userId, token)
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

export const clearBasket = createAsyncThunk(
  '/api/user/removeAll',
  async (__, thunkAPI) => {
    const token = await thunkAPI.getState().user.user.token
    const userId = await thunkAPI.getState().user.user._id
    try {
      return await userService.clearBasket(userId, token)
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

// Order:
export const createOrder = createAsyncThunk(
  'api/user/orders/new',
  async (orderData, thunkAPI) => {
    const token = await thunkAPI.getState().user.user.token
    try {
      return await userService.createOrder(orderData, token)
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

// Seller:
export const getSeller = createAsyncThunk(
  '/api/user/getSeller',
  async (sellerId, thunkAPI) => {
    const token = await thunkAPI.getState().user.user.token
    try {
      return await userService.getSeller(sellerId, token)
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

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    reset: state => {
      state.isLoading = false
      state.isSuccess = false
      state.isError = false
      state.message = ''
      state.basketSuccess = false
      state.basketError = false
      state.removeBasketSuccess = false
      state.removeBasketError = false
      state.orderSuccess = false
      state.orderError = false
      state.seller = ''
    },
  },
  extraReducers: builder => {
    builder
      .addCase(signIn.pending, state => {
        state.isLoading = true
      })
      .addCase(signIn.fulfilled, (state, action) => {
        state.isLoading = false
        state.isSuccess = true
        state.user = action.payload
      })
      .addCase(signIn.rejected, (state, action) => {
        state.isLoading = false
        state.isError = true
        state.message = action.payload
      })

      .addCase(signUp.pending, state => {
        state.isLoading = true
      })
      .addCase(signUp.fulfilled, (state, action) => {
        state.isLoading = false
        state.isSuccess = true
        state.user = action.payload
      })
      .addCase(signUp.rejected, (state, action) => {
        state.isLoading = false
        state.isError = true
        state.message = action.payload
      })

      .addCase(signOut.fulfilled, state => {
        state.user = null
      })

      .addCase(updateUser.pending, state => {
        state.isLoading = true
      })
      .addCase(updateUser.fulfilled, (state, action) => {
        state.isLoading = false
        state.updatedSuccess = true
        state.user = action.payload
      })
      .addCase(updateUser.rejected, (state, action) => {
        state.isLoading = false
        state.updatedError = true
        state.message = action.payload
      })

      .addCase(getUser.pending, state => {
        state.isLoading = true
      })
      .addCase(getUser.fulfilled, (state, action) => {
        state.isLoading = false
        state.isSuccess = true
        state.user = action.payload
      })
      .addCase(getUser.rejected, (state, action) => {
        state.isLoading = false
        state.isError = true
        state.message = action.payload
      })

      .addCase(addToBasket.pending, state => {
        state.isLoading = true
      })
      .addCase(addToBasket.fulfilled, (state, action) => {
        state.isLoading = false
        state.basketSuccess = true
      })
      .addCase(addToBasket.rejected, (state, action) => {
        state.isLoading = false
        state.basketError = true
        state.message = action.payload
      })

      .addCase(removeFromBasket.pending, state => {
        state.isLoading = true
      })
      .addCase(removeFromBasket.fulfilled, (state, action) => {
        state.isLoading = false
        state.basketSuccess = true
        state.user = action.payload
      })
      .addCase(removeFromBasket.rejected, (state, action) => {
        state.isLoading = false
        state.basketError = true
        state.message = action.payload
      })

      .addCase(clearBasket.pending, state => {
        state.isLoading = true
      })
      .addCase(clearBasket.fulfilled, (state, action) => {
        state.isLoading = false
        state.removeBasketSuccess = true
        state.user.basket = []
      })
      .addCase(clearBasket.rejected, (state, action) => {
        state.isLoading = false
        state.removeBasketError = true
        state.message = action.payload
      })

      .addCase(createOrder.pending, state => {
        state.isLoading = true
      })
      .addCase(createOrder.fulfilled, (state, action) => {
        state.isLoading = false
        state.orderSuccess = true
      })
      .addCase(createOrder.rejected, (state, action) => {
        state.isLoading = false
        state.orderError = true
        state.message = action.payload
      })

      .addCase(getSeller.pending, state => {
        state.isLoading = true
      })
      .addCase(getSeller.fulfilled, (state, action) => {
        state.isLoading = false
        state.isSuccess = true
        state.seller = action.payload
      })
      .addCase(getSeller.rejected, (state, action) => {
        state.isLoading = false
        state.isError = true
        state.message = action.payload
      })
  },
})

export const { reset } = userSlice.actions
export default userSlice.reducer
