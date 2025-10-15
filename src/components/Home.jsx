// src/components/Home.jsx

import Carousel from "./Carousel";
import Features from "./Features";
import TrendingNow from "./TrendingNow";
import OfferSection from "./OfferSection";
import Hero from "./Hero";
import NewsletterForm from "./NewsletterForm";
import useSWR from "swr";

const Home = () => {
  // Prefetch all target audiences
  useSWR("/products/api/detail-products/");
  useSWR("/products/api/detail-products/?target_audience=men");
  useSWR("/products/api/detail-products/?target_audience=women");
  useSWR("/products/api/detail-products/?target_audience=kids");
  useSWR("/products/api/detail-products/?page=1")

  return (
    <>
      <Hero />
      <Carousel />
      <Features />
      <TrendingNow />
      <OfferSection endDate="2026-05-31T23:59:59" />
      <NewsletterForm />
    </>
  );
};

export default Home;
