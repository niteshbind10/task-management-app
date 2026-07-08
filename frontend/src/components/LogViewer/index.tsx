import React, { useEffect, useRef } from "react";

interface LogViewerProps {
  logs: string[];
}

const LogViewer: React.FC<LogViewerProps> = ({ logs }) => {
  const containerRef = useRef<HTMLDivElement>(null);

  // Auto scroll logs container to bottom as new logs arrive
  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.scrollTop = containerRef.current.scrollHeight;
    }
  }, [logs]);

  return (
    <div className="flex flex-col gap-2 w-full">
      <div className="flex items-center justify-between text-xs font-semibold text-slate-400 select-none px-1">
        <span>Execution Logs</span>
        <span className="text-[10px] text-slate-500 uppercase tracking-widest bg-slate-900 px-2 py-0.5 rounded border border-slate-800">
          Terminal
        </span>
      </div>
      <div
        ref={containerRef}
        className="w-full h-64 bg-slate-950/90 border border-slate-900 rounded-xl p-4 overflow-y-auto font-mono text-xs text-slate-300 leading-relaxed shadow-inner"
      >
        {logs.length === 0 ? (
          <div className="text-slate-600 italic">No execution logs available.</div>
        ) : (
          logs.map((log, index) => {
            let logColor = "text-slate-300";
            if (log.includes("Error") || log.includes("Failed")) {
              logColor = "text-rose-400";
            } else if (log.includes("success") || log.includes("Success")) {
              logColor = "text-emerald-400";
            } else if (log.includes("Running") || log.includes("started")) {
              logColor = "text-blue-400";
            }

            return (
              <div key={index} className={`py-0.5 ${logColor}`}>
                <span className="text-slate-600 select-none mr-2 font-mono">
                  [{index + 1}]
                </span>
                {log}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

export default LogViewer;
