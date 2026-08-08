import { useDroppable } from "@dnd-kit/react";
import AddButton from "./AddButton";
import Form from "./Form";

const statusStyles: Record<string, { dot: string; chip: string }> = {
  "To Do": {
    dot: "bg-[var(--todo)]",
    chip: "bg-slate-100 text-slate-700",
  },
  "In Progress": {
    dot: "bg-[var(--progress)]",
    chip: "bg-sky-100 text-sky-800",
  },
  "In Review": {
    dot: "bg-[var(--review)]",
    chip: "bg-amber-100 text-amber-900",
  },
  Done: {
    dot: "bg-[var(--done)]",
    chip: "bg-teal-100 text-teal-900",
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
        className="column-shell flex min-h-[420px] flex-1 flex-col rounded-2xl border border-border/90 bg-surface-soft/80 p-3 backdrop-blur-sm"
      >
        <div className="mb-3 flex items-center justify-between gap-2 px-1">
          <div className="flex items-center gap-2">
            <span
              className={`h-2 w-2 rounded-full ${styles.dot}`}
              aria-hidden
            />
            <h2 className="font-[family-name:var(--font-syne)] text-base font-semibold tracking-tight text-foreground">
              {stat}
            </h2>
          </div>
          <span
            className={`rounded-md px-2 py-0.5 text-xs font-medium ${styles.chip}`}
          >
            {filtered.length}
          </span>
        </div>

        <div className="flex flex-1 flex-col gap-2.5">
          {filtered.map((tasks: any, i: number) => (
            <TaskCard key={tasks.id} tasks={tasks} index={i} />
          ))}

          {openStatus === stat && (
            <div className="card-in rounded-xl border border-dashed border-accent/40 bg-surface p-3 shadow-[var(--shadow)]">
              <Form
                createTasks={createTasks}
                sessionData={sessionData}
                status={stat}
                onCancel={() => setOpenStatus(null)}
              />
            </div>
          )}

          {filtered.length === 0 && openStatus !== stat && (
            <div className="flex flex-1 items-center justify-center rounded-xl border border-dashed border-border/70 px-3 py-8 text-center text-sm text-muted">
              Drop tasks here
            </div>
          )}
        </div>
      </div>

      <AddButton openStatus={stat} setOpenStatus={setOpenStatus} />
    </div>
  );
};

export default Column;
