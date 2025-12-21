import { redirect } from 'next/navigation';
import { getExportRenderToken } from '@/lib/exportToken';
import ExportRenderContent from './ExportRenderContent';

interface ExportRenderPageProps {
    searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export default async function ExportRenderPage({ searchParams }: ExportRenderPageProps) {
    const params = await searchParams;
    const token = params.token as string | undefined;
    const id = params.id as string | undefined;

    // Server-side token validation
    const validToken = getExportRenderToken();
    
    if (!token || token !== validToken) {
        console.error("Invalid or missing export render token");
        redirect('/');
    }

    if (!id) {
        return <div style={{ padding: '20px', color: 'red' }}>No compose ID provided</div>;
    }

    return <ExportRenderContent id={id} />;
}
