import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { EditTaskPayload, NewTaskPayload, Task } from 'src/app/interfaces/task.interface';
import { environment } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';
import { ApiResponse } from '../interfaces/api-response.interface';

@Injectable({
    providedIn: 'root'
})
export class TasksService {
    private baseUrl = environment.api.tasksUrl;
    private http = inject(HttpClient);

    public getTasks(userId: string): Observable<ApiResponse<Task[]>> {
        return this.http.get<ApiResponse<Task[]>>(`${this.baseUrl}/${userId}`);
    }

    addTask(userId: string, task: NewTaskPayload): Observable<ApiResponse<Task>> {
        return this.http.post<ApiResponse<Task>>(`${this.baseUrl}/${userId}/add`, {
            ...task,
            userId
        });
    }

    editTask(userId: string, task: EditTaskPayload): Observable<ApiResponse<{ id: string }>> {
        return this.http.put<ApiResponse<{ id: string }>>(`${this.baseUrl}/${userId}/edit/${task.id}`, task);
    }

    deleteTask(userId: string, taskId: string): Observable<ApiResponse<{ id: string }>> {
        return this.http.delete<ApiResponse<{ id: string }>>(`${this.baseUrl}/${userId}/delete/${taskId}`);
    }
}