import { Result } from '../../../../../core/logic/Result';
import { UseCaseError } from '../../../../../core/logic/UseCaseError';
import { DomainId } from '../../../domain/domainId';

export namespace GetAverageCommittedWorkloadErrors {
    export class NoWorkloadCommitted extends Result<UseCaseError> {
        constructor(committedWorkloadId: DomainId | number) {
            super(false, {
                message: `User has not committed ${committedWorkloadId.toString()} workload for any expertise scope`,
            } as UseCaseError);
        }
    }
    export class NoUserFound extends Result<UseCaseError> {
        constructor(userId: DomainId | number) {
            super(false, {
                message: `No user found by given ${userId.toString()}`,
            } as UseCaseError);
        }
    }
}
