import React, { useState, useRef, useEffect } from 'react';
import { ZoomIn, ZoomOut, Move, Check, X, RotateCcw } from 'lucide-react';

export default function ImageCropper({ image, onCropComplete, onCancel, aspectRatio = 1 }) {
  console.log('ImageCropper rendering, image:', image?.substring(0, 50));
  
  const canvasRef = useRef(null);
  const [scale, setScale] = useState(1);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [imageObj, setImageObj] = useState(null);

  useEffect(() => {
    console.log('ImageCropper useEffect - loading image');
    const img = new Image();
    img.crossOrigin = 'anonymous'; // Prevent canvas tainting
    img.onload = () => {
      setImageObj(img);
      // Center the image initially
      const canvas = canvasRef.current;
      if (canvas) {
        const ctx = canvas.getContext('2d');
        const canvasSize = Math.min(canvas.width, canvas.height);
        const imgSize = Math.min(img.width, img.height);
        const initialScale = canvasSize / imgSize;
        setScale(initialScale);
        setPosition({
          x: (canvas.width - img.width * initialScale) / 2,
          y: (canvas.height - img.height * initialScale) / 2
        });
      }
    };
    img.src = image;
  }, [image]);

  useEffect(() => {
    if (imageObj && canvasRef.current) {
      drawCanvas();
    }
  }, [imageObj, scale, position]);

  const drawCanvas = () => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    
    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Draw image
    ctx.save();
    ctx.drawImage(
      imageObj,
      position.x,
      position.y,
      imageObj.width * scale,
      imageObj.height * scale
    );
    ctx.restore();

    // Draw crop overlay
    const cropSize = Math.min(canvas.width, canvas.height) * 0.8;
    const cropX = (canvas.width - cropSize) / 2;
    const cropY = (canvas.height - cropSize) / 2;

    // Darken outside crop area
    ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
    ctx.fillRect(0, 0, canvas.width, cropY);
    ctx.fillRect(0, cropY, cropX, cropSize);
    ctx.fillRect(cropX + cropSize, cropY, canvas.width - cropX - cropSize, cropSize);
    ctx.fillRect(0, cropY + cropSize, canvas.width, canvas.height - cropY - cropSize);

    // Draw crop border
    ctx.strokeStyle = '#fff';
    ctx.lineWidth = 2;
    ctx.strokeRect(cropX, cropY, cropSize, cropSize);

    // Draw corner guides
    const guideLength = 20;
    ctx.strokeStyle = '#0D7DFF';
    ctx.lineWidth = 3;
    
    // Top-left
    ctx.beginPath();
    ctx.moveTo(cropX, cropY + guideLength);
    ctx.lineTo(cropX, cropY);
    ctx.lineTo(cropX + guideLength, cropY);
    ctx.stroke();

    // Top-right
    ctx.beginPath();
    ctx.moveTo(cropX + cropSize - guideLength, cropY);
    ctx.lineTo(cropX + cropSize, cropY);
    ctx.lineTo(cropX + cropSize, cropY + guideLength);
    ctx.stroke();

    // Bottom-left
    ctx.beginPath();
    ctx.moveTo(cropX, cropY + cropSize - guideLength);
    ctx.lineTo(cropX, cropY + cropSize);
    ctx.lineTo(cropX + guideLength, cropY + cropSize);
    ctx.stroke();

    // Bottom-right
    ctx.beginPath();
    ctx.moveTo(cropX + cropSize - guideLength, cropY + cropSize);
    ctx.lineTo(cropX + cropSize, cropY + cropSize);
    ctx.lineTo(cropX + cropSize, cropY + cropSize - guideLength);
    ctx.stroke();
  };

  const handleMouseDown = (e) => {
    setIsDragging(true);
    const rect = canvasRef.current.getBoundingClientRect();
    setDragStart({
      x: e.clientX - rect.left - position.x,
      y: e.clientY - rect.top - position.y
    });
  };

  const handleMouseMove = (e) => {
    if (!isDragging) return;
    const rect = canvasRef.current.getBoundingClientRect();
    setPosition({
      x: e.clientX - rect.left - dragStart.x,
      y: e.clientY - rect.top - dragStart.y
    });
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleZoomIn = () => {
    setScale(prev => Math.min(prev + 0.05, 5));
  };

  const handleZoomOut = () => {
    setScale(prev => Math.max(prev - 0.05, 0.25));
  };

  const handleReset = () => {
    const canvas = canvasRef.current;
    if (canvas && imageObj) {
      const canvasSize = Math.min(canvas.width, canvas.height);
      const imgSize = Math.min(imageObj.width, imageObj.height);
      const initialScale = canvasSize / imgSize;
      setScale(initialScale);
      setPosition({
        x: (canvas.width - imageObj.width * initialScale) / 2,
        y: (canvas.height - imageObj.height * initialScale) / 2
      });
    }
  };

  const handleCrop = () => {
    const canvas = canvasRef.current;
    const cropSize = Math.min(canvas.width, canvas.height) * 0.8;
    const cropX = (canvas.width - cropSize) / 2;
    const cropY = (canvas.height - cropSize) / 2;

    // Create a new canvas for the cropped image
    const croppedCanvas = document.createElement('canvas');
    croppedCanvas.width = cropSize;
    croppedCanvas.height = cropSize;
    const ctx = croppedCanvas.getContext('2d');

    // Calculate the source coordinates on the original image
    const sourceX = (cropX - position.x) / scale;
    const sourceY = (cropY - position.y) / scale;
    const sourceWidth = cropSize / scale;
    const sourceHeight = cropSize / scale;

    // Draw the cropped portion directly from the original image
    ctx.drawImage(
      imageObj,
      sourceX,
      sourceY,
      sourceWidth,
      sourceHeight,
      0,
      0,
      cropSize,
      cropSize
    );

    // Convert to blob
    croppedCanvas.toBlob((blob) => {
      onCropComplete(blob);
    }, 'image/png', 0.95);
  };

  // Touch event handlers for mobile
  const handleTouchStart = (e) => {
    if (e.touches.length === 1) {
      const touch = e.touches[0];
      const rect = canvasRef.current.getBoundingClientRect();
      setIsDragging(true);
      setDragStart({
        x: touch.clientX - rect.left - position.x,
        y: touch.clientY - rect.top - position.y
      });
    }
  };

  const handleTouchMove = (e) => {
    if (!isDragging || e.touches.length !== 1) return;
    e.preventDefault();
    const touch = e.touches[0];
    const rect = canvasRef.current.getBoundingClientRect();
    setPosition({
      x: touch.clientX - rect.left - dragStart.x,
      y: touch.clientY - rect.top - dragStart.y
    });
  };

  const handleTouchEnd = () => {
    setIsDragging(false);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center p-2 sm:p-4">
      <div className="bg-card rounded-2xl p-3 sm:p-6 max-w-2xl w-full max-h-[95vh] overflow-y-auto">
        <h3 className="text-base sm:text-lg font-medium text-foreground mb-3 sm:mb-4">Adjust Image Position</h3>
        
        {/* Canvas */}
        <div className="mb-3 sm:mb-4 flex justify-center">
          <canvas
            ref={canvasRef}
            width={Math.min(500, window.innerWidth - 80)}
            height={Math.min(500, window.innerWidth - 80)}
            className="border border-border rounded-lg cursor-move touch-none max-w-full"
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
          />
        </div>

        {/* Controls */}
        <div className="flex flex-wrap items-center justify-center gap-2 mb-3 sm:mb-4">
          <button
            type="button"
            onClick={handleZoomOut}
            className="p-2 sm:p-2.5 bg-secondary hover:bg-secondary/80 rounded-lg transition-colors touch-manipulation"
            title="Zoom out"
          >
            <ZoomOut className="w-4 h-4 sm:w-5 sm:h-5" />
          </button>
          
          <div className="px-3 sm:px-4 py-2 bg-secondary rounded-lg text-xs sm:text-sm font-medium">
            {Math.round(scale * 100)}%
          </div>
          
          <button
            type="button"
            onClick={handleZoomIn}
            className="p-2 sm:p-2.5 bg-secondary hover:bg-secondary/80 rounded-lg transition-colors touch-manipulation"
            title="Zoom in"
          >
            <ZoomIn className="w-4 h-4 sm:w-5 sm:h-5" />
          </button>

          <div className="w-px h-6 sm:h-8 bg-border mx-1 sm:mx-2" />

          <button
            type="button"
            onClick={handleReset}
            className="p-2 sm:p-2.5 bg-secondary hover:bg-secondary/80 rounded-lg transition-colors touch-manipulation"
            title="Reset position"
          >
            <RotateCcw className="w-4 h-4 sm:w-5 sm:h-5" />
          </button>
        </div>

        <p className="text-xs sm:text-sm text-muted-foreground text-center mb-3 sm:mb-4">
          <Move className="w-3 h-3 sm:w-4 sm:h-4 inline mr-1" />
          Drag to reposition • Zoom to adjust size
        </p>

        {/* Action Buttons */}
        <div className="flex gap-2 sm:gap-3">
          <button
            type="button"
            onClick={onCancel}
            className="flex-1 px-3 sm:px-4 py-2 sm:py-2.5 border border-border rounded-lg hover:bg-secondary transition-colors flex items-center justify-center gap-2 text-sm sm:text-base touch-manipulation"
          >
            <X className="w-4 h-4" />
            <span className="hidden sm:inline">Cancel</span>
            <span className="sm:hidden">Cancel</span>
          </button>
          <button
            type="button"
            onClick={handleCrop}
            className="flex-1 px-3 sm:px-4 py-2 sm:py-2.5 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors flex items-center justify-center gap-2 text-sm sm:text-base touch-manipulation"
          >
            <Check className="w-4 h-4" />
            <span className="hidden sm:inline">Apply</span>
            <span className="sm:hidden">Apply</span>
          </button>
        </div>
      </div>
    </div>
  );
}
