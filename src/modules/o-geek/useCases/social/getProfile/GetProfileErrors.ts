/* eslint-disable @typescript-eslint/no-namespace */
import { Result } from '../../../../../core/logic/Result';
import { UseCaseError } from '../../../../../core/logic/UseCaseError';

export namespace GetProfileErrors {
    export class ProfileNotFound extends Result<UseCaseError> {
        constructor(id: string) {
            super(false, {
                message: `The profile ${id} is not found`,
            } as UseCaseError);
        }
    }
}
