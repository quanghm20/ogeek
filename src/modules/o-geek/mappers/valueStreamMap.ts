import { UniqueEntityID } from '../../../core/domain/UniqueEntityID';
import { Mapper } from '../../../core/infra/Mapper';
import { ValueStream } from '../domain/valueStream';
import { ValueStreamEntity } from '../infra/database/entities/valueStream.entity';
import { ValueStreamShortDto } from '../infra/dtos/summaryYearDTO/valueStreamShort.dto';
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

    public static fromArrayDomain(
        valueStream: ValueStream[],
    ): ValueStreamShortDto[] {
        const valueStreamArrayDTO = Array<ValueStreamShortDto>();
        valueStream.forEach(function get(item) {
            const valueStreamShort = ValueStreamMap.fromDomainShort(item);
            valueStreamArrayDTO.push(valueStreamShort);
        });
        return valueStreamArrayDTO;
    }

    public static fromDomainAll(valueStreams: ValueStream[]): ValueStreamDto[] {
        const valueStreamArrayDto = new Array<ValueStreamDto>();
        valueStreams.forEach((valueStream) => {
            valueStreamArrayDto.push(ValueStreamMap.fromDomain(valueStream));
        });
        return valueStreamArrayDto;
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

    public static toArrayDomain(raws: ValueStreamEntity[]): ValueStream[] {
        const valueStreamsOrError = Array<ValueStream>();
        raws.forEach(function get(item) {
            const valueStream = ValueStreamMap.toDomain(item);
            valueStreamsOrError.push(valueStream);
        });
        return valueStreamsOrError ? valueStreamsOrError : null;
    }

    public static toDomainAll(
        valueStreams: ValueStreamEntity[],
    ): ValueStream[] {
        const valueStreamArray = new Array<ValueStream>();
        valueStreams.forEach((valueStream) => {
            const valueStreamOrError = ValueStreamMap.toDomain(valueStream);
            if (valueStreamOrError) {
                valueStreamArray.push(valueStreamOrError);
            } else {
                return null;
            }
        });

        return valueStreamArray;
    }
}
