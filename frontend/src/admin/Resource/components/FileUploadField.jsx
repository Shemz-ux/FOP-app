import { useRef } from 'react';
import { Upload } from 'lucide-react';
import { RESOURCE_FILE_EXTENSIONS } from '../resourceOptions';

const acceptedTypes = RESOURCE_FILE_EXTENSIONS.map(extension => `.${extension}`).join(',');

export default function FileUploadField({ file, onFileChange, existingFileName, existingFileSize, isEdit, copy }) {
  const inputRef = useRef(null);

  const handleDrop = (e) => {
    e.preventDefault();
    const droppedFile = e.dataTransfer.files?.[0];
    if (droppedFile) {
      onFileChange(droppedFile);
    }
  };

  const handleRemove = () => {
    onFileChange(null);
    if (inputRef.current) {
      inputRef.current.value = '';
    }
  };

  return (
    <div>
      {isEdit && existingFileName && (
        <div className="mb-4 p-4 bg-secondary rounded-lg">
          <p className="text-sm text-muted-foreground mb-1">{copy.currentLabel}</p>
          <p className="text-foreground font-medium">{existingFileName}</p>
          <p className="text-sm text-muted-foreground">{existingFileSize}</p>
        </div>
      )}
      <label className="block text-sm mb-2 text-foreground">
        {isEdit ? copy.editLabel : copy.createLabel} {!isEdit && <span className="text-red-500">*</span>}
      </label>
      <div
        onDragOver={(e) => e.preventDefault()}
        onDrop={handleDrop}
        className="border-2 border-dashed border-border rounded-xl p-8 text-center hover:border-primary transition-colors"
      >
        <Upload className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
        <p className="text-foreground mb-2">
          {file ? file.name : copy.dropPrompt}
        </p>
        <p className="text-sm text-muted-foreground">{copy.hint}</p>
        <input
          ref={inputRef}
          type="file"
          accept={acceptedTypes}
          className="hidden"
          id="file-upload"
          onChange={(e) => onFileChange(e.target.files?.[0] || null)}
        />
        <div className="flex gap-2 justify-center mt-4">
          <label
            htmlFor="file-upload"
            className="px-6 py-3 bg-primary text-primary-foreground rounded-lg hover:opacity-90 cursor-pointer"
          >
            {file ? copy.change : copy.select}
          </label>
          {file && (
            <button
              type="button"
              onClick={handleRemove}
              className="px-6 py-3 border border-red-500/50 text-red-500 rounded-lg hover:bg-red-500/10 transition-colors"
            >
              {copy.remove}
            </button>
          )}
        </div>
        {file && (
          <p className="mt-4 text-sm text-green-500 font-medium">{copy.selected(file.name)}</p>
        )}
      </div>
    </div>
  );
}
