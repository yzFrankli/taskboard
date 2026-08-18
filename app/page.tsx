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
  const completedCount =
    taskTitles?.filter((task: any) => task.status === "Done").length ?? 0;
  const inPlayCount =
    taskTitles?.filter((task: any) => task.status === "In Progress").length ?? 0;

  return (
    <div className="flex flex-1 flex-col px-4 pb-10 pt-4 sm:px-8 sm:pt-7 lg:px-10">
      <header className="scoreboard board-in mb-7 overflow-hidden rounded-2xl border border-white/10 shadow-2xl shadow-slate-950/25">
        <div className="scoreboard-top flex items-center justify-between px-4 py-2 text-[10px] font-bold uppercase tracking-[0.2em] sm:px-6">
          <span>Task League · Game Day</span>
          <span className="flex items-center gap-2"><i className="live-dot" /> Live board</span>
        </div>
        <div className="flex flex-col gap-5 px-5 py-6 sm:px-7 md:flex-row md:items-center md:justify-between">
          <div className="flex items-center gap-4">
            {/* <div className="team-mark" aria-hidden>TB</div> */}
            <div>
              <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-cyan-300">Home team</p>
              <h1 className="font-[family-name:var(--font-syne)] text-3xl font-extrabold uppercase tracking-tight text-white sm:text-4xl">Task Manager</h1>
              <p className="mt-1 text-sm text-slate-300">Drag cards across columns to change status.</p>
            </div>
          </div>
          <div className="score-stats grid grid-cols-3 divide-x divide-white/10 self-stretch rounded-xl border border-white/10 bg-slate-950/35 md:self-auto">
            <div><strong>{taskCount}</strong><span>On board</span></div>
            <div><strong>{inPlayCount}</strong><span>In play</span></div>
            <div><strong>{completedCount}</strong><span>Final</span></div>
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
