import { createApi } from '@reduxjs/toolkit/query/react';
import type { BaseQueryFn } from '@reduxjs/toolkit/query';
import axios from 'axios';
import type { AxiosRequestConfig, AxiosError } from 'axios';
import { Api } from './api.types';
import { RootState } from './store';
import { logout } from './auth';
import { redirect } from 'react-router-dom';


const axiosBaseQuery =
  (
    { baseUrl } = { baseUrl: '' }
  ): BaseQueryFn<
    {
      url: string;
      method: AxiosRequestConfig['method'];
      data?: AxiosRequestConfig['data'];
      params?: AxiosRequestConfig['params'];
    },
    unknown,
    { status: number; message: string }
  > =>
  async ({ url, method, data }, { getState, dispatch }) => {
    try {
      const result = await axios({
        baseURL: baseUrl,
        url,
        method,
        data,
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
          
          ...(url.includes('Authentication')
            ? {}
            : {
                Authorization: `Bearer ${
                  (getState() as RootState).auth.token
                }`,
              }),
        },
      });

      return { data: result.data };
    } catch (e) {
      const err = e as AxiosError;

 
      if (err.response?.status === 401) {
       
        if (!url.includes('login')) {
          dispatch(logout());
          redirect('/login');
        }
      }

      return {
        error: {
          status: err.response?.status || 500,
          message: (err.response?.data as any)?.message || 'Unknown error',
        },
      };
    }
  };

// -----------------------------------
// 2) Create the RTK Query API slice
// -----------------------------------
export const api = createApi({
  baseQuery: axiosBaseQuery({
    baseUrl: `https://localhost:7083/api/`,
  }),
  tagTypes: ['User', 'Trip', 'Invitation'],
  endpoints: (builder) => ({

    // -----------------------------------
    // Auth-related endpoints
    // -----------------------------------
    login: builder.mutation<Api.LoginResponse, Api.LoginRequest>({
      query: (data) => ({
        url: 'Authentication/login',
        method: 'post',
        data,
      }),
      invalidatesTags: ['User'],
    }),

    register: builder.mutation<Api.RegisterResponse, Api.RegisterRequest>({
      query: (data) => ({
        url: 'Authentication/register',
        method: 'post',
        data,
      }),
    }),

    isUserAdmin: builder.query<Api.isUserAdminResponse, string>({
      query: (userId) => ({
        url: `Authentication/is-admin?userId=${userId}`,
        method: 'get',
      }),
    }),

    // -----------------------------------
    // User-related endpoints
    // -----------------------------------
    user: builder.query<Api.UserResponse, Api.UserRequest>({
      query: ({ userId }) => ({
        url: `User/get-user-by-id?userId=${userId}`,
        method: 'get',
      }),
      providesTags: ['User'],
    }),

    updateUser: builder.mutation<Api.UpdateUserResponse, Api.UpdateUserRequest>({
      query: (data) => ({
        url: 'User/update-user',
        method: 'patch',
        data,
      }),
      invalidatesTags: ['User'],
    }),

    getAllUsers: builder.query<Api.GetAllUsersResponse, Api.GetAllUsersRequest>({
      query: () => ({
        url: 'User/get-all-users',
        method: 'get',
      }),
      providesTags: ['User'],
    }),

    deleteUser: builder.mutation<Api.DeleteUserResponse, Api.DeleteUserRequest>({
      query: ({ userId }) => ({
        url: `User/delete-user?userId=${userId}`,
        method: 'delete',
      }),
      invalidatesTags: ['User'],
    }),

    getUserByEmail: builder.query<Api.UserResponse, Api.GetUserByEmailRequest>({
      query: (email) => ({
        url: `User/get-user-by-email?email=${email}`,
        method: 'get',
      }),
      providesTags: ['User'],
    }),

    // -----------------------------------
    // Trip-related endpoints
    // -----------------------------------
    createTrip: builder.mutation<Api.CreateTripResponse, { data: Api.CreateTripRequest; userId: string }>({
      query: ({ data, userId }) => ({
        url: `Trip/create?userId=${userId}`,
        method: 'post',
        data, 
      }),
      invalidatesTags: ['Trip'],
    }),

    tripHistory: builder.query<Api.TripHistoryResponse, Api.TripHistoryRequest>({
      query: ({ userId }) => ({
        url: `Trip/get-trip-history?userId=${userId}`,
        method: 'get',
      }),
      providesTags: ['Trip'],
    }),

    addUserToTrip: builder.mutation<Api.AddUserToTripResponse, Api.AddUserToTripRequest>({
      query: (data) => ({
        url: 'Trip/add-user-to-trip',
        method: 'post',
        data,
      }),
      invalidatesTags: ['Trip'],
    }),

    setTripOwner: builder.mutation<Api.AddUserToTripResponse, Api.AddUserToTripRequest>({
      query: (data) => ({
        url: 'Trip/set-trip-owner',
        method: 'post',
        data,
      }),
      invalidatesTags: ['Trip'],
    }),

    removeTrip: builder.mutation<void, number>({
      query: (tripId) => ({
        url: `Trip/remove-trip?tripId=${tripId}`,
        method: 'delete',
      }),
      invalidatesTags: ['Trip'],
    }),

    // -----------------------------------
    // New endpoint: get-trip-details
    //   Returns trip info + participants
    // -----------------------------------
    getTripDetails: builder.query<Api.TripDetailDto, number>({
      query: (tripId) => ({
        url: `Trip/get-trip-details?tripId=${tripId}`,
        method: 'get',
      }),
      providesTags: ['Trip'],
    }),

    // -----------------------------------
    // Password Recovery endpoints
    // -----------------------------------
    recoverPassword: builder.mutation<Api.RecoverPasswordResponse, Api.RecoverPasswordRequest>({
      query: (data) => ({
        url: 'Authentication/request-password-reset',
        method: 'post',
        data,
      }),
    }),

    resetPassword: builder.mutation<Api.ResetPasswordResponse, Api.ResetPasswordRequest>({
      query: (data) => ({
        url: 'Authentication/reset-password',
        method: 'post',
        data,
      }),
    }),

    // -----------------------------------
    // Invitation-related endpoints
    // -----------------------------------
    getUserInvitations: builder.query<Api.Invitation[], string>({
      query: (userId) => ({
        url: `Invitation/get-user-invitations?userId=${userId}`,
        method: 'get',
      }),
      providesTags: ['Invitation'],
    }),

    inviteUser: builder.mutation<void, Api.InviteUserRequest>({
      query: (data) => ({
        url: 'Invitation/invite-by-email',
        method: 'post',
        data,
      }),
      invalidatesTags: ['Invitation'],
    }),

    respondToInvitation: builder.mutation<void, Api.RespondToInvitationRequest>({
      query: (data) => ({
        url: `Invitation/${data.isAccepted ? 'accept' : 'reject'}`,
        method: 'post',
        data,
      }),
      invalidatesTags: ['Invitation', 'Trip'],
    }),

    // -----------------------------------
    // Expense endpoints
    // -----------------------------------
    createExpense: builder.mutation<Api.CreateExpenseResponse, Api.CreateExpenseRequest>({
      query: (data) => ({
        url: 'Expense/create',
        method: 'post',
        data,
      }),
    }),

    getExpensesByTrip: builder.query<Api.GetExpensesByTripResponse, Api.GetExpensesByTripRequest>({
      query: ({ tripId }) => ({
        url: `Expense/get-by-id?tripId=${tripId}`,
        method: 'get',
      }),
    }),

    splitExpenses: builder.mutation<void, Api.SplitExpensesRequest>({
      query: (data) => ({
        url: 'Expense/split',
        method: 'post',
        data,
      }),
    }),
  }),
});

// -----------------------------------
// 3) Export auto-generated hooks
// -----------------------------------
export const {
  useLoginMutation,
  useRegisterMutation,
  useUserQuery,
  useUpdateUserMutation,
  useIsUserAdminQuery,
  useLazyGetUserByEmailQuery,
  useCreateTripMutation,
  useRecoverPasswordMutation,
  useResetPasswordMutation,
  useTripHistoryQuery,
  useGetUserInvitationsQuery,
  useInviteUserMutation,
  useRespondToInvitationMutation,
  useAddUserToTripMutation,
  useSetTripOwnerMutation,
  useGetAllUsersQuery,
  useDeleteUserMutation,
  useGetTripDetailsQuery,
  useCreateExpenseMutation,
  useGetExpensesByTripQuery,
  useSplitExpensesMutation,
} = api;
