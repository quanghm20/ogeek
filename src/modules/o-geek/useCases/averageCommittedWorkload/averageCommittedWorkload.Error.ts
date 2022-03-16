import { Result } from '../../../../core/logic/Result';
import { UseCaseError } from '../../../../core/logic/UseCaseError';

export namespace GetAverageCommittedWorkloadErrors {
    export class NoWorkloadCommitted extends Result<UseCaseError> {
        constructor() {
            super(false, {
                message:
                    'User has not committed workload for any expertise scope',
            } as UseCaseError);
        }
    }
    export class NoUserFound extends Result<UseCaseError> {
        constructor() {
            super(false, {
                message: 'No user found by given ID',
            } as UseCaseError);
        }
    }
}
