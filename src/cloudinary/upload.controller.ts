// upload.controller.ts
import { Controller, Param, Post, Req } from "@nestjs/common";
import { UploadService } from "./upload.service";

@Controller("/api/uploads")
export class UploadController {
    constructor(private readonly uploadService: UploadService) { }

    @Post("image-signature/:product_id")
    getImageSignature(@Param("product_id") productId: string) {
        return this.uploadService.createImageSignature(productId);
    }
}
