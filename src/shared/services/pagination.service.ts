import { Injectable } from '@nestjs/common';

import { Order } from '../../common/constants/order';
import { paginationDefault } from '../../common/constants/pagination';
import { PaginationDto } from '../../modules/ogeek/infra/dtos/pagination.dto';

@Injectable()
export class PaginationService {
    static pagination(
        query: PaginationDto,
        allowSortColumnArray: string[],
        sortDefault: string,
    ): PaginationDto {
        let orderBy = '';
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
                const handleSortArray = filterSortArray.map((sort) => {
                    const myArray = sort.split('.');
                    return myArray.map((item) => `"${item}"`).join('.');
                });
                let orderArray: string[] = [];
                if (query.order) {
                    orderArray = query.order.split(',');
                }
                handleSortArray.forEach((sort, index) => {
                    if (orderArray[index]) {
                        orderBy += sort + ' ' + orderArray[index] + ',';
                        return;
                    }

                    orderBy += sort + ` ${Order.DESC},`;
                });
                orderBy = orderBy.slice(0, orderBy.length - 1);
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
        } as PaginationDto;
    }
}
