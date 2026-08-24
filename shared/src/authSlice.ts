import { createSlice, createSelector } from '@reduxjs/toolkit'

export interface AuthState {
  user: { id: string; email: string; name: string } | null
  isAuthenticated: boolean
}

const initialState: AuthState = {
  user: null,
  isAuthenticated: false,
}

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setUser(state, action) {
      state.user = action.payload
      state.isAuthenticated = !!action.payload
    },
    logout(state) {
      state.user = null
      state.isAuthenticated = false
    },
  },
})

export const { setUser, logout } = authSlice.actions
export default authSlice.reducer

export const selectUser = createSelector(
  (state: any) => state.auth.user,
  (user) => user
)

export const selectIsAuthenticated = createSelector(
  (state: any) => state.auth.isAuthenticated,
  (isAuth) => isAuth
)
