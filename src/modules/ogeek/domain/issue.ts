import { IssueStatus } from '../../../common/constants/issueStatus';
import { AggregateRoot } from '../../../core/domain/AggregateRoot';
import { UniqueEntityID } from '../../../core/domain/UniqueEntityID';
import { Guard } from '../../../core/logic/Guard';
import { Result } from '../../../core/logic/Result';
import { DomainId } from './domainId';
import { User } from './user';
interface IIssueProps {
    week: number;
    type: IssueStatus;
    user: User;
    createdAt?: Date;
    updatedAt?: Date;
}
export class Issue extends AggregateRoot<IIssueProps> {
    private constructor(props: IIssueProps, id: UniqueEntityID) {
        super(props, id);
    }
    get issueId(): DomainId {
        return DomainId.create(this._id).getValue();
    }
    get type(): IssueStatus {
        return this.props.type;
    }
    set type(type: IssueStatus) {
        this.props.type = type;
    }
    get week(): number {
        return this.props.week;
    }
    set week(week: number) {
        this.props.week = week;
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
