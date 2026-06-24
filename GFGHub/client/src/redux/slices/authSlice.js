import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import authAPI from '../../services/authAPI';

export const fetchProfile = createAsyncThunk('auth/fetchProfile', async () => {
    const data = await authAPI.getProfile();
    return data;
});

const authSlice = createSlice({
    name: 'auth',
    initialState: { user: null, status: 'idle' },
    reducers: {
        logout(state) {
            state.user = null;
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchProfile.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(fetchProfile.fulfilled, (state, action) => {
                state.user = action.payload;
                state.status = 'succeeded';
            })
            .addCase(fetchProfile.rejected, (state) => {
                state.status = 'failed';
            });
    }
});

export const { logout } = authSlice.actions;
export default authSlice.reducer;
