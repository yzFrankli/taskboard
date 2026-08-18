import { useDraggable } from "@dnd-kit/react";

const TaskCard = ({
  tasks,
  index = 0,
}: {
  tasks: any;
  index?: number;
}) => {
  const { ref, isDragging } = useDraggable({
    id: tasks.id,
  });

  return (
    <div
      ref={ref}
      className="task-card card-in cursor-grab rounded-xl border border-border bg-surface p-3.5 shadow-[var(--shadow)] select-none"
      style={{
        animationDelay: `${index * 40}ms`,
        opacity: isDragging ? 0.55 : 1,
      }}
    >
      <div className="mb-2 flex items-start justify-between gap-2">
        <h3 className="text-[15px] font-semibold leading-snug text-foreground">
          {tasks.title}
        </h3>
        <span
          className="mt-1 flex shrink-0 flex-col gap-0.5 opacity-35"
          aria-hidden
        >
          <span className="block h-0.5 w-3 rounded-full bg-current" />
          <span className="block h-0.5 w-3 rounded-full bg-current" />
          <span className="block h-0.5 w-3 rounded-full bg-current" />
        </span>
      </div>
      {tasks.description ? (
        <p className="line-clamp-3 text-sm leading-relaxed text-muted">
          {tasks.description}
        </p>
      ) : null}
      <div className="mt-3 flex items-center justify-between border-t border-border/70 pt-2.5">
        <span className="text-[10px] font-bold uppercase tracking-[0.14em] text-muted">Play {String(index + 1).padStart(2, "0")}</span>
        {tasks.priority ? <span className="rounded-md bg-surface-soft px-2 py-0.5 text-xs font-bold capitalize text-muted">{tasks.priority}</span> : <span className="text-[10px] font-bold uppercase tracking-[0.14em] text-accent">Ready</span>}
      </div>
    </div>
  );
};

export default TaskCard;
