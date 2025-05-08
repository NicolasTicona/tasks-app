import { Component, EventEmitter, inject, Input, Output } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatDialog } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { EditTaskPayload, Task } from 'src/app/interfaces/task.interface';
import { EditTaskDialogComponent } from 'src/app/components/edit-task-dialog/edit-task-dialog.component';
import { ConfirmActionDialogComponent } from 'src/app/components/confirm-action-dialog/confirm-action-dialog.component';
import { DatePipe } from '@angular/common';

@Component({
    selector: 'app-task-card',
    templateUrl: './task-card.component.html',
    styleUrls: ['./task-card.component.scss'],
    imports: [MatCheckboxModule, MatIconModule, MatButtonModule, DatePipe]
})
export class TaskCardComponent {
    @Input() public task: Task;
    @Output() taskDeleted = new EventEmitter<number>();
    @Output() taskUpdated = new EventEmitter<EditTaskPayload>();
    readonly dialog = inject(MatDialog);

    public toggleComplete(): void {
        this.taskUpdated.emit({
            ...this.task,
            completed: !this.task.completed,
        });
    }

    public openEditTaskDialog(): void {
        const dialogRef = this.dialog.open(EditTaskDialogComponent, {
            data: this.task,
            width: '400px',
        });

        dialogRef.afterClosed().subscribe((payload: EditTaskPayload) => {
            if (payload) {
                this.taskUpdated.emit(payload);
            }
        });
    }

    public openConfirmationDialog(): void {
        const dialogRef = this.dialog.open(ConfirmActionDialogComponent, {
            width: '400px',
            data: { }
        });

        dialogRef.afterClosed().subscribe((isConfirmed: boolean) => {
            if (isConfirmed) {
                this.taskDeleted.emit(this.task.id);
            }
        });
    }
}