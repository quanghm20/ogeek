import { AggregateRoot } from '../../../core/domain/AggregateRoot';
import { UniqueEntityID } from '../../../core/domain/UniqueEntityID';
import { Guard } from '../../../core/logic/Guard';
import { Result } from '../../../core/logic/Result';

interface ICommittedWorkloadProps {
    userId?: UniqueEntityID;
    contributedValueId?: UniqueEntityID;
    committedWorkloadId?: UniqueEntityID;
    committedWorkload?: number;
    startDate?: Date;
    expiredDate?: Date;
    isActive?: boolean;
    reason?: string;
}

export class CommittedWorkload extends AggregateRoot<ICommittedWorkloadProps> {
    get userId(): UniqueEntityID {
        return this.props.userId;
    }
    get contributedValueId(): UniqueEntityID {
        return this.props.contributedValueId;
    }
    get committedWorkloadId(): UniqueEntityID {
        return this.props.committedWorkloadId;
    }
    get committedWorkload(): number {
        return this.props.committedWorkload;
    }
    get startDate(): Date {
        return this.props.startDate;
    }
    get expiredDate(): Date {
        return this.props.expiredDate;
    }
    get isActive(): boolean {
        return this.props.isActive;
    }

    private constructor(
        props: ICommittedWorkloadProps /* , id: UniqueEntityID*/,
    ) {
        super(props /*id*/);
    }

    public static create(
        props: ICommittedWorkloadProps,
        // id?: UniqueEntityID,
    ): Result<CommittedWorkload> {
        const propsResult = Guard.againstNullOrUndefinedBulk([]);

        if (!propsResult.succeeded) {
            return Result.fail<CommittedWorkload>(propsResult.message);
        }

        const defaultValues = {
            ...props,
        };

        const committedWorkload = new CommittedWorkload(defaultValues /*, id*/);

        return Result.ok<CommittedWorkload>(committedWorkload);
    }
}
