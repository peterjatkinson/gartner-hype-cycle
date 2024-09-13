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
        x: 0, // Initial x position
        y: 0, // Initial y position
        isOnImage: false, // Tracks if element is placed on the graph image
        hasBeenDragged: false, // Tracks if element has been dragged
      }))
    );
    const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  
    // Function to update window width state on resize
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
        hasBeenDragged: true, // Stop resizing relatively once dragged
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
        scale: window.devicePixelRatio // For better quality on high DPI screens
      }).then(canvas => {
        const image = canvas.toDataURL("image/png").replace("image/png", "image/octet-stream");
        const link = document.createElement('a');
        link.download = 'gartner-hype-cycle-screenshot.png';
        link.href = image;
        link.click();
      });
    };
  
    // Define scaling styles based on breakpoints
    const getScalingStyles = () => {
      if (windowWidth < 768) {
        return {
          transform: 'scale(0.8)',
          fontSize: '0.85rem',
          height: '2rem', // Adjust height of boxes at small screen sizes
        };
      } else if (windowWidth < 1024) {
        return {
          transform: 'scale(0.9)',
          fontSize: '.9rem',
          height: '2.5rem', // Adjust height of boxes at medium screen sizes
        };
      } else {
        return {
          transform: 'scale(1)',
          fontSize: '.9rem',
          height: '2.5rem', // Adjust height of boxes at large screen sizes
        };
      }
    };
  
    return (
      <div ref={containerRef} className="relative w-full bg-gray-100 p-4 mx-auto max-w-[90vw]">
        <h2 className="text-2xl font-bold mb-4 text-center">Interactive Gartner Hype Cycle</h2>
        
        {/* Staging area */}
        <div 
          className="relative w-full mb-4 border border-dashed border-gray-300 bg-gray-50 flex flex-wrap justify-start items-start p-4 gap-4"
          style={{ 
            paddingTop: '3rem', // Space for the "Drag technologies..." text
            height: windowWidth < 768 ? '25vh' : windowWidth < 1024 ? '20vh' : '15vh', // Responsive height
          }}
        >
          <p className="absolute top-2 left-2 text-sm text-gray-500">Drag technologies onto the graph below</p>
          {/* Draggable elements */}
          {labels.map((label, index) => (
            <Draggable
              key={index}
              position={{ x: label.x, y: label.y }}
              onDrag={(e, data) => handleDrag(index, e, data)}
            >
              <div
                className={`relative cursor-move p-2 rounded shadow text-sm 
                            ${label.isOnImage ? 'bg-white bg-opacity-75' : 'bg-white'}`}
                style={{
                  ...getScalingStyles(), // Apply scaling based on breakpoints
                  lineHeight: '1.2', // Adjust line height for better text visibility
                }}
              >
                {label.text}
              </div>
            </Draggable>
          ))}
        </div>
  
        {/* Screenshot button between staging area and graph */}
        <div className="w-full flex justify-center mb-0">
          <button 
            onClick={takeScreenshot}
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
            style={{
              marginBottom: windowWidth < 768 ? '1vh' : '2vh', // Adjust margin for smaller screens
            }}
          >
            Take Screenshot
          </button>
        </div>
  
        {/* Gartner Hype Cycle image */}
        <div 
  ref={graphRef}
  className="w-full bg-cover bg-center"
  style={{
    backgroundImage: `url('${process.env.PUBLIC_URL}/images/gartner-hype-cycle.png')`,
    backgroundSize: '100% auto', // This will make the image width 100% of the container
    backgroundRepeat: 'no-repeat',
    backgroundPosition: 'center',
    height: windowWidth < 768 ? '40vh' : windowWidth < 1024 ? '50vh' : '60vh', // Increased height
    marginTop: '0',
    maxWidth: '1200px', // Set a maximum width
    margin: '0 auto', // Center the div if it's less than 100% width
  }}
        />
      </div>
    );
  };
  
  export default GartnerHypeCycle;