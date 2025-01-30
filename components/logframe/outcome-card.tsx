'use client';

import { useState } from 'react';
import { Outcome, Output } from '@/utils/types';
import FeatureCard from '@/components/ui/feature-card';
import OutcomeForm from './outcome-form';
import ActionButton from '@/components/ui/action-button';
import { Badge } from '@/components/ui/badge';
import OutcomeMeasurableCard from './outcome-measurable-card';

export default function OutcomeCard({
  canEdit = false,
  outcome,
  outputs,
  projectId,
}: {
  /** Enables the Add Impact and Edit Impact buttons*/
  canEdit?: boolean;
  outcome: Outcome | null;
  outputs: Output[];
  projectId: number;
}) {
  const [isOutcomeDialogOpen, setIsOutcomeDialogOpen] = useState(false);

  return (
    <div className='relative flex flex-col gap-8'>
      {!outcome && canEdit && (
        <FeatureCard title='Outcome' minHeight='100%'>
          <div className='flex grow flex-col items-center justify-center gap-4'>
            <ActionButton
              action='add'
              label='Add outcome'
              onClick={() => setIsOutcomeDialogOpen(true)}
            />
          </div>
          <OutcomeForm
            isOpen={isOutcomeDialogOpen}
            onClose={() => setIsOutcomeDialogOpen(false)}
            outcome={outcome}
            projectId={projectId}
          />
        </FeatureCard>
      )}

      {outcome && (
        <>
          <FeatureCard title='Outcome' variant='green' minHeight='100%'>
            <div className='flex grow flex-col items-start justify-between gap-4'>
              <div>
                <p className='text-sm'>
                  <Badge className='mr-2' variant='transparent'>
                    {outcome.code}
                  </Badge>
                  {outcome.description}
                </p>
              </div>
              {canEdit && (
                <div className='flex w-full justify-end text-sm'>
                  <ActionButton
                    action='edit'
                    onClick={() => setIsOutcomeDialogOpen(true)}
                  />
                </div>
              )}
            </div>

            <OutcomeForm
              isOpen={isOutcomeDialogOpen}
              onClose={() => setIsOutcomeDialogOpen(false)}
              outcome={outcome}
              projectId={projectId}
            />
          </FeatureCard>

          <OutcomeMeasurableCard
            outcomeId={outcome.id}
            projectId={projectId}
            outputs={outputs}
          />
        </>
      )}
    </div>
  );
}
