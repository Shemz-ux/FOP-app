import { Image, Upload, X, RefreshCw } from "lucide-react";

export function ImageUploadCard({ 
  imagePreview, 
  imageFile, 
  onImageChange, 
  onRemoveImage,
  label = "Event Image",
  required = false 
}) {
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file && onImageChange) {
      onImageChange(file);
    }
  };

  if (!imagePreview) {
    return (
      <div className="bg-card border border-border rounded-2xl p-6">
        <div className="flex items-center gap-2 mb-4">
          {/* <Image className="w-5 h-5 text-primary" /> */}
          <label className="text-sm text-foreground">
            {label}
            {required && <span className="text-red-500 ml-1">*</span>}
          </label>
        </div>
        <label className="block p-8 border-2 border-dashed border-border rounded-xl text-center hover:border-primary transition-colors cursor-pointer group">
          <Upload className="w-8 h-8 text-muted-foreground mx-auto mb-3 group-hover:text-primary transition-colors" />
          <div className="text-muted-foreground text-sm group-hover:text-foreground transition-colors">
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
    );
  }

  return (
    <div className="bg-card border border-border rounded-2xl p-6">
      <div className="flex items-center gap-2 mb-4">
        {/* <Image className="w-5 h-5 text-primary" /> */}
        <label className="text-sm text-foreground">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      </div>

      <div className="p-4 bg-secondary/30 rounded-xl border border-border">
        <div className="relative mb-3">
          <img
            src={imagePreview}
            alt="Preview"
            className="w-full h-48 object-cover rounded-lg border border-border"
          />
          <button
            type="button"
            onClick={onRemoveImage}
            className="absolute top-2 right-2 p-1.5 bg-destructive text-destructive-foreground rounded-lg hover:opacity-90 transition-opacity shadow-lg"
            title="Remove image"
          >
            <X className="w-4 h-4" />
          </button>
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

        <label className="flex items-center justify-center gap-2 px-4 py-2 text-sm border border-border text-foreground rounded-lg hover:bg-secondary transition-colors cursor-pointer">
          <RefreshCw className="w-4 h-4" />
          Replace Image
          <input
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="hidden"
          />
        </label>
      </div>
    </div>
  );
}
