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
        const expertiseScopeDto = new ExpertiseScopeDto();
        if (expertiseScope) {
            expertiseScopeDto.id = expertiseScope.expertiseScopeId.id;
            expertiseScopeDto.name = expertiseScope.name;
        }
        return expertiseScopeDto;
    }
    public static fromDomainShort(
        expertiseScope: ExpertiseScope,
    ): ExpertiseScopeShortDto {
        const expertiseScopeDto = new ExpertiseScopeShortDto();
        if (expertiseScope) {
            expertiseScopeDto.id = Number(expertiseScope.expertiseScopeId.id);
            expertiseScopeDto.name = expertiseScope.name;
        }
        return expertiseScopeDto;
    }

    public static fromDomainAll(
        expertiseScopes: ExpertiseScope[],
    ): ExpertiseScopeDto[] {
        const listExpertiseScopesDto = new Array<ExpertiseScopeDto>();
        if (expertiseScopes) {
            expertiseScopes.forEach((expertiseScope) => {
                listExpertiseScopesDto.push(
                    ExpertiseScopeMap.fromDomain(expertiseScope),
                );
            });
        }
        return listExpertiseScopesDto;
    }

    public static toDomain(raw: ExpertiseScopeEntity): ExpertiseScope {
        if (!raw) {
            return null;
        }
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
        if (expertiseScope) {
            expertiseScopeEntity.id = Number(expertiseScope.id.toValue());
            expertiseScopeEntity.name = expertiseScope.name;
        }
        return expertiseScopeEntity;
    }

    public static toDomainAll(
        expertiseScopes: ExpertiseScopeEntity[],
    ): ExpertiseScope[] {
        const listExpertiseScopes = new Array<ExpertiseScope>();
        if (expertiseScopes) {
            expertiseScopes.forEach((expertiseScope) => {
                const expertiseScopesOrError =
                    ExpertiseScopeMap.toDomain(expertiseScope);
                if (expertiseScopesOrError) {
                    listExpertiseScopes.push(expertiseScopesOrError);
                } else {
                    return null;
                }
            });
        }
        return listExpertiseScopes;
    }
}
