export interface Task {
    id: string;
    title: string;
    description: string;
    completed: boolean;
    createdAt: number;
}

export interface NewTaskPayload {
    title: string;
    description: string;
}

export interface EditTaskPayload {
    id: string;
    title: string;
    description: string;
    completed: boolean;
}