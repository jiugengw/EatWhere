import { ActionIcon } from '@mantine/core';
import { IconMoon, IconSun } from '@tabler/icons-react';
import { useEffect, useState } from 'react';
import classes from './ColorSchemeToggle.module.css';

export function ColorSchemeToggle() {
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    if (darkMode) {
      document.body.classList.add('dark-mode');
    } else {
      document.body.classList.remove('dark-mode');
    }
  }, [darkMode]);

  return (
    <ActionIcon
      variant="transparent"
      size="lg"
      className={classes.iconButton}
      onClick={() => setDarkMode(!darkMode)}
      title="Toggle theme"
    >
      {darkMode ? <IconSun size={22} /> : <IconMoon size={22} />}
    </ActionIcon>
  );
}
