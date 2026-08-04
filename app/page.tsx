"use client";

import { UUID } from "crypto";

import { createClient } from "../config/supabaseClient"
import { JSXElementConstructor, ReactElement, ReactNode, ReactPortal, useActionState, useEffect, useState } from "react";

// components
import TaskCard from "./components/TaskCard";
import AddButton from "./components/AddButton"
import { SupabaseClient } from "@supabase/supabase-js";
import Form from "./components/Form";


export default function Home() { 

  // console.log(supabase)
  const supabase = createClient()
  const stat: string[] = ["to-do", "in-progress", "done"]



  const [fetchError, setFetchError] = useState<any>(null)
  const [taskTitles, setTaskTitles] = useState<any>(null)

  const [createError, setCreateError] = useState<any>(null)

  const [openStatus, setOpenStatus] = useState<String | null>(null);

  const [sessionData, setSessionData] = useState<any>(null);

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
      <div className="flex gap-8">

          {/* Todo */}
          <div>
            <div className="task-grid">
              <div className="status">
                <h2>Todo</h2>
              </div>

              {/* Box */}
              {taskTitles && (
                <div>
                  {taskTitles
                  .filter((task: any) => task.status === stat[0])
                  .map((tasks: any) => (
                      <TaskCard key={tasks.id} tasks={tasks} />
                  ))}
                </div>
              )}

              {/* Add Tasks */}
              {openStatus === stat[0] && (
                <div className="TaskCard">
                  <Form 
                      createTasks={createTasks} 
                      sessionData={sessionData}
                      status={stat[0]}/>
                </div>
              )}
              </div>
              <AddButton 
                  openStatus={stat[0]}
                  setOpenStatus={setOpenStatus}/>
            </div>


          {/* In progress */}
          <div>
            <div className="task-grid">
                <div className="status">
                  <h2>In Progress</h2>
                </div>

                {/* Box */}
                {taskTitles && (
                  <div>
                    {taskTitles
                    .filter((task: any) => task.status === stat[1])
                    .map((tasks: any) => (
                        <TaskCard key={tasks.id} tasks={tasks} />
                    ))}
                  </div>
                )}

                {/* Add tasks */}
                {openStatus === stat[1] && (
                  <div className="TaskCard">
                    <Form 
                      createTasks={createTasks} 
                      sessionData={sessionData}
                      status={stat[1]}/>
                  </div>
                )}
                </div>
                <AddButton 
                  openStatus={stat[1]}
                  setOpenStatus={setOpenStatus}/>
            </div>


          {/* Done */}
          <div>
            <div className="task-grid">
              <div className="status">
                <h2>Done</h2>
              </div>

              {/* Box */}
              {taskTitles && (
                <div>
                  {taskTitles
                  .filter((task: any) => task.status === stat[2])
                  .map((tasks: any) => (
                      <TaskCard key={tasks.id} tasks={tasks} />
                  ))}
                </div>
              )}
                
              {/* Add tasks */}
              {openStatus === stat[2] && (
                <div className="TaskCard">
                  <Form 
                    createTasks={createTasks} 
                    sessionData={sessionData}
                    status={stat[2]}/>
                </div>
              )}
              
              </div>
              <AddButton 
                  openStatus={stat[2]}
                  setOpenStatus={setOpenStatus}/>
            </div>
      </div>
    </div>

  );
}
