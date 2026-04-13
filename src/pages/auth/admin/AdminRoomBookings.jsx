import React, { useEffect } from "react";

import { FaTrash, FaBell } from "react-icons/fa";

import { useDispatch, useSelector } from "react-redux";

import {
  getBookingsAction,
  deleteBookingAction
} from "../../../redux/actions/AdminRoomBookingAction";

const AdminRoomBookings = () => {

  const dispatch = useDispatch();

  const { bookings } = useSelector((state) => state.bookings);


  useEffect(() => {

    dispatch(getBookingsAction());

  }, [dispatch]);


  const handleDelete = (id) => {

    if (window.confirm("Delete this booking?")) {

      dispatch(deleteBookingAction(id));

    }

  };


  return (

<div className="booking-container">


{/* TOP BAR */}

<div className="top-bar">

<h2>Room Bookings</h2>

<FaBell className="bell-icon"/>

</div>


{/* TABLE */}

<div className="table-wrapper">

<table className="booking-table">

<thead>

<tr>
<th>ID</th>
<th>User</th>
<th>Room</th>
<th>Check In</th>
<th>Check Out</th>
<th>Status</th>
<th>Action</th>
</tr>

</thead>


<tbody>

{!bookings || bookings.length === 0 ? (

<tr>
<td colSpan="7" className="no-data">
No Bookings Found
</td>
</tr>

) : (

bookings.map((item) => (

<tr key={item.id}>

<td>{item.id}</td>
<td>{item.user}</td>
<td>{item.room}</td>
<td>{item.check_in}</td>
<td>{item.check_out}</td>
<td>{item.status}</td>

<td>

<button
className="delete-btn"
onClick={() => handleDelete(item.id)}
>
<FaTrash/>
</button>

</td>

</tr>

))

)}

</tbody>

</table>

</div>

</div>

);

};

export default AdminRoomBookings;