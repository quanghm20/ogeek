import { Result } from '../../../../../core/logic/Result';
import { UseCaseError } from '../../../../../core/logic/UseCaseError';

export namespace CreateCommittedWorkloadErrors {
    export class NotFound extends Result<UseCaseError> {
        constructor(message: string) {
            super(false, {
                message: `Could not find User ${message} .`,
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
    export class DateError extends Result<UseCaseError> {
        constructor() {
            super(false, {
                message: 'StartDate or ExpiredDate is not valid !',
            } as UseCaseError);
        }
    }
    export class ExistCommittedWorkloadInComing extends Result<UseCaseError> {
        constructor() {
            super(false, {
                message: 'This user existing committed workload upcoming!',
            } as UseCaseError);
        }
    }
}
