import Link from 'next/link';
import { memo, FC } from 'react';
import { Menu } from '@mantine/core';
import { IconUserCircle, IconLogout } from '@tabler/icons-react';

import { accountApi } from 'resources/account';

import { RoutePath } from 'routes';

import MenuToggle from '../MenuToggle';

const UserMenu: FC = () => {
  const { mutate: signOut } = accountApi.useSignOut();
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
