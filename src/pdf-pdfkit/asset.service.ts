/* eslint-disable */
import { Injectable } from '@nestjs/common';
import axios from 'axios';

@Injectable()
export class AssetService {
  async fetchImageAsBuffer(url?: string): Promise<Buffer | null> {
    if (!url) return null;
    const res = await axios.get(url, { responseType: 'arraybuffer' });
    return Buffer.from(res.data, 'binary');
  }
}
