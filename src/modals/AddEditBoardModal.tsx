import { useState } from 'react'
import { v4 as uuidv4 } from 'uuid'
import CrossIcon from '../icons/CrossIcon'
import { useDispatch } from 'react-redux'
import boardsSlice from '../redux/boardsSlice'

type AddEditBoardModalProps = {
    setIsBoardModalOpen: (state: boolean) => void,
    type: string,
    setBoardType?: (state: string) => void
}

function AddEditBoardModal({ setIsBoardModalOpen, type }: AddEditBoardModalProps ) {
    const dispatch = useDispatch()
    const [name, setName] = useState<string>('')
    const [isValid, setIsValid] = useState<boolean>(false)
    const [newColumns, setNewColumns] = useState([
        {
            id: uuidv4(),
            name: 'Todo',
            tasks: []
        },
        {
            id: uuidv4(),
            name: 'Doing',
            tasks: []
        }
    ])

    const onChange = (id: string, newValue: string) => {
        setNewColumns((prevState) => {
            const newState = [...prevState]
            const column = newState.find((column) => column.id === id)
            if (column) {
                column.name = newValue
            }
            return newState
        })
    }

    const onDelete = (id: string) => {
        setNewColumns((prevState) => prevState.filter((el) => el.id !== id))
    } 

    const validate = () => {
        setIsValid(false)
        if (!name.trim()) {
            return false
        }

        for (let i = 0; i < newColumns.length; i++) {
            if (!newColumns[i].name.trim()) {
                return false
            }
        }

        setIsValid(true)
        return true
    }

    const onsubmit = (type: string) => {
        setIsBoardModalOpen(false)
        if (type === 'add') {
            dispatch(boardsSlice.actions.addBoard({name, newColumns}))
        } else {
            dispatch(boardsSlice.actions.editBoard({name, newColumns}))
        }
    }


    return (
        <div
            onClick={(e) => {
                if (e.target !== e.currentTarget) {
                    return
                }
                setIsBoardModalOpen(false)
            }}
            className=" fixed right-0 left-0 top-0 bottom-0 px-2 scrollbar-hide py-4 overflow-scroll z-50 justify-center items-center flex bg-[#00000080] "
        >
            {/* Modal Section */}
            <div
                className=" scrollbar-hide overflow-y-scroll max-h-[95vh] bg-white dark:bg-darkGrey text-black dark:text-white font-bold shadow-md shadow-[#364E7E1A] max-w-md mx-auto w-full px-8 py-8 rounded-xl "
            >
                <h3 className=" text-L">
                    { type === 'edit' ? 'Edit' : 'Add New'} Board
                </h3>

                <div className=" mt-8 flex flex-col space-y-3 ">
                    <label className=" text-sm dark:text-white text-gray-500 ">
                        Name
                    </label>
                    <input 
                        className=" bg-transparent px-4 py-2 rounded-md text-sm placeholder-lightLines text-darkGrey border border-lightLines outline-none focus:border-mainPurple outline-1 ring-0 "
                        placeholder=" e.g Web Design"
                        value={name}
                        onChange={(e) => {
                            setName(e.target.value)
                        }} 
                        id="board-name-input"
                    />
                </div>

                {/* Board Columns */}

                <div
                    className=" mt-8 flex flex-col space-y-3 "
                >
                    <label className=" text-sm dark:text-white text-gray-500 ">
                        Columns
                    </label>
                    {
                        newColumns.map((column) => (
                            <div key={column.id} className=" flex items-center w-full ">
                                <input 
                                    className=" bg-transparent flex-grow px-4 py-2 rounded-md text-sm text-darkGrey border border-lightLines outline-none focus:border-mainPurple outline-1 ring-0 "
                                    placeholder="Column name"
                                    value={column.name}
                                    type="text"
                                    onChange={(e) => {
                                        onChange( column.id, e.target.value )
                                    }}
                                />
                                    <button
                                        className=" bg-transparent text-white text-BodyL"
                                        onClick={() => {
                                            onDelete(column.id)
                                        }}
                                    >
                                        <CrossIcon 
                                            className="text-mediumGrey hover:text-red ml-4"
                                        />
                                    </button>
                            </div>
                        ))
                    }

                </div>

                <div className=" mt-8 flex justify-between flex-col gap-[24px] ">
                    <button 
                        className=" button bg-[#625fc71a] text-mainPurple text-BodyL hover:bg-[#625fc740] flex items-center gap-1 justify-center "
                        onClick={() => {
                            setNewColumns((state) => [
                                ...state,
                                { id: uuidv4(), name: '', tasks: [] }
                            ])
                        }}
                    >
                        + Add New Column
                    </button>
                    <button 
                        className=" bg-mainPurple text-white button text-BodyL"
                        onClick={() => {
                            validate()
                            if ( isValid === true ) onsubmit(type) 
                        }}
                    >
                        {type === 'add' ? 'Create New Board' : 'Save Changes'}
                    </button>
                </div>
            </div>
        </div>
    )
}

export default AddEditBoardModal