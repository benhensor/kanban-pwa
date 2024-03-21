type ElipsisMenuProps = {
  type: string
  setOpenEditModal: (state: boolean) => void
  setOpenDeleteModal: (state: boolean) => void
}

function ElipsisMenu({ type, setOpenEditModal, setOpenDeleteModal }: ElipsisMenuProps) {
  return (
    <div
      className={
        type === "Boards"
          ? " absolute  top-16  right-5"
          : " absolute  top-6  right-4"
      }
    >
      <div className=" flex justify-end items-center">
        <div className=" w-40 text-sm z-50 font-medium shadow-md shadow-[#364e7e1a] bg-white dark:bg-veryDarkGrey space-y-4 py-5 px-4 rounded-lg  h-auto pr-12">
          <button
            onClick={() => {
              setOpenEditModal(true);
            }}
            className=" cursor-pointer dark:text-gray-400 text-gray-700"
          >
            Edit {type}
          </button>

          <button
            onClick={() => setOpenDeleteModal(true)}
            className=" cursor-pointer text-red"
          >
            Delete {type}
          </button>
        </div>
      </div>
    </div>
  );
}

export default ElipsisMenu