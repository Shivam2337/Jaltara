import React from "react";

import img_1 from "./../../assets/aboutPage/about-page-story.webp";

import "./AboutStory.css";

export default function AboutStory({ aboutData, loading, error }) {
  if (loading) {
    return (
      <section className="about-page-story">
        <div className="about-page-story-img-wrapper">
          <img className="about-page-story-img" src={img_1} alt="water park" />
        </div>
        <div className="about-page-story-text-box">
          <h2 className="about-page-story-text-heading">- Our Story</h2>
          <p className="about-page-story-text">Loading...</p>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="about-page-story">
        <div className="about-page-story-img-wrapper">
          <img className="about-page-story-img" src={img_1} alt="water park" />
        </div>
        <div className="about-page-story-text-box">
          <h2 className="about-page-story-text-heading">- Our Story</h2>
          <p className="about-page-story-text">Failed to load content</p>
        </div>
      </section>
    );
  }

  const storyText = aboutData?.description || "Jaltara Parks was created with a simple goal — to build the perfect destination for families, friends and adventure lovers.\n\nOur park combines thrilling water rides, relaxing resort stays and entertainment for all ages.\n\nSafety, cleanliness and hospitality are at the heart of everything we do.";
  const imageUrl = aboutData?.main_image || img_1;
  const paragraphs = storyText.split("\n").filter(p => p.trim());

  return (
    <section className="about-page-story">
      <div className="about-page-story-img-wrapper">
        <img className="about-page-story-img" src={imageUrl} alt="water park" />
      </div>

      <div className="about-page-story-text-box">
        <h2 className="about-page-story-text-heading">- Our Story</h2>

        {paragraphs.map((paragraph, index) => (
          <p key={index} className="about-page-story-text">
            {paragraph.trim()}
          </p>
        ))}
      </div>
    </section>
  );
}
