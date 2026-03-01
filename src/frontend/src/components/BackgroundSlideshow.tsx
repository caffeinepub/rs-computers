import { AnimatePresence, motion } from "motion/react";
import { useEffect, useState } from "react";

const SLIDES = [
  "/assets/generated/bg-slide1.dim_1920x1080.jpg",
  "/assets/generated/bg-slide2.dim_1920x1080.jpg",
  "/assets/generated/bg-slide3.dim_1920x1080.jpg",
  "/assets/generated/bg-slide4.dim_1920x1080.jpg",
] as const;

const SLIDE_DURATION = 5000; // ms per slide
const TRANSITION_DURATION = 1.4; // seconds for crossfade

export function BackgroundSlideshow() {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % SLIDES.length);
    }, SLIDE_DURATION);
    return () => clearInterval(timer);
  }, []);

  return (
    <div
      className="fixed inset-0 overflow-hidden"
      style={{ zIndex: -2 }}
      aria-hidden="true"
    >
      {/* Slideshow layers — stacked, crossfading */}
      <AnimatePresence initial={false}>
        <motion.div
          key={current}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: TRANSITION_DURATION, ease: "easeInOut" }}
          className="absolute inset-0"
          style={{
            backgroundImage: `url(${SLIDES[current]})`,
            backgroundSize: "cover",
            backgroundPosition: "center center",
            backgroundRepeat: "no-repeat",
          }}
        />
      </AnimatePresence>

      {/* Dark overlay for text readability — always on top of images */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(135deg, rgba(4, 6, 18, 0.80) 0%, rgba(4, 8, 22, 0.72) 100%)",
          zIndex: 1,
        }}
      />
    </div>
  );
}
