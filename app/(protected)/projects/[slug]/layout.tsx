import { supabase } from '@/utils/supabase/service-role';
import { createClient } from '@/utils/supabase/server';
import PageHeading from '@/components/ui/page-heading';
import { Metadata } from 'next';
import Breadcrumbs from '@/components/ui/breadcrumbs';

export async function generateStaticParams() {
  const { data: projects, error } = await supabase.from('projects').select('*');

  if (error) {
    throw new Error(`Failed to fetch projects: ${error.message}`);
  }

  return projects.map((project) => ({
    slug: project.slug,
  }));
}

export async function generateMetadata({
  params,
}: {
  params: {
    slug: string;
  };
}): Promise<Metadata> {
  const { slug } = await params;
  return {
    title: `${slug.slice(0, 3).toUpperCase()} | Maerl`,
  };
}

export default async function ProjectLayout({
  params,
  children,
}: {
  params: {
    slug: string;
  };
  children: React.ReactNode;
}) {
  const { slug } = await params;
  const supabase = await createClient();
  const { data: project, error: projectError } = await supabase
    .from('projects')
    .select('*')
    .eq('slug', slug)
    .single();

  if (projectError) {
    console.log(`Failed to fetch projects: ${projectError.message}`);

    return (
      <div className='animate-in'>
        <div className='mb-8'>
          <PageHeading>Error loading project</PageHeading>
        </div>

        <div className='flex flex-col items-center gap-4 rounded-lg bg-card p-20'>
          <h2 className='font-semibold'>
            Error loading project:{' '}
            <span className='font-mono text-muted-foreground'>{slug}</span>
          </h2>
          <p>
            Please screenshot this whole page (including the address bar) and
            forward it to the SII team:
          </p>
          <p className='rounded-md bg-slate-600 px-2 py-1 text-xs'>
            <code>{projectError.message}</code>
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className='flex flex-col gap-6 animate-in'>
      <div className='flex items-start justify-between gap-8'>
        <PageHeading>{project.name}</PageHeading>
        <Breadcrumbs projectName={project.name} />
      </div>

      {children}
    </div>
  );
}
