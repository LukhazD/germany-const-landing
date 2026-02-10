import type { APIRoute } from 'astro';
import { getProjectAnalyses } from '../../../lib/server/actions';

export const GET: APIRoute = async ({ cookies, url }) => {
    const token = cookies.get('admin_token')?.value;
    if (!token) {
        return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401 });
    }

    const page = parseInt(url.searchParams.get('page') || '1');
    const limit = parseInt(url.searchParams.get('limit') || '20');

    try {
        const result = await getProjectAnalyses(token, page, limit);
        return new Response(JSON.stringify(result), {
            status: 200,
            headers: { 'Content-Type': 'application/json' }
        });
    } catch (error: any) {
        return new Response(JSON.stringify({ error: error.message }), { status: 400 });
    }
};
