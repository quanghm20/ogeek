import { RoleType } from '../../../common/constants/role-type';
import { AggregateRoot } from '../../../core/domain/AggregateRoot';
import { UniqueEntityID } from '../../../core/domain/UniqueEntityID';
import { Guard } from '../../../core/logic/Guard';
import { Result } from '../../../core/logic/Result';
import { AggregateId } from './aggregateId';

interface IUserProps {
    alias?: string;
    email?: string;
    name?: string;
    phone?: string;
    avatar?: string;
    role?: RoleType;
}

export class User extends AggregateRoot<IUserProps> {
    get userId(): AggregateId {
        return AggregateId.create(this._id).getValue();
    }

    get alias(): string {
        return this.props.alias;
    }

    get email(): string {
        return this.props.email;
    }

    get name(): string {
        return this.props.name;
    }

    get avatar(): string {
        return this.props.avatar;
    }

    get phone(): string {
        return this.props.phone;
    }

    get role(): RoleType {
        return this.props.role;
    }

    private constructor(props: IUserProps, id: UniqueEntityID) {
        super(props, id);
    }

    public static create(props: IUserProps, id?: UniqueEntityID): Result<User> {
        const propsResult = Guard.againstNullOrUndefinedBulk([]);

        if (!propsResult.succeeded) {
            return Result.fail<User>(propsResult.message);
        }

        const defaultValues = {
            ...props,
        };

        const user = new User(defaultValues, id);

        return Result.ok<User>(user);
    }
}
