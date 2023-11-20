import queryClient from 'query-client';
import { useMutation, useQuery } from 'react-query';
import { apiService } from 'services';
import { Products } from 'types';

export function useGet(options?: {}) {
  const get = () => apiService.get('/account');

  interface ProductsListResponse {
    products: Products[];
  }

  return useQuery<ProductsListResponse>(['products'], get, options);
}

export function useList<T>(params: T) {
  const list = () => apiService.get('/products', params);

  interface ProductsListResponse {
    products: Products[];
    count: number;
    totalPages: number;
  }

  return useQuery<ProductsListResponse>(['products', params], list);
}

export function useCreate<T>() {
  const create = (data: T) => apiService.post('/products', data);

  return useMutation<Products, unknown, T>(create, {
    onSuccess: (data) => {
      queryClient.setQueryData(['products'], data);
    },
  });
}

export function useRemoveProduct() {
  const removeProduct = (id: string) => apiService.delete(`/products/${id}`);

  return useMutation<Products, unknown, string>(removeProduct, 
  //   {
  //   onSuccess: (data) => {
  //     queryClient.setQueryData(['products'], data);
  //   },
  // }
  );
}

export function usePaymentProduct<T>() {
  const payment = (products: T) => apiService.post('/products/payment', { products });

  return useMutation<any, unknown, T>(payment);
}
