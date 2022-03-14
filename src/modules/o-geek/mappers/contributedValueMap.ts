import { UniqueEntityID } from '../../../core/domain/UniqueEntityID';
import { Mapper } from '../../../core/infra/Mapper';
import { ContributedValue } from '../domain/contributedValue';
import { ContributedValueEntity } from '../infra/database/entities/contributedValue.entity';
import { ContributedValueDto } from '../infra/dtos/contributedValue.dto';

export class ContributedValueMap implements Mapper<ContributedValue> {
    public static fromDomain(
        contributedValue: ContributedValue,
    ): ContributedValueDto {
        return {
            expertiseScopeId: contributedValue.expertiseScopeId,
            valueStreamId: contributedValue.valueStreamId,
        };
    }

    public static toDomain(raw: ContributedValueEntity): ContributedValue {
        const { id } = raw;

        const contributedValueOrError = ContributedValue.create(
            {
                expertiseScopeId: raw.expertiseScope.id,
                valueStreamId: raw.valueStream.id,
            },
            new UniqueEntityID(id),
        );

        return contributedValueOrError.isSuccess
            ? contributedValueOrError.getValue()
            : null;
    }
}
