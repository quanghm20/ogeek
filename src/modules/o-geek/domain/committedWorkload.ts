import { WorkloadStatus } from '../../../common/constants/committed-status';
import { AggregateRoot } from '../../../core/domain/AggregateRoot';
import { UniqueEntityID } from '../../../core/domain/UniqueEntityID';
import { Guard } from '../../../core/logic/Guard';
import { Result } from '../../../core/logic/Result';
import { ContributedValue } from './contributedValue';
import { DomainId } from './domainId';
import { User } from './user';

interface ICommittedWorkloadProps {
    contributedValue?: ContributedValue;
    user?: User;
    committedWorkload: number;
    startDate: Date;
    expiredDate: Date;
    picId?: User;
    status?: WorkloadStatus;
    createdAt?: Date;
    updatedAt?: Date;
}
export class CommittedWorkload extends AggregateRoot<ICommittedWorkloadProps> {
    private constructor(props: ICommittedWorkloadProps, id: UniqueEntityID) {
        super(props, id);
    }
    get committedWorkloadId(): DomainId {
        return DomainId.create(this._id).getValue();
    }
    get contributedValue(): ContributedValue {
        return this.props.contributedValue;
    }
    set contributedValue(contributedValue: ContributedValue) {
        this.props.contributedValue = contributedValue;
    }
    get user(): User {
        return this.props.user;
    }
    set user(user: User) {
        this.props.user = user;
    }
    get committedWorkload(): number {
        return this.props.committedWorkload;
    }
    set committedWorkload(workload: number) {
        this.props.committedWorkload = workload;
    }
    get startDate(): Date {
        return this.props.startDate;
    }
    set startDate(startDate: Date) {
        this.props.startDate = startDate;
    }
    get expiredDate(): Date {
        return this.props.expiredDate;
    }
    set expiredDate(expiredDate: Date) {
        this.props.expiredDate = expiredDate;
    }
    get status(): WorkloadStatus {
        return this.props.status;
    }
    set status(status: WorkloadStatus) {
        this.props.status = status;
    }
    public isActive(): boolean {
        return this.props.status === WorkloadStatus.ACTIVE;
    }

    public static create(
        props: ICommittedWorkloadProps,
        id: UniqueEntityID,
    ): Result<CommittedWorkload> {
        const propsResult = Guard.againstNullOrUndefinedBulk([]);
        if (!propsResult.succeeded) {
            return Result.fail<CommittedWorkload>(propsResult.message);
        }
        const defaultValues = {
            ...props,
        };
        defaultValues.createdAt = new Date();
        defaultValues.updatedAt = new Date();
        if (defaultValues.startDate < defaultValues.createdAt) {
            defaultValues.status = WorkloadStatus.INACTIVE;
        }
        const committedWorkload = new CommittedWorkload(defaultValues, id);
        return Result.ok<CommittedWorkload>(committedWorkload);
    }
}
