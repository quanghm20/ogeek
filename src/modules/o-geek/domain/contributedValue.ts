import { AggregateRoot } from '../../../core/domain/AggregateRoot';
import { UniqueEntityID } from '../../../core/domain/UniqueEntityID';
import { Guard } from '../../../core/logic/Guard';
import { Result } from '../../../core/logic/Result';
import { ExpertiseScopeEntity } from '../infra/database/entities/expertiseScope.entity';
import { ValueStreamEntity } from '../infra/database/entities/valueStream.entity';
import { DomainId } from './domainId';
import { ExpertiseScope } from './expertiseScope';
import { ValueStream } from './valueStream';

interface IContributedValueProps {
    valueStream: ValueStream | ValueStreamEntity;
    expertiseScope: ExpertiseScope | ExpertiseScopeEntity;
    createdAt?: Date;
    updatedAt?: Date;
}
export class ContributedValue extends AggregateRoot<IContributedValueProps> {
    private constructor(props: IContributedValueProps, id: UniqueEntityID) {
        super(props, id);
    }
    get valueStream(): ValueStream | ValueStreamEntity {
        return this.props.valueStream;
    }
    set valueStream(valueStream: ValueStream | ValueStreamEntity) {
        this.props.valueStream = valueStream;
    }
    get expertiseScope(): ExpertiseScope | ExpertiseScopeEntity {
        return this.props.expertiseScope;
    }
    set expertiseScope(expertiseScope: ExpertiseScope | ExpertiseScopeEntity) {
        this.props.expertiseScope = expertiseScope;
    }
    get contributedValueId(): DomainId {
        return DomainId.create(this._id).getValue();
    }
    public static create(
        props: IContributedValueProps,
        id: UniqueEntityID,
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
        const contributedValue = new ContributedValue(defaultValues, id);
        return Result.ok<ContributedValue>(contributedValue);
    }
}
