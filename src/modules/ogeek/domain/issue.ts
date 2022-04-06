import { IssueStatus } from '../../../common/constants/issueStatus';
import { AggregateRoot } from '../../../core/domain/AggregateRoot';
import { UniqueEntityID } from '../../../core/domain/UniqueEntityID';
import { Guard } from '../../../core/logic/Guard';
import { Result } from '../../../core/logic/Result';
import { DomainId } from './domainId';
import { User } from './user';
interface IIssueProps {
    note: string;
    status: IssueStatus;
    user: User;
    createdBy?: number;
    updatedBy?: number;
    deletedBy?: number;
    createdAt?: Date;
    updatedAt?: Date;
    deletedAt?: Date;
}
export class Issue extends AggregateRoot<IIssueProps> {
    private constructor(props?: IIssueProps, id?: UniqueEntityID) {
        super(props, id);
    }

    get issueId(): DomainId {
        return DomainId.create(this._id).getValue();
    }
    get status(): IssueStatus {
        return this.props.status;
    }
    set status(status: IssueStatus) {
        this.props.status = status;
    }
    get note(): string {
        return this.props.note;
    }
    set note(note: string) {
        this.props.note = note;
    }
    get user(): User {
        return this.props.user;
    }
    set user(user: User) {
        this.props.user = user;
    }
    public static create(
        props: IIssueProps,
        id: UniqueEntityID,
    ): Result<Issue> {
        const propsResult = Guard.againstNullOrUndefinedBulk([]);
        if (!propsResult.succeeded) {
            return Result.fail<Issue>(propsResult.message);
        }
        const defaultValues = {
            ...props,
        };
        defaultValues.createdAt = new Date();
        defaultValues.updatedAt = new Date();
        const issue = new Issue(defaultValues, id);
        return Result.ok<Issue>(issue);
    }
}
