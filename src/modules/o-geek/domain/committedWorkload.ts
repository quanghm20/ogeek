import moment from 'moment';

import { WorkloadStatus } from '../../../common/constants/committed-status';
// import { Date } from '../../../common/constants/date';
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
    public getValueStreamId(): number {
        return Number(this.contributedValue.valueStream.id.toValue());
    }
    public getExpertiseScopeId(): number {
        return Number(this.contributedValue.expertiseScope.id.toValue());
    }
    public getExpertiseScopeName(): string {
        return this.contributedValue.expertiseScope.name;
    }
    public duration(startDate: Date, endDate: Date): number {
        if (startDate > endDate) {
            const duration = moment.duration(
                moment(endDate, 'DD-MM-YYYY').diff(
                    moment(startDate, 'DD-MM-YYYY'),
                ),
            );
            return (duration.asDays() + 1) / 7;
        }
        {
            const duration = moment.duration(
                moment(startDate, 'DD-MM-YYYY').diff(
                    moment(endDate, 'DD-MM-YYYY'),
                ),
            );
            return (duration.asDays() + 1) / 7;
        }
    }
    // startDate < startDateOfYear
    public calculateExpiredDateOne(
        startDateOfYear: Date,
        endDateOfYear: Date,
        expiredDate: Date,
    ): number {
        // expiredDate <= endDateOfYear
        if (expiredDate <= endDateOfYear) {
            return this.duration(startDateOfYear, expiredDate);
        }
        return this.duration(startDateOfYear, endDateOfYear);
    }
    // startDate >= startDateOfYear
    public calculateExpiredDateTwo(
        startDate: Date,
        expiredDate: Date,
        endDateOfYear: Date,
    ): number {
        // expiredDate <= endDateOfYear
        if (expiredDate <= endDateOfYear) {
            return this.duration(startDate, expiredDate);
        }
        // epxiredDate > endDateOfYear
        if (expiredDate > endDateOfYear) {
            return this.duration(startDate, endDateOfYear);
        }
    }
    public calculateCommittedWorkload(
        startDateOfYear: Date,
        endDateOfYear: Date,
    ): number {
        if (this.startDate < startDateOfYear) {
            return this.calculateExpiredDateOne(
                startDateOfYear,
                endDateOfYear,
                this.expiredDate,
            );
        }
        return this.calculateExpiredDateTwo(
            this.startDate,
            this.expiredDate,
            endDateOfYear,
        );
    }

    // calculate planned workload (query sum theo contributed, committed, condition: userId = id truyen vao, group by theo contributedId, committedId)
    // truyen expertise scope id, value stream id qua server mock

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
        const committedWorkload = new CommittedWorkload(defaultValues, id);
        return Result.ok<CommittedWorkload>(committedWorkload);
    }
}
