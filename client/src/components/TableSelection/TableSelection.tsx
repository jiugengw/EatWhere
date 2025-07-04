import cx from 'clsx';
import { Checkbox, ScrollArea, Table } from '@mantine/core';
import classes from './TableSelection.module.css';

type TableSelectionProps<T> = {
    data: T[];
    columns: {
        key: keyof T | string;
        header: string;
        render?: (item: T) => React.ReactNode;
    }[];
    selection: string[];
    onSelectionChange: (selection: string[]) => void;
    disableCheckbox?: (row: T) => boolean;
};

export function TableSelection<T extends { id: string }>({
    data,
    columns,
    selection,
    onSelectionChange,
    disableCheckbox,
}: TableSelectionProps<T>) {
    const toggleRow = (id: string) =>
        onSelectionChange(
            selection.includes(id)
                ? selection.filter((item) => item !== id)
                : [...selection, id]
        );

    const toggleAll = () =>
        onSelectionChange(
            selection.length === data.length ? [] : data.map((item) => item.id)
        );

    const rows = data.map((item) => {
        const selected = selection.includes(item.id);
        return (
            <Table.Tr key={item.id} className={cx({ [classes.rowSelected]: selected })}>
                <Table.Td>
                    <Checkbox checked={selected}
                        disabled={disableCheckbox?.(item)}
                        onChange={() => toggleRow(item.id)}
                    />
                </Table.Td>

                {columns.map((col) => (
                    <Table.Td key={col.key.toString()}>
                        {col.render ? col.render(item) : (item[col.key as keyof T] as React.ReactNode)}
                    </Table.Td>
                ))}
            </Table.Tr>
        );
    });

    return (
        <ScrollArea>
            <Table miw={800} verticalSpacing="sm" className={classes.table}>
                <Table.Thead>
                    <Table.Tr>
                        <Table.Th w={40}>
                            <Checkbox
                                onChange={toggleAll}
                                checked={selection.length === data.length}
                                indeterminate={selection.length > 0 && selection.length !== data.length}
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
    );
}