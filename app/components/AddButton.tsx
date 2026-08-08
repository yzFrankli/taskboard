import { useState } from "react";

const AddButton = ({openStatus, setOpenStatus}: { openStatus: string, setOpenStatus: any}) => {

  return (
    <div className="button">
      <button
        type="button"
        onClick={() => 
          setOpenStatus(openStatus)}
        onDoubleClick={() => setOpenStatus(null)}
        style={{ marginLeft: 10}}
      >Add Task</button>
    </div>
  )
}

export default AddButton