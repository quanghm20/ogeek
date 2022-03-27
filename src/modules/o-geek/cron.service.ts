import { Inject, Injectable } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';

import { IssueType } from '../../common/constants/issue-type';
import { IssueEntity } from './infra/database/entities/issue.entity';
import { IssueMap } from './mappers/issueMap';
import { IIssueRepo } from './repos/issueRepo';

@Injectable()
export class CronService {
    constructor(@Inject('IIssueRepo') public readonly issueRepo: IIssueRepo) {}
    @Cron('0 15 0 * * 1') // update on Monday at 00:15
    async autoCreateIssueEntity() {
        const issues = await this.issueRepo.findAll();
        if (issues) {
            const issuesFilter = issues.filter(
                (issue) => issue.type !== IssueType.NOT_ISSUE,
            );
            const issueEntitiesList = [] as IssueEntity[];
            for (const issueItem of issuesFilter) {
                const issue = IssueMap.toEntity(issueItem);
                issueEntitiesList.push(issue);
            }
            await this.issueRepo.createMany(issueEntitiesList);
        }
    }
}
