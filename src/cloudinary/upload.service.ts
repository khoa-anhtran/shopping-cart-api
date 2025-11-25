// upload.service.ts
import { Injectable } from "@nestjs/common";
import cloudinary from "./cloudinary.config";
import { v4 as uuid } from "uuid";

@Injectable()
export class UploadService {
    createImageSignature(productId: string) {
        const timestamp = Math.round(new Date().getTime() / 1000);
        const folder = `shopping-cart/comments/${productId}`;

        const paramsToSign: Record<string, string | number> = {
            timestamp,
            folder,
        };

        const signature = cloudinary.utils.api_sign_request(
            paramsToSign,
            process.env.CLOUDINARY_API_SECRET as string,
        );

        return {
            timestamp,
            folder,
            signature,
            cloudName: process.env.CLOUDINARY_CLOUD_NAME,
            apiKey: process.env.CLOUDINARY_API_KEY,
        };
    }
}
