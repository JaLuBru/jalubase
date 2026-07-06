import { changeCaptureResurface } from "@/app/actions";

type ResurfaceActionsProps = {
  id: string;
  compact?: boolean;
};

const actions = [
  ["tomorrow", "Tomorrow"],
  ["week", "Week"],
  ["month", "Month"],
  ["clear", "Clear"]
] as const;

export function ResurfaceActions({ id, compact = false }: ResurfaceActionsProps) {
  return (
    <div className={compact ? "resurface-actions compact" : "resurface-actions"}>
      {actions.map(([preset, label]) => (
        <form action={changeCaptureResurface} key={preset}>
          <input name="id" type="hidden" value={id} />
          <input name="preset" type="hidden" value={preset} />
          <button
            type="submit"
            className={preset === "clear" ? "secondary-button" : undefined}
          >
            {label}
          </button>
        </form>
      ))}
    </div>
  );
}
