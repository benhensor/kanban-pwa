import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import data from '../data/data.json'
import { Board, Column, Task, Subtask } from '../types/types'

interface EditBoardPayload {
	name: string
	newColumns: Column[]
}

interface AddTaskPayload {
	title: string
	status: string
	description: string
	subtasks: Subtask[]
	newColIndex: number
}

interface EditTaskPayload {
	title: string
	status: string
	description: string
	subtasks: Subtask[]
	prevColIndex: number
	newColIndex: number
	taskIndex: number | null
}

interface DragTaskPayload {
    colIndex: number
    prevColIndex: number
    taskIndex: number
}

interface SetSubtaskCompletedPayload {
    colIndex: number
    taskIndex: number
    index: number
}

interface SetTaskStatusPayload {
    colIndex: number
    taskIndex: number
    newColIndex: number
    status: string
}

interface DeleteTaskPayload {
    colIndex: number
    taskIndex: number
}

const boardsSlice = createSlice({
	name: 'boards',
	initialState: data.boards as Board[],
	reducers: {
		addBoard: (
			state,
			action: PayloadAction<{ name: string; newColumns: Column[] }>
		) => {
			const isActive = state.length > 0 ? false : true
			const payload = action.payload
			const board = {
				name: payload.name,
				isActive,
				columns: payload.newColumns,
			}
			board.columns = payload.newColumns
			state.push(board)
		},
		editBoard: (state, action: PayloadAction<EditBoardPayload>) => {
			const { name, newColumns } = action.payload
			const board = state.find((board) => board.isActive)
			if (board) {
				board.name = name
				board.columns = newColumns
			}
		},
		deleteBoard: (state) => {
			const board = state.find((board) => board.isActive)
            if (!board) {
                console.error("Active board not found.")
                return
            }
			state.splice(state.indexOf(board), 1)
		},
		setBoardActive: (state, action) => {
			state.map((board, index) => {
				index === action.payload.index
					? (board.isActive = true)
					: (board.isActive = false)
				return board
			})
		},
		addTask: (state, action: PayloadAction<AddTaskPayload>) => {
			const { title, status, description, subtasks, newColIndex } =
				action.payload
			const task: Task = {
				id: generateId(),
				columnId: findColumnIdByIndex(newColIndex),
				title,
				description,
				subtasks,
				status,
			}
			const board = state.find((board) => board.isActive)
			if (board) {
				const column = board.columns.find(
					(_: Column, index: number) => index === newColIndex
				)
				if (column) {
					column.tasks.push(task)
				}
			}
		},
		editTask: (state, action: PayloadAction<EditTaskPayload>) => {
			const {
				title,
				status,
				description,
				subtasks,
				prevColIndex,
				taskIndex,
			} = action.payload
			const board = state.find((board) => board.isActive)
            if (!board) {
                console.error("Active board not found.")
                return;
            }
			const column = board.columns.find((_: Column, index: number) => index === prevColIndex)
			const task = column?.tasks.find((_: Task, index: number) => index === taskIndex)
			if (task) {
                task.title = title;
                task.status = status;
                task.description = description;
                task.subtasks = subtasks;
            }
        },
		dragTask: (state, action: PayloadAction<DragTaskPayload>) => {
			const { colIndex, prevColIndex, taskIndex } = action.payload
			const board = state.find((board) => board.isActive)
            if (!board) {
                console.error("Active board not found.")
                return;
            }
			const prevCol = board.columns.find((_: Column, i: number) => i === prevColIndex)
            if (!prevCol) {
                console.error(`Previous column at index ${prevColIndex} not found.`)
                return;
            }
            if (prevCol.tasks.length <= taskIndex) {
                console.error(`Task index ${taskIndex} out of bounds.`)
            }
			const task = prevCol.tasks.splice(taskIndex, 1)[0]
            if (!task) {
                console.error(`Task at index ${taskIndex} not found.`)
            }
			const targetCol = board.columns[colIndex]
            targetCol.tasks.push(task)
		},
		setSubtaskCompleted: (state, action: PayloadAction<SetSubtaskCompletedPayload>) => {
			const { colIndex, taskIndex, index } = action.payload
			const board = state.find((board) => board.isActive)
            if (!board) {
                console.error("Active board not found.")
                return;
            }
			const col = board.columns[colIndex]
            const task = col.tasks[taskIndex]
            if (!task) {
                console.error(`Task at index ${taskIndex} not found.`)
                return
            }
            const subtask = task.subtasks[index]
            if (!subtask) {
                console.error(`Subtask at index ${index} not found.`)
                return
            }
            subtask.isCompleted = !subtask.isCompleted
		},
		setTaskStatus: (state, action: PayloadAction<SetTaskStatusPayload>) => {
			const { colIndex, taskIndex, newColIndex, status } = action.payload
			const board = state.find((board) => board.isActive)
            if (!board) {
                console.error("Active board not found.")
                return;
            }
			const col = board.columns[colIndex]
			const newCol = board.columns[newColIndex]
            if (!col || !newCol) {
                console.error(`Column at index ${colIndex} or ${newColIndex} not found.`)
                return
            }
			const task = col.tasks[taskIndex]
			if (!task) {
                console.error(`Task at index ${taskIndex} not found.`)
                return
            }
            task.status = status
            if (colIndex !== newColIndex) {
                col.tasks.splice(taskIndex, 1)
                newCol.tasks.push(task)
            }
		},
		deleteTask: (state, action: PayloadAction<DeleteTaskPayload>) => {
            const { colIndex, taskIndex } = action.payload
			const board = state.find((board) => board.isActive)
            if (!board) {
                console.error("Active board not found.")
                return
            }
			const col = board.columns[colIndex]
			if (!col) {
                console.error(`Column at index ${colIndex} not found.`);
                return;
            }
              col.tasks = col.tasks.filter((_, i: number) => i !== taskIndex);
        },
	},
})

function generateId() {
	return Math.random().toString(36).substr(2, 9)
}

function findColumnIdByIndex(index: number) {
	return index.toString()
}

export default boardsSlice
