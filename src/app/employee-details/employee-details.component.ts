import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Apollo } from 'apollo-angular';
import { CommonModule } from '@angular/common';
import gql from 'graphql-tag';
import { MaterialModule } from '../material.module';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatListModule } from '@angular/material/list'

@Component({
  selector: 'app-employee-details',
  standalone: true,
  imports: [CommonModule, MaterialModule, MatCardModule, MatButtonModule, MatProgressSpinnerModule, MatListModule],
  templateUrl: './employee-details.component.html'
})
export class EmployeeDetailsComponent {
  employee: any = null;
  loading = false;
  error = '';

  constructor(private route: ActivatedRoute, private apollo: Apollo) {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) this.fetchEmployee(id);
  }

  fetchEmployee(id: string) {
    this.loading = true;
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
          this.employee = res.data.getEmployeeById;
          this.loading = false;
        },
        error: err => {
          this.error = err.message;
          this.loading = false;
        }
      });
  }
}
