import { Result } from '../../../../core/logic/Result';
import { UseCaseError } from '../../../../core/logic/UseCaseError';

export namespace GetAverageCommittedWorkloadErrors {
    export class GetAverageCommittedWorkloadFailed extends Result<UseCaseError> {
        constructor() {
            super(false, {
                message: 'Failed to get data for overview chart',
            } as UseCaseError);
        }
    }
}
