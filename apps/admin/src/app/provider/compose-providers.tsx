'use client';

export function composeProviders(
  ...providers: React.ComponentType<{ children: React.ReactNode }>[]
): React.ComponentType<{ children: React.ReactNode }> {
  const Base: React.ComponentType<{ children: React.ReactNode }> = ({
    children,
  }: {
    children: React.ReactNode;
  }) => <>{children}</>;

  const Composed = providers.reduce<
    React.ComponentType<{ children: React.ReactNode }>
  >((Accum, Provider) => {
    const Wrapped: React.ComponentType<{ children: React.ReactNode }> = ({
      children,
    }: {
      children: React.ReactNode;
    }) => (
      <Provider>
        <Accum>{children}</Accum>
      </Provider>
    );
    Wrapped.displayName = `Compose(${Provider.displayName ?? Provider.name ?? 'Anonymous'})`;
    return Wrapped;
  }, Base);

  Composed.displayName = 'ComposedProviders';
  return Composed;
}
