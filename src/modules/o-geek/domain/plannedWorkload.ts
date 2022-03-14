import { AggregateRoot } from '../../../core/domain/AggregateRoot';
import { UniqueEntityID } from '../../../core/domain/UniqueEntityID';
import { Guard } from '../../../core/logic/Guard';
import { Result } from '../../../core/logic/Result';

interface IPlannedWorkloadProps {
    userId?: UniqueEntityID;
    contributedValueId?: UniqueEntityID;
    committedWorkloadId?: UniqueEntityID;
    plannedWorkload?: number;
    startDate?: Date;
    isActive?: boolean;
    reason?: string;
}

export class PlannedWorkload extends AggregateRoot<IPlannedWorkloadProps> {
    get userId(): UniqueEntityID {
        return this.props.userId;
    }
    get contributedValue(): UniqueEntityID {
        return this.props.contributedValueId;
    }
    get committedWorkloadId(): UniqueEntityID {
        return this.props.committedWorkloadId;
    }
    get plannedWorkload(): number {
        return this.props.plannedWorkload;
    }
    get startDate(): Date {
        return this.props.startDate;
    }
    get isActive(): boolean {
        return this.props.isActive;
    }
    get reason(): string {
        return this.props.reason;
    }
    private constructor(props: IPlannedWorkloadProps, id: UniqueEntityID) {
        super(props, id);
    }

    public static create(
        props: IPlannedWorkloadProps,
        id?: UniqueEntityID,
    ): Result<PlannedWorkload> {
        const propsResult = Guard.againstNullOrUndefinedBulk([]);

        if (!propsResult.succeeded) {
            return Result.fail<PlannedWorkload>(propsResult.message);
        }

        const defaultValues = {
            ...props,
        };

        const plannedWorkload = new PlannedWorkload(defaultValues, id);

        return Result.ok<PlannedWorkload>(plannedWorkload);
    }
}
