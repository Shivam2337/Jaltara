// redux/reducers/AdminDashboardReducer.js

const initialState = {
  loading: false,
  summary: null,
  lineChart: [],
  pieChart: [],
  error: null,
};

const AdminDashboardReducer = (state = initialState, action) => {
  switch (action.type) {

    case "DASHBOARD_LOADING":
      return { ...state, loading: true, error: null };

    case "DASHBOARD_SUCCESS":
      return {
        ...state,
        loading: false,
        summary: action.payload.summary,
        lineChart: action.payload.line_chart,
        pieChart: action.payload.pie_chart,
      };

    case "DASHBOARD_FAIL":
      return { ...state, loading: false, error: action.payload };

    default:
      return state;
  }
};

export default AdminDashboardReducer;