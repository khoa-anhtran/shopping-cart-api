import { Injectable } from '@nestjs/common';
import axios from 'axios';

@Injectable()
export class AddressService {
  private readonly apiUrl: string;
  constructor() {
    this.apiUrl = 'https://production.cas.so/address-kit/latest/provinces';
  }

  async getProvinces() {
    const res = await axios.get(this.apiUrl);

    return res.data.provinces;
  }

  async getCommunes(id: string) {
    const res = await axios.get(`${this.apiUrl}/${id}/communes`);

    return res.data.communes;
  }
}
