import trendingData from "../data/trendingData";

const TrendingNow = () => {
  return (
    <section className="py-16 px-6 md:px-16 bg-white overflow-hidden">
      <h2 className="text-2xl md:text-4xl font-bold text-center mb-16">Trending Now</h2>

      <div className="flex flex-col md:flex-row justify-center mb-10 md:mb-30 items-center gap-10 md:gap-15 relative">
        {trendingData.map((item, index) => (
          <div
            key={index}
            className={`
              relative flex-1 max-w-xs sm:max-w-sm transition-transform duration-500 group
              animate-float motion-safe:animate-float
              ${index === 0 ? "translate-y-0" : index === 1 ? "translate-y-10 md:translate-y-24" : "translate-y-5 md:translate-y-0"}
            `}
          >
            <div
              className={`flex flex-col sm:flex-row items-center gap-4
                ${index % 2 !== 0 ? "sm:flex-row-reverse" : ""}
                lg:flex-row
                ${index % 2 !== 0 ? "lg:flex-row-reverse" : ""}
              `}
            >
              {/* Image */}
              <div
                className={`w-full sm:w-1/2
                  ${index % 2 === 0 ? "translate-y-0 sm:-translate-y-4" : "translate-y-0 sm:translate-y-4"}
                  transition-all duration-500 ease-in-out
                  group/image
                `}
              >
                <img
                  src={item.image}
                  alt={item.title}
                  className="w-full h-52 sm:h-60 md:h-72 object-cover shadow-xl rounded-3xl
                    transition-transform duration-300
                    group-hover/image:[animation-play-state:paused]
                  "
                />
              </div>

              {/* Title */}
              <div
                className={`w-full sm:w-1/2 text-center sm:text-left
                  ${index % 2 === 0 ? "translate-y-0 sm:translate-y-2" : "translate-y-0 sm:-translate-y-2"}
                  transition-all duration-500 ease-in-out
                `}
              >
                <h3 className="text-lg md:text-xl font-semibold text-gray-800">{item.title}</h3>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default TrendingNow;
