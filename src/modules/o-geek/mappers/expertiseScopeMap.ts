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

    public static fromDomainAll(
        expertiseScopes: ExpertiseScope[],
    ): ExpertiseScopeDto[] {
        const listExpertiseScopesDto = new Array<ExpertiseScopeDto>();
        expertiseScopes.forEach((expertiseScope) => {
            listExpertiseScopesDto.push(
                ExpertiseScopeMap.fromDomain(expertiseScope),
            );
        });
        return listExpertiseScopesDto;
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

    public static toDomainAll(
        expertiseScopes: ExpertiseScopeEntity[],
    ): ExpertiseScope[] {
        const listExpertiseScopes = new Array<ExpertiseScope>();
        expertiseScopes.forEach((expertiseScope) => {
            const expertiseScopesOrError =
                ExpertiseScopeMap.toDomain(expertiseScope);
            if (expertiseScopesOrError) {
                listExpertiseScopes.push(expertiseScopesOrError);
            } else {
                return null;
            }
        });

        return listExpertiseScopes;
    }
}
