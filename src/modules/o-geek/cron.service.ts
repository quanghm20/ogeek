import {
    Inject,
    Injectable,
    InternalServerErrorException,
} from '@nestjs/common';
import { Cron } from '@nestjs/schedule';

import { IssueType } from '../../common/constants/issue-type';
import { IssueEntity } from './infra/database/entities/issue.entity';
import { IssueMap } from './mappers/issueMap';
import { IIssueRepo } from './repos/issueRepo';

@Injectable()
export class CronService {
    constructor(@Inject('IIssueRepo') public readonly issueRepo: IIssueRepo) {}
    @Cron('0 0 20 * * 5') // update on Friday at 20:00
    async autoCreateIssueEntity(): Promise<void> {
        try {
            const issues = await this.issueRepo.findAll();
            if (issues && issues.length > 0) {
                const issuesFilter = issues.filter(
                    (issue) => issue.type !== IssueType.NOT_ISSUE,
                );
                const issueEntitiesList = [] as IssueEntity[];
                for (const issueItem of issuesFilter) {
                    issueItem.week += 1;
                    const issue = IssueMap.toEntity(issueItem);
                    issueEntitiesList.push(issue);
                }
                await this.issueRepo.createMany(issueEntitiesList);
            }
        } catch (err) {
            throw new InternalServerErrorException(err);
        }
    }
}
