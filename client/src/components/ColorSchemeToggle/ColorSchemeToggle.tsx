import { IconMoon, IconSun } from '@tabler/icons-react';
import cx from 'clsx';
import {
  ActionIcon,
  useComputedColorScheme,
  useMantineColorScheme,
} from '@mantine/core';
import classes from './ColorSchemeToggle.module.css';

export function ColorSchemeToggle() {
  const { setColorScheme } = useMantineColorScheme();
  const computedColorScheme = useComputedColorScheme('light', {
    getInitialValueInEffect: true,
  });

  return (
    <div className={classes.icon}>
        <ActionIcon
          onClick={() =>
            setColorScheme(computedColorScheme === 'light' ? 'dark' : 'light')
          }
          variant="transparent"
          size="l"
          radius="md"
          aria-label="Toggle color scheme"
        >
          <IconSun className={cx(classes.light)} stroke={1.5} />
          <IconMoon className={cx(classes.dark)} stroke={1.5} />
        </ActionIcon>
    </div>
  );
}
