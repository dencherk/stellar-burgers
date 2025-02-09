import {
  TLoginData,
  TRegisterData,
  getUserApi,
  loginUserApi,
  logoutApi,
  registerUserApi,
  updateUserApi
} from '@api';
import {
  SerializedError,
  createAsyncThunk,
  createSlice
} from '@reduxjs/toolkit';
import { deleteCookie, setCookie } from '../../../utils/cookie';
import { TUser, RequestStatus } from '@utils-types';

type TUserState = {
  isAuthChecked: boolean;
  isAuthenticated: boolean;
  data: TUser | null;
  error?: SerializedError;
  RequestStatus: RequestStatus;
};

export const initialState: TUserState = {
  isAuthChecked: false,
  isAuthenticated: false,
  data: null,
  RequestStatus: RequestStatus.Idle
};

export const getUser = createAsyncThunk(
  'user/getUser',
  async (_, { rejectWithValue }) => {
    try {
      const response = await getUserApi();
      if (!response.success) {
        return rejectWithValue(response);
      }
      return response.user;
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

export const registerUser = createAsyncThunk<TUser, TRegisterData>(
  'users/registerUser',
  async (data, { rejectWithValue }) => {
    const response = await registerUserApi(data);
    if (!response.success) {
      return rejectWithValue(response);
    }

    const { user, refreshToken, accessToken } = response;

    localStorage.setItem('refreshToken', String(refreshToken));
    setCookie('accessToken', String(accessToken));
    return user;
  }
);

export const authUser = createAsyncThunk<TUser, TLoginData>(
  'users/login',
  async (data, { rejectWithValue }) => {
    const response = await loginUserApi(data);
    if (!response.success) {
      return rejectWithValue(response);
    }
    const { user, refreshToken, accessToken } = response;
    localStorage.setItem('refreshToken', String(refreshToken));
    setCookie('accessToken', String(accessToken));
    return user;
  }
);

export const logoutUser = createAsyncThunk(
  'users/logoutUser',
  async (_, { rejectWithValue }) => {
    const response = await logoutApi();
    if (!response.success) {
      return rejectWithValue(response);
    }
    localStorage.clear();
    deleteCookie('accessToken');
  }
);

export const updateUser = createAsyncThunk<TUser, Partial<TRegisterData>>(
  'users/updateUser',
  async (data, { rejectWithValue }) => {
    const response = await updateUserApi(data);
    if (!response.success) {
      return rejectWithValue(response);
    }
    return response.user;
  }
);

const slice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    authCheck: (state) => {
      state.isAuthChecked = true;
    },
    userLogout: (state) => {
      state.data = null;
    },
    setUser: (state, action) => {
      state.data = action.payload;
    }
  },
  selectors: {
    getUserData: (state) => state.data,
    getUserLoading: (state) => state.RequestStatus,
    isAuthChecked: (state) => state.isAuthChecked,
    isAuthenticated: (state) => state.isAuthenticated,
    getError: (state) => state.error
  },
  extraReducers: (builder) => {
    builder
      .addCase(getUser.pending, (state) => {
        state.RequestStatus = RequestStatus.Loading;
      })
      .addCase(getUser.fulfilled, (state, action) => {
        state.data = action.payload;
        state.isAuthChecked = true;
        state.isAuthenticated = true;
        state.RequestStatus = RequestStatus.Success;
      })
      .addCase(getUser.rejected, (state, action) => {
        state.error = action.meta.rejectedWithValue
          ? (action.payload as SerializedError)
          : action.error;
        state.RequestStatus = RequestStatus.Failed;
      });
    builder
      .addCase(registerUser.pending, (state) => {
        state.RequestStatus = RequestStatus.Loading;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.data = action.payload;
        state.isAuthChecked = true;
        state.isAuthenticated = true;
        state.RequestStatus = RequestStatus.Success;
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.RequestStatus = RequestStatus.Failed;
      });
    builder
      .addCase(authUser.pending, (state) => {
        state.RequestStatus = RequestStatus.Loading;
      })
      .addCase(authUser.fulfilled, (state, action) => {
        state.data = action.payload;
        state.isAuthChecked = true;
        state.isAuthenticated = true;
        state.RequestStatus = RequestStatus.Success;
      })
      .addCase(authUser.rejected, (state, action) => {
        state.RequestStatus = RequestStatus.Failed;
      });
    builder
      .addCase(logoutUser.pending, (state) => {
        state.RequestStatus = RequestStatus.Loading;
      })
      .addCase(logoutUser.fulfilled, (state) => {
        state.data = null;
        state.isAuthChecked = true;
        state.isAuthenticated = false;
        state.RequestStatus = RequestStatus.Success;
      })
      .addCase(logoutUser.rejected, (state, action) => {
        state.RequestStatus = RequestStatus.Failed;
      });
  }
});

export const {
  getUserData,
  getUserLoading,
  isAuthChecked,
  isAuthenticated,
  getError
} = slice.selectors;
export const { setUser } = slice.actions;
export default slice.reducer;
