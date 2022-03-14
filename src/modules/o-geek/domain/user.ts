import { RoleType } from '../../../common/constants/role-type';
import { Status } from '../../../common/constants/status';
import { AggregateRoot } from '../../../core/domain/AggregateRoot';
import { UniqueEntityID } from '../../../core/domain/UniqueEntityID';
import { Guard } from '../../../core/logic/Guard';
import { Result } from '../../../core/logic/Result';
import { DomainId } from './domainId';

interface IUserProps {
    alias: string;
    name: string;
    phone: string;
    email: string;
    avatar: string;
    role: string;
    weekStatus: string;
    createdAt?: Date;
    updatedAt?: Date;
}
export class User extends AggregateRoot<IUserProps> {
    private constructor(props: IUserProps, id: UniqueEntityID) {
        super(props, id);
    }
    get userId(): DomainId {
        return DomainId.create(this._id).getValue();
    }
    get alias(): string {
        return this.props.alias;
    }
    set alias(alias: string) {
        this.props.alias = alias;
    }
    get name(): string {
        return this.props.name;
    }
    set name(name: string) {
        this.props.name = name;
    }
    get phone(): string {
        return this.props.phone;
    }
    set phone(phone: string) {
        this.props.phone = phone;
    }
    get email(): string {
        return this.props.email;
    }
    set email(email: string) {
        this.props.email = email;
    }
    get avatar(): string {
        return this.props.avatar;
    }
    set avatar(avatar: string) {
        this.props.avatar = avatar;
    }
    get weekStatus(): string {
        return this.props.weekStatus;
    }
    set weekStatus(weekStatus: string) {
        this.props.weekStatus = weekStatus;
    }
    get role(): string {
        return this.props.role;
    }
    set role(role: string) {
        this.props.role = role;
    }
    public isAdmin(): boolean {
        return this.props.role === RoleType.ADMIN;
    }
    public isPlaning(): boolean {
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
