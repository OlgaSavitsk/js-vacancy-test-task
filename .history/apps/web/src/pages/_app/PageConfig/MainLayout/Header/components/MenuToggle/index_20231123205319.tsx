import { forwardRef, memo, useState } from 'react';
import { Group, Indicator, UnstyledButton } from '@mantine/core';
import NextLink from 'next/link';

import { accountApi } from 'resources/account';
import { CartIcon, LogoutIcon } from 'public/icons';
import { RoutePath } from 'routes';
import { useRouter } from 'next/router';
import { useStyles } from './styles';

const MenuToggle = forwardRef<HTMLButtonElement>((props, ref) => {
  const { classes } = useStyles();
  const router = useRouter();
  const [active, setActive] = useState(router.pathname);
  const { mutate: signOut } = accountApi.useSignOut();

  const { data: account } = accountApi.useGet();

  if (!account) return null;

  return (
    <Group>
      <UnstyledButton ref={ref} {...props}>
        <NextLink
          type="router"
          href={RoutePath.Cart}
          data-active={active ===  || undefined}
          onClick={(event) => {
            event.preventDefault();
            router.push(link.link);
            setActive(link.link);
          }}
        >
          <Indicator inline disabled={!account.cart.length} label={account.cart.length} size={20}>
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
