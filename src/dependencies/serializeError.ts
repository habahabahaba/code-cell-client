export default function serializeError(error: unknown): string {
  const serializedError = !error
    ? ''
    : typeof error === 'string'
      ? error
      : error instanceof Error
        ? error.message
        : JSON.stringify(error) || 'unserializable';

  return serializedError;
}
