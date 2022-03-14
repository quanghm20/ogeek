import { UniqueEntityID } from '../../../core/domain/UniqueEntityID';
import { Mapper } from '../../../core/infra/Mapper';
import { ExpertiseScope } from '../domain/expertiseScope';
import { ExpertiseScopeEntity } from '../infra/database/entities/expertiseScope.entity';
import { ExpertiseScopeDto } from '../infra/dtos/expertiseScope.dto';

export class ExpertiseScopeMap implements Mapper<ExpertiseScope> {
    public static fromDomain(
        expertiseScope: ExpertiseScope,
    ): ExpertiseScopeDto {
        return {
            id: expertiseScope.expertiseScopeId.id,
            name: expertiseScope.name,
        };
    }

    public static toDomain(raw: ExpertiseScopeEntity): ExpertiseScope {
        const { id } = raw;
        const profileOrError = ExpertiseScope.create(
            {
                name: raw.name,
            },
            new UniqueEntityID(id),
        );

        return profileOrError.isSuccess ? profileOrError.getValue() : null;
    }
}
