
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { RootState } from "../redux/store";
import AddEditBoardModal from "../modals/AddEditBoardModal";
import Column from "./Column";
import EmptyBoard from "./EmptyBoard";
import Sidebar from "./Sidebar";

type HomeProps = {
  setIsBoardModalOpen: (state: boolean) => void;
  isBoardModalOpen: boolean;
};

function Home({ setIsBoardModalOpen, isBoardModalOpen}: HomeProps) {
  const [windowSize, setWindowSize] = useState([
    window.innerWidth,
    window.innerHeight,
  ]);

  useEffect(() => {
    const handleWindowResize = () => {
      setWindowSize([window.innerWidth, window.innerHeight]);
    };

    window.addEventListener("resize", handleWindowResize);

    return () => {
      window.removeEventListener("resize", handleWindowResize);
    };
  });

  const boards = useSelector((state: RootState) => state.boards);
  const board = boards.find((board) => board.isActive === true);
  const columns = board?.columns;

  const [isSideBarOpen, setIsSideBarOpen] = useState(true);

  return (
    <div
      className={
        windowSize[0] >= 768 && isSideBarOpen
          ? " bg-lightBackgroundGrey  scrollbar-hide h-screen flex dark:bg-veryDarkGrey  overflow-x-scroll gap-6  ml-[261px] mt-4"
          : "bg-lightBackgroundGrey  scrollbar-hide h-screen flex    dark:bg-veryDarkGrey overflow-x-scroll gap-6 "
      }
    >
      {windowSize[0] >= 768 && (
        <Sidebar
          setIsBoardModalOpen={setIsBoardModalOpen}
          isBoardModalOpen={isBoardModalOpen}
          isSideBarOpen={isSideBarOpen}
          setIsSideBarOpen={setIsSideBarOpen}
        />
      )}

      {/* Columns Section */}

      {columns && columns.length > 0 ? (
        <>
          {columns?.map((_, index) => (
            <Column key={index} colIndex={index} />
          ))}
          <div
            onClick={() => {
              setIsBoardModalOpen(true);
            }}
            className=" h-100 dark:bg-darkGrey flex justify-center items-center font-bold text-2xl hover:text-mainPurple transition duration-300 cursor-pointer bg-lightLines scrollbar-hide mb-2  mx-5 pt-[90px] min-w-[280px] text-mediumGrey mt-[135px] rounded-lg "
          >
            + New Column
          </div>
        </>
      ) : (
        <>
          <EmptyBoard type="edit" />
        </>
      )}
      {isBoardModalOpen && (
        <AddEditBoardModal
          type="edit"
          setIsBoardModalOpen={setIsBoardModalOpen}
        />
      )}
    </div>
  );
}

export default Home;
