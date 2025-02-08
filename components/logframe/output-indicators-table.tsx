'use client';

import { useState } from 'react';
import { OutputMeasurable } from '@/utils/types';

import ActionButton from '@/components/ui/action-button';
import { Badge } from '@/components/ui/badge';
import {
  flexRender,
  getCoreRowModel,
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
import OutputMeasurableForm from './output-measurable-form';

export default function OutputIndicatorsTable({
  measurables,
  outputId,
  projectId,
}: {
  measurables: OutputMeasurable[];
  outputId: number;
  projectId: number;
}) {
  const [isMeasurableDialogOpen, setIsMeasurableDialogOpen] = useState(false);
  const [selectedMeasurable, setSelectedMeasurable] =
    useState<OutputMeasurable | null>(null);

  const handleEditMeasurable = (measurable: OutputMeasurable) => {
    setSelectedMeasurable(measurable);
    setIsMeasurableDialogOpen(true);
  };

  const handleCloseMeasurableDialog = () => {
    setIsMeasurableDialogOpen(false);
    setSelectedMeasurable(null);
  };

  const handleAddMeasurable = () => {
    if (measurables) {
      const nextIndex = (measurables.length || 0) + 1;
      const nextCode = `OP0.${nextIndex}`;
      setSelectedMeasurable({ code: nextCode } as OutputMeasurable);
      setIsMeasurableDialogOpen(true);
    }
  };

  const columns = [
    {
      accessorKey: 'description',
      header: 'Measurable Indicator',
      cell: ({ row }: { row: any }) => {
        return (
          <div className='flex flex-row gap-4'>
            <div className='mt-1'>
              <Badge className='bg-slate-800 py-1.5 font-medium'>
                {row.original.code}
              </Badge>
            </div>
            <p className='text-sm'>{row.getValue('description')}</p>
          </div>
        );
      },
      size: 400,
    },
    {
      accessorKey: 'verification',
      header: 'Verification',
      size: 200,
    },
    {
      accessorKey: 'assumptions',
      header: 'Assumptions',
      size: 200,
    },
    {
      accessorKey: 'target',
      header: 'Target',
      size: 200,
    },
    {
      accessorKey: 'impact_indicator_id',
      header: 'Impact Indicator',
      cell: ({ row }: { row: any }) => {
        return (
          <p
            title={row.original.impact_indicators?.indicator_title}
            className='hover:cursor-help'
          >
            {row.original.impact_indicators?.indicator_code}
          </p>
        );
      },
    },
    {
      id: 'actions',
      cell: ({ row }: { row: any }) => (
        <div className='flex justify-end'>
          <ActionButton
            action='edit'
            variant='icon'
            onClick={() => handleEditMeasurable(row.original)}
          />
        </div>
      ),
      size: 10,
    },
  ];

  const table = useReactTable({
    data: measurables,
    columns,
    getCoreRowModel: getCoreRowModel(),
    columnResizeMode: 'onChange',
  });

  if (!measurables) {
    return <div>Loading...</div>;
  }

  return (
    <>
      {measurables.length === 0 ? (
        <div className='flex items-center justify-center rounded-md border border-dashed p-12'>
          <ActionButton
            action='add'
            label='Add output indicator'
            onClick={handleAddMeasurable}
          />
        </div>
      ) : (
        <div className='flex w-full flex-col items-start gap-4'>
          <div className='w-full rounded-md border'>
            <Table style={{ width: '100%' }}>
              <TableHeader>
                {table.getHeaderGroups().map((headerGroup) => (
                  <TableRow key={headerGroup.id}>
                    {headerGroup.headers.map((header) => (
                      <TableHead
                        key={header.id}
                        style={{
                          width: header.column.getSize(),
                        }}
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
                {table.getRowModel().rows.map((row) => (
                  <TableRow key={row.id}>
                    {row.getVisibleCells().map((cell) => (
                      <TableCell
                        key={cell.id}
                        className='text-left align-top'
                        style={{
                          width: cell.column.getSize(),
                        }}
                      >
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext(),
                        )}
                      </TableCell>
                    ))}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
          <div className='flex w-full flex-row items-center justify-start'>
            <ActionButton
              action='add'
              label='Add output indicator'
              onClick={handleAddMeasurable}
            />
          </div>
        </div>
      )}

      <OutputMeasurableForm
        isOpen={isMeasurableDialogOpen}
        onClose={handleCloseMeasurableDialog}
        measurable={selectedMeasurable}
        outputId={outputId}
        projectId={projectId}
      />
    </>
  );
}
