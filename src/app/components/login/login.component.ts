import { Component, inject, signal } from '@angular/core';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatButtonModule } from '@angular/material/button';
import { FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { filter, merge, switchMap } from 'rxjs';
import { AuthService } from 'src/app/services/auth.service';
import { Router, RouterModule } from '@angular/router';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { ConfirmActionDialogComponent } from 'src/app/components/confirm-action-dialog/confirm-action-dialog.component';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
    selector: 'app-login',
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.scss'],
    imports: [MatFormFieldModule, MatInputModule, MatDialogModule, MatButtonModule, ReactiveFormsModule, RouterModule],
})
export class LoginComponent {
    public readonly email = new FormControl('', [Validators.required, Validators.email]);
    public readonly errorMessage = signal('');
    private readonly authService = inject(AuthService);
    private readonly router = inject(Router);
    private readonly dialog = inject(MatDialog);
    private readonly snackbar = inject(MatSnackBar)

    constructor() {
        const user = this.authService.isUserValidInStorage();

        if (user) {
            this.loginUser(user.email);
        }

        merge(this.email.statusChanges, this.email.valueChanges)
            .pipe(takeUntilDestroyed())
            .subscribe(() => this.updateErrorMessage());
    }

    public updateErrorMessage(): void {
        if (this.email.hasError('required')) {
            this.errorMessage.set('Enter your email');
        } else if (this.email.hasError('email')) {
            this.errorMessage.set('It is not a valid email');
        } else {
            this.errorMessage.set('');
        }
    }

    public submit(): void {
        const email = this.email.value;

        if (this.email.invalid || !email) {
            return;
        }

        this.loginUser(email);
    }

    private loginUser(email): void {
        this.authService.loginUser(email).subscribe({
            next: () => {
                this.router.navigate(['/dashboard']);
            },
            error: (err) => {
                if (err.status === 404) {
                    this.openConfirmRegisterDialog(email);
                }
            }
        })
    }

    private openConfirmRegisterDialog(email: string): void {
        const dialogRef = this.dialog.open(ConfirmActionDialogComponent, {
            data: {
                title: 'Register User',
                text: 'This email is not registered yet. Do you want to register this email ?'
            }
        })

        dialogRef.afterClosed()
            .pipe(
                filter(confirm => !!confirm),
                switchMap(() => this.authService.registerUser(email))
            )
            .subscribe({
                next: (res) => {
                    this.snackbar.open(res.message, 'close', {
                        duration: 5000
                    });
                    this.router.navigate(['/dashboard']);
                },
                error: (err) => {
                    this.snackbar.open(err.message)
                }
            })
    }
}