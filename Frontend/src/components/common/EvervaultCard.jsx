import React, { useState, useEffect } from "react";
import { motion, useMotionValue, useMotionTemplate } from "framer-motion";
import { cn } from "../../utils/cn";

export const EvervaultCard = ({
  text,
  className
}) => {
  let mouseX = useMotionValue(0);
  let mouseY = useMotionValue(0);

  const [randomString, setRandomString] = useState("");

  useEffect(() => {
    let str = generateRandomString(35000); // Restored to original large count
    setRandomString(str);
  }, []);

  function onMouseMove({
    currentTarget,
    clientX,
    clientY
  }) {
    let { left, top } = currentTarget.getBoundingClientRect();
    mouseX.set(clientX - left);
    mouseY.set(clientY - top);

    const str = generateRandomString(35000); // Restored to original
    setRandomString(str);
  }

  return (
    <div
      className={cn(
        "p-0 bg-transparent flex items-center justify-start w-full h-full relative",
        className
      )}>
      <div
        onMouseMove={onMouseMove}
        className="group/card w-full relative overflow-hidden bg-transparent flex items-center justify-start h-full">
        <CardPattern mouseX={mouseX} mouseY={mouseY} randomString={randomString} />
        <div className="relative z-10 flex items-start justify-start pl-8 lg:pl-16">
          <div className="relative flex flex-col items-start justify-start text-white cabinet-grotesk text-left">
            <h2 className="text-4xl sm:text-6xl md:text-7xl font-bold tracking-tight mb-4">
              <span className="text-white relative z-20">
                Connect<span className="text-[#ff3333]">.</span> Update<span className="text-[#ff3333]">.</span> Share<span className="text-[#ff3333]">.</span>
              </span>
            </h2>
            <p className="text-xl sm:text-2xl md:text-3xl font-light text-gray-300 max-w-2xl">
              The smartest way to manage status in real-time
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export function CardPattern({
  mouseX,
  mouseY,
  randomString
}) {
  let maskImage = useMotionTemplate`radial-gradient(250px at ${mouseX}px ${mouseY}px, white, transparent)`;
  let style = { maskImage, WebkitMaskImage: maskImage };

  return (
    <div className="pointer-events-none">
      <div
        className="absolute inset-0 [mask-image:linear-gradient(white,transparent)] group-hover/card:opacity-50"></div>
      <motion.div
        className="absolute inset-0 bg-gradient-to-r from-red-500 to-red-700 opacity-0 group-hover/card:opacity-100 backdrop-blur-xl transition duration-1000"
        style={style} />
      <motion.div
        className="absolute inset-0 opacity-0 mix-blend-overlay group-hover/card:opacity-100 transition duration-1000"
        style={style}>
        <p
          className="absolute inset-0 text-xs h-full w-full whitespace-pre text-white font-mono font-bold leading-none tracking-normal overflow-hidden m-0 p-0 box-border">
          {randomString}
        </p>
      </motion.div>
    </div>
  );
}

const characters =
  "0123456789ABCDEF";

export const generateRandomString = (length) => {
  let result = "";
  const charsPerLine = 500; // Restored to original full width coverage
  const linesNeeded = Math.ceil(window.innerHeight / 10);
  const totalChars = charsPerLine * linesNeeded * 4;

  let charCount = 0;

  for (let i = 0; i < Math.max(length, totalChars); i++) {
    if (charCount > 0 && charCount % charsPerLine === 0) {
      result += "\n";
      charCount = 0;
    } else {
      // Generate 4-digit groups consistently
      if (charCount > 0 && (charCount + 1) % 5 === 0) {
        result += " ";
      } else {
        // Generate character
        if (Math.random() > 0.2) {
          result += "0123456789"[Math.floor(Math.random() * 10)];
        } else {
          result += "ABCDEF"[Math.floor(Math.random() * 6)];
        }
      }
      charCount++;
    }
  }

  return result;
};

export const Icon = ({
  className,
  ...rest
}) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth="1.5"
      stroke="currentColor"
      className={className}
      {...rest}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v12m6-6H6" />
    </svg>
  );
};
