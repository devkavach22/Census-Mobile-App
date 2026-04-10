import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { api } from "../api/axios";
import { ENDPOINTS } from "../api/endpoints";
import { setStorageData } from "../../utils/storage";
import STORAGE_KEYS from "../../utils/storageKeys";

interface ReportState {
  token: string | null;
  userData: any;
  DashboardStatesData: any;
  isLogin: boolean;
  loading: boolean;

  error: string | null;
  success: string | null;
}

const initialState: ReportState = {
  token: null,
  userData: [],
  DashboardStatesData: [],
  isLogin: false,
  loading: false,

  error: null,
  success: null,
};

//
// ============================
// Error Handler
// ============================

const errorMassage = (error: any) => {
  if (error === "Network Error") {
    return "Server not responding. Please try again later."
  }
  return error
}
const handleThunkError = (error: any, rejectWithValue: any) => {
  const message =
    error?.response?.data?.message ||
    error?.response?.data?.error ||
    error?.message
  return rejectWithValue(errorMassage(message));
};

//
// ============================
// 🔐 AUTH APIs
// ============================


export const LoginWithSendOtpApi = createAsyncThunk(
  "LoginWithSendotpApi",
  async (payload:any, { rejectWithValue }) => {
    try {
      const response = await api.post(ENDPOINTS.LOGIN_SEND_OTP, payload);
      return response.data;
    } catch (error: any) {
      return handleThunkError(error, rejectWithValue);
    }
  }
);

export const LoginWithVerifyOtpApi = createAsyncThunk(
  "LoginWithVerifyOtpApi",
  async (payload: any, { rejectWithValue }) => {
    try {
      const response = await api.post(ENDPOINTS.LOGIN_VERIFY_OTP, payload);
      // console.log("LoginWithVerifyOtpApi response===>", response.data.data)
      const { token } = response.data.data;
      await setStorageData(STORAGE_KEYS.TOKEN, token);
      return response.data;
    } catch (error: any) {
      return handleThunkError(error, rejectWithValue);
    }
  }
);

export const LoginWithPasswordApi = createAsyncThunk(
  "LoginWithPasswordApi",
  async (payload: any, { rejectWithValue }) => {
    try {
      const response = await api.post(ENDPOINTS.LOGIN_WITH_PASSWORD, payload);
      const { token } = response.data.data;
      await setStorageData(STORAGE_KEYS.TOKEN, token);
      return response.data;
    } catch (error: any) {
      return handleThunkError(error, rejectWithValue);
    }
  }
);

export const LoginWithAadhaarApi = createAsyncThunk(
  "LoginWithAadhaarApi",
  async (payload: any, { rejectWithValue }) => {
    try {
      const response = await api.post(ENDPOINTS.LOGIN_WITH_AADHAAR, payload);
      const { token } = response.data.data;
      await setStorageData(STORAGE_KEYS.TOKEN, token);
      return response.data;
    } catch (error: any) {
      return handleThunkError(error, rejectWithValue);
    }
  }
);

export const ForgotPasswordApi = createAsyncThunk(
  "ForgotPasswordApi",
  async (payload: any, { rejectWithValue }) => {
    try {
      const response = await api.post(ENDPOINTS.FORGOT_PASSWORD, payload);
      return response.data;
    } catch (error: any) {
      return handleThunkError(error, rejectWithValue);
    }
  }
);

export const ResetPasswordApi = createAsyncThunk(
  "ResetPasswordApi",
  async (payload: any, { rejectWithValue }) => {
    try {
      const response = await api.post(ENDPOINTS.RESET_PASSWORD, payload);
      return response.data;
    } catch (error: any) {
      return handleThunkError(error, rejectWithValue);
    }
  }
);

//  ===========================================================================================

// ============================
// 🔐 DASHBOARD APIs
// ============================

export const DashboardStatesApi = createAsyncThunk(
  "DashboardStatesApi",
  async (payload: any, { rejectWithValue }) => {
    try {
      const response = await api.get(ENDPOINTS.DASHBOARD_STATES, payload);
      return response.data;
    } catch (error: any) {
      return handleThunkError(error, rejectWithValue);
    }
  }
);

// ============================
// Slice
// ============================

const commonSlice = createSlice({
  name: "common",
  initialState,
  reducers: {

    logout(state) {
      state.token = null;
      state.success = "Logged out successfully";
    },
    clearError(state) {
      state.error = null;
    },
    clearSuccess(state) {
      state.success = null;
    },
    clearMessages(state) {
      state.error = null;
      state.success = null;
    },
    updateState(state, action: PayloadAction<Partial<ReportState>>) {
      return { ...state, ...action.payload };
    },
  },
  extraReducers: (builder) => {
    builder

      // ======================
      // addCase FIRST
      // ======================

      .addCase(LoginWithSendOtpApi.fulfilled, (state, action: PayloadAction<any>) => {
        state.success = action.payload.message;
      })
      
      .addCase(LoginWithVerifyOtpApi.fulfilled, (state,action: PayloadAction<any>) => {
        state.isLogin = true;
        state.userData = action.payload.data.user
        state.success = action.payload.message;
      })

      .addCase(LoginWithPasswordApi.fulfilled, (state, action: PayloadAction<any>) => {
        state.isLogin = true;
        state.userData = action.payload.data.user
        state.success = action.payload.message;
      })

      .addCase(LoginWithAadhaarApi.fulfilled, (state, action: PayloadAction<any>) => {
        state.isLogin = true;
        state.userData = action.payload.data.user
        state.success = action.payload.message;
      })

      .addCase(ForgotPasswordApi.fulfilled, (state, action: PayloadAction<any>) => {
        state.success = action.payload.message;
      })

      .addCase(ResetPasswordApi.fulfilled, (state, action: PayloadAction<any>) => {
        state.success = action.payload.message;
      })

      .addCase(DashboardStatesApi.fulfilled, (state, action: PayloadAction<any>) => {
        state.DashboardStatesData = action.payload;
      })



      // ======================
      // addMatcher LAST
      // ======================

      .addMatcher(
        (action) =>
          action.type.endsWith("/pending"),
        (state) => {
          state.loading = true;
          state.error = null;
          state.success = null;
        }
      )

      .addMatcher(
        (action) => action.type.endsWith("/rejected"),
        (state, action: any) => {
          state.loading = false;
          state.error = action.payload;
        }
      )

      .addMatcher(
        (action) => action.type.endsWith("/fulfilled"),
        (state) => {
          state.loading = false;
        }
      )
  },
});

export const { logout, clearError, clearSuccess, clearMessages , updateState } = commonSlice.actions;

export default commonSlice.reducer;