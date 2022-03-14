import { UniqueEntityID } from '../../../core/domain/UniqueEntityID';
import { Mapper } from '../../../core/infra/Mapper';
import { CommittedWorkload } from '../domain/committedWorkload';
import { CommittedWorkloadEntity } from '../infra/database/entities/committedWorkload.entity';
import { CommittedWorkloadDto } from '../infra/dtos/committedWorkload.dto';

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
            status: committedWorkload.props.status,
            picId: committedWorkload.props.picId,
        };
    }

    public static toDomain(raw: CommittedWorkloadEntity): CommittedWorkload {
        const { id } = raw;
        const profileOrError = CommittedWorkload.create(
            {
                contributedValue: raw.contributedValue,
                user: raw.user,
                committedWorkload: raw.committedWorkload,
                startDate: raw.startDate,
                expiredDate: raw.expiredDate,
                status: raw.status,
                picId: raw.picId,
            },
            new UniqueEntityID(id),
        );

        return profileOrError.isSuccess ? profileOrError.getValue() : null;
    }
}
