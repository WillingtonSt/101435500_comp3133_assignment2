import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../auth.service';
import { Router, RouterLink } from '@angular/router';
import { MaterialModule } from '../material.module';

@Component({
  selector: 'app-signup',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink, MaterialModule],
  templateUrl: './signup.component.html'
})
export class SignupComponent {
  username = '';
  email = '';
  password = '';
  error = '';

  constructor(private auth: AuthService, private router: Router) {}

  onSubmit() {
    this.auth.signup(this.username, this.email, this.password).subscribe({
      next: (res: any) => {
        const token = res.data.signup.token;
        this.auth.setToken(token);
        this.router.navigate(['/employee']);
      },
      error: err => this.error = err.message
    });
  }  
}
