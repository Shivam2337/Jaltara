import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import {
  selectPackage,
  setDates,
} from "../../../features/booking/bookingSlice";
import "./BookingDetails.css";
import { useNavigate } from "react-router-dom";
import { getRoomsListAction, getPackagesListAction } from "../../../redux/UserActions";

export default function BookingDetails() {
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [roomOpen, setRoomOpen] = useState(false);

  const dispatch = useDispatch();

  const booking = useSelector((state) => state.booking);

  const { checkIn, checkOut, package: selectedPackage } = booking;

  const [localCheckIn, setLocalCheckIn] = useState(checkIn || "");
  const [localCheckout, setLocalCheckout] = useState(checkOut || "");

  const today = new Date().toISOString().split("T")[0];

  const { list: roomsOptions } = useSelector((s) => s.userRoomsList || { list: [] });
  const { list: vipOptions } = useSelector((s) => s.userPackagesList || { list: [] });

  const packages = [
    {
      id: "waterpark",
      label: "Water Park",
      category: "waterpark",
      price: 0,
    },
    {
      id: "resort",
      label: "Resort Stay",
      category: "resort",
      price: 0,
    },
    {
      id: "vip",
      label: "VIP Experience",
      category: "vip",
      price: 0,
    },
  ];

  const selectedCategory = selectedPackage?.category;

  const selectedPackageConfig = packages.find(
    (pkg) => pkg.category === selectedCategory
  );

  const roomsForSelected =
    selectedCategory === "resort"
      ? roomsOptions
      : selectedCategory === "vip"
      ? vipOptions
      : [];

  const isWaterpark = selectedCategory === "waterpark";

  useEffect(() => {
    if (selectedCategory === "resort") {
      dispatch(getRoomsListAction());
    } else if (selectedCategory === "vip") {
      dispatch(getPackagesListAction());
    }
  }, [selectedCategory, dispatch]);

  useEffect(() => {
    if (selectedCategory === "resort" && roomsOptions.length > 0) {
      if (!selectedPackage?.roomType) {
        const first = roomsOptions[0];
        dispatch(
          selectPackage({
            category: "resort",
            packageType: "Resort Stay",
            roomType: first.label,
            price: first.price,
          })
        );
      }
    } else if (selectedCategory === "vip" && vipOptions.length > 0) {
      if (!selectedPackage?.roomType) {
        const first = vipOptions[0];
        dispatch(
          selectPackage({
            category: "vip",
            packageType: "VIP Experience",
            roomType: first.label,
            price: first.price,
          })
        );
      }
    }
  }, [roomsOptions, vipOptions, selectedCategory, dispatch, selectedPackage?.roomType]);

  useEffect(() => {
    if (isWaterpark && localCheckIn) {
      setLocalCheckout(localCheckIn);

      dispatch(
        setDates({
          checkIn: localCheckIn,
          checkOut: localCheckIn,
        })
      );
    }
  }, [isWaterpark, localCheckIn, dispatch]);

  useEffect(() => {
    if (!selectedPackage?.category) {
      const firstPkg = packages[0];

      dispatch(
        selectPackage({
          category: firstPkg.category,
          packageType: firstPkg.label,
          roomType: null,
          price: firstPkg.price,
        })
      );
    }
  }, [dispatch, selectedPackage?.category]);

  useEffect(() => {
    if (selectedPackageConfig?.rooms && !selectedPackage?.roomType) {
      const firstRoom = selectedPackageConfig.rooms[0];

      dispatch(
        selectPackage({
          category: selectedPackageConfig.category,
          packageType: selectedPackage.packageType,
          roomType: firstRoom.label,
          price: firstRoom.price,
        })
      );
    }
  }, [selectedPackageConfig, selectedPackage?.roomType, dispatch]);

  console.log({
    category: selectedPackage?.category,
    roomType: selectedPackage?.roomType,
    checkIn,
    checkOut,
  });
  return (
    <div className="booking-s2-details-card">
      <h3 className="booking-s2-details-title">Booking Details</h3>

      <div className="booking-s2-details-field">
        <label className="booking-s2-details-label">Booking Type</label>
        {/* <select
          className="booking-s2-details-dropdown"
          value={selectedCategory || packages[0].category}
          onChange={(e) => {
            const pkg = packages.find((p) => p.category === e.target.value);

            dispatch(
              selectPackage({
                category: pkg.category,
                packageType: pkg.label,
                roomType: null,
                price: pkg.price,
              })
            );
          }}
        >
          {packages.map((pkg) => (
            <option key={pkg.id} value={pkg.category}>
              {pkg.label}
            </option>
          ))}
        </select> */}
        <div className="booking-s2-dropdown">
          <div
            className="booking-s2-dropdown-selected"
            // onClick={() => setOpen(!open)}
          >
            {packages.find((p) => p.category === selectedCategory)?.label ||
              "Select"}
            <span className="material-symbols-rounded booking-s2-dropdown-arrow">
              expand_more
            </span>
          </div>
          <div className="booking-s2-dropdown-menu">
            {packages.map((pkg) => (
              <div
                key={pkg.id}
                className={`booking-s2-dropdown-item ${
                  selectedCategory === pkg.category ? "active" : ""
                }`}
                onClick={() => {
                  dispatch(
                    selectPackage({
                      category: pkg.category,
                      packageType: pkg.label,
                      roomType: null,
                      price: pkg.price,
                    })
                  );
                  setOpen(false);
                }}
              >
                <span>{pkg.label}</span>
                {selectedCategory === pkg.category && (
                  <span className="material-symbols-rounded booking-s2-check">
                    check
                  </span>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {roomsForSelected && roomsForSelected.length > 0 && (
        <div className="booking-s2-details-field">
          <label className="booking-s2-details-label">Room Type</label>
          {/* <select
            className="booking-s2-details-dropdown"
            value={
              selectedPackageConfig.rooms.find(
                (r) => r.label === selectedPackage?.roomType
              )?.id || selectedPackageConfig.rooms[0].id
            }
            onChange={(e) => {
              const room = selectedPackageConfig.rooms.find(
                (r) => r.id === e.target.value
              );

              dispatch(
                selectPackage({
                  category: selectedPackageConfig.category,
                  packageType: selectedPackage.packageType,
                  roomType: room.label,
                  price: room.price,
                })
              );
            }}
          >
            {selectedPackageConfig.rooms.map((room) => (
              <option key={room.id} value={room.id}>
                {room.label}
              </option>
            ))}
          
          </select> */}
          <div className="booking-s2-dropdown">
            <div className="booking-s2-dropdown-selected">
              {selectedPackage?.roomType || roomsForSelected[0].label}
              <span className="material-symbols-rounded booking-s2-dropdown-arrow">
                expand_more
              </span>
            </div>
            <div className="booking-s2-dropdown-menu">
              {roomsForSelected.map((room) => (
                <div
                  key={room.id}
                  className={`booking-s2-dropdown-item ${
                    selectedPackage?.roomType === room.label ? "active" : ""
                  }`}
                  onClick={() => {
                    dispatch(
                      selectPackage({
                        category: selectedCategory,
                        packageType: selectedPackage.packageType,
                        roomType: room.label,
                        price: room.price,
                      })
                    );

                    setRoomOpen(false);
                  }}
                >
                  <span>{room.label}</span>
                  {selectedPackage?.roomType === room.label && (
                    <span className="material-symbols-rounded booking-s2-check">
                      check
                    </span>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      <div className="booking-s2-details-field">
        <label className="booking-s2-details-label">Coupon Code</label>

        <div className="booking-s2-coupon-row">
          <input
            type="text"
            placeholder="Enter coupon code"
            className="booking-s2-details-input"
          />

          <button className="booking-s2-coupon-btn">Verify</button>
        </div>
      </div>

      <div className="booking-s2-details-field">
        <label className="booking-s2-details-label">Check In</label>

        <input
          type="date"
          className="booking-s2-details-input"
          value={localCheckIn}
          min={today}
          onChange={(e) => {
            const newCheckIn = e.target.value;

            setLocalCheckIn(newCheckIn);

            if (
              localCheckout &&
              new Date(localCheckout) < new Date(newCheckIn)
            ) {
              setLocalCheckout(newCheckIn);
            }

            dispatch(
              setDates({
                checkIn: newCheckIn,
                checkOut: isWaterpark ? newCheckIn : localCheckout,
              })
            );
          }}
        />
      </div>

      <div className="booking-s2-details-field">
        <label className="booking-s2-details-label">Check Out</label>

        {isWaterpark ? (
          <input
            type="date"
            className="booking-s2-details-input"
            value={localCheckIn}
            disabled
          />
        ) : (
          <input
            type="date"
            className="booking-s2-details-input"
            value={localCheckout}
            min={localCheckIn}
            onChange={(e) => {
              const value = e.target.value;

              setLocalCheckout(value);

              dispatch(
                setDates({
                  checkIn: localCheckIn,
                  checkOut: value,
                })
              );
            }}
          />
        )}
      </div>

      <hr className="booking-s2-devider" />

      <div className="booking-s2-details-prise-row">
        <span className="booking-s2-details-prise-row-text">Subtotal</span>
        <span className="booking-s2-details-prise-value">₹0</span>
      </div>

      <div className="booking-s2-details-prise-row">
        <span className="booking-s2-details-prise-row-text">Addons</span>
        <span className="booking-s2-details-prise-value">₹0</span>
      </div>
      <hr className="booking-s2-devider" />

      <div className=" booking-s2-details-prise-row booking-s2-details-prise-row-total ">
        <div>
          <span className="booking-s2-details-prise-row-total-text">Total</span>
          <span className="booking-s2-details-prise-total-value">₹0</span>
        </div>
        <p className="booking-s2-details-payable">Payable: ₹0</p>
      </div>

      <div className="booking-s2-details-btn-div">
        <button
          className="booking-s2-details-book"
          onClick={() => navigate("/book/summary")}
        >
          Book Now
        </button>

        <button className="booking-s2-details-cancel">Cancel Booking</button>
      </div>
    </div>
  );
}
