"use client";

import { UUID } from "crypto";

import { createClient } from "../config/supabaseClient"
import { JSXElementConstructor, ReactElement, ReactNode, ReactPortal, useActionState, useEffect, useState } from "react";

// components
import TaskCard from "./components/TaskCard";
import AddButton from "./components/AddButton"
import { SupabaseClient } from "@supabase/supabase-js";
import Form from "./components/Form";
import { DragDropProvider, DragEndEvent, useDraggable } from "@dnd-kit/react";
import Column from "./components/Column";


export default function Home() { 

  // console.log(supabase)
  const supabase = createClient()
  const stat: string[] = ["to-do", "in-progress", "done"]

  const [tasks, setTasks] = useState<any>(null);

  const [fetchError, setFetchError] = useState<any>(null)

  const [taskTitles, setTaskTitles] = useState<any>(null)

  const [createError, setCreateError] = useState<any>(null)

  const [openStatus, setOpenStatus] = useState<String | null>(null);

  const [sessionData, setSessionData] = useState<any>(null);


  const handleDragEnd = async (event: DragEndEvent) => {
    const { source, target } = event.operation

    if (!target) return

    const taskId = source?.id
    const newStatus = target.id

    console.log(taskId)
    console.log(newStatus)

    const task = taskTitles?.find(
      (task: any) => task.id === taskId
    )

    if (!task || task.status === newStatus) {
      return
    }

    const { error } = await supabase
      .from("tasks")
      .update({
        status: newStatus,
      })
      .eq("id", taskId)
      .eq("user_id", sessionData.userId)

    if (error) {
      console.error("Failed to update task: ", error)
      return
    }

    await fetchTasks()
  }

  


  useEffect(() => {
    const getSession = async () => {
      let { 
        data: { session }, 
        error
      } = await supabase.auth.getSession()

      console.log("session", session)
      console.log("error", error);
      if (!session) {
        const { error } = await supabase.auth.signInAnonymously()
      }

      if (session) {
        console.log("user", session.user)

        const jwtPayload = JSON.parse(
          atob(session.access_token.split('.')[1])
        );
        
        console.log(jwtPayload)

        setSessionData({
          sessionId: jwtPayload.session_id,
          userId: session.user.id,
        });
      } else {
        setSessionData(null)
      }
    }
    
    getSession()
  }, [])

  const fetchTasks = async () => {
    if (!sessionData) return

    const { data, error } = await supabase
      .from('tasks')
      .select()
      .eq('user_id', sessionData.userId)

      if (error) {
        setFetchError('Could not fetch the tasks')
        setTaskTitles([])
        console.log(error)
      }
      if (data) {
        setTaskTitles(data)
        setFetchError(null)
      }
  }

  useEffect(() => {
    const { 
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session) {
        const jwtPayload = JSON.parse(atob(session.access_token.split('.')[1]));

        setSessionData({
          sessionId: jwtPayload.session_id,
          userId: session.user.id,
        });
      } else {
        setSessionData(null);
      }
    });

    return () => subscription.unsubscribe();
  }, [])
  


  const createTasks = async (formData: FormData) => {
    
    const payload = {
      title: formData.get('title'),
      description: formData.get('description'),
      status: formData.get('status'),
      user_id: formData.get("user_id"),
    }

      const { data: newTask, error } = await supabase 
        .from('tasks')
        .insert(payload)
        .select()
        .eq('user_id', sessionData.userId)

      if (error) {
        console.log(error)
        return
      }
      if( formData ) {
        fetchTasks()
      }
  }
  
  
  useEffect(() => {
    fetchTasks()
  }, [sessionData])


  return (
    <div className="flex flex-col flex-1 bg-zinc-50 font-sans pt-4 p-8">
      {fetchError && (<p>{fetchError}</p>)}
      {/* Title */}
      <div className="border-b">
          <h1 className="p-2 text-xl mg">My Tasks</h1>
      </div>
      
      {/* Sections (Todo, In progress, Done) */}
      <DragDropProvider
        onDragEnd={handleDragEnd}>
        <div className="flex gap-8">
            
            <Column 
              taskTitles={taskTitles} 
              TaskCard={TaskCard}
              openStatus={openStatus}
              setOpenStatus={setOpenStatus}
              stat={stat[0]}
              createTasks={createTasks}
              sessionData={sessionData}/>


            {/* In progress */}
            <Column 
              taskTitles={taskTitles} 
              TaskCard={TaskCard}
              openStatus={openStatus}
              setOpenStatus={setOpenStatus}
              stat={stat[1]}
              createTasks={createTasks}
              sessionData={sessionData}/>


            {/* Done */}
            <Column 
              taskTitles={taskTitles} 
              TaskCard={TaskCard}
              openStatus={openStatus}
              setOpenStatus={setOpenStatus}
              stat={stat[2]}
              createTasks={createTasks}
              sessionData={sessionData}/>
        </div>
      </DragDropProvider>
    </div>
    
  );
}
