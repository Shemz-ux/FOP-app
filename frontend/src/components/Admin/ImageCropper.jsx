import React, { useState, useRef, useEffect, useMemo, useCallback } from 'react';
import { ZoomIn, ZoomOut, Move, Check, X, RotateCcw, Maximize } from 'lucide-react';

// A logo tile on a card is a padded square: w-12 with p-2 leaves two thirds of
// the tile for the image, which is then object-contain'ed into it. The crop
// frame here stands for that inner box, so a square export lands in it 1:1 and
// what the cropper shows is what the card and the details page will render.
const LOGO_CONTENT_RATIO = 2 / 3;
const LOGO_TILE_RATIO = 0.8;
const IMAGE_FRAME_RATIO = 0.85;

// Logos render between 40px and 80px, so 512 is already generous; the old
// 1200px JPEG only added weight and lost the alpha channel.
const LOGO_OUTPUT_SIZE = 512;
const IMAGE_OUTPUT_SIZE = 1200;

const MIN_SCALE = 0.05;
const MAX_SCALE = 8;
const ZOOM_STEP = 1.1;

const clamp = (value, min, max) => Math.min(Math.max(value, min), max);

const roundRectPath = (ctx, x, y, width, height, radius) => {
  const r = Math.min(radius, width / 2, height / 2);
  ctx.beginPath();
  if (typeof ctx.roundRect === 'function') {
    ctx.roundRect(x, y, width, height, r);
    return;
  }
  ctx.moveTo(x + r, y);
  ctx.arcTo(x + width, y, x + width, y + height, r);
  ctx.arcTo(x + width, y + height, x, y + height, r);
  ctx.arcTo(x, y + height, x, y, r);
  ctx.arcTo(x, y, x + width, y, r);
  ctx.closePath();
};

export default function ImageCropper({
  image,
  onCropComplete,
  onCancel,
  aspectRatio = 1,
  variant = 'image',
}) {
  const isLogo = variant === 'logo';

  const canvasRef = useRef(null);
  const [scale, setScale] = useState(1);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [imageObj, setImageObj] = useState(null);

  // Fixed once per mount: the canvas is a bitmap, so resizing it mid-session
  // would invalidate the stored position and scale
  const [canvasSize] = useState(() =>
    Math.min(500, (typeof window === 'undefined' ? 500 : window.innerWidth) - 80)
  );

  // The tile the card draws, and the crop frame inside it
  const geometry = useMemo(() => {
    if (isLogo) {
      const tileSize = canvasSize * LOGO_TILE_RATIO;
      const contentSize = tileSize * LOGO_CONTENT_RATIO;
      return {
        tile: {
          x: (canvasSize - tileSize) / 2,
          y: (canvasSize - tileSize) / 2,
          size: tileSize,
        },
        crop: {
          x: (canvasSize - contentSize) / 2,
          y: (canvasSize - contentSize) / 2,
          width: contentSize,
          height: contentSize,
        },
      };
    }

    const width =
      aspectRatio === 1 ? canvasSize * LOGO_TILE_RATIO : canvasSize * IMAGE_FRAME_RATIO;
    const height = aspectRatio === 1 ? width : width * (9 / 16);
    return {
      tile: null,
      crop: {
        x: (canvasSize - width) / 2,
        y: (canvasSize - height) / 2,
        width,
        height,
      },
    };
  }, [aspectRatio, canvasSize, isLogo]);

  // A logo opens fully visible inside the frame; photography opens filling it
  const framingScale = useCallback(
    (img, mode) => {
      const { crop } = geometry;
      const fit = Math.min(crop.width / img.width, crop.height / img.height);
      const fill = Math.max(crop.width / img.width, crop.height / img.height);
      return mode === 'fit' ? fit : fill;
    },
    [geometry]
  );

  const centreAt = useCallback(
    (img, nextScale) => {
      const { crop } = geometry;
      setScale(nextScale);
      setPosition({
        x: crop.x + (crop.width - img.width * nextScale) / 2,
        y: crop.y + (crop.height - img.height * nextScale) / 2,
      });
    },
    [geometry]
  );

  useEffect(() => {
    const img = new Image();
    img.crossOrigin = 'anonymous'; // Prevent canvas tainting
    img.onload = () => {
      setImageObj(img);
      centreAt(img, framingScale(img, isLogo ? 'fit' : 'fill'));
    };
    img.src = image;
  }, [image, centreAt, framingScale, isLogo]);

  const drawCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas || !imageObj) return;

    const ctx = canvas.getContext('2d');
    const { crop, tile } = geometry;
    const drawWidth = imageObj.width * scale;
    const drawHeight = imageObj.height * scale;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    if (isLogo) {
      // Ghost of everything outside the tile, so dragging stays orientated
      ctx.globalAlpha = 0.14;
      ctx.drawImage(imageObj, position.x, position.y, drawWidth, drawHeight);
      ctx.globalAlpha = 1;

      // The card tile itself: white, rounded, and the padding ring around the
      // crop frame is the card's own padding
      roundRectPath(ctx, tile.x, tile.y, tile.size, tile.size, tile.size * 0.18);
      ctx.fillStyle = '#ffffff';
      ctx.fill();

      ctx.save();
      ctx.beginPath();
      ctx.rect(crop.x, crop.y, crop.width, crop.height);
      ctx.clip();
      ctx.drawImage(imageObj, position.x, position.y, drawWidth, drawHeight);
      ctx.restore();

      roundRectPath(ctx, tile.x, tile.y, tile.size, tile.size, tile.size * 0.18);
      ctx.strokeStyle = 'rgba(15, 23, 42, 0.18)';
      ctx.lineWidth = 1;
      ctx.stroke();

      ctx.setLineDash([6, 4]);
      ctx.strokeStyle = 'rgba(13, 125, 255, 0.85)';
      ctx.lineWidth = 1.5;
      ctx.strokeRect(crop.x, crop.y, crop.width, crop.height);
      ctx.setLineDash([]);
      return;
    }

    ctx.drawImage(imageObj, position.x, position.y, drawWidth, drawHeight);

    // Darken outside crop area
    ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
    ctx.fillRect(0, 0, canvas.width, crop.y);
    ctx.fillRect(0, crop.y, crop.x, crop.height);
    ctx.fillRect(crop.x + crop.width, crop.y, canvas.width - crop.x - crop.width, crop.height);
    ctx.fillRect(0, crop.y + crop.height, canvas.width, canvas.height - crop.y - crop.height);

    ctx.strokeStyle = '#fff';
    ctx.lineWidth = 2;
    ctx.strokeRect(crop.x, crop.y, crop.width, crop.height);

    const guideLength = 20;
    ctx.strokeStyle = '#0D7DFF';
    ctx.lineWidth = 3;
    const corners = [
      [crop.x, crop.y, 1, 1],
      [crop.x + crop.width, crop.y, -1, 1],
      [crop.x, crop.y + crop.height, 1, -1],
      [crop.x + crop.width, crop.y + crop.height, -1, -1],
    ];
    corners.forEach(([cx, cy, dx, dy]) => {
      ctx.beginPath();
      ctx.moveTo(cx, cy + guideLength * dy);
      ctx.lineTo(cx, cy);
      ctx.lineTo(cx + guideLength * dx, cy);
      ctx.stroke();
    });
  }, [geometry, imageObj, isLogo, position, scale]);

  useEffect(() => {
    drawCanvas();
  }, [drawCanvas]);

  const pointerPosition = (clientX, clientY) => {
    const rect = canvasRef.current.getBoundingClientRect();
    // The canvas is capped by max-w-full, so CSS pixels and bitmap pixels
    // diverge on narrow screens
    const ratioX = canvasRef.current.width / rect.width;
    const ratioY = canvasRef.current.height / rect.height;
    return {
      x: (clientX - rect.left) * ratioX,
      y: (clientY - rect.top) * ratioY,
    };
  };

  const startDrag = (clientX, clientY) => {
    const point = pointerPosition(clientX, clientY);
    setIsDragging(true);
    setDragStart({ x: point.x - position.x, y: point.y - position.y });
  };

  const moveDrag = (clientX, clientY) => {
    const point = pointerPosition(clientX, clientY);
    setPosition({ x: point.x - dragStart.x, y: point.y - dragStart.y });
  };

  const handleMouseDown = (e) => startDrag(e.clientX, e.clientY);

  const handleMouseMove = (e) => {
    if (!isDragging) return;
    moveDrag(e.clientX, e.clientY);
  };

  const handleMouseUp = () => setIsDragging(false);

  // Zoom around the centre of the crop frame, so the framing the user has
  // chosen stays put instead of drifting towards the canvas corner
  const zoomBy = useCallback(
    (factor) => {
      if (!imageObj) return;
      const next = clamp(scale * factor, MIN_SCALE, MAX_SCALE);
      if (next === scale) return;
      const ratio = next / scale;
      const { crop } = geometry;
      const centreX = crop.x + crop.width / 2;
      const centreY = crop.y + crop.height / 2;
      setPosition({
        x: centreX - (centreX - position.x) * ratio,
        y: centreY - (centreY - position.y) * ratio,
      });
      setScale(next);
    },
    [geometry, imageObj, position, scale]
  );

  const handleWheel = (e) => {
    e.preventDefault();
    zoomBy(e.deltaY < 0 ? ZOOM_STEP : 1 / ZOOM_STEP);
  };

  const handleFrame = (mode) => {
    if (!imageObj) return;
    centreAt(imageObj, framingScale(imageObj, mode));
  };

  const handleCrop = () => {
    if (!imageObj) return;
    const { crop } = geometry;

    // Source coordinates on the original image
    const sourceX = (crop.x - position.x) / scale;
    const sourceY = (crop.y - position.y) / scale;
    const sourceWidth = crop.width / scale;
    const sourceHeight = crop.height / scale;

    const outputWidth = isLogo ? LOGO_OUTPUT_SIZE : IMAGE_OUTPUT_SIZE;
    const outputHeight = Math.round(outputWidth * (crop.height / crop.width));

    const croppedCanvas = document.createElement('canvas');
    croppedCanvas.width = outputWidth;
    croppedCanvas.height = outputHeight;
    const ctx = croppedCanvas.getContext('2d');

    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = 'high';

    // JPEG has no alpha, so transparent source pixels would come out black
    if (!isLogo) {
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(0, 0, outputWidth, outputHeight);
    }

    ctx.drawImage(
      imageObj,
      sourceX,
      sourceY,
      sourceWidth,
      sourceHeight,
      0,
      0,
      outputWidth,
      outputHeight
    );

    // Logos keep their transparency as PNG; photography stays JPEG for weight
    const mimeType = isLogo ? 'image/png' : 'image/jpeg';
    const quality = isLogo ? undefined : 0.92;

    croppedCanvas.toBlob((blob) => onCropComplete(blob), mimeType, quality);
  };

  const handleTouchStart = (e) => {
    if (e.touches.length !== 1) return;
    startDrag(e.touches[0].clientX, e.touches[0].clientY);
  };

  const handleTouchMove = (e) => {
    if (!isDragging || e.touches.length !== 1) return;
    e.preventDefault();
    moveDrag(e.touches[0].clientX, e.touches[0].clientY);
  };

  const handleTouchEnd = () => setIsDragging(false);

  const heading = isLogo
    ? 'Position logo'
    : aspectRatio === 1
      ? 'Adjust image'
      : 'Adjust event image';

  const subheading = isLogo
    ? 'The white square is the tile used on cards and job pages. Keep the whole logo inside the dashed guide.'
    : aspectRatio === 1
      ? 'Position your image inside the square frame (1:1 ratio)'
      : 'Position your image to match the event card preview (16:9 ratio)';

  return (
    <div className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center p-2 sm:p-4">
      <div className="bg-card rounded-2xl p-3 sm:p-6 max-w-3xl w-full max-h-[95vh] overflow-y-auto">
        <h3 className="text-base sm:text-lg font-medium text-foreground mb-1">{heading}</h3>
        <p className="text-xs sm:text-sm text-muted-foreground mb-3 sm:mb-4">{subheading}</p>

        <div className="flex flex-col lg:flex-row lg:items-start gap-4 mb-3 sm:mb-4">
          <div className="flex justify-center flex-shrink-0">
            <canvas
              ref={canvasRef}
              width={canvasSize}
              height={canvasSize}
              className={`border border-border rounded-lg cursor-move touch-none max-w-full ${
                isLogo ? 'bg-secondary/40' : ''
              }`}
              onMouseDown={handleMouseDown}
              onMouseMove={handleMouseMove}
              onMouseUp={handleMouseUp}
              onMouseLeave={handleMouseUp}
              onTouchStart={handleTouchStart}
              onTouchMove={handleTouchMove}
              onTouchEnd={handleTouchEnd}
              onWheel={handleWheel}
            />
          </div>

          {isLogo && imageObj && (
            <LogoSizePreview
              image={image}
              imageObj={imageObj}
              scale={scale}
              position={position}
              crop={geometry.crop}
            />
          )}
        </div>

        {/* Controls */}
        <div className="flex flex-wrap items-center justify-center gap-2 mb-3">
          <button
            type="button"
            onClick={() => zoomBy(1 / ZOOM_STEP)}
            className="p-2 sm:p-2.5 bg-secondary hover:bg-secondary/80 rounded-lg transition-colors touch-manipulation"
            title="Zoom out"
          >
            <ZoomOut className="w-4 h-4 sm:w-5 sm:h-5" />
          </button>

          <div className="px-3 sm:px-4 py-2 bg-secondary rounded-lg text-xs sm:text-sm font-medium tabular-nums">
            {Math.round(scale * 100)}%
          </div>

          <button
            type="button"
            onClick={() => zoomBy(ZOOM_STEP)}
            className="p-2 sm:p-2.5 bg-secondary hover:bg-secondary/80 rounded-lg transition-colors touch-manipulation"
            title="Zoom in"
          >
            <ZoomIn className="w-4 h-4 sm:w-5 sm:h-5" />
          </button>

          <div className="w-px h-6 sm:h-8 bg-border mx-1 sm:mx-2" />

          <button
            type="button"
            onClick={() => handleFrame('fit')}
            className="flex items-center gap-1.5 px-3 py-2 text-xs sm:text-sm bg-secondary hover:bg-secondary/80 rounded-lg transition-colors touch-manipulation"
            title={isLogo ? 'Fit the whole logo inside the tile' : 'Fit the whole image in the frame'}
          >
            <Maximize className="w-4 h-4" />
            Fit
          </button>

          <button
            type="button"
            onClick={() => handleFrame(isLogo ? 'fit' : 'fill')}
            className="p-2 sm:p-2.5 bg-secondary hover:bg-secondary/80 rounded-lg transition-colors touch-manipulation"
            title="Reset position"
          >
            <RotateCcw className="w-4 h-4 sm:w-5 sm:h-5" />
          </button>
        </div>

        <p className="text-xs sm:text-sm text-muted-foreground text-center mb-3 sm:mb-4">
          <Move className="w-3 h-3 sm:w-4 sm:h-4 inline mr-1" />
          Drag to reposition • Scroll or use the buttons to zoom
        </p>

        {/* Action Buttons */}
        <div className="flex gap-2 sm:gap-3">
          <button
            type="button"
            onClick={onCancel}
            className="flex-1 px-3 sm:px-4 py-2 sm:py-2.5 border border-border rounded-lg hover:bg-secondary transition-colors flex items-center justify-center gap-2 text-sm sm:text-base touch-manipulation"
          >
            <X className="w-4 h-4" />
            Cancel
          </button>
          <button
            type="button"
            onClick={handleCrop}
            className="flex-1 px-3 sm:px-4 py-2 sm:py-2.5 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors flex items-center justify-center gap-2 text-sm sm:text-base touch-manipulation"
          >
            <Check className="w-4 h-4" />
            Apply
          </button>
        </div>
      </div>
    </div>
  );
}

// The tile sizes CompanyLogo renders at, so the cropper answers "how small
// will this be?" rather than only "what is in frame?"
const PREVIEW_TILES = [
  { label: 'Card · 48px', tile: 48 },
  { label: 'Large · 64px', tile: 64 },
  { label: 'Small · 40px', tile: 40 },
];

function LogoSizePreview({ image, imageObj, scale, position, crop }) {
  return (
    <div className="flex-1 min-w-0">
      <div className="text-xs text-muted-foreground mb-2 text-left">Live preview</div>
      <div className="flex flex-wrap items-end gap-4 p-3 rounded-xl bg-secondary/30 border border-border">
        {PREVIEW_TILES.map(({ label, tile }) => {
          // The tile's inner box is two thirds of it, and that box holds the
          // crop frame, which is how the exported square gets laid out
          const padding = tile / 6;
          const content = tile - padding * 2;
          const ratio = content / crop.width;

          return (
            <div key={label} className="flex flex-col items-center gap-1.5">
              <div
                className="rounded-xl bg-white border border-border shadow-sm flex-shrink-0"
                style={{ width: tile, height: tile, padding }}
              >
                <div className="relative w-full h-full overflow-hidden">
                  <img
                    src={image}
                    alt=""
                    className="absolute max-w-none"
                    style={{
                      left: (position.x - crop.x) * ratio,
                      top: (position.y - crop.y) * ratio,
                      width: imageObj.width * scale * ratio,
                      height: imageObj.height * scale * ratio,
                    }}
                  />
                </div>
              </div>
              <span className="text-[10px] text-muted-foreground whitespace-nowrap">{label}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
