import { Upload, X, RefreshCw, ZoomIn, Crop } from "lucide-react";
import { useState } from "react";
import ImageCropper from './ImageCropper';

// Cloudinary and the API both validate on mime type, so the name has to agree
// with what the cropper actually produced
const nameForBlob = (name, blobType) => {
  const extension = blobType === 'image/png' ? 'png' : 'jpg';
  const base = (name || 'image').replace(/\.[^./\\]+$/, '') || 'image';
  return `${base}.${extension}`;
};

export default function ImageUploadCard({
  imagePreview,
  imageFile,
  onImageChange,
  onRemoveImage,
  label = "Event Image",
  required = false,
  enableCropping = true,
  aspectRatio = 1,
  variant = 'image'
}) {
  const isLogo = variant === 'logo';

  const [isZoomed, setIsZoomed] = useState(false);
  const [isCropping, setIsCropping] = useState(false);
  const [tempImage, setTempImage] = useState(null);
  const [isDragActive, setIsDragActive] = useState(false);
  const [originalFileName, setOriginalFileName] = useState('cropped-image.png');

  const processFile = (file) => {
    if (!file || !file.type?.startsWith('image/')) return;

    setOriginalFileName(file.name);

    if (!enableCropping) {
      // Direct upload without cropping - parent handles preview
      onImageChange(file);
      return;
    }

    // Show cropper for adjustment
    const reader = new FileReader();
    reader.onloadend = () => {
      setTempImage(reader.result);
      setIsCropping(true);
    };
    reader.readAsDataURL(file);
  };

  const handleFileChange = (e) => {
    processFile(e.target.files?.[0]);
    // Allows re-picking the same file after a cancel
    e.target.value = '';
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragActive(true);
  };

  const handleDragLeave = () => setIsDragActive(false);

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragActive(false);
    processFile(e.dataTransfer.files?.[0]);
  };

  const handleCropComplete = (croppedBlob) => {
    if (!croppedBlob) return;

    const croppedFile = new File(
      [croppedBlob],
      nameForBlob(originalFileName, croppedBlob.type),
      { type: croppedBlob.type }
    );

    // Call the parent's onChange handler which will update the preview
    if (onImageChange) {
      onImageChange(croppedFile);
    }

    setIsCropping(false);
    setTempImage(null);
  };

  const handleCropCancel = () => {
    setIsCropping(false);
    setTempImage(null);
  };

  const handleAdjustImage = () => {
    if (imagePreview) {
      setTempImage(imagePreview);
      setIsCropping(true);
    }
  };

  const cropper = isCropping && tempImage && (
    <ImageCropper
      image={tempImage}
      onCropComplete={handleCropComplete}
      onCancel={handleCropCancel}
      aspectRatio={aspectRatio}
      variant={variant}
    />
  );

  const fieldLabel = (
    <label className="block text-sm text-foreground text-left">
      {label}
      {required && <span className="text-red-500 ml-1">*</span>}
    </label>
  );

  // A logo is shown at 40-64px, so the editor stays a single compact row
  // rather than a full-width block
  if (isLogo) {
    return (
      <>
        {cropper}
        <div>
          <div className="mb-2">{fieldLabel}</div>

          {!imagePreview ? (
            <label
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              className={`flex items-center gap-3 p-3 bg-card border border-dashed rounded-xl cursor-pointer transition-colors group ${
                isDragActive ? 'border-primary bg-primary/5' : 'border-border hover:border-primary'
              }`}
            >
              <span className="w-14 h-14 rounded-xl border border-dashed border-border bg-secondary/40 flex items-center justify-center flex-shrink-0 group-hover:border-primary transition-colors">
                <Upload className="w-5 h-5 text-muted-foreground group-hover:text-primary transition-colors" />
              </span>
              <span className="min-w-0 text-left">
                <span className="block text-sm text-foreground">Upload a logo</span>
                <span className="block text-xs text-muted-foreground">
                  Square PNG with a transparent background works best • up to 10MB
                </span>
              </span>
              <input type="file" accept="image/*" onChange={handleFileChange} className="hidden" />
            </label>
          ) : (
            <div className="flex items-center gap-3 p-3 bg-card border border-border rounded-xl">
              {/* Same tile as CompanyLogo: white, rounded, padded, contained */}
              {enableCropping ? (
                <button
                  type="button"
                  onClick={handleAdjustImage}
                  className="w-14 h-14 p-2 rounded-xl bg-white border border-border shadow-sm flex items-center justify-center flex-shrink-0 hover:border-primary transition-colors"
                  title="Adjust logo position"
                >
                  <img src={imagePreview} alt="Logo preview" className="w-full h-full object-contain" />
                </button>
              ) : (
                <div className="w-14 h-14 p-2 rounded-xl bg-white border border-border shadow-sm flex items-center justify-center flex-shrink-0">
                  <img src={imagePreview} alt="Logo preview" className="w-full h-full object-contain" />
                </div>
              )}

              <div className="min-w-0 flex-1 text-left">
                <div className="text-sm text-foreground truncate">
                  {imageFile?.name || 'Current logo'}
                </div>
                <div className="text-xs text-muted-foreground">
                  {imageFile
                    ? `${(imageFile.size / 1024 / 1024).toFixed(2)} MB • shown at 40-64px`
                    : 'Shown at 40-64px on job and event cards'}
                </div>
              </div>

              <div className="flex items-center gap-1 flex-shrink-0">
                {enableCropping && (
                  <button
                    type="button"
                    onClick={handleAdjustImage}
                    className="p-2 text-muted-foreground hover:text-foreground hover:bg-secondary rounded-lg transition-colors"
                    title="Adjust position"
                    aria-label="Adjust logo position"
                  >
                    <Crop className="w-4 h-4" />
                  </button>
                )}
                <label
                  className="p-2 text-muted-foreground hover:text-foreground hover:bg-secondary rounded-lg transition-colors cursor-pointer"
                  title="Replace logo"
                >
                  <RefreshCw className="w-4 h-4" />
                  <span className="sr-only">Replace logo</span>
                  <input type="file" accept="image/*" onChange={handleFileChange} className="hidden" />
                </label>
                <button
                  type="button"
                  onClick={onRemoveImage}
                  className="p-2 text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded-lg transition-colors"
                  title="Remove logo"
                  aria-label="Remove logo"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}
        </div>
      </>
    );
  }

  return (
    <>
      {cropper}

      {!imagePreview ? (
        <div className="bg-card border border-border rounded-2xl p-4 sm:p-6 w-full">
          <div className="flex items-center gap-2 mb-3 sm:mb-4">{fieldLabel}</div>
          <label
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            className={`block p-6 sm:p-8 border-2 border-dashed rounded-xl text-center transition-colors cursor-pointer group ${
              isDragActive ? 'border-primary bg-primary/5' : 'border-border hover:border-primary'
            }`}
          >
            <Upload className="w-6 h-6 sm:w-8 sm:h-8 text-muted-foreground mx-auto mb-2 sm:mb-3 group-hover:text-primary transition-colors" />
            <div className="text-muted-foreground text-xs sm:text-sm group-hover:text-foreground transition-colors">
              Click to upload or drag and drop
            </div>
            <div className="text-muted-foreground text-xs mt-1">
              PNG, JPG, GIF up to 10MB
            </div>
            <input
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="hidden"
            />
          </label>
        </div>
      ) : (
    <div className="bg-card border border-border rounded-2xl p-4 sm:p-6 w-full">
      <div className="flex items-center gap-2 mb-3 sm:mb-4">{fieldLabel}</div>

      <div className="p-3 sm:p-4 bg-secondary/30 rounded-xl border border-border">
        <div className={`relative mb-3 w-full overflow-hidden rounded-lg border border-border group/preview ${aspectRatio === 1 ? 'aspect-square' : 'aspect-[16/9]'}`}>
          <img
            src={imagePreview}
            alt="Preview"
            className="w-full h-full object-cover cursor-zoom-in"
            onClick={() => setIsZoomed(true)}
          />
          <button
            type="button"
            onClick={onRemoveImage}
            className="absolute top-2 right-2 p-1.5 bg-destructive text-destructive-foreground rounded-lg hover:opacity-90 transition-opacity shadow-lg"
            title="Remove image"
          >
            <X className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={() => setIsZoomed(true)}
            className="absolute bottom-2 right-2 p-1.5 bg-card/90 backdrop-blur-sm text-foreground rounded-lg hover:bg-card transition-all shadow-lg opacity-0 group-hover/preview:opacity-100"
            title="Zoom to view full size"
          >
            <ZoomIn className="w-4 h-4" />
          </button>
        </div>
        <div className="text-xs text-muted-foreground mb-3 text-left">
          Tip: {aspectRatio === 1 ? '1:1 square' : '16:9'} ratio images work best. Portrait images may be cropped on the sides.
        </div>

        {imageFile && (
          <div className="mb-3 pb-3 border-b border-border">
            <div className="text-foreground text-sm mb-1 truncate text-left">
              {imageFile.name}
            </div>
            <div className="text-muted-foreground text-xs text-left">
              {(imageFile.size / 1024 / 1024).toFixed(2)} MB
            </div>
          </div>
        )}

        <div className="flex gap-2">
          {enableCropping && (
            <button
              type="button"
              onClick={handleAdjustImage}
              className="flex-1 flex items-center justify-center gap-2 px-4 py-2 text-sm border border-border text-foreground rounded-lg hover:bg-secondary transition-colors"
            >
              <Crop className="w-4 h-4" />
              Adjust Position
            </button>
          )}
          <label className="flex-1 flex items-center justify-center gap-2 px-4 py-2 text-sm border border-border text-foreground rounded-lg hover:bg-secondary transition-colors cursor-pointer">
            <RefreshCw className="w-4 h-4" />
            Replace
            <input
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="hidden"
            />
          </label>
        </div>
      </div>
    </div>
      )}

      {/* Zoom Modal */}
      {isZoomed && (
        <div
          className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200"
          onClick={() => setIsZoomed(false)}
        >
          <div
            className="bg-card border border-border rounded-2xl p-4 max-w-md w-full shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-medium text-foreground">Image Preview</h3>
              <button
                onClick={() => setIsZoomed(false)}
                className="p-1.5 hover:bg-secondary rounded-lg transition-colors"
                title="Close"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className={`rounded-xl border border-border overflow-hidden ${aspectRatio === 1 ? 'aspect-square' : 'aspect-[16/9]'}`}>
              <img
                src={imagePreview}
                alt="Image preview"
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </div>
      )}
    </>
  );
}
