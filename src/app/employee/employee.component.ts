import { Component } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Apollo } from 'apollo-angular';
import gql from 'graphql-tag';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatTableModule } from '@angular/material/table';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatToolbarModule } from '@angular/material/toolbar';

@Component({
  selector: 'app-employee',
  standalone: true,
  templateUrl: './employee.component.html',
  imports: [
    CommonModule,
    FormsModule,
    RouterModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatTableModule,
    MatProgressSpinnerModule,
    MatToolbarModule
  ]
})
export class EmployeeComponent {
  employees: any[] = [];
  designation = '';
  department = '';
  loading = false;
  error = '';

  displayedColumns: string[] = [
    'first_name',
    'last_name',
    'email',
    'designation',
    'department',
    'actions'
  ];

  constructor(private apollo: Apollo, private router: Router) {
    this.getAllEmployees(); 
  }

  getAllEmployees() {
    this.loading = true;
    this.apollo
      .watchQuery({
        query: gql`
          query {
            getAllEmployees {
              id
              first_name
              last_name
              email
              designation
              department
            }
          }
        `,
      })
      .valueChanges.subscribe({
        next: (result: any) => {
          this.employees = result?.data?.getAllEmployees || [];
          this.loading = false;
        },
        error: (err) => {
          this.error = err.message;
          this.loading = false;
        },
      });
  }

  searchEmployees() {
    this.loading = true;
    this.apollo
      .watchQuery({
        query: gql`
          query Search($designation: String, $department: String) {
            searchEmployees(designation: $designation, department: $department) {
              id
              first_name
              last_name
              email
              designation
              department
            }
          }
        `,
        variables: {
          designation: this.designation || null,
          department: this.department || null,
        },
      })
      .valueChanges.subscribe({
        next: (result: any) => {
          this.employees = result?.data?.searchEmployees || [];
          this.loading = false;
        },
        error: (err) => {
          this.error = err.message;
          this.loading = false;
        },
      });
  }

  viewEmployee(id: string) {
    this.router.navigate(['/employee', id]);
  }
  
  editEmployee(id: string) {
    this.router.navigate(['/employee/edit', id]);
  }
  
  addEmployee() {
    this.router.navigate(['/employee/add']);
  }

  deleteEmployee(id: string) {
    if (confirm('Are you sure you want to delete this employee?')) {
      this.apollo.mutate({
        mutation: gql`
          mutation DeleteEmployee($id: ID!) {
            deleteEmployee(id: $id)
          }
        `,
        variables: { id }
      }).subscribe({
        next: () => {
          this.getAllEmployees(); 
        },
        error: (err) => {
          this.error = err.message;
        }
      });
    }
  }
  

}
