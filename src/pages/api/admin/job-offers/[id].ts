import type { APIRoute } from 'astro';
import { updateJobOffer, deleteJobOffer } from '../../../../lib/server/actions';

export const PUT: APIRoute = async ({ request, params, cookies }) => {
    const token = cookies.get('admin_token')?.value;
    const { id } = params;

    if (!token) {
        return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401 });
    }

    if (!id) {
        return new Response(JSON.stringify({ error: 'Job Offer ID required' }), { status: 400 });
    }

    try {
        const data = await request.json();
        const updated = await updateJobOffer(id, data, token);
        return new Response(JSON.stringify(updated), { status: 200 });
    } catch (error: any) {
        return new Response(JSON.stringify({ error: error.message }), { status: 400 });
    }
};

export const DELETE: APIRoute = async ({ params, cookies }) => {
    const token = cookies.get('admin_token')?.value;
    const { id } = params;

    if (!token) {
        return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401 });
    }

    if (!id) {
        return new Response(JSON.stringify({ error: 'Job Offer ID required' }), { status: 400 });
    }

    try {
        await deleteJobOffer(id, token);
        return new Response(null, { status: 204 });
    } catch (error: any) {
        return new Response(JSON.stringify({ error: error.message }), { status: 400 });
    }
};
