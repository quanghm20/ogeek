import { Result } from '../../../../../core/logic/Result';
import { UseCaseError } from '../../../../../core/logic/UseCaseError';

export namespace GetListCommittingErrors {
    export class UserNotFound extends Result<UseCaseError> {
        constructor(userId: number) {
            super(false, {
                message: `Could not find User ${userId}.`,
            } as UseCaseError);
        }
    }
    export class ListCommittingNotFound extends Result<UseCaseError> {
        constructor() {
            super(false, {
                message: 'Could not get committing list.',
            } as UseCaseError);
        }
    }
    export class Forbidden extends Result<UseCaseError> {
        constructor() {
            super(false, {
                message: 'Forbidden.',
            } as UseCaseError);
        }
    }
}
