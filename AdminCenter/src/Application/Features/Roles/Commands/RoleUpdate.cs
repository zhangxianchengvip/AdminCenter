﻿namespace AdminCenter.Application.Features.Roles.Commands;

/// <summary>
/// 角色修改
/// </summary>
public record RoleUpdateCommand(Guid Id, string Name, string? Description) : IRequest<bool>;

public class RoleUpdateCommandValidator : AbstractValidator<RoleCreateCommand>
{
    public RoleUpdateCommandValidator()
    {
        RuleFor(v => v.Name).NotNull();
    }
}

public class RoleUpdataHandler(IApplicationDbContext context) : IRequestHandler<RoleUpdateCommand, bool>
{
    public async Task<bool> Handle(RoleUpdateCommand request, CancellationToken cancellationToken)
    {
        var role = await context.Roles.FindAsync(request.Id);

        if (role != null)
        {
            role.Description = request.Description;
            role.UpdateRoleName(request.Name);
            return true;
        }

        throw new BusinessException(ExceptionMessage.RoleNotExist);
    }
}
