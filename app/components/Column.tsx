import { useDroppable } from "@dnd-kit/react";
import AddButton from "./AddButton";
import Form from "./Form";


const Column = ({
  taskTitles, 
  TaskCard, 
  openStatus, 
  setOpenStatus, 
  stat, 
  createTasks, 
  sessionData}: 
  { 
    taskTitles: any, 
    TaskCard: any, 
    openStatus: any, 
    setOpenStatus: any, 
    stat: any, 
    createTasks: any, 
    sessionData: any 
  }) => {
    const { ref } = useDroppable({
      id: stat,
    })

  return (
    <div>
            <div 
              ref={ref}
              className="task-grid"
            >
              <div className="status">
                <h2>{stat}</h2>
              </div>

              {/* Box */}
              {taskTitles && (
                <div>
                  {taskTitles
                  .filter((task: any) => task.status === stat)
                  .map((tasks: any) => (
                      <TaskCard key={tasks.id} tasks={tasks} />
                  ))}
                </div>
              )}

              {/* Add Tasks */}
              {openStatus === stat && (
                <div className="TaskCard">
                  <Form 
                      createTasks={createTasks} 
                      sessionData={sessionData}
                      status={stat}/>
                </div>
              )}
              </div>
              <AddButton 
                  openStatus={stat}
                  setOpenStatus={setOpenStatus}/>
            </div>
  )
}

export default Column