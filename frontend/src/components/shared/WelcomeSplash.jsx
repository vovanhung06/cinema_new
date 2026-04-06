import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';

const WelcomeSplash = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const hasSeenSplash = sessionStorage.getItem('cinema_has_seen_splash');
    
    if (!hasSeenSplash) {
      setIsVisible(true);
      
      const timer = setTimeout(() => {
        setIsVisible(false);
        sessionStorage.setItem('cinema_has_seen_splash', 'true');
      }, 3000); 
      
      return () => clearTimeout(timer);
    }
  }, []);

  const text = "CINEMA+".split("");

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, transition: { duration: 0.8, ease: "easeInOut" } }}
          className="fixed inset-0 z-[99999] flex flex-col items-center justify-center bg-black overflow-hidden perspective-[1000px]"
        >
          <style>
            {`
              @import url('https://fonts.googleapis.com/css2?family=Montserrat:wght@800;900&display=swap');
              .font-cinema {
                font-family: 'Montserrat', sans-serif;
              }
            `}
          </style>

          {/* Gentle Ambient Glow */}
          <motion.div 
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: [1, 2, 1.5], opacity: [0, 0.15, 0] }}
            transition={{ duration: 3, ease: "easeInOut" }}
            className="absolute w-[80vw] h-[80vw] md:w-[40vw] md:h-[40vw] bg-primary/50 rounded-full blur-[200px] -z-20"
          />

          {/* Cinematic Particles / Stars */}
          {[...Array(12)].map((_, i) => (
            <motion.div
              key={i}
              initial={{ 
                x: (Math.random() - 0.5) * window.innerWidth, 
                y: (Math.random() - 0.5) * window.innerHeight,
                scale: 0,
                opacity: 0
              }}
              animate={{ 
                y: (Math.random() - 0.5) * window.innerHeight * 1.5,
                scale: Math.random() * 2,
                opacity: [0, Math.random(), 0]
              }}
              transition={{ duration: 2 + Math.random() * 2, ease: "linear" }}
              className="absolute w-1 h-1 bg-white rounded-full blur-[1px] -z-10"
            />
          ))}

          <motion.div
            initial={{ rotateX: 60, scale: 0.5, opacity: 0, y: 100 }}
            animate={{ rotateX: 0, scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 5, filter: "blur(20px)", opacity: 0 }}
            transition={{ duration: 1.2, ease: "easeOut" }}
            className="flex flex-col items-center relative"
          >
            <h1 className="text-5xl md:text-7xl lg:text-8xl font-black uppercase font-cinema tracking-[0.2em] flex items-center relative z-10">
              {text.map((char, index) => {
                return (
                  <motion.span
                    key={index}
                    initial={{ opacity: 0, y: -50, filter: "blur(10px)", rotateY: 90 }}
                    animate={{ opacity: 1, y: 0, filter: "blur(0px)", rotateY: 0 }}
                    transition={{ delay: 0.1 * index, duration: 0.8, type: "spring", stiffness: 100 }}
                    className="inline-block text-primary"
                    style={{ textShadow: '0 0 30px rgba(229,9,20,0.8)' }}
                  >
                    {char}
                  </motion.span>
                );
              })}
            </h1>

            {/* Epic Strike Lens Flare */}
            <motion.div 
              initial={{ width: 0, opacity: 0, scaleY: 0 }}
              animate={{ width: "200%", opacity: [0, 1, 0], scaleY: [0, 2, 0] }}
              transition={{ delay: 1, duration: 1.2, ease: "easeInOut" }}
              className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-[4px] bg-white blur-[2px] z-20 shadow-[0_0_30px_rgba(255,255,255,1)]"
            />
             <motion.div 
              initial={{ width: 0, opacity: 0 }}
              animate={{ width: "100%", opacity: [0, 1, 0] }}
              transition={{ delay: 1, duration: 1.2, ease: "easeInOut" }}
              className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-[1px] bg-white z-30"
            />
          </motion.div>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ delay: 1.5, duration: 1 }}
            className="text-white/40 uppercase tracking-[0.5em] text-xs font-medium mt-12"
          >
            Explore The Universe
          </motion.p>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default WelcomeSplash;
