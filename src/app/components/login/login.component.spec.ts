import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { LoginComponent } from './login.component';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import { Router } from '@angular/router';
import { USER_MOCK } from 'src/app/mocks/user.mock';
import { of, throwError } from 'rxjs';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';

describe('login test', () => {
    let component: LoginComponent;
    let fixture: ComponentFixture<LoginComponent>;
    let authService: AuthService;
    let router: Router;
    let dialog: MatDialog;

    beforeEach(waitForAsync(() => {
        TestBed.configureTestingModule({
            imports: [LoginComponent],
            providers: [
                {
                    provide: AuthService,
                    useValue: {
                        isUserValidInStorage: jest.fn(),
                        loginUser: jest.fn(),
                        registerUser: jest.fn()
                    }
                },
                {
                    provide: Router,
                    useValue: {
                        navigate: jest.fn()
                    }
                },
                {
                    provide: MatDialog,
                    useValue: {
                        open: () => jest.fn()
                    }
                },
                {
                    provide: MatSnackBar,
                    useValue: {
                        open: () => jest.fn()
                    }
                }
            ],
            schemas: [NO_ERRORS_SCHEMA]
        })

        authService = TestBed.inject(AuthService);
        router = TestBed.inject(Router);
        dialog = TestBed.inject(MatDialog);
    }))

    beforeEach(() => {
        fixture = TestBed.createComponent(LoginComponent);
        component = fixture.componentInstance;
    })

    it('should not try log in if user not exists in storage', () => {
        jest.spyOn(authService, 'isUserValidInStorage').mockReturnValueOnce(null);
        jest.spyOn(authService, 'loginUser');

        component.ngOnInit();

        expect(authService.isUserValidInStorage).toHaveBeenCalled();
        expect(authService.loginUser).not.toHaveBeenCalled();
    });

    it('should navigate to dashboard if user in storage exists', () => {
        jest.spyOn(router, 'navigate');
        jest.spyOn(authService, 'isUserValidInStorage').mockReturnValueOnce(USER_MOCK);
        jest.spyOn(authService, 'loginUser').mockReturnValueOnce(of({
            message: ''
        }));

        component.ngOnInit();

        expect(authService.isUserValidInStorage).toHaveBeenCalled();
        expect(authService.loginUser).toHaveBeenCalledWith(USER_MOCK.email);
        expect(router.navigate).toHaveBeenCalledWith(['/dashboard'])
    });

    it('should register user if email is not registered', () => {
        jest.spyOn(router, 'navigate');
        jest.spyOn(authService, 'isUserValidInStorage').mockReturnValueOnce(null);
        jest.spyOn(authService, 'loginUser').mockReturnValueOnce(throwError(() => ({
            status: 404
        })));
        jest.spyOn(authService, 'registerUser').mockReturnValueOnce(of({
            message: '',
            data: USER_MOCK
        }))
        jest.spyOn(dialog, 'open').mockReturnValueOnce({
            afterClosed: () => of(true)
        } as MatDialogRef<unknown>);

        component.ngOnInit();
        component.email.setValue('123@gmail.com');
        component.submit();

        expect(router.navigate).toHaveBeenCalledWith(['/dashboard'])
    })
});