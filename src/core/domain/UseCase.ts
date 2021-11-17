import { Member } from './member';

/* eslint-disable @typescript-eslint/tslint/config */
export interface IUseCase<IRequest, IResponse> {
    execute(request?: IRequest, actor?: Member): Promise<IResponse> | IResponse;
}
