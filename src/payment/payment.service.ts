import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { InjectModel } from "@nestjs/mongoose";
import { PayOS } from "@payos/node";
import { Model } from "mongoose";


@Injectable()
export class PaymentService {

    private readonly payos: PayOS

    constructor(private cfg: ConfigService) {
        this.payos = new PayOS({
            clientId: cfg.get<string>('PAYOS_CLIENT_ID'),
            apiKey: cfg.get<string>('PAYOS_API_KEY'),
            checksumKey: cfg.get<string>('PAYOS_CHECKSUM_KEY')
        })
    }

    async findAll(userId: string) {

    }
}
