import { Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { SignupComponent } from './signup/signup.component';
import { EmployeeComponent } from './employee/employee.component';
import { AddEmployeeComponent } from './add-employee/add-employee.component';
import { EmployeeDetailsComponent } from './employee-details/employee-details.component';
import { EditEmployeeComponent } from './edit-employee/edit-employee.component';
import { authGuard } from './auth.guard';


export const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'signup', component: SignupComponent },
  { path: 'employee', component: EmployeeComponent, canActivate: [authGuard] },
  { path: 'employee/add', component: AddEmployeeComponent, canActivate: [authGuard] },
  { path: 'employee/:id', component: EmployeeDetailsComponent, canActivate: [authGuard] },
  { path: 'employee/edit/:id', component: EditEmployeeComponent, canActivate: [authGuard] }
];
