import React, { useState, useRef } from 'react';
import Draggable from 'react-draggable';
import html2canvas from 'html2canvas';

const technologies = [
  "Artificial Intelligence (AI)", "Virtual assistants", "Augmented Reality (AR)",
  "Virtual Reality (VR)", "Social media", "Mobile technology",
  "Internet of Things (IoT)", "Machine learning", "5G networks",
  "Blockchain", "Wearable technology", "Advanced analytics and big data"
];

const GartnerHypeCycle = () => {
  const [labels, setLabels] = useState(
    technologies.map((tech, index) => ({
      text: tech,
      x: 20 + (index % 4) * 220,
      y: 20 + Math.floor(index / 4) * 40,
      isOnImage: false,
    }))
  );

  const containerRef = useRef(null);

  const handleDrag = (index, e, data) => {
    const containerRect = containerRef.current.getBoundingClientRect();
    const labelRect = e.target.getBoundingClientRect();
    
    const isOnImage = 
      labelRect.top > containerRect.top + 200 && // Height of the staging area
      labelRect.left > containerRect.left &&
      labelRect.right < containerRect.right &&
      labelRect.bottom < containerRect.bottom;

    const newLabels = [...labels];
    newLabels[index] = { 
      ...newLabels[index], 
      x: data.x, 
      y: data.y,
      isOnImage: isOnImage,
    };
    setLabels(newLabels);
  };

  const takeScreenshot = () => {
    html2canvas(containerRef.current).then(canvas => {
      const image = canvas.toDataURL("image/png").replace("image/png", "image/octet-stream");
      const link = document.createElement('a');
      link.download = 'gartner-hype-cycle-screenshot.png';
      link.href = image;
      link.click();
    });
  };

  return (
    <div ref={containerRef} className="relative w-[1000px] bg-gray-100 p-4 mx-auto">
      <h2 className="text-2xl font-bold mb-4">Interactive Gartner Hype Cycle</h2>
      
      {/* Screenshot button */}
      <button 
        onClick={takeScreenshot}
        className="absolute top-4 right-4 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
      >
        Take Screenshot
      </button>
      
      {/* Staging area */}
      <div className="relative w-full h-[200px] mb-4 border border-dashed border-gray-300 bg-gray-50">
        <p className="text-sm text-gray-500 p-2">Drag technologies onto the graph below</p>
        {/* Draggable elements */}
        {labels.map((label, index) => (
          <Draggable
            key={index}
            position={{ x: label.x, y: label.y }}
            onDrag={(e, data) => handleDrag(index, e, data)}
            bounds={containerRef}
          >
            <div className={`absolute cursor-move p-2 rounded shadow text-sm
                            ${label.isOnImage ? 'bg-white bg-opacity-75' : 'bg-white'}`}>
              {label.text}
            </div>
          </Draggable>
        ))}
      </div>
      
      {/* Gartner Hype Cycle image */}
      <div 
        className="w-full h-[550px] bg-cover bg-center"
        style={{
          backgroundImage: "url('/images/gartner-hype-cycle.png')",
          backgroundSize: 'contain',
          backgroundRepeat: 'no-repeat',
        }}
      />
    </div>
  );
};

export default GartnerHypeCycle;