import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import axios from "axios";

import { AppThunk } from "..";
import { TaskStatus } from "../../../config/api/clozeTests/clozeTests.types";

export interface PollingState {
  taskId: string | null;
  result: number | null; // created test id
  pollingInterval: number | null;
  loading: boolean;
  error: string | null;
}

const initialState = {
  taskId: null,
  result: null,
  pollingInterval: null,
  loading: false,
  error: null,
} as PollingState;

export const pollingSlice = createSlice({
  name: "polling",
  initialState,
  reducers: {
    setTaskId: (state, action: PayloadAction<string>) => {
      state.taskId = action.payload;
    },
    setResult: (state, action: PayloadAction<number>) => {
      state.result = action.payload;
    },
    setPollingInterval: (state, action: PayloadAction<number>) => {
      state.pollingInterval = action.payload;
    },
    clearPollingInterval: (state) => {
      if (state.pollingInterval) {
        clearInterval(state.pollingInterval);
      }
      state.pollingInterval = null;
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    setError: (state, action: PayloadAction<string>) => {
      state.error = action.payload;
    },
    resetState: (state) => {
      //eslint-disable-next-line @typescript-eslint/no-unused-vars
      state = {
        taskId: null,
        result: null,
        pollingInterval: null,
        loading: false,
        error: null,
      };
    },
  },
});

export const {
  setTaskId,
  setResult,
  setPollingInterval,
  clearPollingInterval,
  setLoading,
  setError,
  resetState,
} = pollingSlice.actions;

export const startPolling =
  (taskId: string): AppThunk =>
  (dispatch) => {
    dispatch(setTaskId(taskId));
    dispatch(setLoading(true));
    const interval = setInterval(() => dispatch(checkTaskStatus(taskId)), 500);
    dispatch(setPollingInterval(interval));
  };

export const checkTaskStatus =
  (taskId: string): AppThunk =>
  async (dispatch) => {
    try {
      const response = await axios.get<TaskStatus>(`/tasks/${taskId}/`);
      if (response.data.task_info.state === "SUCCESS") {
        dispatch(setResult(response.data.task_info.result));
        dispatch(clearPollingInterval());
        dispatch(setLoading(false));
      } else if (response.data.task_info.state === "FAILURE") {
        dispatch(clearPollingInterval());
        dispatch(
          setError(
            "Something went wrong when generating your test. Please try again.",
          ),
        );
        dispatch(setLoading(false));
      }
    } catch (error) {
      dispatch(clearPollingInterval());
      dispatch(
        setError(
          "Something went wrong when generating your test. Please try again.",
        ),
      );
      dispatch(setLoading(false));
    }
  };

export default pollingSlice.reducer;
