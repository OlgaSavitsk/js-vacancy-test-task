import { FC, ReactElement } from 'react';

import { SimpleGrid, MediaQuery, Stack, Title, Text, Avatar, Image, Group, rem } from '@mantine/core';

import { LogoImage } from 'public/images';
import { useStyles } from './styles';

interface UnauthorizedLayoutProps {
  children: ReactElement;
}

const imagedata = [
  { src: '/images/card.png' },
  { src: '/images/card-1.png' },
];

const UnauthorizedLayout: FC<UnauthorizedLayoutProps> = ({ children }) => {
  const { classes } = useStyles();

  const imageLinks = imagedata.map(({ src }, index) => (
    <Image
      pos="absolute"
      r
      src={src}
      sx={{
        transform: index === 0 ? 'rotate(-15deg)' : 'rotate(15deg)',
        bottom: 30,
        right: index === 0 ? 'none' : 0,
        height: rem(132),
        width: rem(100),
        zIndex: 0,
      }}
    />
  ));

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
        }}
        >
          <LogoImage />
          <Group
            w={448}
            h={300}
            sx={{
              position: 'relative',
              alignSelf: 'center',
            }}
          >
            <Image
              src="/images/shop.png"
              sx={{
                maxWidth: rem(448),
                height: rem(300),
                zIndex: 1,
              }}
            />
            {imageLinks}
            {/* <Image pos="absolute" bottom={0} h={132} src="/images/card.png" />
            <Image
              pos="absolute"
              src="/images/card-1.png"
              sx={{
                transform: 'rotate(15deg)',
                bottom: 30,
                right: 0,
                height: rem(132),
                width: rem(100),
                zIndex: 0,
              }}
            /> */}
          </Group>
          <Title order={2}>Sell and buy products super quickly!</Title>
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
