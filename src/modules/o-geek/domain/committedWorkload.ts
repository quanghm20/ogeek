import { AggregateRoot } from '../../../core/domain/AggregateRoot';
import { Guard } from '../../../core/logic/Guard';
import { Result } from '../../../core/logic/Result';
import { ContributedValue } from './contributedValue';
import { User } from './user';

interface ICommittedWorkloadProps {
    id: number;
    committedWorkload: number;
    contributedValue: ContributedValue;
    user: User;
    startDate: Date;
    expiredDate: Date;
    status: boolean;
    picId: User;
    createdAt?: Date;
    updatedAt?: Date;
}

export class CommittedWorkload extends AggregateRoot<ICommittedWorkloadProps> {
    private constructor(props: ICommittedWorkloadProps) {
        super(props);
    }
    get committedWorkloadId(): number {
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
        props: ICommittedWorkloadProps,
    ): Result<CommittedWorkload> {
        const propsResult = Guard.againstNullOrUndefinedBulk([]);
        if (!propsResult.succeeded) {
            return Result.fail<CommittedWorkload>(propsResult.message);
        }
        const defaultValues = {
            ...props,
        };
        const committedWorkload = new CommittedWorkload(defaultValues);
        return Result.ok<CommittedWorkload>(committedWorkload);
    }
}
