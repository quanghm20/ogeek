import { AggregateRoot } from '../../../core/domain/AggregateRoot';
import { UniqueEntityID } from '../../../core/domain/UniqueEntityID';
import { Guard } from '../../../core/logic/Guard';
import { Result } from '../../../core/logic/Result';
import { ProfileId } from './profileId';

interface IProfileProps {
    createdAt?: Date;
    facebookLink?: string;
}

export class Profile extends AggregateRoot<IProfileProps> {
    get profileId(): ProfileId {
        return ProfileId.create(this._id).getValue();
    }

    get facebookLink(): string {
        return this.props.facebookLink;
    }

    get createdAt(): Date {
        return this.props.createdAt;
    }

    private constructor(props: IProfileProps, id: UniqueEntityID) {
        super(props, id);
    }

    public static create(
        props: IProfileProps,
        id?: UniqueEntityID,
    ): Result<Profile> {
        const propsResult = Guard.againstNullOrUndefinedBulk([]);

        if (!propsResult.succeeded) {
            return Result.fail<Profile>(propsResult.message);
        }

        const defaultValues = {
            ...props,
        };

        const profile = new Profile(defaultValues, id);

        return Result.ok<Profile>(profile);
    }
}
