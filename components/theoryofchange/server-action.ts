'use server';

import { createClient } from '@/utils/supabase/server';
import { Impact, Outcome, OutcomeMeasurable, Output } from '@/utils/types';

export const fetchLogframe = async (identifier: number | string) => {
  const supabase = await createClient();
  const response = await supabase
    .from('projects')
    .select(
      'id, slug, name, impacts(*), outcomes(*, outcome_measurables(*, outputs(*))),  outputs(*)',
    )
    .eq(typeof identifier === 'number' ? 'id' : 'slug', identifier)
    .single();

  return response;
};

export const upsertImpact = async (impact: Partial<Impact>) => {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('impacts')
    .upsert(impact)
    .select()
    .single();

  if (error) throw error;
  return data;
};

export const upsertOutcome = async (outcome: Partial<Outcome>) => {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('outcomes')
    .upsert({
      id: outcome.id,
      project_id: outcome.project_id,
      description: outcome.description,
      code: outcome.code,
    })
    .select()
    .single();

  if (error) throw error;

  // Handle outcome_measurables
  if (outcome.outcome_measurables) {
    const measurablesToUpsert = outcome.outcome_measurables.map(
      (measurable) => ({
        ...measurable,
        outcome_id: data.id,
      }),
    );

    const { error: measurablesError } = await supabase
      .from('outcome_measurables')
      .upsert(measurablesToUpsert);

    if (measurablesError) throw measurablesError;
  }

  return data;
};

export const upsertOutcomeMeasurable = async (
  measurable: Partial<OutcomeMeasurable>,
) => {
  const supabase = await createClient();

  // Ensure we have required fields
  if (!measurable.outcome_id || !measurable.description || !measurable.code) {
    throw new Error('Missing required fields');
  }

  const { data, error } = await supabase
    .from('outcome_measurables')
    .upsert({
      id: measurable.id,
      outcome_id: measurable.outcome_id,
      description: measurable.description,
      verification: measurable.verification || '',
      assumptions: measurable.assumptions || '',
      code: measurable.code,
    })
    .select()
    .single();

  if (error) throw error;
  return data;
};

export const upsertOutput = async (output: Partial<Output>) => {
  const supabase = await createClient();

  // Ensure we have required fields
  if (!output.outcome_measurable_id || !output.description || !output.code) {
    throw new Error('Missing required fields');
  }

  const { data, error } = await supabase
    .from('outputs')
    .upsert({
      id: output.id,
      outcome_measurable_id: output.outcome_measurable_id,
      project_id: output.project_id,
      description: output.description,
      code: output.code,
    })
    .select()
    .single();

  if (error) throw error;
  return data;
};
