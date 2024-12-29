export type User = {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
};

export type Trip = {
  id: string;
  name: string;
  destination: string;
  description: string;
  startDate: string;
  endDate: string;
};

export namespace Api {
  // Authentication and User Types
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

  // Trip Types
  export type CreateTripRequest = {
    name: string;
    destination: string;
    description: string;
    startDate?: string;
    endDate?: string;
  };

  export type CreateTripResponse = {
    tripId: number;
  }

  export type TripHistoryRequest = {
    userId: string;
  };

  export type AddUserToTripRequest = {
    tripId: number;
    userId: string;
  };

  export type AddUserToTripResponse = void;

  export type TripHistoryResponse = Trip[];

  // Password Recovery Types
  export type RecoverPasswordRequest = {
    email: string;
  };

  export type ResetPasswordRequest = {
    userId?: string;
    token?: string;
    password: string;
  };

  export type RecoverPasswordResponse = void;

  export type ResetPasswordResponse = void;

  // Invitation Types
  export type Invitation = {
    tripId: number;
    userId: string;
    isDenied: boolean;
    tripName: string;
    tripDestination: string;
  };

  export type InviteUserRequest = {
    tripId: number;
    email: string;
  };

  export type RespondToInvitationRequest = {
    tripId: number;
    userId: string;
    isAccepted: boolean;
  };
}
