import { Result } from '../../../../../core/logic/Result';
import { UseCaseError } from '../../../../../core/logic/UseCaseError';

export namespace StartWeekErrors {
    export class NotPlan extends Result<UseCaseError> {
        constructor() {
            super(false, {
                message: 'Cannot execute without planning!',
            } as UseCaseError);
        }
    }
    export class PreviousWeekNotClose extends Result<UseCaseError> {
        constructor() {
            super(false, {
                message: 'Previous week does not close!',
            } as UseCaseError);
        }
    }
}
