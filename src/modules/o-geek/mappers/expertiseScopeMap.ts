import { UniqueEntityID } from '../../../core/domain/UniqueEntityID';
import { Mapper } from '../../../core/infra/Mapper';
import { ExpertiseScope } from '../domain/expertiseScope';
import { ExpertiseScopeEntity } from '../infra/database/entities/expertiseScope.entity';
import { ExpertiseScopeDto } from '../infra/dtos/expertiseScope.dto';
import { ExpertiseScopeShortDto } from '../infra/dtos/getContributedValue/expertiseScopeShort.dto';

export class ExpertiseScopeMap implements Mapper<ExpertiseScope> {
    public static fromDomain(
        expertiseScope: ExpertiseScope,
    ): ExpertiseScopeDto {
        return {
            id: expertiseScope.expertiseScopeId.id,
            name: expertiseScope.name,
        };
    }
    public static fromDomainShort(
        expertiseScope: ExpertiseScope,
    ): ExpertiseScopeShortDto {
        return {
            id: Number(expertiseScope.expertiseScopeId.id),
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
        const expertiseScopeEntity = new ExpertiseScopeEntity();
        expertiseScopeEntity.id = Number(expertiseScope.id.toValue());
        expertiseScopeEntity.name = expertiseScope.name;

        return expertiseScopeEntity;
    }
}
