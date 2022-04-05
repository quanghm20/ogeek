import {
    Check,
    Column,
    Entity,
    JoinColumn,
    ManyToOne,
    OneToMany,
} from 'typeorm';

import { AbstractEntity } from '../../../../../common/abstract.entity';
import { CommittedWorkloadStatus } from '../../../../../common/constants/committedStatus';
import { ContributedValueEntity } from './contributedValue.entity';
import { PlannedWorkloadEntity } from './plannedWorkload.entity';
import { UserEntity } from './user.entity';

@Entity({ name: 'committed_workload' })
@Check(
    'CHK_START_DATE_COMMITTED_WORKLOAD',
    '"start_date" > now() AND "start_date" < "expired_date"',
)
@Check('CHK_EXPIRED_DATE_COMMITTED_WORKLOAD', '"expired_date" > now()')
@Check(
    'CHK_COMMITTED_WORKLOAD',
    '"committed_workload" >= 0 AND "committed_workload" <= 50 ',
)
export class CommittedWorkloadEntity extends AbstractEntity {
    @ManyToOne(() => UserEntity, (user) => user.committedWorkloads)
    @JoinColumn({
        name: 'user_id',
    })
    user: UserEntity;

    @ManyToOne(
        () => ContributedValueEntity,
        (contributedValue) => contributedValue.committedWorkloads,
    )
    @JoinColumn({
        name: 'contributed_value_id',
    })
    contributedValue: ContributedValueEntity;

    @Column({
        nullable: false,
        name: 'committed_workload',
    })
    committedWorkload: number;

    @Column({
        nullable: false,
        name: 'start_date',
    })
    startDate: Date;

    @Column({
        default: CommittedWorkloadStatus.ACTIVE,
        name: 'status',
    })
    status: CommittedWorkloadStatus;

    @Column({
        nullable: false,
        name: 'expired_date',
    })
    expiredDate: Date;

    @ManyToOne(() => UserEntity, (user) => user.id)
    @JoinColumn({
        name: 'created_by',
    })
    createdBy?: UserEntity;

    @ManyToOne(() => UserEntity, (user) => user.id)
    @JoinColumn({
        name: 'updated_by',
    })
    updatedBy?: UserEntity;

    @ManyToOne(() => UserEntity, (user) => user.id)
    @JoinColumn({
        name: 'deleted_by',
    })
    deletedBy?: UserEntity;

    @OneToMany(
        () => PlannedWorkloadEntity,
        (plannedWorkload) => plannedWorkload.committedWorkload,
    )
    plannedWorkloads: PlannedWorkloadEntity[];

    constructor(
        user: UserEntity,
        contributedValue: ContributedValueEntity,
        committedWorkload: number,
        startDate: Date,
        expiredDate: Date,
        status?: CommittedWorkloadStatus,
        createdAt?: Date,
        updatedAt?: Date,
    ) {
        super();
        this.user = user;
        this.contributedValue = contributedValue;
        this.committedWorkload = committedWorkload;
        this.startDate = startDate;
        this.expiredDate = expiredDate;
        this.status = status;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
    }
}
