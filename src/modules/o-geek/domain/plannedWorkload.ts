import { WorkloadStatus } from '../../../common/constants/committed-status';
import { AggregateRoot } from '../../../core/domain/AggregateRoot';
import { UniqueEntityID } from '../../../core/domain/UniqueEntityID';
import { Guard } from '../../../core/logic/Guard';
import { Result } from '../../../core/logic/Result';
import { CommittedWorkload } from './committedWorkload';
import { ContributedValue } from './contributedValue';
import { DomainId } from './domainId';
import { ExpertiseScope } from './expertiseScope';
import { User } from './user';
import { ValueStream } from './valueStream';

interface IPlannedWorkloadProps {
    contributedValue?: ContributedValue;
    user?: User;
    plannedWorkload?: number;
    committedWorkload?: CommittedWorkload;
    startDate?: Date;
    reason?: string;
    status?: WorkloadStatus;
    createdAt?: Date;
    updatedAt?: Date;
}
export class PlannedWorkload extends AggregateRoot<IPlannedWorkloadProps> {
    private constructor(props: IPlannedWorkloadProps, id: UniqueEntityID) {
        super(props, id);
    }
    get user(): User {
        return this.props.user;
    }
    set user(user: User) {
        this.props.user = user;
    }
    get plannedWorkload(): number {
        return this.props.plannedWorkload;
    }
    set plannedWorkload(workload: number) {
        this.props.plannedWorkload = workload;
    }
    get committedWorkload(): CommittedWorkload {
        return this.props.committedWorkload;
    }
    set committedWorkload(committedWorkload: CommittedWorkload) {
        this.props.committedWorkload = committedWorkload;
    }
    get startDate(): Date {
        return this.props.startDate;
    }
    set startDate(startDate: Date) {
        this.props.startDate = startDate;
    }
    get status(): WorkloadStatus {
        return this.props.status;
    }
    set status(status: WorkloadStatus) {
        this.props.status = status;
    }
    get valueStream(): ValueStream {
        return this.props.contributedValue.valueStream;
    }
    get expertiseScope(): ExpertiseScope {
        return this.props.contributedValue.expertiseScope;
    }
    get plannedWorkloadId(): DomainId {
        return DomainId.create(this._id).getValue();
    }
    get contributedValue(): ContributedValue {
        return this.props.contributedValue;
    }
    get reason(): string {
        return this.props.reason;
    }
    public isActive(): boolean {
        return this.props.status === WorkloadStatus.ACTIVE;
    }
    public static create(
        props: IPlannedWorkloadProps,
        id: UniqueEntityID,
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

        const plannedWorkload = new PlannedWorkload(defaultValues, id);
        return Result.ok<PlannedWorkload>(plannedWorkload);
    }
}
