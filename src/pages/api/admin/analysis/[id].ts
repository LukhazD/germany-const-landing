
import type { APIRoute } from 'astro';
import { deleteProjectAnalysis } from '../../../../lib/server/actions';

export const DELETE: APIRoute = async ({ params, cookies }) => {
    const token = cookies.get('admin_token')?.value;
    const { id } = params;

    if (!token) {
        return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401 });
    }

    if (!id) {
        return new Response(JSON.stringify({ error: 'Analysis ID required' }), { status: 400 });
    }

    try {
        await deleteProjectAnalysis(id, token);
        return new Response(null, { status: 204 });
    } catch (error: any) {
        return new Response(JSON.stringify({ error: error.message }), { status: 400 });
    }
};
