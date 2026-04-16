import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { api } from '../api/axios';
import { ENDPOINTS } from '../api/endpoints';
import { setStorageData, STORAGE_KEYS } from '../../utils/storage';

interface ReportState {
  token: string | null;
  userData: any;
  notifications: any;
  SurveryQuestionData: any;
  geoData: any;
  states: any;
  districts: any;
  questions: any;
  profile: any;
  DashboardStatesData: any;
  DistrictDashboardData: any;
  StateDashboardData: any;
  NationalDashboardData: any;
  isLogin: boolean;
  loading: boolean;
  error: string | null;
  success: string | null;
}

const initialState: ReportState = {
  token: null,
  userData: null,
  DashboardStatesData: [],
  DistrictDashboardData: {},
  StateDashboardData: {},
  NationalDashboardData: {},
  notifications: [],
  SurveryQuestionData: [],
  geoData: [],
  states: [],
  districts: [],
  questions: [],
  profile: null,
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
  if (error === 'Network Error') {
    return 'Server not responding. Please try again later.';
  }
  return error;
};
const handleThunkError = (error: any, rejectWithValue: any) => {
  const message =
    error?.response?.data?.message ||
    error?.response?.data?.error ||
    error?.message;
  return rejectWithValue(errorMassage(message));
};

//
// ============================
// 🔐 AUTH APIs
// ============================

export const LoginWithSendOtpApi = createAsyncThunk(
  'LoginWithSendotpApi',
  async (payload: any, { rejectWithValue }) => {
    try {
      const response = await api.post(ENDPOINTS.LOGIN_SEND_OTP, payload);
      return response.data;
    } catch (error: any) {
      return handleThunkError(error, rejectWithValue);
    }
  },
);

export const LoginWithVerifyOtpApi = createAsyncThunk(
  'LoginWithVerifyOtpApi',
  async (payload: any, { rejectWithValue }) => {
    try {
      const response = await api.post(ENDPOINTS.LOGIN_VERIFY_OTP, payload);

      const { token } = response.data.data;
      await setStorageData(STORAGE_KEYS.TOKEN, token);
      return response.data;
    } catch (error: any) {
      return handleThunkError(error, rejectWithValue);
    }
  },
);

export const LoginWithPasswordApi = createAsyncThunk(
  'LoginWithPasswordApi',
  async (payload: any, { rejectWithValue }) => {
    try {
      const response = await api.post(ENDPOINTS.LOGIN_WITH_PASSWORD, payload);
      const { token } = response.data.data;
      await setStorageData(STORAGE_KEYS.TOKEN, token);
      return response.data;
    } catch (error: any) {
      return handleThunkError(error, rejectWithValue);
    }
  },
);

export const LoginWithAadhaarApi = createAsyncThunk(
  'LoginWithAadhaarApi',
  async (payload: any, { rejectWithValue }) => {
    try {
      const response = await api.post(ENDPOINTS.LOGIN_WITH_AADHAAR, payload);
      const { token } = response.data.data;
      await setStorageData(STORAGE_KEYS.TOKEN, token);
      return response.data;
    } catch (error: any) {
      return handleThunkError(error, rejectWithValue);
    }
  },
);

export const ForgotPasswordApi = createAsyncThunk(
  'ForgotPasswordApi',
  async (payload: any, { rejectWithValue }) => {
    try {
      const response = await api.post(ENDPOINTS.FORGOT_PASSWORD, payload);
      return response.data;
    } catch (error: any) {
      return handleThunkError(error, rejectWithValue);
    }
  },
);

export const ResetPasswordApi = createAsyncThunk(
  'ResetPasswordApi',
  async (payload: any, { rejectWithValue }) => {
    try {
      const response = await api.post(ENDPOINTS.RESET_PASSWORD, payload);
      return response.data;
    } catch (error: any) {
      return handleThunkError(error, rejectWithValue);
    }
  },
);

//  ===========================================================================================

// ============================
// 🔐 DASHBOARD APIs
// ============================

export const DashboardStatesApi = createAsyncThunk(
  'DashboardStatesApi',
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get(ENDPOINTS.DASHBOARD_STATES);
      return response.data.data;
    } catch (error: any) {
      return handleThunkError(error, rejectWithValue);
    }
  },
);

export const GetNotificationsApi = createAsyncThunk(
  'GetNotificationsApi',
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get(ENDPOINTS.NOTIFICATIONS);
      return response.data;
    } catch (error: any) {
      return handleThunkError(error, rejectWithValue);
    }
  },
);

export const CreateHouseholdApi = createAsyncThunk(
  'CreateHouseholdApi',
  async (payload: any, { rejectWithValue }) => {
    try {
      console.log(
        'PAYLAOD CreateHouseholdApi ===>',
        JSON.stringify(payload, null, 2),
      );
      const response = await api.post(ENDPOINTS.CREATE_HOUSEHOLD, payload);
      return response.data;
    } catch (error: any) {
      return handleThunkError(error, rejectWithValue);
    }
  },
);

export const GetGeoDataApi = createAsyncThunk(
  'GetGeoDataApi',
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get(ENDPOINTS.GEO_DATA);
      return response.data;
    } catch (error: any) {
      return handleThunkError(error, rejectWithValue);
    }
  },
);

export const SurveySubmitApi = createAsyncThunk(
  'SurveySubmitApi',
  async (payload: any, { rejectWithValue }) => {
    try {
      const response = await api.post(ENDPOINTS.SURVEY_SUBMIT, payload);
      return response.data;
    } catch (error: any) {
      return handleThunkError(error, rejectWithValue);
    }
  },
);

export const GetQuestionsApi = createAsyncThunk(
  'GetQuestionsApi',
  async (params: any, { rejectWithValue }) => {
    try {
      const response = await api.get(ENDPOINTS.GET_QUESTIONS, { params });
      return response.data;
    } catch (error: any) {
      return handleThunkError(error, rejectWithValue);
    }
  },
);

export const GetStatesApi = createAsyncThunk(
  'GetStatesApi',
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get(ENDPOINTS.GET_STATES);
      return response.data;
    } catch (error: any) {
      return handleThunkError(error, rejectWithValue);
    }
  },
);

export const GetDistrictsApi = createAsyncThunk(
  'GetDistrictsApi',
  async (params: any, { rejectWithValue }) => {
    try {
      const response = await api.get(
        `${ENDPOINTS.GET_DISTRICTS}?state_id=${params.stateId}`,
      );
      return response.data;
    } catch (error: any) {
      return handleThunkError(error, rejectWithValue);
    }
  },
);

export const GetGeofiltersOptionsApi = createAsyncThunk(
  'GetGeofiltersOptionsApi',
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get(ENDPOINTS.GEO_FILTER_OPTIONS);
      console.log('response====>', response);
      return response.data;
    } catch (error: any) {
      return handleThunkError(error, rejectWithValue);
    }
  },
);

export const GetProfileApi = createAsyncThunk(
  'GetProfileApi',
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get(ENDPOINTS.GET_PROFILE);
      return response.data;
    } catch (error: any) {
      return handleThunkError(error, rejectWithValue);
    }
  },
);

export const UpdateProfileApi = createAsyncThunk(
  'UpdateProfileApi',
  async (payload: any, { rejectWithValue }) => {
    try {
      const response = await api.post(ENDPOINTS.UPDATE_PROFILE, payload);
      return response.data;
    } catch (error: any) {
      return handleThunkError(error, rejectWithValue);
    }
  },
);

export const GetSurveyQuestionsApi = createAsyncThunk(
  'GetSurveyQuestionsApi',
  async (payload: any, { rejectWithValue }) => {
    try {
      const response = await api.get(
        `${ENDPOINTS.GET_SURVEY_QUESTIONS}${payload.id}`,
      );
      return response.data;
    } catch (error: any) {
      return handleThunkError(error, rejectWithValue);
    }
  },
);

export const GetDistrictDashboardApi = createAsyncThunk(
  'GetDistrictDashboardApi',
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get(ENDPOINTS.DISTRICT_DASHBOARD);
      return response.data.data;
    } catch (error: any) {
      return handleThunkError(error, rejectWithValue);
    }
  },
);

export const GetStateDashboardApi = createAsyncThunk(
  'GetStateDashboardApi',
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get(ENDPOINTS.STATE_DASHBOARD);
      return response.data.data;
    } catch (error: any) {
      return handleThunkError(error, rejectWithValue);
    }
  },
);

export const GetNationalDashboardApi = createAsyncThunk(
  'GetNationalDashboardApi',
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get(ENDPOINTS.NATIONAL_DASHBOARD);
      return response.data.data;
    } catch (error: any) {
      return handleThunkError(error, rejectWithValue);
    }
  },
);

// ============================
// Slice
// ============================

const commonSlice = createSlice({
  name: 'common',
  initialState,
  reducers: {
    logout(state) {
      state.token = null;
      state.success = 'Logged out successfully';
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
  extraReducers: builder => {
    builder

      // ======================
      // addCase FIRST
      // ======================

      .addCase(
        LoginWithSendOtpApi.fulfilled,
        (state, action: PayloadAction<any>) => {
          state.success = action.payload.message;
        },
      )

      .addCase(
        LoginWithVerifyOtpApi.fulfilled,
        (state, action: PayloadAction<any>) => {
          state.isLogin = true;
          state.userData = action.payload.data.user;
          state.success = action.payload.message;
        },
      )

      .addCase(
        LoginWithPasswordApi.fulfilled,
        (state, action: PayloadAction<any>) => {
          state.isLogin = true;
          state.userData = action.payload.data.user;
          state.success = action.payload.message;
        },
      )

      .addCase(
        LoginWithAadhaarApi.fulfilled,
        (state, action: PayloadAction<any>) => {
          state.isLogin = true;
          state.userData = action.payload.data.user;
          state.success = action.payload.message;
        },
      )

      .addCase(
        ForgotPasswordApi.fulfilled,
        (state, action: PayloadAction<any>) => {
          state.success = action.payload.message;
        },
      )

      .addCase(
        ResetPasswordApi.fulfilled,
        (state, action: PayloadAction<any>) => {
          state.success = action.payload.message;
        },
      )

      .addCase(
        DashboardStatesApi.fulfilled,
        (state, action: PayloadAction<any>) => {
          state.DashboardStatesData = action.payload;
        },
      )

      .addCase(
        GetDistrictDashboardApi.fulfilled,
        (state, action: PayloadAction<any>) => {
          state.DistrictDashboardData = action.payload;
        },
      )

      .addCase(
        GetStateDashboardApi.fulfilled,
        (state, action: PayloadAction<any>) => {
          state.StateDashboardData = action.payload;
        },
      )

      .addCase(
        GetNationalDashboardApi.fulfilled,
        (state, action: PayloadAction<any>) => {
          state.NationalDashboardData = action.payload;
        },
      )

      .addCase(GetNotificationsApi.fulfilled, (state, action) => {
        state.notifications = action.payload.data;
      })

      .addCase(GetSurveyQuestionsApi.fulfilled, (state, action) => {
        state.SurveryQuestionData = action.payload.data;
      })

      .addCase(GetGeoDataApi.fulfilled, (state, action) => {
        state.geoData = action.payload.data;
      })

      .addCase(GetStatesApi.fulfilled, (state, action) => {
        state.states = action.payload.data;
      })

      .addCase(GetDistrictsApi.fulfilled, (state, action) => {
        state.districts = action.payload.data;
      })

      .addCase(GetQuestionsApi.fulfilled, (state, action) => {
        state.questions = action.payload.data;
      })

      .addCase(GetProfileApi.fulfilled, (state, action) => {
        state.profile = action.payload.data;
      })

      .addCase(UpdateProfileApi.fulfilled, (state, action) => {
        state.success = action.payload.message;
      })

      .addCase(CreateHouseholdApi.fulfilled, (state, action) => {
        state.success = action.payload.message;
      })

      .addCase(SurveySubmitApi.fulfilled, (state, action) => {
        state.success = action.payload.message;
      })

      // ======================
      // addMatcher LAST
      // ======================

      .addMatcher(
        action => action.type.endsWith('/pending'),
        state => {
          state.loading = true;
          state.error = null;
          state.success = null;
        },
      )

      .addMatcher(
        action => action.type.endsWith('/rejected'),
        (state, action: any) => {
          state.loading = false;
          state.error = action.payload;
        },
      )

      .addMatcher(
        action => action.type.endsWith('/fulfilled'),
        state => {
          state.loading = false;
        },
      );
  },
});

export const { logout, clearError, clearSuccess, clearMessages, updateState } =
  commonSlice.actions;

export default commonSlice.reducer;
