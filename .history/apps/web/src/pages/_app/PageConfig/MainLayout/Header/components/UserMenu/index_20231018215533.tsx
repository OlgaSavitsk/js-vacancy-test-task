import { memo, FC, useState } from 'react';
import { Burger, Group, Paper, Transition } from '@mantine/core';

import { useDisclosure } from '@mantine/hooks';
import { useRouter } from 'next/router';
import { RoutePath } from 'routes';
import NextLink from 'next/link';

const links = [
  { link: RoutePath.Home, label: 'Marketplace' },
  { link: RoutePath.Products, label: 'Your Products' },
];

const UserMenu: FC = () => {
  // const { mutate: signOut } = accountApi.useSignOut();
  const [opened, { toggle: toggleDrawer }] = useDisclosure(false);
  const { classes, cx } = useStyles();
  const router = useRouter();
  const [active, setActive] = useState(router.pathname);

  const menuItems = links.map((link) => (
    <NextLink
      type="router"
      key={link.label}
      href={link.link}
      className={classes.link}
      data-active={active === link.link || undefined}
      onClick={(event) => {
        event.preventDefault();
        router.push(link.link);
        setActive(link.link);
      }}
    >
      {link.label}
    </NextLink>
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