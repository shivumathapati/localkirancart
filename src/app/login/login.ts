import { Component } from '@angular/core';
import { Route, Router } from '@angular/router';
import { AuthService } from '../service/auth.service';

@Component({
  selector: 'app-login',
  imports: [],
  templateUrl: './login.html',
  styleUrls: ['./login.css'],
})
export class Login {

  constructor(private authService: AuthService, private router: Router) { }

  register(email: string, password: string) {
    this.authService.register(email, password)
      .then(() => {
        alert('User Registered successful');
      })
      .catch((err: any) => {
        alert(err.message);
      });
  }

  login(email: string, password: string) {
    this.authService.login(email, password)
      .then((userCredential) => {
        console.log('User exists & logged in:', userCredential.user);
        alert('Login successful');
        this.router.navigate(['/dashboard']);
      })
      .catch((error: any) => {
        if (error.code === 'auth/user-not-found') {
          alert('User does not exist');
        } else if (error.code === 'auth/wrong-password') {
          alert('Wrong password');
        } else {
          alert(error.message);
        }
      });
  }
}
