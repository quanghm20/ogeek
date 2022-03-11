import { AggregateRoot } from '../../../core/domain/AggregateRoot';
import { Guard } from '../../../core/logic/Guard';
import { Result } from '../../../core/logic/Result';

interface IExpertiseScope {
    id: number;
    name: string;
    createdAt?: Date;
    updatedAt?: Date;
}

export class ExpertiseScope extends AggregateRoot<IExpertiseScope> {
    private constructor(props: IExpertiseScope) {
        super(props);
    }

    get expertiseScopeId(): number {
        return this.props.id;
    }

    get name(): string {
        return this.props.name;
    }

    public static create(props: IExpertiseScope): Result<ExpertiseScope> {
        const propsResult = Guard.againstNullOrUndefinedBulk([]);
        if (!propsResult.succeeded) {
            return Result.fail<ExpertiseScope>(propsResult.message);
        }
        const defaultValues = {
            ...props,
        };
        defaultValues.createdAt = new Date();
        defaultValues.updatedAt = new Date();
        const expertiseScope = new ExpertiseScope(defaultValues);
        return Result.ok<ExpertiseScope>(expertiseScope);
    }
}
