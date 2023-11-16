import { useMutation, useQuery } from 'react-query';

import { Products, User } from 'types';

import { apiService } from 'services';
import queryClient from 'query-client';

export function useList<T>(params: T) {
  const list = () => apiService.get('/users', params);

  interface UserListResponse {
    count: number;
    items: User[];
    totalPages: number;
  }

  return useQuery<UserListResponse>(['users', params], list);
}

export function useAddToCart<T>() {
  const addToCart = (data: T) => apiService.post('/users/cart', data);

  return useMutation<Products, unknown, T>(addToCart, {
    onSuccess: (data) => {
      queryClient.setQueryData(['cart'], data);
    },
  });
}

export function useRemoveFromCart() {
  const removeFromCart = (id: string) => apiService.delete(`/users/cart/${id}`);

  return useMutation<Products, unknown, string>(removeFromCart, {
    onSuccess: (data) => {
      queryClient.setQueryData(['cart'], data);
    },
  });
}

export function useUpdate<T>() {
  const update = ({ _id, quantity }: Products) => apiService.put(`/users/cart/${_id}`, { quantity });

  return useMutation<T, unknown, Products>(update, {
    onSuccess: (data) => {
      queryClient.setQueryData(['cart'], data);
    },
  });
}
