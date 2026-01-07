import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../service/auth.service';
import { map, take, tap } from 'rxjs/operators';

export const adminGuard: CanActivateFn = (route, state) => {
    const authService = inject(AuthService);
    const router = inject(Router);

    return authService.isAdmin$.pipe(
        take(1),
        tap(isAdmin => {
            if (!isAdmin) {
                console.log('Access denied - Admins only');
                router.navigate(['/dashboard']); // Or login, but they might be logged in just not admin
            }
        })
    );
};
