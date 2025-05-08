import { Component, EventEmitter, inject, Output } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { NewTaskPayload } from 'src/app/interfaces/task.interface';

@Component({
    selector: 'app-add-task',
    templateUrl: './add-task.component.html',
    styleUrls: ['./add-task.component.scss'],
    imports: [MatFormFieldModule, MatInputModule, MatIconModule, MatButtonModule, ReactiveFormsModule]
})
export class AddTaskComponent {
    @Output() private readonly taskCreated = new EventEmitter<NewTaskPayload>();
    public formGroup = new FormGroup({
        title: new FormControl('', { nonNullable: true, validators: Validators.required }),
        description: new FormControl('', { nonNullable: true })
    })

    public addTask(event: Event): void {
        event.preventDefault();
        const taskPayload = this.formGroup.getRawValue();
        this.taskCreated.emit(taskPayload);
        this.formGroup.reset();
    }
}