import type { APIRoute } from 'astro';
import { createJobOffer } from '../../../../lib/server/actions';

export const POST: APIRoute = async ({ request, cookies }) => {
    const token = cookies.get('admin_token')?.value;

    if (!token) {
        return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401 });
    }

    try {
        const data = await request.json();
        const newOffer = await createJobOffer(data, token);
        return new Response(JSON.stringify(newOffer), { status: 201 });
    } catch (error: any) {
        return new Response(JSON.stringify({ error: error.message }), { status: 400 });
    }
};
