import React, { useState, useRef, useEffect } from 'react';
import Draggable from 'react-draggable';
import html2canvas from 'html2canvas';

const technologies = [
  "AI", "Virtual assistants", "AR/VR",
  "Social media",
  "IoT", "Machine learning", "5G",
  "Blockchain", "Wearables", "Big data"
];

const GartnerHypeCycle = () => {
  const containerRef = useRef(null);
  const graphRef = useRef(null);
  const [labels, setLabels] = useState(
    technologies.map((tech, index) => ({
      text: tech,
      x: 0,
      y: 0,
      isOnImage: false,
      hasBeenDragged: false,
    }))
  );
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);

  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  const handleDrag = (index, e, data) => {
    const containerRect = containerRef.current.getBoundingClientRect();
    const labelRect = e.target.getBoundingClientRect();

    const isOnImage =
      labelRect.top > containerRect.top + 200 &&
      labelRect.left > containerRect.left &&
      labelRect.right < containerRect.right &&
      labelRect.bottom < containerRect.bottom;

    const newLabels = [...labels];
    newLabels[index] = {
      ...newLabels[index],
      x: data.x,
      y: data.y,
      isOnImage: isOnImage,
      hasBeenDragged: true,
    };

    setLabels(newLabels);
  };

  const takeScreenshot = () => {
    const graphElement = graphRef.current;
    const graphRect = graphElement.getBoundingClientRect();

    html2canvas(document.body, {
      x: graphRect.left,
      y: graphRect.top,
      width: graphRect.width,
      height: graphRect.height,
      scale: window.devicePixelRatio,
    }).then((canvas) => {
      const image = canvas
        .toDataURL("image/png")
        .replace("image/png", "image/octet-stream");
      const link = document.createElement("a");
      link.download = "gartner-hype-cycle-screenshot.png";
      link.href = image;
      link.click();
    });
  };

  const getScalingStyles = () => {
    if (windowWidth < 400) {
      return {
        transform: "scale(0.85)", // Make it a bit larger for small screens
        fontSize: "0.9rem",
        height: "2rem",
      };
    } else if (windowWidth < 768) {
      return {
        transform: "scale(0.9)",
        fontSize: "0.95rem",
        height: "2.2rem",
      };
    } else if (windowWidth < 1024) {
      return {
        transform: "scale(0.95)",
        fontSize: "1rem",
        height: "2.5rem",
      };
    } else {
      return {
        transform: "scale(1)",
        fontSize: "1rem",
        height: "2.5rem",
      };
    }
  };

  return (
    <div
      ref={containerRef}
      className="relative w-full bg-white mx-auto"
      style={{
        maxWidth: "100%",
        padding: 0,
        margin: 0,
      }}
    >
      <div
        className="relative w-full border border-dashed border-gray-300 bg-gray-50 flex flex-wrap justify-start items-start"
        style={{
          paddingTop: "2rem",
          height: windowWidth < 400 ? "35vh" : windowWidth < 768 ? "30vh" : windowWidth < 1024 ? "25vh" : "20vh",
          maxHeight: windowWidth < 400 ? "30vh" : windowWidth < 768 ? "25vh" : "20vh",
          minHeight: "150px",
          padding: "0",
          margin: 0,
        }}
      >
        <p className="absolute top-1 left-2 text-xs text-gray-500">
          Drag technologies onto the graph below
        </p>
        {labels.map((label, index) => (
          <Draggable
            key={index}
            position={{ x: label.x, y: label.y }}
            onDrag={(e, data) => handleDrag(index, e, data)}
          >
            <div
              className={`relative cursor-move p-1 rounded shadow text-sm 
                            ${label.isOnImage ? 'bg-white bg-opacity-75' : 'bg-white'}`}
              style={{
                ...getScalingStyles(),
                lineHeight: "1.2",
                maxWidth: "45%",
              }}
            >
              {label.text}
            </div>
          </Draggable>
        ))}
      </div>

      <div className="w-full flex justify-center mb-4">
        <button
          onClick={takeScreenshot}
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded text-sm"
        >
          Take screenshot
        </button>
      </div>

      <div
        ref={graphRef}
        className="w-full bg-cover bg-center"
        style={{
          backgroundImage: `url('${process.env.PUBLIC_URL}/images/gartner-hype-cycle.png')`,
          backgroundSize: "contain",
          backgroundRepeat: "no-repeat",
          backgroundPosition: "center",
          width: "100%", 
          paddingTop: "60%", 
          height: 0, 
          maxWidth: "100%",
          margin: "0",  
          display: "block",
        }}
      />
      
      {/* Mobile-specific styles */}
      <style jsx>{`
        @media (max-width: 768px) {
          div.relative {
            margin: 0;
            padding: 0;
            width: 100vw; /* Use the full viewport width */
            max-width: 100vw; /* No extra space on the sides */
          }

          div.relative.w-full {
            padding: 0;
            margin: 0;
            border: none; /* Remove border if desired for mobile */
          }

          .w-full.flex {
            margin: 0; /* Ensure the button container takes full width */
          }
        }
      `}</style>
    </div>
  );
};


  
  export default GartnerHypeCycle;