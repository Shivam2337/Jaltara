export const AdminCouponReducer = (state = { coupons: [] }, action) => {

  switch (action.type) {

    case "COUPON_LIST_REQUEST":
      return { loading: true, coupons: [] };

    case "COUPON_LIST_SUCCESS":
      return { loading: false, coupons: action.payload };

    case "COUPON_LIST_FAIL":
      return { loading: false, error: action.payload };

    default:
      return state;
  }

};