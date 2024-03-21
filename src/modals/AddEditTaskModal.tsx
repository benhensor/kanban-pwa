import { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { v4 as uuidv4 } from 'uuid'
import CrossIcon from '../icons/CrossIcon'
import boardsSlice from '../redux/boardsSlice'
import { Column, Id } from '../types/types'
import { RootState } from '../redux/store'

type AddEditTaskModalProps = {
	type: string
	device: string
	setIsAddTaskModalOpen: (state: boolean) => void
	setIsTaskModalOpen: (state: boolean) => void
	taskIndex?: number
	prevColIndex?: number
}

function AddEditTaskModal({
	type,
	device,
	setIsAddTaskModalOpen,
	setIsTaskModalOpen,
	taskIndex,
	prevColIndex = 0,
}: AddEditTaskModalProps) {

	const dispatch = useDispatch()
	const [isFirstLoad, setIsFirstLoad] = useState(true)
	const [title, setTitle] = useState('')
	const [description, setDescription] = useState('')
	const board = useSelector((state: RootState) => state.boards.find((board) => board.isActive))

	const columns = board ? board.columns : []
	const col = columns.find((_, index) => index === prevColIndex) || null
	const task = col?.tasks.find((_, index) => index === taskIndex) || null
	// const task = col ? col.tasks.find((task, index) => index === taskIndex) : null
	const [status, setStatus] = useState(columns[prevColIndex].name)
	const [newColIndex, setNewColIndex] = useState(prevColIndex)
	const [subtasks, setSubtasks] = useState([
		{ title: '', isCompleted: false, id: uuidv4() },
		{ title: '', isCompleted: false, id: uuidv4() },
	])

	const onChangeSubtasks = (id: string, newValue: string) => {
		setSubtasks((prevState) => {
			const newState = [...prevState]
			const subtask = newState.find((subtask) => subtask.id === id)
			if (subtask) {
				subtask.title = newValue
			}
			return newState
		})
	}

	const onChangeStatus = (e: React.ChangeEvent<HTMLSelectElement>) => {
		setStatus(e.target.value)
		setNewColIndex(e.target.selectedIndex)
	}

	const validate = () => {
		if (!title.trim()) {
			return false
		}
		for (let i = 0; i < subtasks.length; i++) {
			if (!subtasks[i].title.trim()) {
				return false
			}
		}
		return true
	}

	if (type === 'edit' && isFirstLoad && task) {
		setSubtasks(
			task.subtasks.map((subtask) => {
				return { ...subtask, id: uuidv4() }
			})
		)
		setTitle(task.title || '')
		setDescription(task.description || '')
		setIsFirstLoad(false)
	}

	const onDelete = (id: Id) => {
		setSubtasks((prevState) => prevState.filter((el) => el.id !== id))
	}

	const onSubmit = (type: string) => {
    // Validate the form data and store the result in isValid
    const isValid = validate();

    // Proceed with the form submission only if the form data is valid
    if (isValid) {
        // Dispatch the appropriate action based on the form type
        if (type === 'add') {
            dispatch(boardsSlice.actions.addTask({
                title,
                description,
                subtasks,
                status,
                newColIndex,
            }));
        } else {
            dispatch(boardsSlice.actions.editTask({
                title,
                description,
                subtasks,
                status,
                taskIndex: taskIndex ?? 0, // Ensure taskIndex is defined for 'edit' type
                prevColIndex,
                newColIndex,
            }));
        }

        // Close the modal after successful submission
        setIsAddTaskModalOpen(false);

        // Additionally, close the task modal if in 'edit' mode
        if (type === 'edit') {
            setIsTaskModalOpen(false);
        }
    }
	};

	return (
		<div
			className={
				device === 'mobile'
					? '  py-6 px-6 pb-40  absolute overflow-y-scroll  left-0 flex  right-0 bottom-[-100vh] top-0 dropdown '
					: '  py-6 px-6 pb-40  absolute overflow-y-scroll  left-0 flex  right-0 bottom-0 top-0 dropdown '
			}
			onClick={(e) => {
				if (e.target !== e.currentTarget) {
					return
				}
				setIsAddTaskModalOpen(false)
			}}
		>
			{/* Modal Section */}

			<div
				className=" scrollbar-hide overflow-y-scroll max-h-[95vh]  my-auto  bg-white dark:bg-darkGrey text-black dark:text-white font-bold
       shadow-md shadow-[#364e7e1a] max-w-md mx-auto  w-full px-8  py-8 rounded-xl"
			>
				<h3 className=" text-lg ">
					{type === 'edit' ? 'Edit' : 'Add New'} Task
				</h3>

				{/* Task Name */}

				<div className="mt-8 flex flex-col space-y-1">
					<label className="  text-sm dark:text-white text-gray-500">
						Task Name
					</label>
					<input
						value={title}
						onChange={(e) => setTitle(e.target.value)}
						id="task-name-input"
						type="text"
						className=" bg-transparent  px-4 py-2 outline-none focus:border-0 rounded-md text-sm  border-[0.5px] border-gray-600 focus:border-mainPurple outline-1  ring-0  "
						placeholder=" e.g Take coffee break"
					/>
				</div>

				{/* Description */}
				<div className="mt-8 flex flex-col space-y-1">
					<label className="  text-sm dark:text-white text-gray-500">
						Description
					</label>
					<textarea
						value={description}
						onChange={(e) => setDescription(e.target.value)}
						id="task-description-input"
						className=" bg-transparent outline-none min-h-[200px] focus:border-0 px-4 py-2 rounded-md text-sm  border-[0.5px] border-gray-600 focus:border-mainPurple outline-[1px] "
						placeholder="e.g. It's always good to take a break. This 
            15 minute break will  recharge the batteries 
            a little."
					/>
				</div>

				{/* Subtasks */}

				<div className="mt-8 flex flex-col space-y-3">
					<label className="  text-sm dark:text-white text-gray-500">
						Subtasks
					</label>

					{subtasks.map((subtask, index) => (
						<div key={index} className=" flex items-center w-full ">
							<input
								onChange={(e) => {
									onChangeSubtasks(subtask.id, e.target.value)
								}}
								type="text"
								value={subtask.title}
								className=" bg-transparent outline-none focus:border-0 flex-grow px-4 py-2 rounded-md text-sm  border-[0.5px] border-gray-600 focus:border-mainPurple outline-[1px]  "
								placeholder=" e.g Take coffee break"
							/>
							<button
								onClick={() => {
									onDelete(subtask.id)
								}}
								className=" m-4 cursor-pointer "
							>
								<CrossIcon className=""/>
							</button>
						</div>
					))}

					<button
						className=" w-full items-center dark:text-mainPurple dark:bg-white  text-white bg-mainPurple py-2 rounded-full "
						onClick={() => {
							setSubtasks((state) => [
								...state,
								{ title: '', isCompleted: false, id: uuidv4() },
							])
						}}
					>
						+ Add New Subtask
					</button>
				</div>

				{/* current Status  */}
				<div className="mt-8 flex flex-col space-y-3">
					<label className="  text-sm dark:text-white text-gray-500">
						Current Status
					</label>
					<select
						value={status}
						onChange={onChangeStatus}
						className=" select-status flex-grow px-4 py-2 rounded-md text-sm bg-transparent focus:border-0  border-[1px] border-gray-300 focus:border-mainPurple outline-none"
					>
						{columns.map((column: Column, index) => (
							<option key={index}>{column.name}</option>
						))}
					</select>
					<button
						onClick={() => {
							onSubmit(type)
						}}
						className=" w-full items-center text-white bg-mainPurple py-2 rounded-full "
					>
						{type === 'edit' ? ' save edit' : 'Create task'}
					</button>
				</div>
			</div>
		</div>
	)
}

export default AddEditTaskModal
