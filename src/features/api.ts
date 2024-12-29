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
    {
      status: number;
      message: string;
    }
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
                Authorization: `Bearer ${(getState() as RootState).auth.token}`,
              }),
        },
      });

      return { data: result.data };
    } catch (e) {
      const err = e as AxiosError;

      // Either expired token or unauthenticated user
      if (err.response?.status === 401) {
        // Routes which are noop in this case, so we can
        // skip dispatching the actions to speed up the request processing
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

export const api = createApi({
  baseQuery: axiosBaseQuery({
    baseUrl: `https://localhost:7083/api/`,
  }),
  tagTypes: ['User', 'Trip', 'Invitation'], // Added 'Invitation' for invalidation
  endpoints: builder => ({
    login: builder.mutation<Api.LoginResponse, Api.LoginRequest>({
      query: data => ({
        url: 'Authentication/login',
        method: 'post',
        data,
      }),
      invalidatesTags: ['User'],
    }),
    register: builder.mutation<Api.RegisterResponse, Api.RegisterRequest>({
      query: data => ({
        url: 'Authentication/register',
        method: 'post',
        data,
      }),
    }),

    user: builder.query<Api.UserResponse, Api.UserRequest>({
      query: ({ userId }) => ({
        url: `User/get-user-by-id?userId=${userId}`,
        method: 'get',
      }),
      providesTags: ['User'],
    }),
    updateUser: builder.mutation<Api.UpdateUserResponse, Api.UpdateUserRequest>({
      query: data => ({
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
    deleteUser : builder.mutation<Api.DeleteUserResponse, Api.DeleteUserRequest>({
      query: ({ userId }) => ({
        url: `User/delete-user?userId=${userId}`,
        method: 'delete',
      }),
      invalidatesTags: ['User'],
    }),
    createTrip: builder.mutation<Api.CreateTripResponse, Api.CreateTripRequest>({
      query: data => ({
        url: 'Trip/create',
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
      query: data => ({
        url: 'Trip/add-user-to-trip',
        method: 'post',
        data,
      }),
      invalidatesTags: ['Trip'],
    }),
    // same request and response types as addUserToTrip
    setTripOwner: builder.mutation<Api.AddUserToTripResponse, Api.AddUserToTripRequest>({
      query: data => ({
        url: 'Trip/set-trip-owner',
        method: 'post',
        data,
      }),
      invalidatesTags: ['Trip'],
    }),
    recoverPassword: builder.mutation<Api.RecoverPasswordResponse, Api.RecoverPasswordRequest>({
      query: data => ({
        url: 'Authentication/request-password-reset',
        method: 'post',
        data,
      }),
    }),
    resetPassword: builder.mutation<Api.ResetPasswordResponse, Api.ResetPasswordRequest>({
      query: data => ({
        url: 'Authentication/reset-password',
        method: 'post',
        data,
      }),
    }),

    // New Endpoints for Invitations
    getUserInvitations: builder.query<Api.Invitation[], string>({
      query: userId => ({
        url: `Invitation/get-user-invitations?userId=${userId}`,
        method: 'get',
      }),
      providesTags: ['Invitation'],
    }),
    inviteUser: builder.mutation<void, Api.InviteUserRequest>({
      query: data => ({
        url: 'Invitation/invite-by-email',
        method: 'post',
        data,
      }),
      invalidatesTags: ['Invitation'],
    }),
    respondToInvitation: builder.mutation<void, Api.RespondToInvitationRequest>({
      query: data => ({
        url: `Invitation/${data.isAccepted ? 'accept' : 'reject'}`,
        method: 'post',
        data,
      }),
      invalidatesTags: ['Invitation', 'Trip'],
    }),
  }),
});

export const {
  useLoginMutation,
  useRegisterMutation,
  useUserQuery,
  useUpdateUserMutation,
  useCreateTripMutation,
  useRecoverPasswordMutation,
  useResetPasswordMutation,
  useTripHistoryQuery,
  useGetUserInvitationsQuery, // Hook for fetching user invitations
  useInviteUserMutation, // Hook for sending invitations
  useRespondToInvitationMutation, // Hook for accepting/rejecting invitations
  useAddUserToTripMutation,
  useSetTripOwnerMutation,
  useGetAllUsersQuery,
  useDeleteUserMutation,
} = api;
