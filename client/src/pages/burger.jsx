import { useDisclosure } from '@mantine/hooks';
import { Burger } from '@mantine/core';

function BurgerPage() {
  const [opened, { toggle }] = useDisclosure();
  return <Burger size="xl" opened={opened} onClick={toggle} aria-label="Toggle navigation" />;
}

export default BurgerPage;