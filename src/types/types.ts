export type Id = string | number;

export type Board = {
        name: string,
        isActive: boolean,
        columns: Column[],
}

export type Column = {
        id: Id,
        name: string,
        tasks: Task[],
}

export type Task = {
        id: Id,
        columnId: Id,
        title: string,
        status: string,
        description?: string,
        subtasks: Subtask[],
}

export type Subtask = {
        title: string,
        isCompleted: boolean,
        id: Id,
}
