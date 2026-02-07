import type { APIRoute } from "astro";
import { S3Client, GetObjectCommand } from "@aws-sdk/client-s3";
import { verifyToken } from "../../../lib/server/auth";

export const GET: APIRoute = async ({ request, cookies }) => {
    const url = new URL(request.url);
    const cvUrl = url.searchParams.get("url");
    const token = cookies.get("admin_token")?.value;

    if (!token || !verifyToken(token)) {
        return new Response("Unauthorized", { status: 401 });
    }

    if (!cvUrl) {
        return new Response("Missing URL param", { status: 400 });
    }

    const bucketName = import.meta.env.S3_BUCKET_NAME || "germany-const";
    let key = cvUrl;

    try {
        if (cvUrl.startsWith("http")) {
            const urlObj = new URL(cvUrl);
            const pathParts = urlObj.pathname.split("/").filter(Boolean);

            // Expected path structure: /bucket-name/key/parts...
            if (pathParts[0] === bucketName) {
                key = pathParts.slice(1).join("/");
            } else {
                // assume key is full path minus leading slash if bucket doesn't match first part
                key = urlObj.pathname.substring(1);
            }
        }
    } catch (e) {
        console.warn("Error parsing URL, using original string as key:", e);
    }

    // Decode URI components in case the key has spaces or special chars
    key = decodeURIComponent(key);

    try {
        const s3 = new S3Client({
            region: import.meta.env.S3_REGION || "us-east-1",
            endpoint: import.meta.env.S3_ENDPOINT,
            credentials: {
                accessKeyId: import.meta.env.S3_ACCESS_KEY,
                secretAccessKey: import.meta.env.S3_SECRET_KEY,
            },
            forcePathStyle: true,
        });

        const command = new GetObjectCommand({
            Bucket: bucketName,
            Key: key,
        });

        const response = await s3.send(command);

        // @ts-ignore
        const webStream = response.Body.transformToWebStream();

        return new Response(webStream, {
            headers: {
                "Content-Type": response.ContentType || "application/pdf",
                "Content-Disposition": `inline; filename="${key.split('/').pop()}"`,
            },
        });

    } catch (error: any) {
        console.error("S3 Error:", error);
        return new Response(`Error fetching file: ${error.message} (Bucket: ${bucketName}, Key: ${key})`, { status: 500 });
    }
};
