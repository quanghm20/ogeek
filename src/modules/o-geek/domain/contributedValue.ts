import { AggregateRoot } from '../../../core/domain/AggregateRoot';
import { Guard } from '../../../core/logic/Guard';
import { Result } from '../../../core/logic/Result';
import { ExpertiseScope } from './expertiseScope';
import { ValueStream } from './valueStream';

interface IContributedValueProps {
    id: number;
    valueStream: ValueStream;
    expertiseScope: ExpertiseScope;
    createdAt?: Date;
    updatedAt?: Date;
}

export class ContributedValue extends AggregateRoot<IContributedValueProps> {
    private constructor(props: IContributedValueProps) {
        super(props);
    }
    get contributedValueId(): number {
        return this.props.id;
    }
    get valueStreamId(): number {
        return this.props.valueStream.valueStreamId;
    }
    get valueStreamName(): string {
        return this.props.valueStream.name;
    }
    get expertiseScopeId(): number {
        return this.props.expertiseScope.expertiseScopeId;
    }
    get expertiseScopeName(): string {
        return this.props.expertiseScope.name;
    }
    public static create(
        props: IContributedValueProps,
    ): Result<ContributedValue> {
        const propsResult = Guard.againstNullOrUndefinedBulk([]);
        if (!propsResult.succeeded) {
            return Result.fail<ContributedValue>(propsResult.message);
        }
        const defaultValues = {
            ...props,
        };
        defaultValues.createdAt = new Date();
        defaultValues.updatedAt = new Date();
        const contributedValue = new ContributedValue(defaultValues);
        return Result.ok<ContributedValue>(contributedValue);
    }
}
