import { Image, Upload, X, RefreshCw, ZoomIn, Crop } from "lucide-react";
import { useState } from "react";
import ImageCropper from './ImageCropper';

export default function ImageUploadCard({ 
  imagePreview, 
  imageFile, 
  onImageChange, 
  onRemoveImage,
  label = "Event Image",
  required = false,
  enableCropping = true,
  aspectRatio = 1
}) {
  const [isZoomed, setIsZoomed] = useState(false);
  const [isCropping, setIsCropping] = useState(false);
  const [tempImage, setTempImage] = useState(null);
  const [originalFileName, setOriginalFileName] = useState('cropped-image.png');

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    
    if (file) {
      setOriginalFileName(file.name);
      if (enableCropping) {
        // Show cropper for adjustment
        const reader = new FileReader();
        reader.onloadend = () => {
          setTempImage(reader.result);
          setIsCropping(true);
        };
        reader.readAsDataURL(file);
      } else {
        // Direct upload without cropping - parent handles preview
        onImageChange(file);
      }
    }
  };

  const handleCropComplete = (croppedBlob) => {
    console.log('Crop complete, blob size:', croppedBlob.size);
    
    // Convert blob to file
    const croppedFile = new File([croppedBlob], originalFileName, {
      type: 'image/png'
    });
    
    console.log('Cropped file created:', croppedFile.name, croppedFile.size);
    
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

  return (
    <>
      {/* Image Cropper */}
      {isCropping && tempImage && (
        <ImageCropper
          image={tempImage}
          onCropComplete={handleCropComplete}
          onCancel={handleCropCancel}
          aspectRatio={aspectRatio}
        />
      )}

      {!imagePreview ? (
        <div className="bg-card border border-border rounded-2xl p-4 sm:p-6 w-full">
          <div className="flex items-center gap-2 mb-3 sm:mb-4">
            {/* <Image className="w-5 h-5 text-primary" /> */}
            <label className="text-sm text-foreground">
              {label}
              {required && <span className="text-red-500 ml-1">*</span>}
            </label>
          </div>
          <label className="block p-6 sm:p-8 border-2 border-dashed border-border rounded-xl text-center hover:border-primary transition-colors cursor-pointer group">
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
      <div className="flex items-center gap-2 mb-3 sm:mb-4">
        {/* <Image className="w-5 h-5 text-primary" /> */}
        <label className="text-sm text-foreground">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      </div>

      <div className="p-3 sm:p-4 bg-secondary/30 rounded-xl border border-border">
        <div className="relative mb-3 w-full overflow-hidden bg-white rounded-lg border border-border group/preview">
          <img
            src={imagePreview}
            alt="Preview"
            className="w-full h-40 sm:h-48 object-contain p-4 cursor-zoom-in"
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
          Tip: Square logos (1:1 ratio) work best. Transparent backgrounds recommended.
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

      {/* Zoom Modal */}
      {isZoomed && (
        <div 
          className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4"
          onClick={() => setIsZoomed(false)}
        >
          <div 
            className="bg-card border border-border rounded-2xl p-4 max-w-md w-full shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-medium text-foreground">Logo Preview</h3>
              <button
                onClick={() => setIsZoomed(false)}
                className="p-1.5 hover:bg-secondary rounded-lg transition-colors"
                title="Close"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="bg-white rounded-xl border border-border p-4 flex items-center justify-center">
              <img
                src={imagePreview}
                alt="Logo preview"
                className="max-w-full max-h-[400px] object-contain"
              />
            </div>
          </div>
        </div>
      )}
    </div>
      )}
    </>
  );
}
