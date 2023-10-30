import { PayloadAction, createSlice } from "@reduxjs/toolkit"

// Define a type for the slice state
export interface TokenState {
  token: string | null
}

// Define the initial state using that type
const initialState: TokenState = {
  token: null
}

export const tokenSlice = createSlice({
  name: 'Token',
  initialState,
  reducers: {
    reset: state => {
      state.token = null
    },
    setToken: (state: TokenState, action: PayloadAction<string>) => {
      state.token = action.payload
    }
  }
});

// export const { reset, setToken} = tokenSlice.actions;
export default tokenSlice.reducer;