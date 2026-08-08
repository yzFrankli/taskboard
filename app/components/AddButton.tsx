const AddButton = ({
  openStatus,
  setOpenStatus,
}: {
  openStatus: string;
  setOpenStatus: any;
}) => {
  return (
    <button
      type="button"
      className="add-task-btn mt-2.5 flex w-full items-center justify-center gap-1.5 rounded-xl border border-transparent px-3 py-2.5 text-sm font-medium text-muted"
      onClick={() => setOpenStatus(openStatus)}
      onDoubleClick={() => setOpenStatus(null)}
    >
      <span className="text-base leading-none" aria-hidden>
        +
      </span>
      Add task
    </button>
  );
};

export default AddButton;
