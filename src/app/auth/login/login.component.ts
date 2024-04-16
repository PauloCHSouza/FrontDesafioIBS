import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../auth.service';
import { CommonModule } from '@angular/common';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-login',
  standalone: true,
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
  imports: [CommonModule, NgbModule, FormsModule ],
})
export class LoginComponent {
  loginData = { login: '', password: '' };

  constructor(private authService: AuthService, private router: Router) {}

  onSubmit(): void {
    this.authService.login(this.loginData)
      .subscribe(() => {
        this.router.navigate(['/pessoas']);
      }, error => {
        console.error('Erro de login:', error);
      });
  }
}
