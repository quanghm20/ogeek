import { Result } from '../../../../../core/logic/Result';
import { UseCaseError } from '../../../../../core/logic/UseCaseError';

export namespace PlanWorkloadErrors {
    export class PlanWorkloadFailed extends Result<UseCaseError> {
        constructor() {
            super(false, {
                message: 'Failed to plan workload!',
            } as UseCaseError);
        }
    }
}
