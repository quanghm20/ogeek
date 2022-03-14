import { AggregateRoot } from '../../../core/domain/AggregateRoot';
import { UniqueEntityID } from '../../../core/domain/UniqueEntityID';
import { Guard } from '../../../core/logic/Guard';
import { Result } from '../../../core/logic/Result';

interface IContributedValueProps {
    expertiseScopeId?: UniqueEntityID;
    valueStreamId?: UniqueEntityID;
}

export class ContributedValue extends AggregateRoot<IContributedValueProps> {
    get expertiseScopeId(): UniqueEntityID {
        return this.props.expertiseScopeId;
    }
    get valueStreamId(): UniqueEntityID {
        return this.props.valueStreamId;
    }
    private constructor(props: IContributedValueProps, id: UniqueEntityID) {
        super(props, id);
    }

    public static create(
        props: IContributedValueProps,
        id?: UniqueEntityID,
    ): Result<ContributedValue> {
        const propsResult = Guard.againstNullOrUndefinedBulk([]);

        if (!propsResult.succeeded) {
            return Result.fail<ContributedValue>(propsResult.message);
        }

        const defaultValues = {
            ...props,
        };

        const contributedValue = new ContributedValue(defaultValues, id);

        return Result.ok<ContributedValue>(contributedValue);
    }
}
