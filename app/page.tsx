"use client";

import { UUID } from "crypto";
// import Image from "next/image";
// import { create } from "domain";
import { createClient } from "../config/supabaseClient"
import { JSXElementConstructor, ReactElement, ReactNode, ReactPortal, useActionState, useEffect, useState } from "react";

// components
import TaskCard from "./components/TaskCard";
import { SupabaseClient } from "@supabase/supabase-js";


export default function Home() { 

  // console.log(supabase)
  const supabase = createClient()
  const stat: string[] = ["to-do", "in-progress", "done"]



  const [fetchError, setFetchError] = useState<any>(null)
  const [taskTitles, setTaskTitles] = useState<any>(null)

  const [createError, setCreateError] = useState<any>(null)

  const [isOpen, setIsOpen] = useState<boolean>(false);

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
    <div className="flex flex-col flex-1 bg-zinc-50 font-sans pt-4">
      {fetchError && (<p>{fetchError}</p>)}
      {/* Title */}
      <div className="self-center">
          <h1 className="font-bold p-5 text-xl"> Frank's Task Board</h1>
      </div>
      
      {/* Sections (Todo, In progress, Done) */}
      <div className="flex justify-evenly">
          {/* Todo */}
          <div className="">
              <h1 className="">Todo</h1>

              {/* Box */}
              {taskTitles && (
                <div className="task-grid">
                  {taskTitles
                  .filter((task: any) => task.status === stat[0])
                  .map((tasks: any) => (
                      <TaskCard key={tasks.id} tasks={tasks} />
                  ))}
                </div>
              )}

              {isOpen && (
                <div className="TaskCard">
                  <form
                    action={createTasks}>
                    <input
                      type="text"
                      name="title"
                      style={{ width: '300px', height: '70px' }}
                      placeholder="Task name"></input>
                      <button type="submit"
                        style={{ border: "1px solid", borderColor: "black", backgroundColor: "red" }} >
                      submit</button>
                      <input type="hidden" name="status" value="to-do"/>
                      <input type="hidden" name="user_id" value={sessionData ? (sessionData.userId) : (0x0)}/>
                  </form>
                </div>
              )}

              <div className="button">
                <button
                  type="button"
                  onClick={() => setIsOpen(!isOpen)}
                >Button Here</button>
              </div>
          </div>

          {/* In progress */}
          <div>
              <h1>In Progress</h1>

              {/* Box */}
              {taskTitles && (
                <div className="task-grid">
                  {taskTitles
                  .filter((task: any) => task.status === stat[1])
                  .map((tasks: any) => (
                      <TaskCard key={tasks.id} tasks={tasks} />
                  ))}
                </div>
              )}

              {isOpen && (
                <div className="TaskCard">
                  <form
                    action={createTasks}>
                    <input
                      type="text"
                      name="title"
                      style={{ width: '300px', height: '70px' }}
                      placeholder="Task name"></input>
                      <button type="submit"
                        style={{ border: "1px solid", borderColor: "black", backgroundColor: "red" }} >
                      submit</button>
                      <input type="hidden" name="status" value="in-progress"/>
                      <input type="hidden" name="user_id" value={sessionData ? (sessionData.userId) : (0x0)}/>
                  </form>
                </div>
              )}

              <div className="button">
                <button
                  type="button"
                  onClick={() => setIsOpen(!isOpen)}
                >Button Here</button>
              </div>
          </div>

          {/* Done */}
          <div>
              <h1>Done</h1>

              {/* Box */}
              {taskTitles && (
                <div className="task-grid">
                  {taskTitles
                  .filter((task: any) => task.status === stat[2])
                  .map((tasks: any) => (
                      <TaskCard key={tasks.id} tasks={tasks} />
                  ))}
                </div>
              )}

              {isOpen && (
                <div className="TaskCard">
                  <form
                    action={createTasks}>
                    <input
                      type="text"
                      name="title"
                      style={{ width: '300px', height: '70px' }}
                      placeholder="Task name"></input>
                      <button type="submit"
                        style={{ border: "1px solid", borderColor: "black", backgroundColor: "red" }} >
                      submit</button>
                      <input type="hidden" name="status" value="done"/>
                      <input type="hidden" name="user_id" value={sessionData ? (sessionData.userId) : (0x0)}/>
                  </form>
                </div>
              )}

              <div className="button">
                <button
                  type="button"
                  onClick={() => setIsOpen(!isOpen)}
                >Button Here</button>
              </div>
              
          </div>
      </div>
    </div>

  );
}
