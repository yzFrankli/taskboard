import { useDroppable } from "@dnd-kit/react";
import AddButton from "./AddButton";
import Form from "./Form";

const statusStyles: Record<string, { dot: string; chip: string; period: string }> = {
  "To Do": {
    dot: "bg-[var(--todo)]",
    chip: "bg-slate-200 text-slate-700",
    period: "Warm-up",
  },
  "In Progress": {
    dot: "bg-[var(--progress)]",
    chip: "bg-sky-100 text-sky-900",
    period: "First half",
  },
  "In Review": {
    dot: "bg-[var(--review)]",
    chip: "bg-amber-100 text-amber-950",
    period: "Replay booth",
  },
  Done: {
    dot: "bg-[var(--done)]",
    chip: "bg-emerald-100 text-emerald-950",
    period: "Final score",
  },
};

const Column = ({
  taskTitles,
  TaskCard,
  openStatus,
  setOpenStatus,
  stat,
  createTasks,
  sessionData,
  index = 0,
}: {
  taskTitles: any;
  TaskCard: any;
  openStatus: any;
  setOpenStatus: any;
  stat: any;
  createTasks: any;
  sessionData: any;
  index?: number;
}) => {
  const { ref, isDropTarget } = useDroppable({
    id: stat,
  });

  const filtered =
    taskTitles?.filter((task: any) => task.status === stat) ?? [];
  const styles = statusStyles[stat] ?? statusStyles["To Do"];

  return (
    <div
      className="board-in flex w-[min(100%,280px)] shrink-0 flex-col"
      style={{ animationDelay: `${index * 70 + 100}ms` }}
    >
      <div
        ref={ref}
        data-dragging={isDropTarget ? "true" : "false"}
        className="column-shell flex min-h-[440px] flex-1 flex-col rounded-2xl border border-border/90 bg-surface-soft/95 p-3 shadow-lg shadow-slate-950/5"
      >
        <div className="mb-3 flex items-center justify-between gap-2 border-b border-border px-1 pb-3">
          <div className="flex items-center gap-2">
            <span
              className={`h-2.5 w-2.5 rounded-full ring-4 ring-current/5 ${styles.dot}`}
              aria-hidden
            />
            <div><p className="text-[9px] font-bold uppercase tracking-[0.16em] text-muted">{styles.period}</p><h2 className="font-[family-name:var(--font-syne)] text-base font-bold tracking-tight text-foreground">{stat}</h2></div>
          </div>
          <span
            className={`rounded-md px-2 py-1 text-xs font-bold tabular-nums ${styles.chip}`}
          >
            {filtered.length}
          </span>
        </div>

        <div className="flex flex-1 flex-col gap-2.5">
          {filtered.map((tasks: any, i: number) => (
            <TaskCard key={tasks.id} tasks={tasks} index={i} />
          ))}

          {openStatus === stat && (
            <div className="card-in rounded-xl border border-dashed border-accent/50 bg-surface p-3 shadow-[var(--shadow)]">
              <Form
                createTasks={createTasks}
                sessionData={sessionData}
                status={stat}
                onCancel={() => setOpenStatus(null)}
              />
            </div>
          )}

          {filtered.length === 0 && openStatus !== stat && (
            <div className="field-empty flex flex-1 items-center justify-center rounded-xl border border-dashed border-border px-3 py-8 text-center text-sm font-medium text-muted">
              <span>Open lane<br /><small>Drop a play here</small></span>
            </div>
          )}
        </div>
      </div>

      <AddButton openStatus={stat} setOpenStatus={setOpenStatus} />
    </div>
  );
};

export default Column;
