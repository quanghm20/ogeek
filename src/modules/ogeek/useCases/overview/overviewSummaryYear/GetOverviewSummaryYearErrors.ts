/* eslint-disable @typescript-eslint/no-namespace */
import { Result } from '../../../../../core/logic/Result';
import { UseCaseError } from '../../../../../core/logic/UseCaseError';

export namespace GetOverviewSummaryYearErrors {
    export class NotFound extends Result<UseCaseError> {
        constructor() {
            super(false, {
                message: 'User not found.',
            } as UseCaseError);
        }
    }
}
