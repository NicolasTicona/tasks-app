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
import { MatSnackBar } from '@angular/material/snack-bar';

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
    private readonly snackbar = inject(MatSnackBar);
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
                this.isLoading = false;
            },
            error: (err) => {
                this.isLoading = false;
                if (err.error.message) {
                    this.showError(err.error.message);
                }
            }
        });
    }
    public onTaskCreated(task: NewTaskPayload): void {
        this.tasksService.addTask(this.user.id, task).subscribe({
            next: () => {
                this.getTasks();
            },
            error: (err) => {
                if (err.error.message) {
                    this.showError(err.error.message);
                }
            }
        })
    }

    public onTaskUpdated(task: EditTaskPayload): void {
        this.tasksService.editTask(this.user.id, task).subscribe({
            next: () => {
                this.getTasks();
            },
            error: (err) => {
                if (err.error.message) {
                    this.showError(err.error.message);
                }
            }
        });
    }

    public onTaskDeleted(taskId: string): void {
        this.tasksService.deleteTask(this.user.id, taskId).subscribe({
            next: () => {
                this.getTasks();
            },
            error: (err) => {
                if (err.error.message) {
                    this.showError(err.error.message);
                }
            }
        });
    }

    public logout(): void {
        this.authService.logoutUser();
        this.router.navigate(['/login'])
    }

    private showError(message: string): void {
        this.snackbar.open(message, 'Close', {
            duration: 5000,
            horizontalPosition: 'right'
        })
    }
}