import type { APIRoute } from 'astro';
import { submitProjectAnalysis } from '../../lib/server/actions';

export const POST: APIRoute = async ({ request }) => {
    try {
        const formData = await request.formData();
        const result = await submitProjectAnalysis(formData);

        return new Response(JSON.stringify(result), {
            status: 200,
            headers: {
                'Content-Type': 'application/json'
            }
        });
    } catch (error) {
        console.error('Error submitting analysis:', error);
        return new Response(JSON.stringify({ error: error }), {
            status: 400,
            headers: {
                'Content-Type': 'application/json'
            }
        });
    }
}
