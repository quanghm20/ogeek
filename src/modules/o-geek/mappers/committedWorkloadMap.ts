import { UniqueEntityID } from '../../../core/domain/UniqueEntityID';
import { Mapper } from '../../../core/infra/Mapper';
import { CommittedWorkload } from '../domain/committedWorkload';
import { CommittedWorkloadEntity } from '../infra/database/entities/committedWorkload.entity';
import { CommittedWorkloadDto } from '../infra/dtos/committedWorkload.dto';
import { ContributedValueMap } from './contributedValueMap';

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
            picId: committedWorkload.props.pic,
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

    public static toEntity(
        committedWorkload: CommittedWorkload,
    ): CommittedWorkloadEntity {
        const entity = new CommittedWorkloadEntity();

        // entity.id = Number(committedWorkload.id.toValue());
        entity.startDate = committedWorkload.startDate;
        entity.expiredDate = committedWorkload.expiredDate;
        entity.status = committedWorkload.status;
        entity.committedWorkload = committedWorkload.committedWorkload;
        // entity.user = UserMap.toEntity(committedWorkload.user);
        // entity.pic = UserMap.toEntity(committedWorkload.pic);
        entity.contributedValue = ContributedValueMap.toEntity(
            committedWorkload.contributedValue,
        );

        return entity;
    }
}
