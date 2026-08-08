"use client";

import { createClient } from "../config/supabaseClient";
import { useEffect, useState } from "react";

import TaskCard from "./components/TaskCard";
import { DragDropProvider, DragEndEvent } from "@dnd-kit/react";
import Column from "./components/Column";

export default function Home() {
  const supabase = createClient();

  const [stat] = useState({
    ToDo: "To Do",
    InProgress: "In Progress",
    InReview: "In Review",
    Done: "Done",
  });

  const [fetchError, setFetchError] = useState<any>(null);
  const [taskTitles, setTaskTitles] = useState<any>(null);
  const [openStatus, setOpenStatus] = useState<String | null>(null);
  const [sessionData, setSessionData] = useState<any>(null);

  const handleDragEnd = async (event: DragEndEvent) => {
    const { source, target } = event.operation;

    if (!target) return;

    const taskId = source?.id;
    const newStatus = target.id;

    const task = taskTitles?.find((task: any) => task.id === taskId);

    if (!task || task.status === newStatus) {
      return;
    }

    const { error } = await supabase
      .from("tasks")
      .update({
        status: newStatus,
      })
      .eq("id", taskId)
      .eq("user_id", sessionData.userId);

    if (error) {
      console.error("Failed to update task: ", error);
      return;
    }

    await fetchTasks();
  };

  useEffect(() => {
    const getSession = async () => {
      let {
        data: { session },
        error,
      } = await supabase.auth.getSession();

      if (!session) {
        await supabase.auth.signInAnonymously();
      }

      if (session) {
        const jwtPayload = JSON.parse(
          atob(session.access_token.split(".")[1])
        );

        setSessionData({
          sessionId: jwtPayload.session_id,
          userId: session.user.id,
        });
      } else {
        setSessionData(null);
      }
    };

    getSession();
  }, []);

  const fetchTasks = async () => {
    if (!sessionData) return;

    const { data, error } = await supabase
      .from("tasks")
      .select()
      .eq("user_id", sessionData.userId);

    if (error) {
      setFetchError("Could not fetch the tasks");
      setTaskTitles([]);
      console.log(error);
    }
    if (data) {
      setTaskTitles(data);
      setFetchError(null);
    }
  };

  useEffect(() => {
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session) {
        const jwtPayload = JSON.parse(
          atob(session.access_token.split(".")[1])
        );

        setSessionData({
          sessionId: jwtPayload.session_id,
          userId: session.user.id,
        });
      } else {
        setSessionData(null);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const createTasks = async (formData: FormData) => {
    const payload = {
      title: formData.get("title"),
      description: formData.get("description"),
      status: formData.get("status"),
      user_id: formData.get("user_id"),
    };

    const { error } = await supabase
      .from("tasks")
      .insert(payload)
      .select()
      .eq("user_id", sessionData.userId);

    if (error) {
      console.log(error);
      return;
    }
    if (formData) {
      fetchTasks();
    }
  };

  useEffect(() => {
    fetchTasks();
  }, [sessionData]);

  const taskCount = taskTitles?.length ?? 0;

  return (
    <div className="flex flex-1 flex-col px-5 pb-10 pt-6 sm:px-8 lg:px-10">
      <header className="board-in mb-8 border-b border-border/80 pb-6">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="mb-1 text-xs font-semibold uppercase tracking-[0.18em] text-accent">
              Workspace
            </p>
            <h1
              className="font-[family-name:var(--font-syne)] text-4xl font-bold tracking-tight text-foreground sm:text-5xl"
            >
              TaskBoard
            </h1>
            <p className="mt-2 max-w-md text-sm text-muted">
              Drag cards across columns to keep work moving.
            </p>
          </div>
          <div className="rounded-full border border-border bg-surface/70 px-4 py-2 text-sm text-muted backdrop-blur-sm">
            <span className="font-medium text-foreground">{taskCount}</span>
            {" "}
            {taskCount === 1 ? "task" : "tasks"}
          </div>
        </div>
      </header>

      {fetchError && (
        <p className="mb-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {fetchError}
        </p>
      )}

      <DragDropProvider onDragEnd={handleDragEnd}>
        <div className="board-in flex gap-4 overflow-x-auto pb-4 [animation-delay:80ms] sm:gap-5">
          {Object.entries(stat).map(([key, value], index) => (
            <Column
              key={key}
              taskTitles={taskTitles}
              TaskCard={TaskCard}
              openStatus={openStatus}
              setOpenStatus={setOpenStatus}
              stat={value}
              createTasks={createTasks}
              sessionData={sessionData}
              index={index}
            />
          ))}
        </div>
      </DragDropProvider>
    </div>
  );
}
