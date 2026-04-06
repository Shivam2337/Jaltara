import PublicAPI from "../BaseAPI/PublicAPI";
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
  USER_AUTH_CLEAR,
} from "./UserAuthActionTypes";

export const loginUserAction =
  ({ username, password }) =>
  async (dispatch) => {
    dispatch({ type: USER_LOGIN_REQUEST });
    try {
      const { data } = await PublicAPI.post("auth/login/user/", {
        username,
        password,
      });
      if (data.access) {
        localStorage.setItem("userAccessToken", data.access);
      }
      if (data.refresh) {
        localStorage.setItem("userRefreshToken", data.refresh);
      }
      dispatch({ type: USER_LOGIN_SUCCESS, payload: data });
    } catch (error) {
      dispatch({
        type: USER_LOGIN_FAIL,
        payload: error.response?.data || error.message,
      });
    }
  };

export const logoutUserAction = () => async (dispatch) => {
  dispatch({ type: USER_LOGOUT_REQUEST });
  try {
    const refresh = localStorage.getItem("userRefreshToken");
    const access = localStorage.getItem("userAccessToken");
    const headers = access ? { Authorization: `Bearer ${access}` } : {};
    if (refresh) {
      await PublicAPI.post("auth/logout/", { refresh }, { headers });
    } else {
      // If no refresh token, still attempt an authenticated call to satisfy server requirements
      await PublicAPI.post("auth/logout/", {}, { headers });
    }
    dispatch({ type: USER_LOGOUT_SUCCESS });
    localStorage.removeItem("userAccessToken");
    localStorage.removeItem("userRefreshToken");
    dispatch({ type: USER_LOGOUT });
    return { ok: true };
  } catch (error) {
    dispatch({ type: USER_LOGOUT_FAIL, payload: error.response?.data || error.message });
    return { ok: false, error: error.response?.data || error.message };
  }
};

export const clearAuthFlagsAction = () => (dispatch) => {
  dispatch({ type: USER_AUTH_CLEAR });
};

export const registerUserAction =
  (form) =>
  async (dispatch) => {
    dispatch({ type: USER_REGISTER_REQUEST });
    try {
      const formData =
        form instanceof FormData
          ? form
          : (() => {
              const fd = new FormData();
              Object.entries(form || {}).forEach(([k, v]) => {
                if (v !== undefined && v !== null) fd.append(k, v);
              });
              return fd;
            })();

      if (!formData.has("is_customer")) {
        formData.append("is_customer", "true");
      }

      const { data } = await PublicAPI.post("auth/register/", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      dispatch({ type: USER_REGISTER_SUCCESS, payload: data });
    } catch (error) {
      dispatch({
        type: USER_REGISTER_FAIL,
        payload: error.response?.data || error.message,
      });
    }
  };

export const passwordResetRequestAction =
  (email) =>
  async (dispatch) => {
    dispatch({ type: USER_PASSWORD_RESET_REQUEST });
    try {
      const { data } = await PublicAPI.post("auth/password-reset/", { email });
      dispatch({ type: USER_PASSWORD_RESET_SUCCESS, payload: data });
    } catch (error) {
      dispatch({
        type: USER_PASSWORD_RESET_FAIL,
        payload: error.response?.data || error.message,
      });
    }
  };
