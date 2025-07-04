// src/components/Home.jsx

import Carousel from "./Carousel";
import Features from "./Features";
import TrendingNow from "./TrendingNow";
import OfferSection from "./OfferSection";
import Hero from "./Hero";
import NewsletterForm from "./NewsletterForm";

const Home = () => (
  <>
    <Hero />
    <Carousel />
    <Features />
    <TrendingNow />
    <OfferSection endDate="2026-05-31T23:59:59" />
    <NewsletterForm />
  </>
);

export default Home;
