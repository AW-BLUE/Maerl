'use client';

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { Project_W_Outputs } from '@/_lib/types';
import ControlledInput from './Input';
import ControlledListbox from './Listbox';
import ControlledCombobox from './Combobox';

export default function UpdateForm({
  data,
  user,
}: {
  data: Project_W_Outputs[];
  user: string;
}) {
  const projects = data.map((project) => {
    return { name: project.name, value: project.id };
  });

  const outputs = data.flatMap((project) => {
    return project.outputs.map((output) => {
      const measurables = output.output_measurables.map((measurable) => {
        return {
          name: `${measurable.code}: ${measurable.description}`,
          value: measurable.id,
        };
      });

      return {
        project_id: project.id,
        name: output.description,
        value: output.id,
        code: output.code,
        measurables: measurables,
      };
    });
  });

  const searchParams = useSearchParams();
  const projectParam = searchParams.get('project');

  const [targetProject, setTargetProject] = useState(
    projectParam ? parseInt(projectParam) : projects[0].value
  );

  const [filteredOutputs, setFilteredOutputs] = useState(() =>
    outputs.filter((output) => output.project_id === targetProject)
  );

  useEffect(() => {
    const relevantOutputs = outputs.filter(
      (output) => output.project_id === targetProject
    );
    setFilteredOutputs(relevantOutputs);
    setInputValues((prevValues) => ({
      ...prevValues,
      output: relevantOutputs[0].value,
    }));
  }, [targetProject]);

  const [inputValues, setInputValues] = useState({
    user: user,
    project: targetProject,
    output: filteredOutputs[0].value,
    update_type: 'Impact',
    date: new Date().toISOString().split('T')[0],
    description: '',
    link: '',
  });

  const handleInputChange = (name: string) => (newValue: string | number) => {
    if (name === 'project') {
      setTargetProject(parseInt(newValue as string));
    }
    setInputValues((prevValues) => ({
      ...prevValues,
      [name]: newValue,
    }));
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    console.log('Input Values:', inputValues);
  };

  return (
    <form
      className='max-w-2xl p-8 mb-4 shadow bg-card-bg rounded-md'
      id='newUpdateForm'
      onSubmit={handleSubmit}
    >
      <ControlledListbox
        label='Project'
        options={projects}
        onSelect={handleInputChange('project')}
        initialValue={inputValues.project}
      />
      <ControlledCombobox
        label='Output'
        options={filteredOutputs}
        onSelect={handleInputChange('output')}
        initialValue={inputValues.output}
      />
      <ControlledListbox
        label='Update type'
        options={[
          { name: 'Impact', value: 'Impact' },
          { name: 'Progress', value: 'Progress' },
        ]}
        onSelect={handleInputChange('update_type')}
        initialValue={inputValues.update_type}
      />
      <ControlledInput
        type='date'
        initialValue={inputValues.date}
        label='Date'
        placeholder=''
        onChange={handleInputChange('date')}
      />
      <ControlledInput
        type='text'
        initialValue={inputValues.link}
        label='Link'
        placeholder='Add a link'
        onChange={handleInputChange('link')}
      />
      <button
        type='submit'
        className='px-4 py-2 w-40 text-center bg-btn-background hover:bg-btn-background-hover rounded-md transition-colors duration-500'
      >
        Submit
      </button>
    </form>
  );
}
