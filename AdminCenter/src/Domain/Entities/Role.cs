﻿using System.Diagnostics.CodeAnalysis;
using AdminCenter.Domain.Constants;
using Ardalis.GuardClauses;

namespace AdminCenter.Domain;

public class Role : AggregateRoot<Guid>
{
    /// <summary>
    /// 角色名称
    /// </summary>
    public string Name { get; private set; } = default!;

    /// <summary>
    /// 描述
    /// </summary>
    public string? Description { get; set; }

    /// <summary>
    /// 状态
    /// </summary>
    public StatusEnum Status { get; set; }

    public Role(
        [NotNull] Guid id,
        [NotNull] string name,
        string? description = null) : base(id)
    {
        Description = description;
        Status = StatusEnum.Enable;
        Name = Guard.Against.NullOrWhiteSpace
        (
            input: name,
            parameterName: nameof(name),
            exceptionCreator: () => new AdminBusinessException(ExctptionMessage.RoleNameNull)
        );
    }

    /// <summary>
    /// 更新角色名称
    /// </summary>
    /// <param name="roleName"></param>
    /// <returns></returns>
    public Role UpdateRoleName([NotNull] string name)
    {
        Name = Guard.Against.NullOrWhiteSpace
        (
            input: name,
            parameterName: nameof(name),
            exceptionCreator: () => new AdminBusinessException(ExctptionMessage.RoleNameNull)
        );

        return this;
    }
}
