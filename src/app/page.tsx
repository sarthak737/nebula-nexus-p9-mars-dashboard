"use client";
import React, { useState, useEffect } from "react";

const MarsLandingPage = () => {
  const [mousePosition, setMousePosition] = useState({ x: 50, y: 50 });
  const [scrollY, setScrollY] = useState(0);
  const [time, setTime] = useState(0);

  useEffect(() => {
    const handleMouseMove = (e: { clientX: number; clientY: number }) => {
      setMousePosition({
        x: (e.clientX / window.innerWidth) * 100,
        y: (e.clientY / window.innerHeight) * 100,
      });
    };

    const handleScroll = () => {
      setScrollY(window.scrollY);
    };

    const timer = setInterval(() => {
      setTime(Date.now() * 0.001);
    }, 10);

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("scroll", handleScroll);
      clearInterval(timer);
    };
  }, []);

  return (
    <div className="relative min-h-screen text-white overflow-x-hidden">
      <div
        className="fixed inset-0 -z-20"
        style={{
          background: `
            radial-gradient(ellipse at top, #1a0b33 0%, #0d1117 30%, #000000 70%),
            radial-gradient(ellipse at bottom, #2d1b3d 0%, transparent 50%),
            linear-gradient(45deg, #ff6b35 0%, #f7931e 25%, #ff6b35 50%, #8b5a3c 75%, #2c1810 100%)
          `,
          backgroundBlendMode: "multiply, normal, overlay",
        }}
      />

      <div
        className="fixed inset-0 -z-19 rounded-full"
        style={{
          background: `
            conic-gradient(from ${time * 20}deg at ${mousePosition.x}% ${
            mousePosition.y
          }%, 
              rgba(255, 107, 53, 0.1) 0deg,
              rgba(139, 90, 60, 0.05) 90deg,
              rgba(45, 24, 16, 0.1) 180deg,
              rgba(247, 147, 30, 0.08) 270deg,
              rgba(255, 107, 53, 0.1) 360deg
            )
          `,
          animation: "rotate 60s linear infinite",
        }}
      />

      <div className="fixed inset-0 -z-10 pointer-events-none overflow-hidden">
        <div
          className="absolute rounded-full transition-all duration-[3000ms] ease-out"
          style={{
            width: "600px",
            height: "600px",
            background: `
              radial-gradient(circle at 30% 30%, 
                rgba(255, 107, 53, 0.15) 0%,
                rgba(247, 147, 30, 0.08) 30%,
                rgba(139, 90, 60, 0.04) 60%,
                transparent 100%
              )
            `,
            filter: "blur(80px)",
            left: `${mousePosition.x * 0.3 - 15}%`,
            top: `${mousePosition.y * 0.3 - 15}%`,
            transform: `translate(-50%, -50%) rotate(${time * 10}deg)`,
          }}
        />

        <div
          className="absolute rounded-full transition-all duration-[4000ms] ease-out"
          style={{
            width: "400px",
            height: "400px",
            background: `
              radial-gradient(circle at 70% 70%, 
                rgba(139, 90, 60, 0.12) 0%,
                rgba(45, 24, 16, 0.06) 40%,
                transparent 80%
              )
            `,
            filter: "blur(60px)",
            right: `${mousePosition.x * 0.2 - 10}%`,
            bottom: `${mousePosition.y * 0.2 - 10}%`,
            transform: `translate(50%, 50%) rotate(${-time * 8}deg)`,
          }}
        />

        {[...Array(40)].map((_, i) => {
          const angle = (i / 40) * Math.PI * 2;
          const radius = 100 + Math.sin(time + i) * 20;
          const x = 50 + Math.cos(angle) * radius * 0.3;
          const y = 50 + Math.sin(angle) * radius * 0.2;
          const twinkle = Math.sin(time * 2 + i) * 0.5 + 0.5;

          return (
            <div
              key={i}
              className="absolute rounded-full"
              style={{
                width: "3px",
                height: "3px",
                left: `${x}%`,
                top: `${y}%`,
                background: `radial-gradient(circle, rgba(255, 255, 255, ${
                  twinkle * 0.8
                }) 0%, transparent 70%)`,
                boxShadow: `0 0 ${twinkle * 6}px rgba(255, 255, 255, ${
                  twinkle * 0.6
                })`,
                transform: "translate(-50%, -50%)",
              }}
            />
          );
        })}

        {[...Array(25)].map((_, i) => {
          const floatY = Math.sin(time * 0.5 + i) * 30;
          const floatX = Math.cos(time * 0.3 + i) * 15;

          return (
            <div
              key={`dust-${i}`}
              className="absolute rounded-full"
              style={{
                width: `${2 + Math.sin(i) * 2}px`,
                height: `${2 + Math.sin(i) * 2}px`,
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                background: `rgba(247, 147, 30, ${
                  0.3 + Math.sin(time + i) * 0.2
                })`,
                transform: `translate(${floatX}px, ${floatY}px)`,
                filter: "blur(1px)",
              }}
            />
          );
        })}

        <div
          className="absolute inset-0 opacity-20"
          style={{
            background: `
              linear-gradient(${time * 30}deg, 
                transparent 30%,
                rgba(255, 107, 53, 0.1) 45%,
                rgba(247, 147, 30, 0.15) 50%,
                rgba(255, 107, 53, 0.1) 55%,
                transparent 70%
              )
            `,
            filter: "blur(40px)",
            transform: `translateY(${Math.sin(time * 0.2) * 50}px)`,
          }}
        />

        <div
          className="absolute inset-0 opacity-30"
          style={{
            backgroundImage: `
              radial-gradient(2px 2px at 20px 30px, rgba(247, 147, 30, 0.3), transparent),
              radial-gradient(2px 2px at 40px 70px, rgba(255, 107, 53, 0.4), transparent),
              radial-gradient(1px 1px at 90px 40px, rgba(139, 90, 60, 0.5), transparent),
              radial-gradient(1px 1px at 130px 80px, rgba(247, 147, 30, 0.3), transparent),
              radial-gradient(2px 2px at 160px 30px, rgba(255, 107, 53, 0.2), transparent)
            `,
            backgroundRepeat: "repeat",
            backgroundSize: "200px 100px",
            transform: `translateX(${scrollY * -0.1}px) translateY(${
              scrollY * -0.05
            }px)`,
          }}
        />
      </div>
    </div>
  );
};

export default MarsLandingPage;
