import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'
import { RootState } from '@/store/redux.store'

interface File {
  _id : string
  filename: string,
  uploadedAt: string,
}

export interface UserState {
    data: {
        name: string,
        identifier: string,
        accessToken: string,
        files: File[] | null
    }
        
    
}

const initialState: UserState = {
    data: {
        name: "",
        identifier: "",
        accessToken: "",
        files: null
    } 
} satisfies UserState as UserState

export const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setUserState: (state, action) => {
      state.data = action.payload
    },
    
  },
})

// Action creators are generated for each case reducer function
export const { 
    setUserState,
 } = userSlice.actions

 export const selectUser = (state: RootState) => (state.user as any).data

export default userSlice.reducer