/* eslint-disable @typescript-eslint/no-namespace */
import { Result } from '../../../../../core/logic/Result';
import { UseCaseError } from '../../../../../core/logic/UseCaseError';

export namespace GetWorkloadListError {
    export class WorkloadListNotFound extends Result<UseCaseError> {
        constructor() {
            super(false, {
                message: 'Can not find any workload list',
            } as UseCaseError);
        }
    }
    export class Forbidden extends Result<UseCaseError> {
        constructor() {
            super(false, {
                message: 'Forbidden !!! ',
            } as UseCaseError);
        }
    }
    export class WeekError extends Result<UseCaseError> {
        constructor() {
            super(false, {
                message:
                    'Week must greater than or equal to 1 and smaller than or equal to 52 !!! ',
            } as UseCaseError);
        }
    }
}
