import {
  USER_LOGIN_REQUEST,
  USER_LOGIN_SUCCESS,
  USER_LOGIN_FAIL,
  USER_LOGOUT,
  USER_LOGOUT_REQUEST,
  USER_LOGOUT_SUCCESS,
  USER_LOGOUT_FAIL,
  USER_REGISTER_REQUEST,
  USER_REGISTER_SUCCESS,
  USER_REGISTER_FAIL,
  USER_PASSWORD_RESET_REQUEST,
  USER_PASSWORD_RESET_SUCCESS,
  USER_PASSWORD_RESET_FAIL,
} from "./UserAuthActionTypes";

const initialState = {
  loading: false,
  user: null,
  token: null,
  error: null,
  passwordResetSent: false,
  registerSuccess: false,
  loginSuccess: false,
};

export default function UserAuthReducer(state = initialState, action) {
  switch (action.type) {
    case USER_LOGIN_REQUEST:
    case USER_REGISTER_REQUEST:
    case USER_PASSWORD_RESET_REQUEST:
      return {
        ...state,
        loading: true,
        error: null,
        passwordResetSent: false,
        registerSuccess: false,
        loginSuccess: false,
      };

    case USER_LOGIN_SUCCESS:
      return {
        ...state,
        loading: false,
        user: action.payload.user || null,
        token: action.payload.access || action.payload.token || null,
        error: null,
        loginSuccess: true,
      };

    case USER_REGISTER_SUCCESS:
      return {
        ...state,
        loading: false,
        user: action.payload.user || action.payload || null,
        error: null,
        registerSuccess: true,
      };

    case USER_PASSWORD_RESET_SUCCESS:
      return { ...state, loading: false, passwordResetSent: true, error: null };

    case USER_LOGOUT_REQUEST:
      return { ...state, loading: true };
    case USER_LOGOUT_SUCCESS:
      return { ...initialState, loading: false };
    case USER_LOGOUT_FAIL:
      return { ...initialState, loading: false, error: action.payload };

    case USER_LOGIN_FAIL:
    case USER_REGISTER_FAIL:
    case USER_PASSWORD_RESET_FAIL:
      return { ...state, loading: false, error: action.payload, registerSuccess: false, loginSuccess: false, passwordResetSent: false };

    case USER_LOGOUT:
      return { ...initialState };

    case "USER_AUTH_CLEAR":
      return {
        ...state,
        error: null,
        registerSuccess: false,
        passwordResetSent: false,
        loginSuccess: false,
      };

    default:
      return state;
  }
}
