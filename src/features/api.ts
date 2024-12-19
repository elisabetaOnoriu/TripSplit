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
  tagTypes: ['User', 'Trip'],
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
    createTrip: builder.mutation<Api.CreateTripResponse, Api.CreateTripRequest>({
      query: data => ({
        url: 'Trip/create',
        method: 'post',
        data,
      }),
      invalidatesTags: ['Trip'],
    }),
  }),
});

export const { useLoginMutation, useRegisterMutation, useUserQuery, useUpdateUserMutation, useCreateTripMutation } = api;
