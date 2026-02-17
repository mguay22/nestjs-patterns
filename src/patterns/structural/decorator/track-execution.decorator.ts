export function TrackExecution(): MethodDecorator {
  return function (
    _target: object,
    propertyKey: string | symbol,
    descriptor: PropertyDescriptor,
  ) {
    const originalMethod = descriptor.value;

    descriptor.value = function (...args: unknown[]) {
      const start = performance.now();
      const result = originalMethod.apply(this, args);
      const end = performance.now();
      const duration = (end - start).toFixed(2);
      console.log(
        `[TrackExecution] ${String(propertyKey)} executed in ${duration}ms`,
      );
      return result;
    };

    return descriptor;
  };
}
