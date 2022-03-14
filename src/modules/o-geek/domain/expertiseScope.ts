import { AggregateRoot } from '../../../core/domain/AggregateRoot';
import { UniqueEntityID } from '../../../core/domain/UniqueEntityID';
import { Guard } from '../../../core/logic/Guard';
import { Result } from '../../../core/logic/Result';

interface IExpertiseScopeProps {
    expertiseScopeId?: UniqueEntityID;
    expertiseScope?: string;
}

export class ExpertiseScope extends AggregateRoot<IExpertiseScopeProps> {
    get expertiseScopeId(): UniqueEntityID {
        return this.props.expertiseScopeId;
    }
    get expertiseScope(): string {
        return this.props.expertiseScope;
    }
    private constructor(props: IExpertiseScopeProps, id: UniqueEntityID) {
        super(props, id);
    }

    public static create(
        props: IExpertiseScopeProps,
        id?: UniqueEntityID,
    ): Result<ExpertiseScope> {
        const propsResult = Guard.againstNullOrUndefinedBulk([]);

        if (!propsResult.succeeded) {
            return Result.fail<ExpertiseScope>(propsResult.message);
        }

        const defaultValues = {
            ...props,
        };

        const expertiseScope = new ExpertiseScope(defaultValues, id);

        return Result.ok<ExpertiseScope>(expertiseScope);
    }
}
