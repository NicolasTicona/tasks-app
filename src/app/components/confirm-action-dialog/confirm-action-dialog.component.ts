import { Component, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogActions, MatDialogContent, MatDialogRef, MatDialogTitle } from '@angular/material/dialog';
import { ConfirmActionDialogParams } from './interfaces/confirm-action-dialog-params.interface';

@Component({
    selector: 'app-confirm-action-dialog',
    templateUrl: './confirm-action-dialog.component.html',
    styleUrls: ['./confirm-action-dialog.component.scss'],
    imports: [
        MatDialogTitle,
        MatDialogContent,
        MatDialogActions,
        MatButtonModule
    ]
})
export class ConfirmActionDialogComponent {
    readonly dialogRef = inject(MatDialogRef<ConfirmActionDialogComponent>);
    readonly data = inject<ConfirmActionDialogParams>(MAT_DIALOG_DATA);

    public close($event: boolean): void {
        this.dialogRef.close($event);
    }
}