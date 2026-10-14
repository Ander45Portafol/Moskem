import {
  CheckIcon,
  XMarkIcon,
} from "@heroicons/react/24/solid";

export function RequirementItem({ isValid, label }) {
  return (
    <div
      className={`flex items-center gap-1.5 ${isValid ? "text-emerald-600" : "text-gray-400"}`}
    >
      {isValid ? (
        <CheckIcon className="size-4" />
      ) : (
        <XMarkIcon className="size-4 text-rose-500" />
      )}
      <span>{label}</span>
    </div>
  );
}
