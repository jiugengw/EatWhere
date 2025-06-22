import React from "react";
import { useDisclosure } from "@mantine/hooks";
import { Burger, Drawer, Button } from "@mantine/core";

function BurgerPage() {
  const [opened, { open, close, toggle }] = useDisclosure(false);
  return (
    <>
      <Drawer opened={opened} onClose={close} title="Authentication"></Drawer>

      <Button variant="default" onClick={toggle}>
        Open Drawer
      </Button>
    </>
  );
}

export default BurgerPage;
