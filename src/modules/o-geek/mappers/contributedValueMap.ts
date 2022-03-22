import { UniqueEntityID } from '../../../core/domain/UniqueEntityID';
import { Mapper } from '../../../core/infra/Mapper';
import { ContributedValue } from '../domain/contributedValue';
import { ExpertiseScope } from '../domain/expertiseScope';
import { ValueStream } from '../domain/valueStream';
import { ContributedValueEntity } from '../infra/database/entities/contributedValue.entity';
import { ContributedValueDto } from '../infra/dtos/contributedValue.dto';
import { ContributedValueShortDto } from '../infra/dtos/getContributedValue/contributedValueShort.dto';
import { ExpertiseScopeMap } from './expertiseScopeMap';
import { ValueStreamMap } from './valueStreamMap';

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

    public static fromDomainShort(
        contributedValue: ContributedValue,
    ): ContributedValueShortDto {
        const valueStream = ValueStreamMap.fromDomainShort(
            contributedValue.valueStream,
        );
        const expertiseScope = ExpertiseScopeMap.fromDomainShort(
            contributedValue.expertiseScope,
        );
        return new ContributedValueShortDto(
            Number(contributedValue.id.toValue()),
            valueStream,
            expertiseScope,
        );
    }
    public static fromDomainShortAll(
        raw: ContributedValue[],
    ): ContributedValueShortDto[] {
        const contributedValuesOrError = Array<ContributedValueShortDto>();
        raw.forEach(function get(item) {
            const contributed = ContributedValueMap.fromDomainShort(item);
            contributedValuesOrError.push(contributed);
        });
        return contributedValuesOrError ? contributedValuesOrError : null;
    }

    public static toDomain(raw: ContributedValueEntity): ContributedValue {
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

    public static toDomainAll(
        raw: ContributedValueEntity[],
    ): ContributedValue[] {
        const contributedValuesOrError = Array<ContributedValue>();
        raw.forEach(function get(item) {
            const contributed = ContributedValueMap.toDomain(item);
            contributedValuesOrError.push(contributed);
        });
        return contributedValuesOrError ? contributedValuesOrError : null;
    }
    public static toEntity(
        contributed: ContributedValue,
    ): ContributedValueEntity {
        const valueStream = ValueStreamMap.toEntity(contributed.valueStream);
        const expertiseScope = ExpertiseScopeMap.toEntity(
            contributed.expertiseScope,
        );
        const contributedValueEntity = new ContributedValueEntity();
        contributedValueEntity.expertiseScope = expertiseScope;
        contributedValueEntity.valueStream = valueStream;
        contributedValueEntity.id = Number(contributedValueEntity.id);

        return contributedValueEntity;
    }
}
