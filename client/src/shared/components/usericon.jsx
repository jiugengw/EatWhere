import React from "react";
import { Popover, Text, Box } from "@mantine/core";
import { IconUserCircle } from "@tabler/icons-react";

import ProfileCard from "../UIelements/profilecard";

export default function Usericon() {
  return (
    <Popover
      width={200}
      position="bottom"
      withArrow
      shadow="md"
      openDelay={100}
      closeDelay={200}
      transitionProps={{ transition: "fade" }}
      trigger="hover"
    >
      <Popover.Target>
        <Box>
          <IconUserCircle
            size={32}
            stroke={1.5}
            style={{ cursor: "pointer" }}
          />
        </Box>
      </Popover.Target>
      <Popover.Dropdown>
        <ProfileCard/>
      </Popover.Dropdown>
    </Popover>
  );
}
