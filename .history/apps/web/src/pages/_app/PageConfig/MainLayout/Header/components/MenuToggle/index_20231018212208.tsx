import { forwardRef, memo } from 'react';
import { Group, Indicator, UnstyledButton } from '@mantine/core';

import { accountApi } from 'resources/account';
import { Link } from 'components';
import { CartIcon, LogoutIcon } from 'public/icons';
import { RoutePath } from 'routes';

const MenuToggle = forwardRef<HTMLButtonElement>((props, ref) => {
  const { mutate: signOut } = accountApi.useSignOut();

  const { data: account } = accountApi.useGet();

  if (!account) return null;

  return (
    <Group>
      <UnstyledButton ref={ref} {...props}>
        <Link
          type="router"
          href={RoutePath.SignIn}
          inherit
          underline={false}
        >
          <Indicator inline label={1} size={20}>
            <CartIcon />
          </Indicator>
        </Link>
      </UnstyledButton>
      <UnstyledButton onClick={() => signOut()}>
        <LogoutIcon />
      </UnstyledButton>
    </Group>
  );
});

export default memo(MenuToggle);
