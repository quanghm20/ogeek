import { AggregateRoot } from '../../../core/domain/AggregateRoot';
import { UniqueEntityID } from '../../../core/domain/UniqueEntityID';
import { Guard } from '../../../core/logic/Guard';
import { Result } from '../../../core/logic/Result';
import { CommittedWorkloadEntity } from '../infra/database/entities/committedWorkload.entity';
import { ContributedValueEntity } from '../infra/database/entities/contributedValue.entity';
import { ExpertiseScopeEntity } from '../infra/database/entities/expertiseScope.entity';
import { UserEntity } from '../infra/database/entities/user.entity';
import { ValueStreamEntity } from '../infra/database/entities/valueStream.entity';
import { CommittedWorkload } from './committedWorkload';
import { ContributedValue } from './contributedValue';
import { DomainId } from './domainId';
import { ExpertiseScope } from './expertiseScope';
import { User } from './user';
import { ValueStream } from './valueStream';

interface IPlannedWorkloadProps {
    contributedValue: ContributedValue | ContributedValueEntity;
    user: User | UserEntity;
    plannedWorkload: number;
    committedWorkload: CommittedWorkload | CommittedWorkloadEntity;
    startDate: Date;
    status: boolean;
    createdAt?: Date;
    updatedAt?: Date;
}
export class PlannedWorkload extends AggregateRoot<IPlannedWorkloadProps> {
    private constructor(props: IPlannedWorkloadProps, id: UniqueEntityID) {
        super(props, id);
    }
    get user(): User | UserEntity {
        return this.props.user;
    }
    set user(user: User | UserEntity) {
        this.props.user = user;
    }
    get plannedWorkload(): number {
        return this.props.plannedWorkload;
    }
    set plannedWorkload(plan: number) {
        this.props.plannedWorkload = plan;
    }
    get startDate(): Date {
        return this.props.startDate;
    }
    set startDate(startDate: Date) {
        this.props.startDate = startDate;
    }
    get status(): boolean {
        return this.props.status;
    }
    get valueStream(): ValueStream | ValueStreamEntity {
        return this.props.contributedValue.valueStream;
    }
    get expertiseScope(): ExpertiseScope | ExpertiseScopeEntity {
        return this.props.contributedValue.expertiseScope;
    }
    get plannedWorkloadId(): DomainId {
        return DomainId.create(this._id).getValue();
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
