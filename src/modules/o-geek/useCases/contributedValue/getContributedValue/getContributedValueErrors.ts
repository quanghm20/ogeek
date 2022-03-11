/* eslint-disable @typescript-eslint/no-namespace */
import { Result } from '../../../../../core/logic/Result';
import { UseCaseError } from '../../../../../core/logic/UseCaseError';

export namespace GetContributedValueErrors {
    export class GetContributedValueNotFound extends Result<UseCaseError> {
        constructor(id: string) {
            super(false, {
                message: `The contributed value ${id} is not found`,
            } as UseCaseError);
        }
    }
}
