import { UniqueEntityID } from '../../../core/domain/UniqueEntityID';
import { Mapper } from '../../../core/infra/Mapper';
import { ValueStream } from '../domain/valueStream';
import { ValueStreamEntity } from '../infra/database/entities/valueStream.entity';
import { ValueStreamDto } from '../infra/dtos/valueStream.dto';

export class ValueStreamMap implements Mapper<ValueStream> {
    public static fromDomain(valueStream: ValueStream): ValueStreamDto {
        return {
            id: valueStream.valueStreamId.id,
            name: valueStream.name,
        };
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
}
