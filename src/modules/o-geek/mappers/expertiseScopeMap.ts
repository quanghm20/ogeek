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
        const expertiseScopeOrError = ExpertiseScope.create(
            {
                name: raw.name,
            },
            new UniqueEntityID(id),
        );

        return expertiseScopeOrError.isSuccess
            ? expertiseScopeOrError.getValue()
            : null;
    }

    public static toEntity(
        expertiseScope: ExpertiseScope,
    ): ExpertiseScopeEntity {
        const entity = new ExpertiseScopeEntity();

        entity.id = Number(expertiseScope.id.toValue());
        entity.name = expertiseScope.name;

        return entity;
    }
}
