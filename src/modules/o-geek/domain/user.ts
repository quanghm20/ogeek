import { RoleType } from '../../../common/constants/role-type';
import { Status } from '../../../common/constants/status';
import { AggregateRoot } from '../../../core/domain/AggregateRoot';
import { Guard } from '../../../core/logic/Guard';
import { Result } from '../../../core/logic/Result';

interface IUserProps {
    id: number;
    alias: string;
    name: string;
    email: string;
    avatar: string;
    role: string;
    weekStatus: string;
    createdAt?: Date;
    updatedAt?: Date;
}

export class User extends AggregateRoot<IUserProps> {
    private constructor(props: IUserProps) {
        super(props);
    }
    get userId(): number {
        return this.props.id;
    }
    get alias(): string {
        return this.props.alias;
    }
    get name(): string {
        return this.props.name;
    }
    get email(): string {
        return this.props.email;
    }
    get avatar(): string {
        return this.props.avatar;
    }
    get role(): string {
        return this.props.role;
    }
    get weekStatus(): string {
        return this.props.weekStatus;
    }
    public isAdmin(): boolean {
        return this.props.role === RoleType.ADMIN;
    }
    public isPlanning(): boolean {
        return this.props.weekStatus === Status.PLANING;
    }
    public isPlanned(): boolean {
        return this.props.weekStatus === Status.PLANNED;
    }
    public isExecuting(): boolean {
        return this.props.weekStatus === Status.EXECUTING;
    }
    public isClosed(): boolean {
        return this.props.weekStatus === Status.CLOSED;
    }
    public static create(props: IUserProps): Result<User> {
        const propsResult = Guard.againstNullOrUndefinedBulk([]);
        if (!propsResult.succeeded) {
            return Result.fail<User>(propsResult.message);
        }
        const defaultValues = {
            ...props,
        };
        defaultValues.createdAt = new Date();
        defaultValues.updatedAt = new Date();
        const user = new User(defaultValues);
        return Result.ok<User>(user);
    }
}
