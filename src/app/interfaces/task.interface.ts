export interface Task {
    id: number;
    title: string;
    description: string;
    completed: boolean;
    createdAt: Date;
}

export interface NewTaskPayload {
    title: string;
    description: string;
}

export interface EditTaskPayload {
    id: number;
    title: string;
    description: string;
    completed: boolean;
}