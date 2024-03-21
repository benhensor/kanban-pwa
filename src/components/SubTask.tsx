import { useDispatch, useSelector } from "react-redux";
import boardsSlice from "../redux/boardsSlice";
import { RootState } from "../redux/store";

type SubtaskProps = {
  index: number;
  taskIndex: number;
  colIndex: number;
};

function Subtask({ index, taskIndex, colIndex }: SubtaskProps) {
  const dispatch = useDispatch();
  const boards = useSelector((state: RootState) => state.boards);
  const board = boards.find((board) => board.isActive === true);
  const col = board?.columns.find((_, i) => i === colIndex);
  const task = col?.tasks.find((_, i) => i === taskIndex);
  const subtask = task?.subtasks.find((_, i) => i === index);
  const checked = subtask?.isCompleted;

 

  const onChange = () => {
    dispatch(
      boardsSlice.actions.setSubtaskCompleted({ index, taskIndex, colIndex })
    );
  };

  return (
    <div className=" w-full flex hover:bg-[#635fc740] dark:hover:bg-[#635fc740] rounded-md relative items-center justify-start dark:bg-veryDarkGrey  p-3 gap-4  bg-lightBackgroundGrey">
      <input
        className=" w-4 h-4  accent-mainPurple cursor-pointer "
        type="checkbox"
        checked={checked}
        onChange={onChange}
      />
      <p className={checked ? " line-through opacity-30 " : ""}>
      {subtask?.title}
      </p>
    </div>
  );
}

export default Subtask;