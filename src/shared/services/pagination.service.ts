import { Injectable } from '@nestjs/common';

import { Order } from '../../common/constants/order';
import { paginationDefault } from '../../common/constants/pagination';
import {
    PaginationDto,
    PaginationRepoDto,
} from '../../modules/ogeek/infra/dtos/pagination.dto';

export interface SortDefault {
    [key: string]: Order;
}

@Injectable()
export class PaginationService {
    static pagination(
        query: PaginationDto,
        allowSortColumnArray: string[],
        sortDefault: SortDefault,
    ): PaginationRepoDto {
        let orderBy = {};
        if (!query.sort) {
            orderBy = sortDefault;
        }

        if (query.sort) {
            const sortArray = query.sort.split(',');

            const filterSortArray = sortArray.filter((sort) =>
                allowSortColumnArray.find((allow) => allow === sort),
            );

            if (filterSortArray.length === 0) {
                orderBy = sortDefault;
            } else {
                let orderArray: string[] = [];
                if (query.order) {
                    orderArray = query.order.split(',');
                }

                filterSortArray.forEach((sort, index) => {
                    if (orderArray[index]) {
                        orderBy[sort] = orderArray[index].toUpperCase();
                        return;
                    }

                    orderBy[sort] = Order.DESC;
                });
            }
        }

        if (!query.page) {
            query.page = paginationDefault.PAGE_DEFAULT;
        }

        if (query.page) {
            query.page = query.page - 1;
        }

        if (!query.limit) {
            query.limit = paginationDefault.LIMIT_DEFAULT;
        }

        if (query.limit > paginationDefault.LIMIT_MAX) {
            query.limit = paginationDefault.LIMIT_MAX;
        }

        return {
            order: orderBy,
            limit: query.limit,
            page: query.page,
        } as PaginationRepoDto;
    }
}
