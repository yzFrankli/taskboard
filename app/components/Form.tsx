import { useEffect, useRef } from "react";

const Form = ({
  createTasks,
  sessionData,
  status,
  onCancel,
}: {
  createTasks: any;
  sessionData: any;
  status: any;
  onCancel?: () => void;
}) => {
  const refOne = useRef<HTMLFormElement>(null);

  useEffect(() => {
    const titleInput = refOne.current?.querySelector(
      'input[name="title"]'
    ) as HTMLInputElement | null;
    titleInput?.focus();
  }, []);

  useEffect(() => {
    document.addEventListener("click", handleClickOutside, true);

    return () => {
      document.removeEventListener("click", handleClickOutside, true);
    };
  }, []);

  const handleClickOutside = (e: MouseEvent) => {
    if (!refOne.current) return;

    if (!refOne.current.contains(e.target as Node)) {
      console.log("Clicked outside");
    } else {
      console.log("Clicked inside");
    }
  };

  return (
    <form
      ref={refOne}
      action={createTasks}
      className="flex flex-col gap-2"
      onBlur={(e) => {
        if (!e.currentTarget.contains(e.relatedTarget as Node | null)) {
          const form = refOne.current;
          if (!form) return;

          const formData = new FormData(form);
          const title = formData.get("title")?.toString().trim() ?? "";

          if (title != "") form.requestSubmit();
          else onCancel?.();
        }
      }}
    >
      <input
        type="text"
        name="title"
        className="form-field text-[15px] font-semibold"
        placeholder="Task title"
        autoComplete="off"
      />
      <input
        type="text"
        name="description"
        className="form-field text-sm text-muted"
        placeholder="Add a short description…"
        autoComplete="off"
      />
      <p className="pt-1 text-[11px] text-muted/80">
        Press away to save · empty cancels
      </p>

      <input type="hidden" name="status" value={status} />
      <input
        type="hidden"
        name="user_id"
        value={sessionData ? sessionData.userId : 0x0}
      />
    </form>
  );
};

export default Form;
