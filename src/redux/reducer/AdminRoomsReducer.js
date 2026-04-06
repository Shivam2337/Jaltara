// redux/reducers/AdminRoomsReducer.js

const initialState = {
  rooms: [],
  loading: false,
  error: null,
};

const AdminRoomsReducer = (state = initialState, action) => {
  switch (action.type) {
    /* ================= GET ROOMS ================= */
    case "ROOMS_REQUEST":
      return { ...state, loading: true };
    case "ROOMS_SUCCESS":
      return { ...state, loading: false, rooms: action.payload };
    case "ROOM_FAIL":
      return { ...state, loading: false, error: action.payload };

    /* ================= CREATE ROOM ================= */
    case "ROOM_CREATE_REQUEST":
      return { ...state, loading: true };
    case "ROOM_CREATE_SUCCESS":
      return {
        ...state,
        loading: false,
        rooms: [...state.rooms, action.payload], // add new room
      };
    case "ROOM_CREATE_FAIL":
      return { ...state, loading: false, error: action.payload };

    /* ================= UPDATE ROOM ================= */
    case "ROOM_UPDATE_REQUEST":
      return { ...state, loading: true };
    case "ROOM_UPDATE_SUCCESS":
      return {
        ...state,
        loading: false,
        rooms: state.rooms.map((room) =>
          room.id === action.payload.id ? action.payload : room
        ),
      };
    case "ROOM_UPDATE_FAIL":
      return { ...state, loading: false, error: action.payload };

    /* ================= DELETE ROOM ================= */
    case "ROOM_DELETE_REQUEST":
      return { ...state, loading: true };
    case "ROOM_DELETE_SUCCESS":
      return {
        ...state,
        loading: false,
        rooms: state.rooms.filter((room) => room.id !== action.payload),
      };
    case "ROOM_DELETE_FAIL":
      return { ...state, loading: false, error: action.payload };

    default:
      return state;
  }
};

export default AdminRoomsReducer;