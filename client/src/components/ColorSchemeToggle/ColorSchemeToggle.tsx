import { ActionIcon, useMantineColorScheme, useComputedColorScheme } from '@mantine/core';
import { IconMoon, IconSun } from '@tabler/icons-react';
import classes from './ColorSchemeToggle.module.css';

export const ColorSchemeToggle = () => {
  const { setColorScheme } = useMantineColorScheme();
  const computedColorScheme = useComputedColorScheme('light', { getInitialValueInEffect: true });

  return (
    <ActionIcon
      onClick={() => setColorScheme(computedColorScheme === 'light' ? 'dark' : 'light')}
      variant="default"
      size="xl"
      aria-label="Toggle color scheme"
      className={classes.iconButton}
    >
      {computedColorScheme === 'light' ? <IconMoon size={20} /> : <IconSun size={20} />}
    </ActionIcon>
  );
};