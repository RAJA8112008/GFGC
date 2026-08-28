import {
    createSlice,
    createAsyncThunk,
} from "@reduxjs/toolkit";

import solutionAPI from "../../services/solutionAPI";

export const fetchSolutions =
    createAsyncThunk(
        "solution/fetchAll",
        async () => {
            const { data } =
                await solutionAPI.getAll();

            return data;
        }
    );

export const addSolution =
    createAsyncThunk(
        "solution/add",
        async (payload) => {
            const { data } =
                await solutionAPI.create(
                    payload
                );

            return data;
        }
    );

const solutionSlice =
    createSlice({
        name: "solution",

        initialState: {
            list: [],
            status: "idle",
        },

        reducers: {},

        extraReducers: (
            builder
        ) => {
            builder
                .addCase(
                    fetchSolutions.pending,
                    (state) => {
                        state.status =
                            "loading";
                    }
                )

                .addCase(
                    fetchSolutions.fulfilled,
                    (state, action) => {
                        state.list =
                            Array.isArray(action.payload)
                                ? action.payload
                                : [];
                        state.status =
                            "succeeded";
                    }
                )

                .addCase(
                    addSolution.fulfilled,
                    (state, action) => {
                        const created =
                            action.payload?.solution ||
                            action.payload;
                        if (created) {
                            state.list.push(created);
                        }
                    }
                );
        },
    });

export default solutionSlice.reducer;