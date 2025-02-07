import { createSlice } from "@reduxjs/toolkit";

interface AuthState{
    user: string | null
    token: string | null
}

interface RootState{
    auth: AuthState
}

const authSlice = createSlice({
    name: 'auth',
    initialState: { user: null, token: null },
    reducers: {
        setCredentials: (state, action) => {
            const { user, accessToken } = action.payload;
            state.user = user;
            state.token = accessToken;
        },
        logOut: (state) => {
            state.user = null;
            state.token = null;
        }
    },
})

export const { setCredentials, logOut } = authSlice.actions;

export default authSlice.reducer;

export const selectCurrentUser = (state: RootState): string | null => state.auth.user
export const selectCurrentToken = (state: RootState): string | null => state.auth.token