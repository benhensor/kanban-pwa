
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Switch } from "@headlessui/react";
import { RootState } from "../redux/store";
import BoardIcon from "../icons/BoardIcon";
import DarkThemeIcon from "../icons/DarkThemeIcon";
import LightThemeIcon from "../icons/LightThemeIcon";
import useDarkMode from "../hooks/useDarkMode";
import ShowSidebarIcon from "../icons/ShowSidebar";
import HideSidebarIcon from "../icons/HideSidebarIcon";

import boardsSlice from "../redux/boardsSlice";
import AddEditBoardModal from "../modals/AddEditBoardModal";

type SidebarProps = {
  isSideBarOpen: boolean;
  isBoardModalOpen: boolean;
  setIsSideBarOpen: (state: boolean) => void;
  setIsBoardModalOpen: (state: boolean) => void;
};

function Sidebar({ isSideBarOpen, setIsSideBarOpen }: SidebarProps) {
  const dispatch = useDispatch();
  const [isBoardModalOpen, setIsBoardModalOpen] = useState<boolean>(false);
  const [colorTheme, setTheme] = useDarkMode();
  const [darkSide, setDarkSide] = useState<boolean>(
    colorTheme === "light" ? true : false
  );

  const toggleDarkMode = () => {
    setTheme();
    setDarkSide(state => !state);
  };

  const boards = useSelector((state: RootState) => state.boards);

  const toggleSidebar = () => {
    setIsSideBarOpen(!isSideBarOpen);
  };

  return (
    <div>
      <div
        className={
          isSideBarOpen
            ? `min-w-[261px] bg-white dark:bg-darkGrey  fixed top-[72px] h-screen  items-center left-0 z-20`
            : ` bg-mainPurple dark:bg-darkGrey dark:hover:bg-mainPurple top-auto bottom-10 justify-center items-center hover:opacity-80 cursor-pointer  p-0 transition duration-300 transform fixed felx w-[56px] h-[48px] rounded-r-full  `
        }
      >
        <div>
          {/* reWrite modal  */}

          {isSideBarOpen && (
            <div className=" bg-white  dark:bg-darkGrey    w-full   py-4 rounded-xl">
              <h3 className=" dark:text-gray-300 text-gray-600 font-semibold mx-4 mb-8 ">
                ALL BOARDS ({boards?.length})
              </h3>

              <div className="  dropdown-borad flex flex-col h-[70vh]  justify-between ">
                <div>
                  {boards.map((board, index) => (
                    <div
                      className={` flex items-baseline space-x-2 px-5 mr-8 rounded-r-full duration-500 ease-in-out py-4 cursor-pointer hover:bg-[#635fc71a] hover:text-mainPurple dark:hover:bg-white dark:hover:text-mainPurple dark:text-white  ${
                        board.isActive &&
                        " bg-mainPurple rounded-r-full text-white mr-8 "
                      } `}
                      key={index}
                      onClick={() => {
                        dispatch(boardsSlice.actions.setBoardActive({ index }));
                      }}
                    >
                      <div className="  filter-white  h-4 "><BoardIcon />{" "}</div>
                      <p className=" text-lg font-bold ">{board.name}</p>
                    </div>
                  ))}

                  <div
                    className=" flex  items-baseline space-x-2  mr-8 rounded-r-full duration-500 ease-in-out cursor-pointer text-mainPurple px-5 py-4 hover:bg-[#635fc71a] hover:text-mainPurple dark:hover:bg-white  "
                    onClick={() => {
                      setIsBoardModalOpen(true);
                    }}
                  >
                    <div className="  filter-white  h-4 "><BoardIcon />{" "}</div>
                    <p className=" text-lg font-bold  ">Create New Board </p>
                  </div>
                </div>

                <div className=" mx-2  p-4 relative space-x-2 bg-slate-100 dark:bg-veryDarkGrey flex justify-center items-center rounded-lg">
                  <LightThemeIcon />

                  <Switch
                    checked={darkSide}
                    onChange={toggleDarkMode}
                    className={`${
                      darkSide ? "bg-mainPurple" : "bg-gray-200"
                    } relative inline-flex h-6 w-11 items-center rounded-full`}
                  >
                    <span
                      className={`${
                        darkSide ? "translate-x-6" : "translate-x-1"
                      } inline-block h-4 w-4 transform rounded-full bg-white transition`}
                    />
                  </Switch>

                  <DarkThemeIcon />
                </div>
              </div>
            </div>
          )}

          {/* Sidebar hide/show toggle */}
          {isSideBarOpen ? (
            <div
              onClick={() => toggleSidebar()}
              className=" flex  items-center mt-2  absolute bottom-16  text-lg font-bold  rounded-r-full hover:text-mainPurple cursor-pointer mr-6 mb-8 px-8 py-4 hover:bg-[#635fc71a] dark:hover:bg-white  space-x-2 justify-center  my-4 text-gray-500 "
            >
              <div
                className=" min-w-[20px]"
              >
                <HideSidebarIcon />{" "}
              </div>
                {isSideBarOpen && <p> Hide Sidebar </p>}
            </div>
          ) : (
            <div className=" absolute p-5  " onClick={() => toggleSidebar()}>
              <ShowSidebarIcon />
            </div>
          )}
        </div>
      </div>

      {isBoardModalOpen && (
        <AddEditBoardModal
          type="add"
          setIsBoardModalOpen={setIsBoardModalOpen}
        />
      )}
    </div>
  );
}

export default Sidebar;
