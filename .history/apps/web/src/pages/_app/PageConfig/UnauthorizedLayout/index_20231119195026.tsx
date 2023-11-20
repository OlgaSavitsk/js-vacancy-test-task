import { FC, ReactElement } from 'react';

import { SimpleGrid, Image, MediaQuery, Stack, Title, Text, Avatar } from '@mantine/core';

import { useStyles } from './styles';

interface UnauthorizedLayoutProps {
  children: ReactElement;
}

const UnauthorizedLayout: FC<UnauthorizedLayoutProps> = ({ children }) => {
  const { classes } = useStyles();

  return (
    <SimpleGrid
      cols={2}
      breakpoints={[
        { maxWidth: 'sm', cols: 1, spacing: 'sm' },
      ]}
    >

      <div className={classes.wrapper}>
        <main className={classes.content}>
          {children}
        </main>
      </div>

      <MediaQuery
        smallerThan="sm"
        styles={{ display: 'none' }}
      >
        <Stack sx={{
          height: '100vh',
          display: 'flex',
          margin: 'auto',
          // alignItems: 'start',
        }}
        >
          <
          <Title order={2}>Sell and buy products super quickly!</Title>
          <Text
            component="p"
            sx={(theme) => ({
              color: theme.colors.gray[5],
              margin: '20px 0 24px',
              // textAlign: 'center',
            })}
          >
            Save your time, we take care of all the processing.
          </Text>
          <Avatar.Group spacing="sm">
            <Avatar src="/images/avatar.png" radius="xl" />
            <Avatar src="/images/avatar-1.png" radius="xl" />
            <Avatar src="/images/avatar-2.png" radius="xl" />
            <Avatar src="/images/avatar-3.png" radius="xl" />
            <Avatar src="/images/avatar-4.png" radius="xl" />
            <Avatar>+100 users from all over the world</Avatar>
          </Avatar.Group>
        </Stack>
      </MediaQuery>

    </SimpleGrid>
  );
};

export default UnauthorizedLayout;
