import type { APIRoute } from 'astro';
import { loginAdmin } from '../../../lib/server/actions';

export const POST: APIRoute = async ({ request, cookies }) => {
    try {
        const data = await request.json();
        const { user, pass } = data;

        const result = await loginAdmin(user, pass);

        if (result.success && result.token) {
            cookies.set('admin_token', result.token, {
                path: '/',
                httpOnly: true,
                secure: import.meta.env.PROD,
                sameSite: 'strict',
                maxAge: 60 * 60 * 8, // 8 hours
            });
            return new Response(JSON.stringify({ success: true }), { status: 200 });
        }

        return new Response(JSON.stringify({ error: 'Invalid credentials' }), { status: 401 });
    } catch (error: any) {
        console.log(error);
        return new Response(JSON.stringify({ error: error.message }), { status: 401 });
    }
};
