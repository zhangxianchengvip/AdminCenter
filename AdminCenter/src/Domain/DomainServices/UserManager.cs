﻿using System.Diagnostics.CodeAnalysis;
using AdminCenter.Application.Common.Interfaces;
using AdminCenter.Domain.Constants;
using Microsoft.EntityFrameworkCore;

namespace AdminCenter.Domain;

public class UserManager(IApplicationDbContext context) : DomainEvent
{
    public async Task<User> CreateAsync(
        [NotNull] string loginName,
        [NotNull] string realName,
        [NotNull] string password,
        string? nickName,
        string? email,
        string? phoneNumber,
        [NotNull] List<Guid> roleIds,
        [NotNull] List<(Guid SuperiorOrganizationId, bool isSubsidiary)> superiorOrganizationIds)
    {
        var user = new User
        (
            id: Guid.NewGuid(),
            loginName: loginName,
            password: password,
            realName: realName,
            nickName: nickName,
            phoneNumber: phoneNumber,
            email: email
        );

        user.UpdateRoleRange(roleIds);
        user.UpdateOrganizationRange(superiorOrganizationIds);

        if (!await context.Users.AnyAsync(s => s.LoginName.Equals(loginName)))
        {
            return user;
        }

        throw new AdminBusinessException(ExctptionMessage.UserExist);
    }
}
