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

  export type CreateTripRequest = {
    name: string;
    destination: string;
    description: string;
    startDate?: string;
    endDate?: string;
  };

  export type RecoverPasswordRequest = {
    email: string;
  };

  export type ResetPasswordRequest = {
    userId?: string;
    token?: string;
    password: string;
  };

  export type ResetPasswordResponse = void;

  export type RecoverPasswordResponse = void;

  export type CreateTripResponse = void;

  export type UserResponse = User;

  export type UpdateUserRequest = User;

  export type UpdateUserResponse = void;
}
