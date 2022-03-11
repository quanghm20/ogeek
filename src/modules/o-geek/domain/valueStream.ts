import { AggregateRoot } from '../../../core/domain/AggregateRoot';
import { Guard } from '../../../core/logic/Guard';
import { Result } from '../../../core/logic/Result';

interface IValueStreamProps {
    id: number;
    name: string;
    createdAt?: Date;
    updatedAt?: Date;
}

export class ValueStream extends AggregateRoot<IValueStreamProps> {
    private constructor(props: IValueStreamProps) {
        super(props);
    }
    get valueStreamId(): number {
        return this.props.id;
    }
    get name(): string {
        return this.props.name;
    }
    public static create(props: IValueStreamProps): Result<ValueStream> {
        const propsResult = Guard.againstNullOrUndefinedBulk([]);
        if (!propsResult.succeeded) {
            return Result.fail<ValueStream>(propsResult.message);
        }
        const defaultValues = {
            ...props,
        };
        defaultValues.createdAt = new Date();
        defaultValues.updatedAt = new Date();
        const valueStream = new ValueStream(defaultValues);
        return Result.ok<ValueStream>(valueStream);
    }
}
