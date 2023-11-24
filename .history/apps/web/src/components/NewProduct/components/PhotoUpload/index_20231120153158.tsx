import { memo, useState } from 'react';
import { Group, Button, Stack, FileButton, Image, Skeleton } from '@mantine/core';
import { FileWithPath } from '@mantine/dropzone';

import { accountApi } from 'resources/account';
import { handleError } from 'utils';

import { DefaultPhotoIcon } from 'public/icons';
import { useStyles } from './styles';

interface PhotoUploadProps {
  onUpload: (photoUrl: string) => void
  error: string | undefined
}

const PhotoUpload = ({ onUpload, error }: PhotoUploadProps) => {
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [photoUrl, setPhotoUrl] = useState<string | null>(null);
  const { classes } = useStyles();

  const { data: account } = accountApi.useGet();

  const {
    mutate: uploadProfilePhoto,
    isLoading: isuploadAvatarLoading } = accountApi.useUploadAvatar<FormData>();
  const { mutate: removeProfilePhoto } = accountApi.useRemoveAvatar();

  if (!account) return null;

  const isFileSizeCorrect = (file: any) => {
    const oneMBinBytes = 1048576;
    if ((file.size / oneMBinBytes) > 2) {
      setErrorMessage('Sorry, you cannot upload a file larger than 2 MB.');
      return false;
    }
    return true;
  };

  const isFileFormatCorrect = (file: FileWithPath) => {
    if (['image/png', 'image/jpg', 'image/jpeg'].includes(file.type)) return true;
    setErrorMessage('Sorry, you can only upload JPG, JPEG or PNG photos.');
    return false;
  };

  const handlePhotoUpload = async ([imageFile]: FileWithPath[]) => {
    setErrorMessage(null);

    if (isFileFormatCorrect(imageFile) && isFileSizeCorrect(imageFile) && imageFile) {
      const body = new FormData();
      body.append('file', imageFile, imageFile.name);

      await uploadProfilePhoto(body, {
        onSuccess: (response: any) => {
          if (response.photoUrl) setPhotoUrl(response.photoUrl);
          onUpload(response.photoUrl);
        },
        onError: (err) => handleError(err),
      });
    }
  };

  const handlerPhotoRemove = async () => {
    setErrorMessage(null);
    await removeProfilePhoto({ photoUrl }, {
      onSuccess: (response: any) => {
        if (response.photoUrl) {
          setPhotoUrl(response.photoUrl);
          onUpload(response.photoUrl);
        } else setPhotoUrl(null);
      },
    });
  };

  return (
    <>
      <Stack>
        <Group align="center" spacing={32}>
          <Stack align="flex-start" spacing={10}>

            <div className={classes.avatar}>
              <Skeleton
                height={180}
                radius="lg"
                visible={isuploadAvatarLoading}
                width="auto"
              >
                {photoUrl ? (
                  <Image
                    height={180}
                    radius="lg"
                    src={photoUrl}
                  />
                ) : <DefaultPhotoIcon />}
              </Skeleton>
            </div>
            {photoUrl && (
              <Button
                type="submit"
                variant="subtle"
                onClick={handlerPhotoRemove}
                size="sm"
              >
                Remove
              </Button>
            )}
          </Stack>
          <Stack spacing={4}>
            <FileButton
              onChange={handlePhotoUpload}
              accept="image/png,image/jpeg,image/jpg"
              multiple
            >
              {(props) => (
                <Button
                  variant="outline"
                  color="gray"
                  radius="md"
                  size="sm"
                  {...props}
                >
                  Upload Photo
                </Button>
              )}
            </FileButton>
          </Stack>
        </Group>
      </Stack>
      {!!errorMessage || error) && <p className={classes.errorMessage}>{errorMessage}</p>}
    </>
  );
};

export default memo(PhotoUpload);
