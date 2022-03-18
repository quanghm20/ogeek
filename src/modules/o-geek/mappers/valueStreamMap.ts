import { UniqueEntityID } from '../../../core/domain/UniqueEntityID';
import { Mapper } from '../../../core/infra/Mapper';
import { ValueStream } from '../domain/valueStream';
import { ValueStreamEntity } from '../infra/database/entities/valueStream.entity';
import { ValueStreamShortDto } from '../infra/dtos/getContributedValue/valueStreamShort.dto';
import { ValueStreamDto } from '../infra/dtos/valueStream.dto';

export class ValueStreamMap implements Mapper<ValueStream> {
    public static fromDomain(valueStream: ValueStream): ValueStreamDto {
        return {
            id: valueStream.valueStreamId.id,
            name: valueStream.name,
        };
    }
    public static fromDomainShort(
        valueStream: ValueStream,
    ): ValueStreamShortDto {
        return {
            id: Number(valueStream.valueStreamId.id.toValue()),
            name: valueStream.name,
        };
    }
    public static fromDomainShortAll(
        raw: ValueStream[],
    ): ValueStreamShortDto[] {
        const contributedValuesOrError = Array<ValueStreamShortDto>();
        raw.forEach(function get(item) {
            const valueStream = ValueStreamMap.fromDomainShort(item);
            contributedValuesOrError.push(valueStream);
        });
        return contributedValuesOrError ? contributedValuesOrError : null;
    }
    public static toDomain(raw: ValueStreamEntity): ValueStream {
        const { id } = raw;
        const valueStreamOrError = ValueStream.create(
            {
                name: raw.name,
            },
            new UniqueEntityID(id),
        );

        return valueStreamOrError.isSuccess
            ? valueStreamOrError.getValue()
            : null;
    }
    public static toDomainAll(raw: ValueStreamEntity[]): ValueStream[] {
        const contributedValuesOrError = Array<ValueStream>();
        raw.forEach(function get(item) {
            const valueStream = ValueStreamMap.toDomain(item);
            contributedValuesOrError.push(valueStream);
        });
        return contributedValuesOrError ? contributedValuesOrError : null;
    }
}
