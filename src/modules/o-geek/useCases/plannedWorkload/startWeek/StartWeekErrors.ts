/* eslint-disable @typescript-eslint/no-namespace */
import { Result } from '../../../../../core/logic/Result';
import { UseCaseError } from '../../../../../core/logic/UseCaseError';

export namespace StartWeekErrors {
    export class StartWeekFailed extends Result<UseCaseError> {
        constructor() {
            super(false, {
                message: 'Cannot execute without planning!',
            } as UseCaseError);
        }
    }
}
