// import React from "react";
// import "./AboutUs.css";

// export default function AboutUs() {
//   return (
//     <div className="aboutPage-wrapper">
//       <h1 className="aboutPage-heading">About Us</h1>

//       <div className="aboutPage-content">
//         <p className="aboutPage-text">
//           Welcome to our Waterpark Resort! We are dedicated to providing an
//           unforgettable experience for families, couples, and adventure seekers.
//         </p>

//         <p className="aboutPage-text">
//           Our resort features state-of-the-art water parks, thrilling rides,
//           comfortable stays, and seasonal packages designed for every occasion.
//         </p>

//         <p className="aboutPage-text">
//           With a focus on safety, fun, and relaxation, we ensure every visit is
//           memorable. Join us and create lasting memories!
//         </p>
//       </div>
//     </div>
//   );
// }

import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getUserAboutAction } from "../../redux/UserActions";
import "./AboutUs.css";

import AboutHero from "./../../components/aboutPage/AboutHero";
import AboutStory from "./../../components/aboutPage/AboutStory";
import AboutFeatures from "./../../components/aboutPage/AboutFeatures";
import AboutStats from "./../../components/aboutPage/AboutStats";
import AboutCta from "./../../components/aboutPage/AboutCta";

export default function AboutUs() {
  const dispatch = useDispatch();
  const { data: aboutData, loading, error } = useSelector((state) => state.userAbout);

  useEffect(() => {
    dispatch(getUserAboutAction());
  }, [dispatch]);

  return (
    <div className="about-page">
      <div className="about-page-container">
        <AboutHero
          title={aboutData?.title}
          description={aboutData?.description?.split("\n\n")[0]}
        />

        <AboutStory aboutData={aboutData} loading={loading} error={error} />

        <AboutFeatures aboutData={aboutData} loading={loading} error={error} />

        <AboutStats aboutData={aboutData} />

        <AboutCta />
      </div>
    </div>
  );
}
