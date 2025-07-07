import cx from 'clsx';
import { Checkbox, Paper, ScrollArea, Table } from '@mantine/core';
import classes from './TableSelection.module.css';

export interface TableColumn<T> {
    key: keyof T | string;
    header: string;
    render?: (row: T) => React.ReactNode;
}

export interface TableSelectionProps<T extends { id: string }> {
    data: T[];
    columns: TableColumn<T>[];
    selection: string[];
    onSelectionChange: (selected: string[]) => void;
    disableCheckbox?: (item: T) => boolean;
}

export function TableSelection<T extends { id: string }>({
    data,
    columns,
    selection,
    onSelectionChange,
    disableCheckbox,
}: TableSelectionProps<T>) {
    const enabledItems = data.filter((item) => !disableCheckbox?.(item));
    const enabledIds = enabledItems.map((item) => item.id);

    const toggleRow = (id: string) =>
        onSelectionChange(
            selection.includes(id)
                ? selection.filter((item) => item !== id)
                : [...selection, id]
        );

    const toggleAll = () => {
        const allSelected = enabledIds.every((id) => selection.includes(id));

        if (allSelected) {
            onSelectionChange(selection.filter((id) => !enabledIds.includes(id)));
        } else {
            onSelectionChange([...new Set([...selection, ...enabledIds])]);
        }
    };

    const allEnabledSelected = enabledIds.length > 0 && enabledIds.every((id) => selection.includes(id));
    const someEnabledSelected = enabledIds.some((id) => selection.includes(id));

    const rows = data.map((item) => {
        const selected = selection.includes(item.id);
        const isDisabled = disableCheckbox?.(item);

        return (
            <Table.Tr key={item.id} className={cx({ [classes.rowSelected]: selected })}>
                <Table.Td>
                    <Checkbox
                        checked={selected}
                        disabled={isDisabled}
                        onChange={() => toggleRow(item.id)}
                    />
                </Table.Td>

                {columns.map((col) => (
                    <Table.Td key={col.key.toString()}>
                        {col.render ? (
                            col.render(item)
                        ) : (
                            (typeof col.key === 'string' && col.key in item)
                                ? (item[col.key as keyof T] as React.ReactNode)
                                : null
                        )}
                    </Table.Td>
                ))}
            </Table.Tr>
        );
    });

    return (
        <Paper withBorder shadow="sm" radius="md" p="md">
            <ScrollArea>
                <Table
                    miw={800}
                    verticalSpacing="md"
                    className={classes.table}
                    highlightOnHover
                >
                    <Table.Thead>
                        <Table.Tr>
                            <Table.Th w={40}>
                                <Checkbox
                                    onChange={toggleAll}
                                    checked={allEnabledSelected}
                                    indeterminate={!allEnabledSelected && someEnabledSelected}
                                />
                            </Table.Th>
                            {columns.map((col) => (
                                <Table.Th key={col.key.toString()}>{col.header}</Table.Th>
                            ))}
                        </Table.Tr>
                    </Table.Thead>
                    <Table.Tbody>{rows}</Table.Tbody>
                </Table>
            </ScrollArea>
        </Paper>
    );
}