import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators, AbstractControl } from '@angular/forms';
import { Authentication } from '../../core/service/auth';
import { Router } from '@angular/router';

@Component({
  selector: 'app-auth',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './auth.html',
  styleUrl: './auth.scss',
})
export class Auth implements OnInit {
  isLoginMode = signal(true);
  service: Authentication = inject(Authentication);
  router: Router = inject(Router);
  loginForm!: FormGroup;
  registerForm!: FormGroup;

  submitting = false;

  constructor(private fb: FormBuilder) { }

  ngOnInit(): void {
    this.buildForms();
  }

  toggleMode(to?: 'login' | 'register') {
    if (to) this.isLoginMode.set(to === 'login');
    else this.isLoginMode.set(!this.isLoginMode());
  }

  private buildForms() {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
    });

    this.registerForm = this.fb.group({
      userName: ['', [Validators.required, Validators.minLength(2)]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', [Validators.required]],
    }, { validators: this.passwordsMatch });
  }

  private passwordsMatch(group: AbstractControl) {
    const pw = group.get('password')?.value;
    const cpw = group.get('confirmPassword')?.value;
    return pw === cpw ? null : { passwordsMismatch: true };
  }

  onLoginSubmit() {
    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      return;
    }
    this.submitting = true;
    const payload = this.loginForm.value;
    // TODO: call auth service
    this.service.login(payload).subscribe({
      next: (res) => {
        this.router.navigate(['journal-list'])
      },
      error: (err) => {
setTimeout(() => (this.submitting = false), 600);
      }
    })
    setTimeout(() => (this.submitting = false), 600);
  }

  onRegisterSubmit() {
    if (this.registerForm.invalid) {
      this.registerForm.markAllAsTouched();
      return;
    }
    this.submitting = true;
    const payload = { ...this.registerForm.value };
    delete payload.confirmPassword;
    // TODO: call registration service
    this.service.reginster(payload).subscribe({
      next:(res)=>{
        this.toggleMode('login');
      },
      error:(err=>{
         setTimeout(() => (this.submitting = false), 600);
      })
    })
    setTimeout(() => (this.submitting = false), 600);
  }

  field(ctrlName: string, form: 'login' | 'register') {
    const f = form === 'login' ? this.loginForm : this.registerForm;
    return f.get(ctrlName)!;
  }
}
