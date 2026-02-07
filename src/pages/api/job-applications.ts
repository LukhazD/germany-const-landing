import type { APIRoute } from 'astro';
import { submitApplication } from '../../lib/server/actions';

export const POST: APIRoute = async ({ request }) => {
    try {
        const formData = await request.formData();
        const jobOfferId = formData.get('jobOfferId') as string;

        if (!jobOfferId) {
            return new Response(JSON.stringify({ error: 'Job Offer ID required' }), { status: 400 });
        }

        const result = await submitApplication(formData, jobOfferId);
        return new Response(JSON.stringify(result), { status: 201 });
    } catch (error: any) {
        return new Response(JSON.stringify({ error: error.message }), { status: 400 });
    }
};
