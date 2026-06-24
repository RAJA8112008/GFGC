import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice.js';
import solutionReducer from './slices/solutionSlice.js';

export default configureStore({
    reducer: {
        auth: authReducer,
        solution: solutionReducer
    }
});
