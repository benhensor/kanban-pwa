import { shuffle } from "lodash";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../redux/store";
import boardsSlice from "../redux/boardsSlice";
import Task from "./Task";

type ColumnProps = {
	colIndex: number;
};

function Column({ colIndex }: ColumnProps) {
  

  const dispatch = useDispatch();
  const [color, setColor] = useState<string>("");
  const boards = useSelector((state: RootState) => state.boards);
  const board = boards.find((board) => board.isActive === true);
  const col = board?.columns.find((_, i) => i === colIndex);
     
  useEffect(() => {
		const colors = [
			"bg-red-500",
			"bg-orange-500",
			"bg-blue-500",
			"bg-purple-500",
			"bg-green-500",
			"bg-indigo-500",
			"bg-yellow-500",
			"bg-pink-500",
			"bg-sky-500",
		];
    setColor(shuffle(colors).pop() ?? "")
    }, [dispatch]);



  const handleOnDrop = (e: React.DragEvent<HTMLDivElement>) => {
    const { prevColIndex, taskIndex } = JSON.parse(
      e.dataTransfer.getData("text")
    );

    if (colIndex !== prevColIndex) {
      dispatch(
        boardsSlice.actions.dragTask({ colIndex, prevColIndex, taskIndex })
      );
    }
  };

  const handleOnDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
  };

  return (
    <div
      onDrop={handleOnDrop}
      onDragOver={handleOnDragOver}
      className="scrollbar-hide   mx-5 pt-[90px] min-w-[280px] "
    >
      <div className=" font-semibold flex  items-center  gap-2 tracking-widest md:tracking-[.2em] text-mediumGrey">
        <div className={`rounded-full w-4 h-4 ${color} `} />
        {col?.name} ({col?.tasks.length})
      </div>

      {col?.tasks.map((_, index) => (
        <Task key={index} taskIndex={index} colIndex={colIndex} />
      ))}
    </div>
  );
}

export default Column;