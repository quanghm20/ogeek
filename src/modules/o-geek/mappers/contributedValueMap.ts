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
            id: contributedValue.id,
            valueStream: contributedValue.props.valueStream,
            expertiseScope: contributedValue.props.expertiseScope,
        };
    }

    public static toDomain(raw: ContributedValueEntity): ContributedValue {
        const { id } = raw;
        const profileOrError = ContributedValue.create(
            {},
            new UniqueEntityID(id),
        );

        return profileOrError.isSuccess ? profileOrError.getValue() : null;
    }
}
