import { memo, FC } from 'react';
import { useRouter } from 'next/router';
import NextLink from 'next/link';

import { Burger, Group, Paper, Transition } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';

import { RoutePath } from 'routes';
import { useStyles } from './styles';
import { Link } from 'components';

const links = [
  { link: RoutePath.Home, label: 'Marketplace' },
  { link: RoutePath.Products, label: 'Your Products' },
];

const UserMenu: FC = () => {
  const [opened, { toggle: toggleDrawer }] = useDisclosure(false);
  const { classes, cx } = useStyles();
  const router = useRouter();

  const menuItems = links.map((link) => (
    <Link
      type="router"
      key={link.label}
      href={link.link}
      className={classes.link}
      data-active={router.pathname === link.link || undefined}
      onClick={(event) => {
        event.preventDefault();
        router.push(link.link);
      }}
    >
      {link.label}
    </Link>
  ));

  return (
    <>
      <Group className={cx(classes.hiddenMobile, classes.menu)}>
        {menuItems}
      </Group>
      <Burger
        opened={opened}
        onClick={toggleDrawer}
        className={classes.hiddenDesktop}
      />
      <Transition transition="pop-top-right" duration={200} mounted={opened}>
        {(styles) => (
          <Paper className={classes.dropdown} withBorder style={styles}>
            {menuItems}
          </Paper>
        )}
      </Transition>
    </>

  );
};

export default memo(UserMenu);
