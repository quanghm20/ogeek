// import { Injectable } from '@nestjs/common';
// import Axios from 'axios';

// import { ConfigService } from '../../../shared/services/config.service';
// interface IActualWorkloadRepo {
//     getDataFromOtable(params: Record<string, unknown>): Promise<any>;
// }

// @Injectable()
// export class ActualWorkloadRepository implements IActualWorkloadRepo {
//     constructor(private _configService: ConfigService) {}
//     async getDataFromOtable(params: Record<string, string>): Promise<unknown> {
//         let url = `${this._configService.get('MOCK_URL')}`;
//         if (params.params) {
//             url = url + '/' + params.params;
//         }

//         if (params.queryString) {
//             url = url + '?' + params.queryString;
//         }

//         const request = await Axios.get<Record<string, unknown>>(url, {
//             headers: {
//                 'x-api-key': this._configService.get('MOCK_API_KEY'),
//             },
//         });
//         return request.data.data;
//     }
// }
