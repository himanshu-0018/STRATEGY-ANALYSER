import { useRef, useState } from "react";
import { UploadCloud } from "lucide-react";

export const Uploader = ({ onFiles, compact }) => {
  const ref = useRef(null);
  const [over, setOver] = useState(false);
  const drop = (e) => {
    e.preventDefault();
    setOver(false);
    onFiles(Array.from(e.dataTransfer.files));
  };
  return (
    <div
      data-testid="file-drop-area"
      onClick={() => ref.current?.click()}
      onDragOver={(e) => { e.preventDefault(); setOver(true); }}
      onDragLeave={() => setOver(false)}
      onDrop={drop}
      className={`qf-drop group cursor-pointer border border-dashed transition-colors duration-200 ${over ? "border-cyan-400 bg-cyan-400/5" : "border-slate-700 hover:border-slate-500"} ${compact ? "px-5 py-4 flex items-center gap-4" : "px-8 py-16 flex flex-col items-start gap-5"}`}
    >
      <UploadCloud className={`text-cyan-400 transition-transform duration-300 group-hover:-translate-y-0.5 ${compact ? "h-6 w-6" : "h-10 w-10"}`} />
      <div>
        <p className={`font-heading font-semibold text-slate-100 ${compact ? "text-sm" : "text-xl"}`}>
          {compact ? "Add more MT5 reports" : "Drop MT5 Strategy Tester reports here"}
        </p>
        <p className="text-xs text-slate-400 mt-1">.html / .htm exports — multiple files supported. Parsed locally in your browser.</p>
      </div>
      <input
        ref={ref}
        data-testid="file-input-element"
        type="file"
        accept=".html,.htm"
        multiple
        className="hidden"
        onChange={(e) => { onFiles(Array.from(e.target.files)); e.target.value = ""; }}
      />
    </div>
  );
};
