import { configureStore, ThunkAction, UnknownAction } from "@reduxjs/toolkit";
import pollingReducer from "./slices/polling-slice";
import snackbarReducer from "./slices/snackbar-slice";

export const store = configureStore({
  reducer: {
    polling: pollingReducer,
    snackbar: snackbarReducer,
  },
});

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;
export type AppThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  RootState,
  unknown,
  UnknownAction
>;
