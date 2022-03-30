import { Result } from '../../../../../core/logic/Result';
import { UseCaseError } from '../../../../../core/logic/UseCaseError';

export namespace CreateIssueErrors {
    export class CreateIssueFailed extends Result<UseCaseError> {
        constructor() {
            super(false, {
                message: 'Failed to create issue!',
            } as UseCaseError);
        }
    }
    export class NotFound extends Result<UseCaseError> {
        constructor(message: string) {
            super(false, {
                message: `Can not find User ${message} .`,
            } as UseCaseError);
        }
    }
    export class Forbidden extends Result<UseCaseError> {
        constructor() {
            super(false, {
                message: 'Forbidden !!! ',
            } as UseCaseError);
        }
    }
    export class WeekError extends Result<UseCaseError> {
        constructor() {
            super(false, {
                message: 'Week is not found !',
            } as UseCaseError);
        }
    }
}
