import { UniqueEntityID } from '../../../core/domain/UniqueEntityID';
import { Mapper } from '../../../core/infra/Mapper';
import { CommittedWorkload } from '../domain/committedWorkload';
// import { ContributedValue } from '../domain/contributedValue';
import { ExpertiseScope } from '../domain/expertiseScope';
import { CommittedWorkloadEntity } from '../infra/database/entities/committedWorkload.entity';
import { CommittedWorkloadDto } from '../infra/dtos/committedWorkload.dto';
import { ContributedValueMap } from './contributedValueMap';
import { UserMap } from './userMap';

export class CommittedWorkloadMap implements Mapper<CommittedWorkload> {
    public static fromDomain(
        committedWorkload: CommittedWorkload,
    ): CommittedWorkloadDto {
        return {
            id: committedWorkload.committedWorkloadId.id,
            user: committedWorkload.props.user,
            contributedValue: committedWorkload.props.contributedValue,
            committedWorkload: committedWorkload.props.committedWorkload,
            startDate: committedWorkload.props.startDate,
            expiredDate: committedWorkload.props.expiredDate,
            picId: committedWorkload.props.picId,
        };
    }

    public static toDomain(raw: CommittedWorkloadEntity): CommittedWorkload {
        const { id } = raw;
        const committedWorkloadOrError = CommittedWorkload.create(
            {
                committedWorkload: raw.committedWorkload,
                startDate: raw.startDate,
                expiredDate: raw.expiredDate,
                status: raw.status,
            },
            new UniqueEntityID(id),
        );

        return committedWorkloadOrError.isSuccess
            ? committedWorkloadOrError.getValue()
            : null;
    }
    public static toDomainAll(
        raw: CommittedWorkloadEntity[],
    ): CommittedWorkload[] {
        const committedWorkloadsOrError = Array<CommittedWorkload>();
        raw.forEach(function get(item) {
            const { id } = item;

            const committedWorkloadId = item.committedWorkload;
            const committedWorkload = CommittedWorkload.create(
                {
                    contributedValue: ContributedValueMap.toDomain(
                        item.contributedValue,
                    ),
                    user: UserMap.toDomain(item.user),
                    committedWorkload: item.committedWorkload,
                    startDate: item.startDate,
                    expiredDate: item.startDate,
                    status: item.status,
                    createdAt: item.createdAt,
                    updatedAt: item.updatedAt,
                },
                new UniqueEntityID(committedWorkloadId),
            );

            const expertiseScopeId = item.contributedValue.expertiseScope.id;
            const expertiseScope = ExpertiseScope.create(
                {
                    name: item.contributedValue.expertiseScope.name,
                    createdAt: item.contributedValue.expertiseScope.createdAt,
                    updatedAt: item.contributedValue.expertiseScope.updatedAt,
                },
                new UniqueEntityID(expertiseScopeId),
            );

            const committedWorkloadOrError = CommittedWorkload.create(
                {
                    createdAt: item.createdAt,
                    updatedAt: item.updatedAt,
                    committedWorkload: item.committedWorkload,
                    startDate: item.startDate,
                    expiredDate: item.expiredDate,
                },
                new UniqueEntityID(id),
            );
            committedWorkloadOrError.getValue().committedWorkload =
                committedWorkload.getValue();
            committedWorkloadOrError.getValue().contributedValue.expertiseScope =
                expertiseScope.getValue();
            committedWorkloadsOrError.push(committedWorkload.getValue());
        });
        return committedWorkloadsOrError ? committedWorkloadsOrError : null;
    }
}
