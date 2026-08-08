import { useDraggable } from "@dnd-kit/react";
import { useState } from "react";

const TaskCard = ({ tasks }: { tasks: any }) => {

  const { ref } = useDraggable({
    id: tasks.id
  })

  return (
    <div 
      ref={ref}
      className="TaskCard"
    >
      <h3>{tasks.title}</h3>
      <p>{tasks.description}</p>
      <div className="priority">{tasks.priority}</div>
    </div>
  )
}

export default TaskCard