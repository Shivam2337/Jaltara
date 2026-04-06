const initialState = {
  loading: false,
  user: null,
  token: localStorage.getItem("adminToken") || null,
  isAuthenticated: localStorage.getItem("adminToken") ? true : false,
  error: null
};


// ================= AUTH REDUCER =================
const authReducer = (state = initialState, action) => {

  switch (action.type) {

    // REGISTER
    case "REGISTER_REQUEST":
      return { ...state, loading: true };

    case "REGISTER_SUCCESS":
      return {
        ...state,
        loading: false,
        user: action.payload
      };

    case "REGISTER_FAILURE":
      return {
        ...state,
        loading: false,
        error: action.payload
      };

    // LOGIN
    case "LOGIN_REQUEST":
      return { ...state, loading: true };

    case "LOGIN_SUCCESS":
      return {
        ...state,
        loading: false,
        token: action.payload.access,
        user: action.payload.user,
        isAuthenticated: true
      };

    case "LOGIN_FAILURE":
      return {
        ...state,
        loading: false,
        error: action.payload
      };

    // LOGOUT
    case "ADMIN_LOGOUT":
      localStorage.removeItem("adminToken");

      return {
        ...state,
        isAuthenticated: false,
        token: null,
        user: null
      };

    default:
      return state;
  }
};


// ================= STAFF USERS REDUCER =================
export const staffUsersReducer = (state = { staffUsers: [] }, action) => {

  switch (action.type) {

    case "STAFF_USER_LIST_REQUEST":
      return { loading: true, staffUsers: [] };

    case "STAFF_USER_LIST_SUCCESS":
      return { loading: false, staffUsers: action.payload };

    case "STAFF_USER_LIST_FAILURE":
      return { loading: false, error: action.payload, staffUsers: [] };

    default:
      return state;
  }
};


export { authReducer };

export default authReducer;