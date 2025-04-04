import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Apollo } from 'apollo-angular';
import gql from 'graphql-tag';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MaterialModule } from '../material.module';
import { MatDatepickerModule } from '@angular/material/datepicker'
import { MatNativeDateModule } from '@angular/material/core';

@Component({
  selector: 'app-edit-employee',
  standalone: true,
  imports: [CommonModule, FormsModule, MaterialModule, MatDatepickerModule, MatNativeDateModule],
  templateUrl: './edit-employee.component.html',
})
export class EditEmployeeComponent {
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
  originalEmployee: any = {}; // stores original values
  id = '';
  error = '';
  success = '';

  constructor(
    private route: ActivatedRoute,
    private apollo: Apollo,
    private router: Router
  ) {
    this.id = this.route.snapshot.paramMap.get('id') || '';
    if (this.id) {
      this.fetchEmployee(this.id);
    }
  }

  fetchEmployee(id: string) {
    this.apollo
      .watchQuery({
        query: gql`
          query GetEmployeeById($id: ID!) {
            getEmployeeById(id: $id) {
              first_name
              last_name
              email
              gender
              designation
              salary
              date_of_joining
              department
              employee_photo
            }
          }
        `,
        variables: { id }
      })
      .valueChanges.subscribe({
        next: (res: any) => {
          const emp = res.data.getEmployeeById;

          let formattedDate = '';
          try {
            console.log(emp.date_of_joining)
            const parsed = new Date(Number(emp.date_of_joining));
            console.log(parsed)
            if (!isNaN(parsed.getTime())) {
              formattedDate = parsed.toISOString().split('T')[0];
              
            }
          } catch {
            console.warn('Invalid date_of_joining:', emp.date_of_joining);
          }

          // Set both employee and original copy
          this.originalEmployee = { ...emp, date_of_joining: formattedDate };
          this.employee = { ...this.originalEmployee };
        },
        error: (err) => this.error = err.message
      });
  }

  onSubmit() {
    // Fill in any blank/null fields from the original data
    for (const key in this.employee) {
      if (
        this.employee[key] === null ||
        this.employee[key] === undefined ||
        this.employee[key] === ''
      ) {
        this.employee[key] = this.originalEmployee[key];
      }
    }

    // Date handling
    try {
      const date = new Date(this.employee.date_of_joining);
      if (!isNaN(date.getTime())) {
        this.employee.date_of_joining = date.toISOString().split('T')[0];
      }
    } catch (e) {
      console.warn("Invalid date:", this.employee.date_of_joining);
    }

    // Handle image
    if (!this.employee.employee_photo) {
      delete this.employee.employee_photo;
    }

    console.log("Submitting update with:", this.employee);

    this.apollo
      .mutate({
        mutation: gql`
          mutation UpdateEmployee(
            $id: ID!
            $first_name: String!
            $last_name: String!
            $email: String!
            $gender: String!
            $designation: String!
            $salary: Float!
            $date_of_joining: String!
            $department: String!
            $employee_photo: String
          ) {
            updateEmployee(
              id: $id
              first_name: $first_name
              last_name: $last_name
              email: $email
              gender: $gender
              designation: $designation
              salary: $salary
              date_of_joining: $date_of_joining
              department: $department
              employee_photo: $employee_photo
            ) {
              id
            }
          }
        `,
        variables: { id: this.id, ...this.employee }
      })
      .subscribe({
        next: () => {
          this.success = 'Employee updated successfully';
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
