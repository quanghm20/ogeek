/* eslint-disable @typescript-eslint/no-namespace */
import { Result } from '../../../../../core/logic/Result';
import { UseCaseError } from '../../../../../core/logic/UseCaseError';

export namespace GetUserByAliasErrors {
    export class UserNotFound extends Result<UseCaseError> {
        constructor(alias: string) {
            super(false, {
                message: `The user ${alias} is not found`,
            } as UseCaseError);
        }
    }
}
