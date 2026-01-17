import { FileText, Download } from "lucide-react";

export function CVViewCard({ cvData }) {
  if (!cvData || !cvData.name) {
    return (
      <div className="bg-card border border-border rounded-2xl p-6">
        <div className="flex items-center gap-2 mb-4">
          <FileText className="w-5 h-5 text-primary" />
          <h3 className="text-foreground">CV / Resume</h3>
        </div>
        <div className="p-8 border-2 border-dashed border-border rounded-xl text-center">
          <FileText className="w-8 h-8 text-muted-foreground mx-auto mb-3" />
          <div className="text-muted-foreground">No CV uploaded</div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-card border border-border rounded-2xl p-6">
      <div className="flex items-center gap-2 mb-4">
        <FileText className="w-5 h-5 text-primary" />
        <h3 className="text-foreground">CV / Resume</h3>
      </div>

      <div className="p-4 bg-secondary/30 rounded-xl border border-border">
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-start gap-3 flex-1 min-w-0">
            <div className="w-10 h-10 rounded-lg bg-primary/10 text-primary flex items-center justify-center shrink-0">
              <FileText className="w-5 h-5" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-foreground text-sm mb-1 truncate text-left">
                {cvData.name}
              </div>
              <div className="text-muted-foreground text-xs text-left">
                {cvData.size && `${cvData.size} • `}
                {cvData.uploadedDate && `Uploaded ${cvData.uploadedDate}`}
              </div>
            </div>
          </div>
        </div>
        <div className="mt-3 pt-3 border-t border-border flex gap-2">
          <button className="flex-1 px-3 py-2 text-sm border border-border text-foreground rounded-lg hover:bg-secondary transition-colors">
            View
          </button>
          <button className="flex-1 px-3 py-2 text-sm border border-border text-foreground rounded-lg hover:bg-secondary transition-colors flex items-center justify-center gap-2">
            <Download className="w-4 h-4" />
            Download
          </button>
        </div>
      </div>
    </div>
  );
}
