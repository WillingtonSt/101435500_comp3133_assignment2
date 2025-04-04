import { Injectable } from '@angular/core';
import { Apollo } from 'apollo-angular';
import gql from 'graphql-tag';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private tokenKey = 'auth_token';

  constructor(private apollo: Apollo) {}

  login(email: string, password: string) {
    return this.apollo.watchQuery({
      query: gql`
        query Login($email: String!, $password: String!) {
          login(email: $email, password: $password) {
            token
            user {
              id
              username
            }
          }
        }
      `,
      variables: { email, password }
    }).valueChanges; 
  }
  

  signup(username: string, email: string, password: string) {
    return this.apollo.mutate({
      mutation: gql`
        mutation Signup($username: String!, $email: String!, $password: String!) {
          signup(username: $username, email: $email, password: $password) {
            token
            user {
              id
              username
            }
          }
        }
      `,
      variables: { username, email, password }
    });
  }

  //Store token in memory or localStorage
  setToken(token: string) {
    localStorage.setItem(this.tokenKey, token);
  }

  getToken(): string | null {
    return localStorage.getItem(this.tokenKey);
  }

  isLoggedIn(): boolean {
    return !!this.getToken();
  }

  logout() {
    localStorage.removeItem(this.tokenKey);
  }
}
