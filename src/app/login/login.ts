import { Auth, createUserWithEmailAndPassword, signInWithEmailAndPassword } from '@angular/fire/auth';
import { Component } from '@angular/core';
import { Route, Router } from '@angular/router';

@Component({
  selector: 'app-login',
  imports: [],
  templateUrl: './login.html',
  styleUrls: ['./login.css'],
})
export class Login {
  
  constructor(private auth: Auth, private router:Router) {}

  register(email: string, password: string) {
    createUserWithEmailAndPassword(this.auth, email, password)
      .then(() => {
        alert('User Registered successful');
      })
      .catch(err => {
        alert(err.message);
      });
  }

  login(email: string, password: string) {
    signInWithEmailAndPassword(this.auth, email, password)
      .then((userCredential) => {
        console.log('User exists & logged in:', userCredential.user);
        alert('Login successful');
        // window.location.href = '/dashboard';
        this.router.navigate(['/dashboard']);
      })
      .catch((error) => {
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
