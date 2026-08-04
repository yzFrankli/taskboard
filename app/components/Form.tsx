import { useEffect, useState, useRef } from "react";

const Form = ({ createTasks, sessionData, status }: { createTasks: any, sessionData: any, status: any }) => {
  const refOne = useRef<HTMLFormElement>(null)

  useEffect(() => {
    document.addEventListener("click", handleClickOutside, true)

    return () => {
      document.removeEventListener("click", handleClickOutside, true)
    };
  }, [])


  const handleClickOutside = (e: MouseEvent) => {
    if(!refOne.current) return

    if(!refOne.current.contains(e.target as Node)) {
      console.log("Clicked outside")
    } else {
      console.log("Clicked inside")
    }
  }
  return (
    <form ref={refOne}
      action={createTasks}
      onBlur={(e) => {
        if(!e.currentTarget.contains(e.relatedTarget as Node | null)) {
          const form = refOne.current
          if (!form) return

          const formData = new FormData(form)
          const title = formData.get("title")?.toString().trim() ?? ""

          if(title != "") form.requestSubmit()


          
        }
      }}
      >
      <div style={{display: "flex", flexDirection: "column"}}>
        <input
        type="text"
        name="title"
        style={{
          height: '20px', 
          // width: "200px",
          marginLeft: "20px", 
          marginRight: "20px", 
          marginTop: "10px", 
          outline: "none",
          fontWeight: "600",
        }}
        placeholder="Task Title"></input>
        <input
          type="text"
          name="description"
          style={{
            height: '50px', 
            marginLeft: "20px", 
            marginRight: "20px", 
            outline: "none" }}
          placeholder="Description"></input>
      </div>
      
        <input type="hidden" name="status" value={status}/>
        <input type="hidden" name="user_id" value={sessionData ? (sessionData.userId) : (0x0)}/>
    </form>
  )
}

export default Form