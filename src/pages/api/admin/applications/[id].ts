import type { APIRoute } from "astro";
import { verifyToken } from "../../../../lib/server/auth";
import connectDB from "../../../../lib/server/db";
import Application from "../../../../lib/server/models/Application";
import { Types } from "mongoose";

export const PUT: APIRoute = async ({ params, request, cookies }) => {
    const { id } = params;
    const token = cookies.get("admin_token")?.value;

    if (!token || !verifyToken(token)) {
        return new Response(JSON.stringify({ error: "Unauthorized" }), {
            status: 401,
            headers: { "Content-Type": "application/json" },
        });
    }

    if (!id || !Types.ObjectId.isValid(id)) {
        return new Response(JSON.stringify({ error: "Invalid ID" }), {
            status: 400,
            headers: { "Content-Type": "application/json" },
        });
    }

    try {
        const body = await request.json();
        const { status } = body;

        if (!["pending", "reviewed", "rejected", "hired"].includes(status)) {
            return new Response(JSON.stringify({ error: "Invalid status" }), {
                status: 400,
                headers: { "Content-Type": "application/json" },
            });
        }

        await connectDB();

        const updatedApp = await Application.findByIdAndUpdate(
            id,
            { status },
            { new: true }
        );

        if (!updatedApp) {
            return new Response(JSON.stringify({ error: "Application not found" }), {
                status: 404,
                headers: { "Content-Type": "application/json" },
            });
        }

        return new Response(JSON.stringify({ success: true, application: updatedApp }), {
            status: 200,
            headers: { "Content-Type": "application/json" },
        });

    } catch (error) {
        console.error("Error updating application:", error);
        return new Response(JSON.stringify({ error: "Internal Server Error" }), {
            status: 500,
            headers: { "Content-Type": "application/json" },
        });
    }
};
