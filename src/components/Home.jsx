// src/components/Home.jsx

import Carousel from "./Carousel";
import Features from "./Features";
import TrendingNow from "./TrendingNow";
import OfferSection from "./OfferSection";

const Home = () => (
  <>
    <Carousel />
    <Features />
    <TrendingNow />
    <OfferSection endDate="2025-05-31T23:59:59" />
  </>
);

export default Home;
