import { UniqueEntityID } from '../../../core/domain/UniqueEntityID';
import { Mapper } from '../../../core/infra/Mapper';
import { Issue } from '../domain/issue';
import { IssueEntity } from '../infra/database/entities/issue.entity';
import { IssueDto } from '../infra/dtos/issue.dto';
import { UserMap } from './userMap';

export class IssueMap implements Mapper<Issue> {
    public static fromDomain(issue: Issue): IssueDto {
        return {
            id: issue.id,
            type: issue.type,
            week: issue.week,
            user: issue.user,
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
                type: raw.type,
                week: raw.week,
                user: UserMap.toDomain(raw.user),
            },
            new UniqueEntityID(id),
        );

        return issueOrError.isSuccess ? issueOrError.getValue() : null;
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
        const week = issue.week++;
        return new IssueEntity(issue.type, week, user);
    }
}
