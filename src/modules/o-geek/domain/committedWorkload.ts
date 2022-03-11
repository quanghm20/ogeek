import { AggregateRoot } from '../../../core/domain/AggregateRoot';
import { UniqueEntityID } from '../../../core/domain/UniqueEntityID';
import { Guard } from '../../../core/logic/Guard';
import { Result } from '../../../core/logic/Result';
import { CommittedWorkloadId } from './committedWorkloadId';

interface CommittedWorkloadProps {
    userId?: number;
    startDate?: Date;
}

export class CommittedWorkload extends AggregateRoot<CommittedWorkloadProps> {
    get committedWorkloadId(): CommittedWorkloadId {
        return CommittedWorkloadId.create(this._id).getValue();
    }
    get userId(): number {
        return this.props.userId;
    }
    get startDate(): Date {
        return this.props.startDate;
    }

    private constructor(props: CommittedWorkloadProps, id: UniqueEntityID) {
        super(props, id);
    }

    public static create(
        props: CommittedWorkloadProps,
        id?: UniqueEntityID,
    ): Result<CommittedWorkload> {
        const propsResult = Guard.againstNullOrUndefinedBulk([]);

        if (!propsResult.succeeded) {
            return Result.fail<CommittedWorkload>(propsResult.message);
        }

        const defaultValuesToShow = {
            ...props,
        };

        const committedWorkload = new CommittedWorkload(
            defaultValuesToShow,
            id,
        );

        return Result.ok<CommittedWorkload>(committedWorkload);
    }
}
