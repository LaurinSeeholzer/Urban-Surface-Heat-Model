import React, { useRef, useEffect, useState } from 'react';

const CanvasPainter = ({ numPixelsX, numPixelsY }) => {
  const canvasRef = useRef(null);
  const [context, setContext] = useState(null);
  const [canvasWidth, setCanvasWidth] = useState(0);
  const [isPainting, setIsPainting] = useState(false);
  const pixelSize = canvasWidth / numPixelsX;

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    setContext(ctx);
    setCanvasWidth(canvas.parentElement.clientWidth); // Set canvas width to parent container's width
  }, []);

  const togglePixelColor = (event) => {
    if (!isPainting) return;

    const { offsetX, offsetY } = event.nativeEvent;
    const x = Math.floor(offsetX / pixelSize);
    const y = Math.floor(offsetY / pixelSize);

    context.fillStyle = 'selectedColorHere';
    context.fillRect(x * pixelSize, y * pixelSize, pixelSize, pixelSize);
  };

  const handleMouseDown = (event) => {
    setIsPainting(true);
    togglePixelColor(event);
  };

  const handleMouseUp = () => {
    setIsPainting(false);
  };

  const handleMouseMove = (event) => {
    togglePixelColor(event);
  };

  return (
    <canvas
      ref={canvasRef}
      width={canvasWidth}
      height={pixelSize * numPixelsY}
      onMouseDown={handleMouseDown}
      onMouseUp={handleMouseUp}
      onMouseMove={handleMouseMove}
      style={{ border: '1px solid black', imageRendering: 'pixelated' }}
    />
  );
};

export default CanvasPainter;
