import { useState } from "react";
import { FileText, Upload, X } from "lucide-react";

export default function CVUploadCard({ initialCV, onUpload, onDelete }) {
  const [uploadedCV, setUploadedCV] = useState(initialCV || null);

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const newCV = {
        name: file.name,
        size: `${(file.size / 1024).toFixed(0)} KB`,
        uploadedDate: new Date().toLocaleDateString("en-US", {
          year: "numeric",
          month: "long",
          day: "numeric",
        }),
      };
      setUploadedCV(newCV);
      if (onUpload) {
        onUpload(newCV);
      }
    }
  };

  const handleDeleteCV = () => {
    setUploadedCV({
      name: "",
      size: "",
      uploadedDate: "",
    });
    if (onDelete) {
      onDelete();
    }
  };

  return (
    <div className="bg-card border border-border rounded-2xl p-6">
      <div className="flex items-center gap-2 mb-4">
        <FileText className="w-5 h-5 text-primary" />
        <h3 className="text-foreground">CV / Resume</h3>
      </div>

      {uploadedCV?.name ? (
        <div className="p-4 bg-secondary/30 rounded-xl border border-border">
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-start gap-3 flex-1 min-w-0">
              <div className="w-10 h-10 rounded-lg bg-primary/10 text-primary flex items-center justify-center shrink-0">
                <FileText className="w-5 h-5" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-foreground text-sm mb-1 truncate text-left">{uploadedCV?.name}</div>
                <div className="text-muted-foreground text-xs text-left">
                  {uploadedCV?.size} • Uploaded {uploadedCV?.uploadedDate}
                </div>
              </div>
            </div>
            <button
              onClick={handleDeleteCV}
              className="text-destructive hover:text-destructive/80 transition-colors shrink-0"
              aria-label="Delete CV"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
          <div className="mt-3 pt-3 border-t border-border flex gap-2">
            <button className="flex-1 px-3 py-2 text-sm border border-border text-foreground rounded-lg hover:bg-secondary transition-colors">
              View
            </button>
            <label className="flex-1 px-3 py-2 text-sm border border-border text-foreground rounded-lg hover:bg-secondary transition-colors cursor-pointer text-center">
              Replace
              <input
                type="file"
                onChange={handleFileUpload}
                accept=".pdf,.doc,.docx"
                className="hidden"
              />
            </label>
          </div>
        </div>
      ) : (
        <label className="block p-8 border-2 border-dashed border-border rounded-xl hover:border-primary/50 transition-colors cursor-pointer text-center">
          <Upload className="w-8 h-8 text-muted-foreground mx-auto mb-3" />
          <div className="text-foreground mb-1">Upload your CV</div>
          <div className="text-sm text-muted-foreground mb-3">PDF, DOC, or DOCX (Max 5MB)</div>
          <div className="inline-block px-4 py-2 bg-primary text-primary-foreground rounded-lg text-sm">
            Choose File
          </div>
          <input
            type="file"
            onChange={handleFileUpload}
            accept=".pdf,.doc,.docx"
            className="hidden"
          />
        </label>
      )}
    </div>
  );
}
