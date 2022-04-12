import { UniqueEntityID } from '../../../core/domain/UniqueEntityID';
import { Mapper } from '../../../core/infra/Mapper';
import { Issue } from '../domain/issue';
import { IssueEntity } from '../infra/database/entities/issue.entity';
import { PotentialIssueDto } from '../infra/dtos/getPotentialIssue/getPotentialIssue.dto';
import { IssueDto } from '../infra/dtos/issue.dto';
import { UserMap } from './userMap';

export class IssueMap implements Mapper<Issue> {
    public static fromDomain(issue: Issue): IssueDto {
        return {
            id: issue.id,
            status: issue.status,
            firstDateOfWeek: issue.firstDateOfWeek,
            note: issue.note,
            user: issue.user,
        };
    }
    public static fromDomainOne(issue: Issue): PotentialIssueDto {
        return {
            userId: Number(issue.user.id),
            status: issue.status,
            note: issue.note,
            firstDateOfWeek: issue.firstDateOfWeek,
            createdAt: issue.createdAt,
        };
    }

    public static fromDomainAll(issues: Issue[]): IssueDto[] {
        const issueArrayDto = new Array<IssueDto>();
        issues.forEach((issue) => {
            issueArrayDto.push(IssueMap.fromDomain(issue));
        });
        return issueArrayDto;
    }

    public static toDomain(raw: IssueEntity): Issue {
        const { id } = raw;
        const issueOrError = Issue.create(
            {
                status: raw.status,
                note: raw.note,
                firstDateOfWeek: raw.firstDateOfWeek,
                user: UserMap.toDomain(raw.user),
                updatedBy: raw.updatedBy,
                createdBy: raw.createdBy,
            },
            new UniqueEntityID(id),
        );

        return issueOrError.isSuccess ? issueOrError.getValue() : null;
    }

    public static toDomainOne(raw: IssueEntity): Issue {
        const { id } = raw;
        const potentialIssueOrError = Issue.create(
            {
                user: UserMap.toDomain(raw.user),
                status: raw.status,
                note: raw.note,
                firstDateOfWeek: raw.firstDateOfWeek,
                createdAt: raw.createdAt,
            },
            new UniqueEntityID(id),
        );
        return potentialIssueOrError.isSuccess
            ? potentialIssueOrError.getValue()
            : null;
    }

    public static toDomainAll(issues: IssueEntity[]): Issue[] {
        const issueArray = new Array<Issue>();
        issues.forEach((issue) => {
            const issueOrError = IssueMap.toDomain(issue);
            if (issueOrError) {
                issueArray.push(issueOrError);
            } else {
                return null;
            }
        });

        return issueArray;
    }

    public static toEntity(issue: Issue): IssueEntity {
        const user = UserMap.toEntity(issue.user);
        const issueEntity = new IssueEntity();
        issueEntity.id = Number(issue.id.toValue());
        issueEntity.note = issue.note;
        issueEntity.status = issue.status;
        issueEntity.user = user;

        return issueEntity;
    }
}
