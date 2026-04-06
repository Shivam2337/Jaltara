import holiImg from "./../assets/home/SeasonalOffers/holi-splash-festival.webp";
import WomensDay from "./../assets/home/SeasonalOffers/women's-day.webp";
import Wednesday from "./../assets/home/SeasonalOffers/wednesday-saver-combo-2.webp";
import summer from "./../assets/home/SeasonalOffers/summer-family-blast-2.webp";
import weakend from "./../assets/home/SeasonalOffers/weekend-stay-splash-2.webp";
import coorporate from "./../assets/home/SeasonalOffers/corporate-group-adventure-2.webp";

export const OffersData = [
  {
    id: 1,
    name: "Holi Splash Festival",
    description:
      "Celebrate Holi with rain dance, DJ party, organic colors & unlimited water rides.",
    package_type: "special_offer",
    duration_hours: 6,
    items: [
      { item_type: "ticket", name: "Water Park Entry", quantity: 1 },
      { item_type: "ride", name: "Unlimited Rides", quantity: 1 },
      { item_type: "meal", name: "Festival Lunch", quantity: 1 },
    ],
    pricings: [
      {
        base_price: 2499,
        included_adults: 2,
        included_children: 1,
        included_seniors: 0,
        extra_adult_price: 800,
        extra_child_price: 500,
        extra_senior_price: 400,
      },
    ],
    image: holiImg,
    badge: "HOLI SPECIAL",
  },

  {
    id: 2,
    name: "Women's Day Celebration Package",
    description:
      "Special Women’s Day offer with spa discount, rain dance & complimentary welcome drink.",
    package_type: "special_offer",
    duration_hours: 6,
    items: [
      { item_type: "ticket", name: "Water Park Entry", quantity: 1 },
      { item_type: "meal", name: "Complimentary Lunch", quantity: 1 },
    ],
    pricings: [
      {
        base_price: 1999,
        included_adults: 1,
        included_children: 0,
        included_seniors: 0,
        extra_adult_price: 700,
        extra_child_price: 400,
        extra_senior_price: 400,
      },
    ],
    image: WomensDay,
    badge: "WOMEN'S DAY",
  },

  // ========================
  // NORMAL OffersData
  // ========================

  {
    id: 3,
    name: "Wednesday Saver Combo",
    description:
      "Mid-week relaxation with deluxe room stay and water park access.",
    package_type: "combo",
    duration_hours: 8,
    items: [
      { item_type: "room", name: "Deluxe Room", quantity: 1 },
      { item_type: "ticket", name: "Water Park Entry", quantity: 2 },
    ],
    pricings: [
      {
        base_price: 3999,
        included_adults: 2,
        included_children: 2,
        included_seniors: 0,
        extra_adult_price: 900,
        extra_child_price: 600,
        extra_senior_price: 500,
      },
    ],
    image: Wednesday,
    badge: "WEDNESDAY OFFER",
  },

  {
    id: 4,
    name: "Summer Family Blast",
    description: "Beat the heat with unlimited slides & family pool access.",
    package_type: "water_park",
    duration_hours: 6,
    items: [
      { item_type: "ticket", name: "Family Entry", quantity: 4 },
      { item_type: "ride", name: "Unlimited Slides", quantity: 1 },
    ],
    pricings: [
      {
        base_price: 3499,
        included_adults: 2,
        included_children: 2,
        included_seniors: 0,
        extra_adult_price: 850,
        extra_child_price: 550,
        extra_senior_price: 450,
      },
    ],
    image: summer,
    badge: "SUMMER SPECIAL",
  },

  {
    id: 5,
    name: "Weekend Stay & Splash",
    description:
      "Premium weekend stay with breakfast and full-day water park access.",
    package_type: "combo",
    duration_hours: 12,
    items: [
      { item_type: "room", name: "Premium Room", quantity: 1 },
      { item_type: "ticket", name: "Water Park Entry", quantity: 2 },
      { item_type: "meal", name: "Breakfast", quantity: 2 },
    ],
    pricings: [
      {
        base_price: 5999,
        included_adults: 2,
        included_children: 1,
        included_seniors: 0,
        extra_adult_price: 1000,
        extra_child_price: 700,
        extra_senior_price: 600,
      },
    ],
    image: weakend,
    badge: "WEEKEND DEAL",
  },

  {
    id: 6,
    name: "Corporate Group Adventure",
    description:
      "Ideal for corporate outings with buffet meals and group activities.",
    package_type: "combo",
    duration_hours: 10,
    items: [
      { item_type: "room", name: "Premium Room", quantity: 2 },
      { item_type: "ticket", name: "Water Park Entry", quantity: 10 },
      { item_type: "meal", name: "Buffet Lunch", quantity: 10 },
    ],
    pricings: [
      {
        base_price: 14999,
        included_adults: 10,
        included_children: 0,
        included_seniors: 0,
        extra_adult_price: 900,
        extra_child_price: 600,
        extra_senior_price: 600,
      },
    ],
    image: coorporate,
    badge: "GROUP DEAL",
  },
];
