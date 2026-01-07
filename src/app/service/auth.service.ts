import { Injectable, inject } from '@angular/core';
import { Auth, authState, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, User } from '@angular/fire/auth';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { map, switchMap, tap } from 'rxjs/operators';

@Injectable({
    providedIn: 'root'
})
export class AuthService {
    private auth = inject(Auth);
    private router = inject(Router);

    // Observable for current user state
    readonly user$: Observable<User | null> = authState(this.auth).pipe(
        tap(user => {
            if (user) {
                localStorage.setItem('user_session', JSON.stringify({
                    uid: user.uid,
                    email: user.email,
                    displayName: user.displayName
                }));
            } else {
                localStorage.removeItem('user_session');
            }
        })
    );

    // Observable to check if current user is Admin
    readonly isAdmin$: Observable<boolean> = this.user$.pipe(
        map(user => {
            if (!user || notUserEmail(user)) return false;
            return user.email === 'suryastarone@gmail.com';
        })
    );

    constructor() {
        // Optional: Check local storage on init to set initial state if needed synchronously, 
        // though authState triggers fairly quickly. 
        // Firebase SDK handles basic persistence automatically.
    }

    getCurrentUser() {
        return this.auth.currentUser;
    }

    register(email: string, password: string) {
        return createUserWithEmailAndPassword(this.auth, email, password);
    }

    login(email: string, password: string) {
        return signInWithEmailAndPassword(this.auth, email, password);
    }

    logout() {
        return signOut(this.auth).then(() => {
            localStorage.removeItem('user_session');
            this.router.navigate(['/']); // Navigate to login/home on logout
        });
    }
}

function notUserEmail(user: User): boolean {
    return !user || !user.email;
}
