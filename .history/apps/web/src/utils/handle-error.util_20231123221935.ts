import { showNotification } from '@mantine/notifications';
import { UseFormSetError } from 'react-hook-form';

export default function handleError(e: any, setError?: UseFormSetError<any>) {
  const { errors: { global, ...errors } } = e.data;
  console.log(errors);

  if (global) {
    showNotification({
      title: 'Error',
      message: global,
      color: 'red',
    });
  }

  if (setError) {
    Object.keys(errors).forEach((key) => {
      const message = errors[key].join(' ');
      showNotification({
        title: 'Error',
        message,
        color: 'red',
      });
      setError(key, { message }, { shouldFocus: true });
    });
  }
}
