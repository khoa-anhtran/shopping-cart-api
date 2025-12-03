import { Controller, Get, Param } from '@nestjs/common';
import { AddressService } from './address.service';

@Controller('/api/address')
export class AddressController {

    constructor(private readonly addressService: AddressService) {
    }

    @Get("provinces")
    async getProvinces() {
        const provinces = await this.addressService.getProvinces()
        return provinces
    }

    @Get("provinces/:id")
    async getCommunes(@Param('id') id: string) {
        const communes = await this.addressService.getCommunes(id)
        return communes
    }


}
