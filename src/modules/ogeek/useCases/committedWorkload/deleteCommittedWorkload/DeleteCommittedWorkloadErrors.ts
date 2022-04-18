import { CommittedWorkloadStatus } from '../../../../../common/constants/committedStatus';
import { Result } from '../../../../../core/logic/Result';
import { UseCaseError } from '../../../../../core/logic/UseCaseError';

export namespace DeleteCommittedWorkloadErrors {
    export class NotFound extends Result<UseCaseError> {
        constructor(idCommitment: number) {
            super(false, {
                message: `Could not find committed workload ${idCommitment} .`,
            } as UseCaseError);
        }
    }

    export class CanNotDelete extends Result<UseCaseError> {
        constructor(idCommitment: number) {
            super(false, {
                message: `Can not delete committed workload ${idCommitment} .`,
            } as UseCaseError);
        }
    }

    export class CanNotDeleteCommitment extends Result<UseCaseError> {
        constructor(status: CommittedWorkloadStatus) {
            super(false, {
                message: `Can not delete committed workload ${status.toLowerCase()}.`,
            } as UseCaseError);
        }
    }
}
