import { Result } from '../../../../../core/logic/Result';
import { UseCaseError } from '../../../../../core/logic/UseCaseError';
import { DomainId } from '../../../domain/domainId';

export namespace GetWeekStatusErrors {
    export class GetWeekStatusFailed extends Result<UseCaseError> {
        constructor(userId: DomainId | number) {
            super(false, {
                message: `Failed to get week status of user ${userId.toString()}`,
            } as UseCaseError);
        }
    }
}
