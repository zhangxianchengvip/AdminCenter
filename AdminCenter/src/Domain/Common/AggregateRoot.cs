using System.ComponentModel.DataAnnotations.Schema;
using AdminCenter.Domain.Constants;
using Ardalis.GuardClauses;

namespace AdminCenter.Domain;

/// <summary>
/// 聚合根
/// </summary>
public abstract class AggregateRoot : IAggregateRoot
{
    /// <summary>
    /// 事件集合
    /// </summary>
    private readonly List<DomainEvent> _domainEvents = [];

    [NotMapped]
    public IReadOnlyCollection<DomainEvent> DomainEvents => _domainEvents.AsReadOnly();

    /// <summary>
    /// 添加领域事件
    /// </summary>
    public void AddDomainEvent(DomainEvent domainEvent)
    {
        _domainEvents.Add(domainEvent);
    }

    /// <summary>
    /// 移出事件
    /// </summary>
    public void RemoveDomainEvent(DomainEvent domainEvent)
    {
        _domainEvents.Remove(domainEvent);
    }

    /// <summary>
    /// 清除领域事件
    /// </summary>
    public void ClearDomainEvents()
    {
        _domainEvents.Clear();
    }
}

/// <summary>
/// 聚合根
/// </summary>
/// <typeparam name="TKey"></typeparam>
public abstract class AggregateRoot<TKey> : AggregateRoot, IAggregateRoot<TKey>
{
    /// <summary>
    /// 主键
    /// </summary>
    public TKey Id { get; init; } = default!;

    protected AggregateRoot() { }

    protected AggregateRoot(TKey id)
    {
        Id = Guard.Against.Null
        (
            input: id,
            parameterName: nameof(id),
            exceptionCreator: () => new BusinessException(ExceptionMessage.IdNull)
        );
    }
}
