'use strict';

import {
    CreateDateColumn,
    DeleteDateColumn,
    PrimaryGeneratedColumn,
    UpdateDateColumn,
} from 'typeorm';

export abstract class AbstractEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @CreateDateColumn({
        type: 'timestamp with time zone',
        name: 'created_at',
    })
    createdAt?: Date;

    @UpdateDateColumn({
        type: 'timestamp with time zone',
        name: 'updated_at',
    })
    updatedAt?: Date;

    @DeleteDateColumn({
        type: 'timestamp with time zone',
        name: 'deleted_at',
    })
    deletedAt?: Date;
    constructor(id?: number) {
        this.id = id;
    }
}
