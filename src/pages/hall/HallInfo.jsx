import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getUserHallAction } from "../../redux/UserActions";
import "./HallInfo.css";

import HallHero from "./../../components/hall/HallHero";
import HallDetails from "./../../components/hall/HallDetails";
import HallGallery from "./../../components/hall/HallGallery";

import HallCta from "./../../components/hall/HallCta";

export default function HallInfo() {
  const dispatch = useDispatch();
  const { data: hallData, loading, error } = useSelector((state) => state.userHall);

  useEffect(() => {
    dispatch(getUserHallAction());
  }, [dispatch]);

  return (
    <div className="hall-page-user">
      <div className="hall-page-container-user">
        
        <HallDetails hallData={hallData} loading={loading} error={error} />

        <HallGallery hallData={hallData} loading={loading} error={error} />

      

        <HallCta hallData={hallData} />
      </div>
    </div>
  );
}
