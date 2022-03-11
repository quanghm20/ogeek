import { AggregateRoot } from '../../../core/domain/AggregateRoot';
import { Guard } from '../../../core/logic/Guard';
import { Result } from '../../../core/logic/Result';
import { CommittedWorkload } from './committedWorkload';
import { ContributedValue } from './contributedValue';
import { User } from './user';

interface IPlannedWorkloadProps {
    id: number;
    plannedWorkload: number;
    contributedValue: ContributedValue;
    committedWorkload: CommittedWorkload;
    user: User;
    startDate: Date;
    expiredDate: Date;
    createdAt?: Date;
    updatedAt?: Date;
}

export class PlannedWorkload extends AggregateRoot<IPlannedWorkloadProps> {
    private constructor(props: IPlannedWorkloadProps) {
        super(props);
    }
    get plannedWorkloadId(): number {
        return this.props.id;
    }
    get contributedValueId(): number {
        return this.props.contributedValue.contributedValueId;
    }
    get valueStreamId(): number {
        return this.props.contributedValue.valueStreamId;
    }
    get valueStreamName(): string {
        return this.props.contributedValue.valueStreamName;
    }
    get expertiseScopeId(): number {
        return this.props.contributedValue.expertiseScopeId;
    }
    get expertiseScopeName(): string {
        return this.props.contributedValue.expertiseScopeName;
    }
    get userId(): number {
        return this.props.user.userId;
    }
    get userName(): string {
        return this.props.user.name;
    }
    public static create(
        props: IPlannedWorkloadProps,
    ): Result<PlannedWorkload> {
        const propsResult = Guard.againstNullOrUndefinedBulk([]);
        if (!propsResult.succeeded) {
            return Result.fail<PlannedWorkload>(propsResult.message);
        }
        const defaultValues = {
            ...props,
        };
        defaultValues.createdAt = new Date();
        defaultValues.updatedAt = new Date();
        const plannedWorkload = new PlannedWorkload(defaultValues);
        return Result.ok<PlannedWorkload>(plannedWorkload);
    }
}
