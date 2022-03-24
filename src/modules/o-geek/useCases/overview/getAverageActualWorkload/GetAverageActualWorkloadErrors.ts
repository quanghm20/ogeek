import { Result } from '../../../../../core/logic/Result';
import { UseCaseError } from '../../../../../core/logic/UseCaseError';
import { DomainId } from '../../../domain/domainId';

export namespace GetAverageActualWorkloadErrors {
    export class NoWorkloadLogged extends Result<UseCaseError> {
        constructor(userId: DomainId | number) {
            super(false, {
                message: `User ${userId.toString()} has not logged workload for any expertise scope`,
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
