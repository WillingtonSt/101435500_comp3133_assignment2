import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Apollo } from 'apollo-angular';
import gql from 'graphql-tag';
import { Router } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker'
import { MatNativeDateModule } from '@angular/material/core';

@Component({
  selector: 'app-add-employee',
  standalone: true,
  imports: [CommonModule, FormsModule, MatCardModule, MatFormFieldModule, MatInputModule, MatButtonModule, MatSelectModule, MatDatepickerModule, MatNativeDateModule],
  templateUrl: './add-employee.component.html'
})
export class AddEmployeeComponent {
  employee: any = {
    first_name: '',
    last_name: '',
    email: '',
    gender: '',
    designation: '',
    salary: null,
    date_of_joining: '',
    department: '',
    employee_photo: ''
  };

  error = '';
  success = '';

  constructor(private apollo: Apollo, private router: Router) {}

  onSubmit() {
    this.apollo.mutate({
      mutation: gql`
        mutation AddEmployee(
          $first_name: String!,
          $last_name: String!,
          $email: String!,
          $gender: String!,
          $designation: String!,
          $salary: Float!,
          $date_of_joining: String!,
          $department: String!,
          $employee_photo: String!
        ) {
          addEmployee(
            first_name: $first_name,
            last_name: $last_name,
            email: $email,
            gender: $gender,
            designation: $designation,
            salary: $salary,
            date_of_joining: $date_of_joining,
            department: $department,
            employee_photo: $employee_photo
          ) {
            id
            first_name
          }
        }
      `,
      variables: this.employee
    }).subscribe({
      next: () => {
        this.success = 'Employee added successfully';
        setTimeout(() => this.router.navigate(['/employee']), 1500);
      },
      error: (err) => this.error = err.message
    });
  }

  onFileSelected(event: any) {
    const file = event.target.files[0];
    const reader = new FileReader();
  
    reader.onload = () => {
      this.employee.employee_photo = reader.result as string; 
    };
  
    if (file) {
      reader.readAsDataURL(file);
    }
  }
  
}
