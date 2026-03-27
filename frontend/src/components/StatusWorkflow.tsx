import type { ItemStatus } from "../types/marketplace";
import { titleCase } from "../utils/format";

type StatusWorkflowProps = {
  status: ItemStatus;
};

const steps: ItemStatus[] = ["available", "reserved", "sold"];

function stepState(current: ItemStatus, step: ItemStatus) {
  const idx = steps.indexOf(current);
  const stepIdx = steps.indexOf(step);
  if (stepIdx < idx) return "done";
  if (stepIdx === idx) return "current";
  return "todo";
}

export default function StatusWorkflow({ status }: StatusWorkflowProps) {
  return (
    <div>
      <p className="text-sm font-medium text-gray-900">Status</p>
      <div className="mt-2 flex items-center gap-2">
        {steps.map((s, i) => {
          const state = stepState(status, s);
          const pillClass =
            state === "done"
              ? "border-emerald-200 bg-emerald-50 text-emerald-700"
              : state === "current"
                ? "border-gray-900 bg-gray-900 text-white"
                : "border-gray-200 bg-white text-gray-600";
          const lineClass = i === steps.length - 1 ? "" : state === "todo" ? "bg-gray-200" : "bg-gray-900";
          return (
            <div key={s} className="flex items-center gap-2">
              <span className={`rounded-full border px-3 py-1 text-xs font-medium ${pillClass}`}>
                {titleCase(s)}
              </span>
              {i !== steps.length - 1 && <span className={`h-[2px] w-6 ${lineClass}`} />}
            </div>
          );
        })}
      </div>
    </div>
  );
}

