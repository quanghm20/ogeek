import { Status } from '../../../common/constants/status';
import { AggregateRoot } from '../../../core/domain/AggregateRoot';
import { Guard } from '../../../core/logic/Guard';
import { Result } from '../../../core/logic/Result';
import { CommittedWorkload } from './committedWorkload';
import { ContributedValue } from './contributedValue';
import { User } from './user';

interface IPlannedWorkloadProps {
    id: number;
    contributedValue: ContributedValue;
    user: User;
    plannedWorkload: number;
    committedWorkload: CommittedWorkload;
    startDate: Date;
    status: Status;
    picId: User;
    createdAt: Date;
    updatedAt: Date;
}
export class PlannedWorkload extends AggregateRoot<IPlannedWorkloadProps> {
    private constructor(props: IPlannedWorkloadProps) {
        super(props);
    }
    get userId(): number {
        return this.props.user.userId;
    }
    get user(): User {
        return this.props.user;
    }
    get plannedWorkload(): number {
        return this.props.plannedWorkload;
    }
    get startDate(): Date {
        return this.props.startDate;
    }
    get status(): Status {
        return this.props.status;
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
    get contributedValueId(): number {
        return this.props.contributedValue.contributedValueId;
    }
    get plannedWorkloadId(): number {
        return this.props.id;
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
