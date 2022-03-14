'use strict';

import {
    CreateDateColumn,
    PrimaryGeneratedColumn,
    UpdateDateColumn,
} from 'typeorm';

import { UniqueEntityID } from '../core/domain/UniqueEntityID';

export abstract class AbstractEntity {
    @PrimaryGeneratedColumn()
    id: UniqueEntityID;

    @CreateDateColumn({
        type: 'timestamp without time zone',
        name: 'created_at',
    })
    createdAt: Date;

    @UpdateDateColumn({
        type: 'timestamp without time zone',
        name: 'updated_at',
    })
    updatedAt: Date;
}
