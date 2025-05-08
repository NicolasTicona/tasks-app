import { Component, inject, OnInit } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import { AddTaskComponent } from 'src/app/components/add-task/add-task.component';
import { EditTaskPayload, NewTaskPayload, Task } from 'src/app/interfaces/task.interface';
import { TasksService } from 'src/app/services/tasks.service';
import { TaskCardComponent } from 'src/app/components/task-card/task-card.component';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressBarModule } from '@angular/material/progress-bar';


@Component({
    selector: 'app-dashboard',
    templateUrl: './dashboard.component.html',
    styleUrls: ['./dashboard.component.scss'],
    imports: [AddTaskComponent, TaskCardComponent, MatProgressBarModule, MatButtonModule, MatIconModule, ReactiveFormsModule, RouterModule]
})
export class DashboardComponent implements OnInit {
    private readonly authService = inject(AuthService);
    private readonly tasksService = inject(TasksService);
    private readonly router = inject(Router);
    public tasks: Task[] = [];
    public user = this.authService.getUser();
    public isLoading = false;

    ngOnInit(): void {
        this.getTasks();
    }

    public getTasks(): void {
        this.isLoading = true;
        this.tasksService.getTasks(this.user.id).subscribe({
            next: (res) => {
                this.tasks = res.data || [];
            },
            complete: () => {
                this.isLoading = false;
            }
        });
    }

    public logout(): void {
        this.authService.logoutUser();
        this.router.navigate(['/login'])
    }

    public onTaskCreated(task: NewTaskPayload): void {
        this.tasksService.addTask(this.user.id, task).subscribe({
            next: () => {
                this.getTasks();
            },
            error: (error) => {
                console.error('Error creating task:', error);
            }
        })
    }

    public onTaskDeleted(taskId: number): void {
        console.log('Deleting task with ID:', taskId);
        this.tasksService.deleteTask(this.user.id, taskId).subscribe({
            next: () => {
                this.getTasks();
            },
            error: (error) => {
                console.error('Error deleting task:', error);
            }
        });
    }

    public onTaskUpdated(task: EditTaskPayload): void {
        console.log('Updating task with ID:', task);

        this.tasksService.editTask(this.user.id, task).subscribe({
            next: () => {
                this.getTasks();
            },
            error: (error) => {
                console.error('Error updating task:', error);
            }
        });
    }
}