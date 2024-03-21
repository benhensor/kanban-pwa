import React, { useState } from "react";
import { useSelector } from "react-redux";
import { RootState } from "../redux/store";
import TaskModal from "../modals/TaskModal";

type TaskProps = {
  colIndex: number;
  taskIndex: number;
};

function Task({ colIndex, taskIndex }: TaskProps) {
  const boards = useSelector((state: RootState) => state.boards);
  const board = boards.find((board) => board.isActive === true);
  const columns = board?.columns;
  const col = columns?.find((_, i) => i === colIndex);
  const task = col?.tasks.find((_, i) => i === taskIndex);
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);

  let completed = 0;
  const subtasks = task?.subtasks;
  subtasks?.forEach((subtask) => {
    if (subtask.isCompleted) {
      completed++;
    }
  });

  const handleOnDrag = (e: React.DragEvent<HTMLDivElement>) => {
    e.dataTransfer.setData(
      "text",
      JSON.stringify({ taskIndex, prevColIndex: colIndex })
    );
  };

  return (
    <div>
      <div
        onClick={() => {
          setIsTaskModalOpen(true);
        }}
        draggable
        onDragStart={handleOnDrag}
        className=" w-[280px] first:my-5 rounded-lg  bg-white  dark:bg-[#2b2c37] shadow-[#364e7e1a] py-6 px-3 shadow-lg hover:text-mainPurple dark:text-white dark:hover:text-mainPurple cursor-pointer "
      >
        <p className=" font-bold tracking-wide ">{task?.title}</p>
        <p className=" font-bold text-xs tracking-tighter mt-2 text-gray-500">
          {completed} of {subtasks?.length} completed tasks
        </p>
      </div>
      {isTaskModalOpen && (
        <TaskModal
          colIndex={colIndex}
          taskIndex={taskIndex}
          setIsTaskModalOpen={setIsTaskModalOpen}
        />
      )}
    </div>
  );
}

export default Task;