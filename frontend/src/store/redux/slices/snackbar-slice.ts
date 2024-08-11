import { AlertColor } from "@mui/material";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface SnackbarState {
  isSnackbarVisible: boolean;
  message: string;
  severity: AlertColor;
}

const snackbarSlice = createSlice({
  name: "snackbar",
  initialState: {
    isSnackbarVisible: false,
    message: "",
    severity: "success",
  } as SnackbarState,
  reducers: {
    show(
      state,
      action: PayloadAction<{ message: string; severity?: AlertColor }>,
    ) {
      state.isSnackbarVisible = true;
      state.message = action.payload.message;
      state.severity = action.payload.severity || "success";
    },
    hide(state) {
      state.isSnackbarVisible = false;
      state.message = "";
      state.severity = "success";
    },
  },
});

export const { show, hide } = snackbarSlice.actions;

export default snackbarSlice.reducer;
