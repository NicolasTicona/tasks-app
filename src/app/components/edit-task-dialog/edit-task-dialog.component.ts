import { Component, inject } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogActions, MatDialogClose, MatDialogContent, MatDialogRef, MatDialogTitle } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { Task } from 'src/app/interfaces/task.interface';

@Component({
    selector: 'app-edit-task-dialog',
    templateUrl: './edit-task-dialog.component.html',
    styleUrls: ['./edit-task-dialog.component.scss'],
    imports: [MatFormFieldModule,
        MatInputModule,
        ReactiveFormsModule,
        MatButtonModule,
        MatDialogTitle,
        MatDialogContent,
        MatDialogActions,
    ]
})
export class EditTaskDialogComponent {
    readonly dialogRef = inject(MatDialogRef<EditTaskDialogComponent>);
    readonly task = inject<Task>(MAT_DIALOG_DATA);
    public formGroup = new FormGroup({
        title: new FormControl(this.task.title, { nonNullable: true, validators: Validators.required }),
        description: new FormControl(this.task.description, { nonNullable: true })
    })

    close(): void {
        this.dialogRef.close();
    }

    public editTask(): void {
        const taskPayload = {
            ...this.task,
            ...this.formGroup.getRawValue()
        }
        this.dialogRef.close(taskPayload);
    }
}