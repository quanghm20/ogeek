/* eslint-disable @typescript-eslint/no-namespace */
import { Result } from '../../../../../core/logic/Result';
import { UseCaseError } from '../../../../../core/logic/UseCaseError';

export namespace GetOverviewSummaryYearErrors {
    export class UserNotFound extends Result<UseCaseError> {
        constructor(id: string) {
            super(false, {
                message: `The user ${id} is not found`,
            } as UseCaseError);
        }
    }
}
