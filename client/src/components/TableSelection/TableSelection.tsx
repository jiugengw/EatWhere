import { useState } from 'react';
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
};

export function TableSelection<T extends { id: string }>({
    data,
    columns,
}: TableSelectionProps<T>) {
    const [selection, setSelection] = useState<string[]>([]);

    const toggleRow = (id: string) =>
        setSelection((current) =>
            current.includes(id) ? current.filter((item) => item !== id) : [...current, id]
        );

    const toggleAll = () =>
        setSelection((current) => (current.length === data.length ? [] : data.map((item) => item.id)));

    const rows = data.map((item) => {
        const selected = selection.includes(item.id);
        return (
            <Table.Tr key={item.id} className={cx({ [classes.rowSelected]: selected })}>
                <Table.Td>
                    <Checkbox checked={selected} onChange={() => toggleRow(item.id)} />
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
            <Table miw={800} verticalSpacing="sm">
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