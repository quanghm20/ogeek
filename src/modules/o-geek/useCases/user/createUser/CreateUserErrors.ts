/* eslint-disable @typescript-eslint/no-namespace */
import { Result } from '../../../../../core/logic/Result';
import { UseCaseError } from '../../../../../core/logic/UseCaseError';

export namespace FailToCreateUserErrors {
    export class FailToCreateUser extends Result<UseCaseError> {
        constructor() {
            super(false, {
                message: 'The user can not create',
            } as UseCaseError);
        }
    }
}
