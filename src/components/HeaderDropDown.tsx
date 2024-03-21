import { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { RootState } from '../redux/store'
import BoardIcon from '../icons/BoardIcon'
import PlusIcon from '../icons/PlusIcon'
import LightThemeIcon from '../icons/LightThemeIcon'
import DarkThemeIcon from '../icons/DarkThemeIcon'
import { Switch } from '@headlessui/react'
import useDarkMode from '../hooks/useDarkMode'
import boardsSlice from '../redux/boardsSlice'

type HeaderDropDownProps = {
	setOpenDropdown: (state: boolean) => void
	setIsBoardModalOpen: (state: boolean) => void
}

function HeaderDropDown({
	setOpenDropdown,
	setIsBoardModalOpen,
}: HeaderDropDownProps) {
	const dispatch = useDispatch()
	const [colorTheme, toggleTheme] = useDarkMode()
	const [darkSide, setDarkSide] = useState<boolean>(
		colorTheme === 'dark' ? false : true
	)

	const toggleDarkMode = () => {
		setDarkSide((state) => !state)
		toggleTheme()
	}

	const boards = useSelector((state: RootState) => state.boards)
	return (
		<div
			className=" py-10 px-4 absolute left-0 right-0 bottom-[-100vh] top-[86px] bg-[#00000080] "
			onClick={(e) => {
				if (e.target !== e.currentTarget) {
					return
				}
				setOpenDropdown(false)
			}}
		>
			{/* Dropdown Modal */}

			<div className=" bg-white dark:bg-darkGrey shadow-md shadow-[#364E7E1A] w-full py-4 rounded-xl ">
				<h3 className="  text-mediumGrey font-semibold mx-4 mb-8 font-main uppercase">
					All Boards ({boards?.length})
				</h3>
				<div>
					{boards.map((board, index) => (
						<div
							key={index}
							className={`flex items-center cursor-pointer gap-2 space-x-2 px-5 py-2 ${
								board.isActive ? 'rounded-r-full mr-8' : ''
							} ${
								board.isActive ? 'bg-mainPurple text-white' : ''
							} ${
								board.isActive && darkSide
									? 'dark:text-mediumGrey'
									: ''
							}`}
							onClick={() => {
								dispatch(
									boardsSlice.actions.setBoardActive({
										index,
									})
								)
							}}
						>
							<BoardIcon />
							<p
								className={`font-bold text-L text-mediumGrey ${
									board.isActive
										? ' text-white '
										: ' text-mediumGrey '
								}`}
							>
								{board.name}
							</p>
						</div>
					))}

					<div
						className=" cursor-pointer flex items-center space-x-2 text-mainPurple px-5 py-4 gap-2"
						onClick={() => {
							setIsBoardModalOpen(true)
							setOpenDropdown(false)
						}}
					>
						<BoardIcon />
						<button
							className=" flex font-bold text-L gap-2"
							aria-label="Create New Board"
						>
							<PlusIcon />
							Create New Board
						</button>
					</div>

					<div className=" mx-2 p-4 space-x-2 bg-lightBackgroundGrey dark:bg-veryDarkGrey flex justify-center items-center rounded-lg">
						<LightThemeIcon />
						<Switch
							checked={darkSide}
							onChange={toggleDarkMode}
							className={
								' bg-mainPurple relative inline-flex h-6 w-11 items-center rounded-full '
							}
						>
							<span
								className={` ${
									darkSide
										? ' translate-x-6 '
										: ' translate-x-1 '
								} inline-block h-4 w-4 transform rounded-full bg-white transition `}
							></span>
						</Switch>
						<DarkThemeIcon />
					</div>
				</div>
			</div>
		</div>
	)
}

export default HeaderDropDown
