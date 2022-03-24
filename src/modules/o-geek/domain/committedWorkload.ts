import { WorkloadStatus } from '../../../common/constants/committed-status';
import { DateRange } from '../../../common/constants/date-range';
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
    committedWorkload?: number;
    startDate?: Date;
    expiredDate?: Date;
    pic?: User;
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
    set pic(pic: User) {
        this.props.pic = pic;
    }
    get pic(): User {
        return this.props.pic;
    }
    public isActive(): boolean {
        return this.props.status === WorkloadStatus.ACTIVE;
    }
    public getValueStreamId(): number {
        return Number(this.contributedValue.valueStream.id.toValue());
    }
    public getExpertiseScopeId(): number {
        return Number(this.contributedValue.expertiseScope.id.toValue());
    }
    public getExpertiseScopeName(): string {
        return this.contributedValue.expertiseScope.name;
    }
    public durationDay(startDate: Date, endDate: Date): number {
        if (startDate < endDate) {
            return Math.floor(
                (endDate.getTime() - startDate.getTime()) /
                    (DateRange.MILLISECONDS_IN_DAY * DateRange.DAY_OF_WEEK),
            );
        }
        return Math.floor(
            (startDate.getTime() - endDate.getTime()) /
                (DateRange.MILLISECONDS_IN_DAY * DateRange.DAY_OF_WEEK),
        );
    }
    // startDate < startDateOfYear
    public calculateExpiredDateOne(
        startDateOfYear: Date,
        endDateOfYear: Date,
        expiredDate: Date,
    ): number {
        // expiredDate <= endDateOfYear
        if (expiredDate <= endDateOfYear) {
            return (
                this.durationDay(startDateOfYear, expiredDate) *
                this.committedWorkload
            );
        }
        return (
            this.durationDay(startDateOfYear, endDateOfYear) *
            this.committedWorkload
        );
    }
    // startDate >= startDateOfYear
    public calculateExpiredDateTwo(
        startDate: Date,
        expiredDate: Date,
        endDateOfYear: Date,
    ): number {
        // expiredDate <= endDateOfYear
        if (expiredDate <= endDateOfYear) {
            return (
                this.durationDay(startDate, expiredDate) *
                this.committedWorkload
            );
        }
        // epxiredDate > endDateOfYear
        if (expiredDate > endDateOfYear) {
            return (
                this.durationDay(startDate, endDateOfYear) *
                this.committedWorkload
            );
        }
    }
    public calculateCommittedWorkload(
        startDateOfYearString: string,
        endDateOfYearString: string,
    ): number {
        const startDateOfYear = new Date(startDateOfYearString);
        const endDateOfYear = new Date(endDateOfYearString);
        if (this.startDate < startDateOfYear) {
            return this.calculateExpiredDateOne(
                startDateOfYear,
                endDateOfYear,
                this.expiredDate,
            );
        } // startDate >= startDateOfYear
        return this.calculateExpiredDateTwo(
            this.startDate,
            this.expiredDate,
            endDateOfYear,
        );
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
        defaultValues.contributedValue = props.contributedValue;
        const committedWorkload = new CommittedWorkload(defaultValues, id);
        return Result.ok<CommittedWorkload>(committedWorkload);
    }
}
