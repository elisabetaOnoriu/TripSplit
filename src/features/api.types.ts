export type User = {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
};

export namespace Api {
  export type RegisterRequest = {
    email: string;
    firstName: string;
    lastName: string;
    password: string;
  };

  export type RegisterResponse = void;

  export type LoginRequest = {
    email: string;
    password: string;
  };

  export type LoginResponse = {
    token: string;
    user: User;
  };

  export type UserRequest = {
    userId: string;
  };

  export type UserResponse = User;

  export type UpdateUserRequest = User;

  export type UpdateUserResponse = void;
}
