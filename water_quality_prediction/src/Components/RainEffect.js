import React, { useEffect } from "react";

const RainEffect = () => {
  useEffect(() => {
    const droplets =500; // Fewer but bigger droplets
    const rainContainer = document.querySelector(".rain");

    for (let r = 0; r < droplets; r++) {
      const droplet = document.createElementNS("http://www.w3.org/2000/svg", "svg");
      droplet.setAttribute("class", "rain__drop");
      droplet.setAttribute("preserveAspectRatio", "xMinYMin");
      droplet.setAttribute("viewBox", "0 0 20 100"); 
      droplet.style.setProperty("--x", Math.random() * 100);
      droplet.style.setProperty("--y", Math.random() * 100);
      droplet.style.setProperty("--o", Math.random()); 
      droplet.style.setProperty("--a", Math.random() + 1); 
      droplet.style.setProperty("--d", (Math.random() * 2) - 1);
      droplet.style.setProperty("--s", Math.random() * 2 + 1); 

      const path = document.createElementNS("http://www.w3.org/2000/svg", "path");
      path.setAttribute("stroke", "none");
      path.setAttribute(
        "d",
        "M 10,0 C 12,10 15,55 18,85 22,110 18,120 10,120 2,120 -2,110 5,85 8,55 8,10 10,0 Z"
      ); // Enlarged droplet shape

      droplet.appendChild(path);
      rainContainer.appendChild(droplet);
    }
  }, []);

  return <div className="rain"></div>;
  
};

export default RainEffect;
