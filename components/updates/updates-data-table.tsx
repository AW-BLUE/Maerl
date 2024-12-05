'use client';

import { useQuery } from '@tanstack/react-query';
import {
  ColumnFiltersState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getSortedRowModel,
  SortingState,
  useReactTable,
} from '@tanstack/react-table';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { useState } from 'react';
import { columns } from './updates-table-columns';
import { fetchUpdates } from './server-actions';
import ColumnFilter from '../data-tables/column-filter';
import SetDateRange from '../date-filtering/set-date-range';
import useUrlDateState from '../date-filtering/use-url-date-state';
import CopyToCsvButton from '../data-tables/export-data';
import { flattenUpdates } from './flatten-updates';
export default function UpdatesDataTable() {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);

  const dateRange = useUrlDateState();

  const { data, error } = useQuery({
    queryKey: ['updates', dateRange],
    queryFn: () => fetchUpdates(dateRange),
  });

  const table = useReactTable({
    data: data ?? [],
    columns: columns,
    getCoreRowModel: getCoreRowModel(),
    onSortingChange: setSorting,
    getSortedRowModel: getSortedRowModel(),
    onColumnFiltersChange: setColumnFilters,
    getFilteredRowModel: getFilteredRowModel(),
    state: {
      sorting,
      columnFilters,
    },
  });

  if (error) {
    return <p>{error.message}</p>;
  }

  if (!data) {
    return (
      <p className='flex h-[500px] w-full items-center justify-center'>
        Loading updates...
      </p>
    );
  }

  if (data) {
    return (
      <div className='flex flex-col gap-4'>
        <div className='flex items-center justify-between gap-4'>
          <div className='flex items-center justify-start gap-4'>
            <p>Filter by:</p>
            <ColumnFilter table={table} columnId='project' label='Project' />
            <ColumnFilter
              table={table}
              columnId='impact_indicator'
              label='Impact Indicator'
            />
            <ColumnFilter table={table} columnId='type' label='Update Type' />
            <SetDateRange />
          </div>

          <div className='flex items-center gap-4'>
            <p>{data.length} updates</p>
            <CopyToCsvButton data={flattenUpdates(data)} />
          </div>
        </div>
        <div className='rounded-md border'>
          <Table className='overflow-x-auto'>
            <TableHeader>
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow key={headerGroup.id}>
                  {headerGroup.headers.map((header) => (
                    <TableHead
                      key={header.id}
                      onClick={header.column.getToggleSortingHandler()}
                      className='cursor-pointer text-xs'
                    >
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext(),
                          )}
                    </TableHead>
                  ))}
                </TableRow>
              ))}
            </TableHeader>
            <TableBody>
              {table.getRowModel().rows?.length ? (
                table.getRowModel().rows.map((row) => (
                  <TableRow
                    key={row.id}
                    data-state={row.getIsSelected() && 'selected'}
                  >
                    {row.getVisibleCells().map((cell) => (
                      <TableCell key={cell.id} className='text-xs'>
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext(),
                        )}
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell
                    colSpan={columns.length}
                    className='h-24 text-center'
                  >
                    No updates match the selected filters
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </div>
    );
  }
}
