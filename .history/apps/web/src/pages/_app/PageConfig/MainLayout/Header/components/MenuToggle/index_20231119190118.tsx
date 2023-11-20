import { forwardRef, memo } from 'react';
import { Group, Indicator, UnstyledButton } from '@mantine/core';

import { accountApi } from 'resources/account';
// import { Link } from 'components';
import NextLink from 'next/link';
import { CartIcon, LogoutIcon } from 'public/icons';
import { RoutePath } from 'routes';

const MenuToggle = forwardRef<HTMLButtonElement>((props, ref) => {
  const { mutate: signOut } = accountApi.useSignOut();

  const { data: account } = accountApi.useGet();

  if (!account) return null;

  return (
    <Group>
      <UnstyledButton ref={ref} {...props}>
        <NextLink
          type="router"
          href={RoutePath.Cart}
        >
          <Indicator account.cart.length ? disabled : inline} label={account.cart.length} size={20}>
            <CartIcon />
          </Indicator>
        </NextLink>
      </UnstyledButton>
      <UnstyledButton onClick={() => signOut()}>
        <LogoutIcon />
      </UnstyledButton>
    </Group>
  );
});

export default memo(MenuToggle);
