import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable, tap } from 'rxjs';
import { environment } from 'src/environments/environment';
import { ApiResponse } from 'src/app/interfaces/api-response.interface';
import { User } from 'src/app/interfaces/user.interface';

@Injectable({
    providedIn: 'root'
})
export class AuthService {
    private readonly userDataKey = 'userData';
    private isLoggedIn = false;
    private baseUrl = environment.api.userAuthUrl;
    private http = inject(HttpClient);
    private userLoggedIn: User;

    public loginUser(email: string): Observable<ApiResponse<User>> {
        const params = new HttpParams().set('email', email);

        return this.http.get<ApiResponse<User>>(`${this.baseUrl}/userExists`, { params }).pipe(tap(({ data }) => {
            this.isLoggedIn = true;
            if (data) {
                this.userLoggedIn = data;
                this.saveUserDataInStorage(data);
            }
        }));
    }

    public registerUser(email: string): Observable<ApiResponse<User>> {
        return this.http.post<ApiResponse<User>>(`${this.baseUrl}/register`, { email }).pipe(tap(({ data }) => {
            this.isLoggedIn = true;
            if (data) {
                this.userLoggedIn = data;
                this.saveUserDataInStorage(data);
            }
        }));
    }

    public logoutUser(): void {
        this.isLoggedIn = false;
        localStorage.removeItem(this.userDataKey);
    }

    public isUserLoggedIn(): boolean {
        return this.isLoggedIn;
    }

    public saveUserDataInStorage(data: User): void {
        localStorage.setItem(this.userDataKey, JSON.stringify(data));
    }

    public isUserValidInStorage(): User | null {
        const data = localStorage.getItem(this.userDataKey);
        const user = data ? JSON.parse(data) : null;

        return user;
    }

    public getUser(): User {
        return this.userLoggedIn;
    }
}