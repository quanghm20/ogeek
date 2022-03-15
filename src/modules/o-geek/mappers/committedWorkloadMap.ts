// import { UniqueEntityID } from '../../../core/domain/UniqueEntityID';
import { Mapper } from '../../../core/infra/Mapper';
import { CommittedWorkload } from '../domain/committedWorkload';
import { CommittedWorkloadEntity } from '../infra/database/entities/committedWorkload.entity';
import { CommittedWorkloadDto } from '../infra/dtos/committedWorkload.dto';

export class CommittedWorkloadMap implements Mapper<CommittedWorkload> {
    public static fromDomain(
        committedWorkload: CommittedWorkload,
    ): CommittedWorkloadDto {
        return {
            userId: committedWorkload.userId,
            contributedValueId: committedWorkload.contributedValueId,
            committedWorkload: committedWorkload.committedWorkload,
            startDate: committedWorkload.startDate,
            expiredDate: committedWorkload.expiredDate,
            isActive: committedWorkload.isActive,
        };
    }

    public static toDomain(raw: CommittedWorkloadEntity): CommittedWorkload {
        // const { id } = raw;

        const committedWorkloadOrError = CommittedWorkload.create(
            {
                userId: raw.user.id,
                contributedValueId: raw.contributedValue.id,
                committedWorkload: raw.committedWorkload,
                startDate: raw.startDate,
                expiredDate: raw.expiredDate,
                isActive: raw.status,
            },
            // new UniqueEntityID(id),
        );

        return committedWorkloadOrError.isSuccess
            ? committedWorkloadOrError.getValue()
            : null;
    }
}
