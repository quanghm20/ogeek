import { Result } from '../../../../../core/logic/Result';
import { UseCaseError } from '../../../../../core/logic/UseCaseError';
import { DomainId } from '../../../domain/domainId';

export namespace GetOverviewChartDataErrors {
    export class GetOverviewChartDataFailed extends Result<UseCaseError> {
        constructor(committedWorkloadId: DomainId | number) {
            super(false, {
                message: `Failed to get data for overview chart of ${committedWorkloadId.toString()}`,
            } as UseCaseError);
        }
    }
}
