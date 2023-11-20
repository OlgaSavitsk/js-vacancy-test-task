import { FC, ReactElement } from 'react';

import { SimpleGrid, MediaQuery, Stack, Title, Text, Avatar, Image, Group } from '@mantine/core';

import { LogoImage } from 'public/images';
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
          backgroundColor: '#F4F4F4',
          justifyContent: 'flex-end',
          alignItems: 'center',
        }}
        >
          <LogoImage />
          <Group
            w={448}
            h={300}
            sx={{
              position: 'relative',
              justifyContent: 'center',
            }}
          >
            <Image maw={448} mx="auto" h={300} fit="contain" src="/images/shop.png" />
            <Image p="absolute" bottom={0} h={132} src="/images/card.png" />
            <Image p="absolute" top={0} h={132} w={100} src="/images/card-1.png" />
          </Group>
          <Title order={1}>Sell and buy products super quickly!</Title>
          <Text
            component="p"
            fz="lg"
            sx={(theme) => ({
              color: theme.colors.gray[5],
              margin: '20px 0 24px',
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
