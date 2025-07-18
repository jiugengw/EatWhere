import {
    Paper,
    Stack,
    Flex,
    Title,
    Badge,
    Menu,
    ActionIcon,
    Text,
    Group,
    Button
} from '@mantine/core';
import {
    IconUsers,
    IconDotsVertical,
    IconEye,
    IconTrash
} from '@tabler/icons-react';
import { Link } from '@tanstack/react-router';
import classes from './GroupCard.module.css';

interface GroupCardProps {
    group: {
        _id: string;
        name: string;
        userCount: number;
    };
    onLeaveGroup: (groupId: string, groupName: string, userCount: number) => void;
    colorIndex: number;
}

const cardColors = [
    { primary: '#FF8C42', secondary: 'rgba(255, 140, 66, 0.1)', badgeColor: '#FF8C42' }, 
    { primary: '#4285f4', secondary: 'rgba(66, 133, 244, 0.1)', badgeColor: '#4285f4' }, 
    { primary: '#34a853', secondary: 'rgba(52, 168, 83, 0.1)', badgeColor: '#34a853' },  
    { primary: '#ea4335', secondary: 'rgba(234, 67, 53, 0.1)', badgeColor: '#ea4335' },   
    { primary: '#9c27b0', secondary: 'rgba(156, 39, 176, 0.1)', badgeColor: '#9c27b0' }, 
    { primary: '#ff9800', secondary: 'rgba(255, 152, 0, 0.1)', badgeColor: '#ff9800' }, 
];

export const GroupCard = ({ group, onLeaveGroup, colorIndex }: GroupCardProps) => {
    const colors = cardColors[colorIndex % cardColors.length];

    return (
        <Paper
            withBorder
            radius="md"
            p="lg"
            className={classes.groupCard}
            style={{
                '--card-primary': colors.primary,
                '--card-secondary': colors.secondary,
                '--badge-color': colors.badgeColor,
            } as React.CSSProperties}
        >
            <Stack gap="md">
                <Flex justify="space-between" align="flex-start">
                    <div className={classes.groupInfo}>
                        <Title order={4} className={classes.groupName}>
                            {group.name}
                        </Title>
                        <Badge
                            variant="light"
                            leftSection={<IconUsers size={12} />}
                            className={classes.memberBadge}
                        >
                            {group.userCount} {group.userCount === 1 ? 'member' : 'members'}
                        </Badge>
                    </div>

                    <Menu shadow="md" width={180}>
                        <Menu.Target>
                            <ActionIcon variant="subtle" className={classes.menuButton}>
                                <IconDotsVertical size={16} />
                            </ActionIcon>
                        </Menu.Target>
                        <Menu.Dropdown>
                            <Menu.Item
                                component={Link}
                                to={`/group/${group._id}`}
                                leftSection={<IconEye size={14} />}
                            >
                                View Details
                            </Menu.Item>
                            <Menu.Divider />
                            <Menu.Item
                                color="red"
                                leftSection={<IconTrash size={14} />}
                                onClick={() => onLeaveGroup(group._id, group.name, group.userCount)}
                            >
                                {group.userCount === 1 ? 'Delete Group' : 'Leave Group'}
                            </Menu.Item>
                        </Menu.Dropdown>
                    </Menu>
                </Flex>

                <Group justify="space-between" mt="auto" className={classes.cardFooter}>
                    <Text size="sm" className={classes.exploreText}>
                        Click to view →
                    </Text>
                    <Button
                        component={Link}
                        to={`/group/${group._id}`}
                        size="sm"
                        radius="xl"
                        className={classes.openButton}
                    >
                        Open
                    </Button>
                </Group>
            </Stack>
        </Paper>
    );
};