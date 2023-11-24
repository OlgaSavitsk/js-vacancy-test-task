import { memo, FC, useState } from 'react';
import { Header as LayoutHeader, Container } from '@mantine/core';
import NextLink from 'next/link';

import { accountApi } from 'resources/account';
import { Link } from 'components';
import { RoutePath } from 'routes';
import { LogoImage } from 'public/images';
import { useRouter } from 'next/router';
import UserMenu from './components/UserMenu';
import MenuToggle from './components/MenuToggle';
import { useStyles } from './styles';

const links = [
  { link: RoutePath.Home, label: 'Marketplace', className: 'link' },
  { link: RoutePath.Products, label: 'Your Products', className: 'link' },
  { link: RoutePath.Cart, label: <MenuToggle />, className: 'cart' },
];

const Header: FC = () => {
  const { data: account } = accountApi.useGet();

  if (!account) return null;

  return (
    <LayoutHeader height="72px">
      <Container
        sx={(theme) => ({
          minHeight: '72px',
          padding: '0 32px',
          display: 'flex',
          flex: '1 1 auto',
          alignItems: 'center',
          justifyContent: 'space-between',
          backgroundColor: theme.white,
        })}
        fluid
      >
        <Link type="router" href={RoutePath.Home}>
          <LogoImage />
        </Link>
        <UserMenu />
        <MenuToggle />
        {/* {menuItems} */}
      </Container>
    </LayoutHeader>
  );
};

export default memo(Header);
