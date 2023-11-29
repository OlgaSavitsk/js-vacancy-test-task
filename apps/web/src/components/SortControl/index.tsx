import { FC, memo } from 'react';

import { Select, SelectItem } from '@mantine/core';
import { IconArrowsDownUp, IconChevronDown } from '@tabler/icons-react';

import { useStyles } from './styles';

interface SortProps {
  selectOptions: SelectItem[],
  sortBy: string,
  onChange(val: string | null): void;
}

const SortControl: FC<SortProps> = ({ selectOptions, sortBy, onChange }) => {
  const { classes: { field } } = useStyles();

  return (
    <Select
      size="md"
      data={selectOptions}
      value={sortBy}
      onChange={onChange}
      rightSection={<IconChevronDown color="grey" />}
      icon={<IconArrowsDownUp size={20} color="gray" />}
      classNames={{ root: field }}
      withinPortal={false}
      variant="unstyled"
      transitionProps={{
        transition: 'pop-bottom-right',
        duration: 210,
        timingFunction: 'ease-out',
      }}
    />
  );
};
export default memo(SortControl);
