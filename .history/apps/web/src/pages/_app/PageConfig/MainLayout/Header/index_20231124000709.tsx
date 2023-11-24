import { memo, FC } from 'react';
import { Header as LayoutHeader, Container } from '@mantine/core';

import { accountApi } from 'resources/account';
import { Link } from 'components';
import { RoutePath } from 'routes';
import { LogoImage } from 'public/images';
import UserMenu from './components/UserMenu';
import MenuToggle from './components/MenuToggle';

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
          backgroundColor: '#FCFCFC',
        })}
        fluid
      >
        <Link type="router" href={RoutePath.Home}>
          <LogoImage />
        </Link>
        <UserMenu />
        <MenuToggle />
      </Container>
    </LayoutHeader>
  );
};

export default memo(Header);
