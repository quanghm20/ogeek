import { CommittedWorkloadStatus } from '../../../common/constants/committedStatus';
import { dateRange } from '../../../common/constants/dateRange';
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
    status?: CommittedWorkloadStatus;
    startDate?: Date;
    expiredDate?: Date;
    createdBy?: number;
    updatedBy?: number;
    deletedBy?: number;
    createdAt?: Date;
    updatedAt?: Date;
    deletedAt?: Date;
}

export class CommittedWorkload extends AggregateRoot<ICommittedWorkloadProps> {
    private constructor(props?: ICommittedWorkloadProps, id?: UniqueEntityID) {
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
    get createdBy(): number {
        return this.props.createdBy;
    }
    set createdBy(createdBy: number) {
        this.props.createdBy = createdBy;
    }
    get updatedBy(): number {
        return this.props.createdBy;
    }
    set updatedBy(updatedBy: number) {
        this.props.updatedBy = updatedBy;
    }
    get deletedBy(): number {
        return this.props.createdBy;
    }
    set deletedBy(deletedBy: number) {
        this.props.deletedBy = deletedBy;
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
    get status(): CommittedWorkloadStatus {
        return this.props.status;
    }
    set status(status: CommittedWorkloadStatus) {
        this.props.status = status;
    }
    get createdAt(): Date {
        return this.props.createdAt;
    }
    set createdAt(createdAt: Date) {
        this.props.createdAt = createdAt;
    }
    get updatedAt(): Date {
        return this.props.createdAt;
    }
    set updatedAt(updatedAt: Date) {
        this.props.updatedAt = updatedAt;
    }
    public isActive(): boolean {
        return this.props.status === CommittedWorkloadStatus.ACTIVE;
    }
    public getValueStreamId(): number {
        return Number(this.contributedValue.valueStream.id);
    }
    public getExpertiseScopeId(): number {
        return Number(this.contributedValue.expertiseScope.id);
    }
    public getExpertiseScopeName(): string {
        return this.contributedValue.expertiseScope.name;
    }

    isBelongToExpertiseScope(expertiseScopeId: number | string) {
        return this.id.toValue() === expertiseScopeId;
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
        defaultValues.contributedValue = props.contributedValue;
        const committedWorkload = new CommittedWorkload(defaultValues, id);
        return Result.ok<CommittedWorkload>(committedWorkload);
    }

    public durationDay(startDate: Date, endDate: Date): number {
        if (startDate < endDate) {
            return Math.floor(
                (endDate.getTime() - startDate.getTime()) /
                    (dateRange.MILLISECONDS_IN_DAY * dateRange.DAY_OF_WEEK),
            );
        }
        return Math.floor(
            (startDate.getTime() - endDate.getTime()) /
                (dateRange.MILLISECONDS_IN_DAY * dateRange.DAY_OF_WEEK),
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
    public calculate(
        startDateOfYearString: string,
        endDateOfYearString: string,
        valueStreamId: number,
    ): number {
        if (this.getValueStreamId() === valueStreamId) {
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
    }
}
