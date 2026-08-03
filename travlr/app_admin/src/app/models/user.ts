export type UserRole =
| 'customer'
| 'admin';

export class User {
  public email = '';
  public name = '';
  public role: UserRole = 'customer';
}
