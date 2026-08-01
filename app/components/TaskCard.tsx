const TaskCard = ({ tasks }: { tasks: any }) => {
  return (
    <div className="TaskCard">
      <h3>{tasks.title}</h3>
      <p>{tasks.description}</p>
      <div className="priority">{tasks.priority}</div>
    </div>
  )
}

export default TaskCard