const initialState = {
  notifications: [],
  unreadCount: 0,
  loading: false,
  error: null,
};

const AdminNotificationReducer = (state = initialState, action) => {
  switch (action.type) {

    case "NOTIFICATION_LIST_REQUEST":
      return { ...state, loading: true, error: null };

    case "NOTIFICATION_LIST_SUCCESS":
      return {
        ...state,
        loading: false,
        notifications: action.payload.notifications,
        unreadCount: action.payload.unread_count,
      };

    case "NOTIFICATION_LIST_FAIL":
      return { ...state, loading: false, error: action.payload };

    // ✅ Mark all read — update local state without API refetch
    case "NOTIFICATION_MARK_ALL_READ":
      return {
        ...state,
        unreadCount: 0,
        notifications: state.notifications.map((n) => ({
          ...n,
          is_read: true,
        })),
      };

    default:
      return state;
  }
};

export default AdminNotificationReducer;