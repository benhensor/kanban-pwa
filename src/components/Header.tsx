import { useState } from 'react'
import DownIcon from '../icons/DownIcon'
import LogoMobile from '../icons/LogoMobile'
import PlusIcon from '../icons/PlusIcon'
import UpIcon from '../icons/UpIcon'
import VerticalEllipsis from '../icons/VerticalEllipsis'
import HeaderDropDown from './HeaderDropDown'
import AddEditBoardModal from '../modals/AddEditBoardModal'
import { useDispatch, useSelector } from 'react-redux'
import AddEditTaskModal from '../modals/AddEditTaskModal'
import DeleteModal from '../modals/DeleteModal'
import ElipsisMenu from './ElipsisMenu'
import boardsSlice from '../redux/boardsSlice'
import { Board } from '../types/types'
import { RootState } from '../redux/store'

interface HeaderProps {
	isBoardModalOpen: boolean
	setIsBoardModalOpen: (state: boolean) => void
}

function Header({ isBoardModalOpen, setIsBoardModalOpen }: HeaderProps) {
	const dispatch = useDispatch()
	const boards = useSelector((state: RootState) => state.boards)
	const board = boards.find((board: Board) => board.isActive)

	const [openDropdown, setOpenDropdown] = useState(false)
	const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
	const [boardType, setBoardType] = useState('')
	const [isElipsisMenuOpen, setIsElipsisMenuOpen] = useState(false)
	const [isTaskModalOpen, setIsTaskModalOpen] = useState(false)

	const onDropdownClick = () => {
		setOpenDropdown((state) => !state)
		setIsElipsisMenuOpen(false)
		setBoardType('add')
	}

	const setOpenEditModal = () => {
		setIsBoardModalOpen(true)
		setIsElipsisMenuOpen(false)
	}
	const setOpenDeleteModal = () => {
		setIsDeleteModalOpen(true)
		setIsElipsisMenuOpen(false)
	}

	const onDeleteBtnClick = (e: React.MouseEvent<HTMLButtonElement>) => {
		if (e.currentTarget.textContent === 'Delete') {
			dispatch(boardsSlice.actions.deleteBoard())
			dispatch(boardsSlice.actions.setBoardActive({ index: 0 }))
			setIsDeleteModalOpen(false)
		} else {
			setIsDeleteModalOpen(false)
		}
	}

	return (
		<div className=" p-4 fixed left-0 bg-white dark:bg-darkGrey z-50 right-0 ">
			<header className=" flex justify-between dark:text-white items-center ">
				{/* left side */}

				<div className=" flex items-center space-x-2 md:space-x-4 ">
					<LogoMobile />
					<h3 className=" hidden md:inline-block font-bold font-main md:text-4xl">
						Kanban
					</h3>
					<div className=" flex items-center ">
						<h3 className=" truncate max-w-[200px] md:text-2xl text-xl font-bold md:ml-20 font-sans ">
							{board?.name}
						</h3>
						<button
							className=" w-3 ml-2 md:hidden cursor-pointer "
							onClick={() => onDropdownClick()}
							aria-label="Dropdown"
						>
							{openDropdown ? <UpIcon /> : <DownIcon />}
						</button>
					</div>
				</div>

				{/* right side */}

				<div className=" flex space-x-4 items-center md:space-x-6 ">
					<button
						className="
							button
							bg-mainPurple
							flex
							gap-2
							px-[18px]
							py-[15px]
						"
						aria-label="Add New Task"
						onClick={() => {
							setIsTaskModalOpen((prevState) => !prevState)
						}}
					>
						<PlusIcon />
						<span className="hidden md:block">Add New Task</span>
					</button>
					<button
						className=" py-1 px-3 md:hidden "
						aria-label="Mobile Menu"
					>
						<VerticalEllipsis />
					</button>
					{isElipsisMenuOpen && (
            <ElipsisMenu
              type="Boards"
              setOpenEditModal={setOpenEditModal}
              setOpenDeleteModal={setOpenDeleteModal}
            />
          )}
				</div>

				{openDropdown && (
					<HeaderDropDown
						setOpenDropdown={setOpenDropdown}
						setIsBoardModalOpen={setIsBoardModalOpen}
					/>
				)}
			</header>

			{isTaskModalOpen && (
				<AddEditTaskModal
					setIsAddTaskModalOpen={setIsTaskModalOpen}
					setIsTaskModalOpen={setIsTaskModalOpen}
					type="add"
					device="mobile"
				/>
			)}

			{isBoardModalOpen && (
				<AddEditBoardModal
					setBoardType={setBoardType}
					type={boardType}
					setIsBoardModalOpen={setIsBoardModalOpen}

				/>
			)}
			{isDeleteModalOpen && board && (
				<DeleteModal
					setIsDeleteModalOpen={setIsDeleteModalOpen}
					type="board"
					title={board.name}
					onDeleteBtnClick={onDeleteBtnClick}
				/>
			)}
		</div>
	)
}

export default Header
