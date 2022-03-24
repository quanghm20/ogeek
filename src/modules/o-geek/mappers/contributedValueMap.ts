import { UniqueEntityID } from '../../../core/domain/UniqueEntityID';
import { Mapper } from '../../../core/infra/Mapper';
import { ContributedValue } from '../domain/contributedValue';
import { ExpertiseScope } from '../domain/expertiseScope';
import { ValueStream } from '../domain/valueStream';
import { ContributedValueEntity } from '../infra/database/entities/contributedValue.entity';
import { ContributedValueDto } from '../infra/dtos/contributedValue.dto';
import { ExpertiseScopeMap } from './expertiseScopeMap';
import { ValueStreamMap } from './valueStreamMap';

export class ContributedValueMap implements Mapper<ContributedValue> {
    public static fromDomain(
        contributedValue: ContributedValue,
    ): ContributedValueDto {
        return {
            id: contributedValue.id,
            valueStream: ValueStreamMap.fromDomain(
                contributedValue.props.valueStream,
            ),
            expertiseScope: ExpertiseScopeMap.fromDomain(
                contributedValue.props.expertiseScope,
            ),
        };
    }

    public static toDomainOverview(
        raw: ContributedValueEntity,
    ): ContributedValue {
        const { id } = raw;
        const valueStreamId = raw.valueStream.id;
        const valueStream = ValueStream.create(
            {
                name: raw.valueStream.name,
                createdAt: raw.valueStream.createdAt,
                updatedAt: raw.valueStream.updatedAt,
            },
            new UniqueEntityID(valueStreamId),
        );
        const expertiseScopeId = raw.expertiseScope.id;
        const expertiseScope = ExpertiseScope.create(
            {
                name: raw.expertiseScope.name,
                createdAt: raw.expertiseScope.createdAt,
                updatedAt: raw.expertiseScope.updatedAt,
            },
            new UniqueEntityID(expertiseScopeId),
        );
        const contributedValueOrError = ContributedValue.create(
            {
                createdAt: raw.createdAt,
                updatedAt: raw.updatedAt,
            },
            new UniqueEntityID(id),
        );
        contributedValueOrError.getValue().valueStream = valueStream.getValue();
        contributedValueOrError.getValue().expertiseScope =
            expertiseScope.getValue();

        return contributedValueOrError.isSuccess
            ? contributedValueOrError.getValue()
            : null;
    }

    public static toEntity(
        contributedValue: ContributedValue,
    ): ContributedValueEntity {
        const entity = new ContributedValueEntity();

        entity.id = Number(contributedValue.contributedValueId.id.toValue());
        entity.expertiseScope = ExpertiseScopeMap.toEntity(
            contributedValue.expertiseScope,
        );

        entity.valueStream = ValueStreamMap.toEntity(
            contributedValue.valueStream,
        );

        return entity;
    }

    public static toDomain(
        contributedValueEntity: ContributedValueEntity,
    ): ContributedValue {
        const { id } = contributedValueEntity;

        const contributedValueOrError = ContributedValue.create(
            {
                valueStream: contributedValueEntity.valueStream
                    ? ValueStreamMap.toDomain(
                          contributedValueEntity.valueStream,
                      )
                    : null,
                expertiseScope: contributedValueEntity.expertiseScope
                    ? ExpertiseScopeMap.toDomain(
                          contributedValueEntity.expertiseScope,
                      )
                    : null,
            },
            new UniqueEntityID(id),
        );

        return contributedValueOrError.isSuccess
            ? contributedValueOrError.getValue()
            : null;
    }

    public static toDomainAll(
        raw: ContributedValueEntity[],
    ): ContributedValue[] {
        const contributedValuesOrError = Array<ContributedValue>();
        raw.forEach(function get(item) {
            const { id } = item;
            const valueStreamId = item.valueStream.id;
            const valueStream = ValueStream.create(
                {
                    name: item.valueStream.name,
                    createdAt: item.valueStream.createdAt,
                    updatedAt: item.valueStream.updatedAt,
                },
                new UniqueEntityID(valueStreamId),
            );
            const expertiseScopeId = item.expertiseScope.id;
            const expertiseScope = ExpertiseScope.create(
                {
                    name: item.expertiseScope.name,
                    createdAt: item.expertiseScope.createdAt,
                    updatedAt: item.expertiseScope.updatedAt,
                },
                new UniqueEntityID(expertiseScopeId),
            );

            const contributedValueOrError = ContributedValue.create(
                {
                    createdAt: item.createdAt,
                    updatedAt: item.updatedAt,
                },
                new UniqueEntityID(id),
            );
            contributedValueOrError.getValue().valueStream =
                valueStream.getValue();
            contributedValueOrError.getValue().expertiseScope =
                expertiseScope.getValue();
            contributedValuesOrError.push(contributedValueOrError.getValue());
        });
        return contributedValuesOrError ? contributedValuesOrError : null;
    }
}
