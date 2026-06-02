import { logs, SeverityNumber } from '@opentelemetry/api-logs'

const otelLogger = logs.getLogger('the-shop-storefront')

type LogAttributes = Record<string, string | number | boolean>

function emit(
  severityNumber: SeverityNumber,
  severityText: string,
  message: string,
  attributes?: LogAttributes,
) {
  otelLogger.emit({ severityNumber, severityText, body: message, attributes })
}

export const logger = {
  debug: (message: string, attributes?: LogAttributes) =>
    emit(SeverityNumber.DEBUG, 'DEBUG', message, attributes),
  info: (message: string, attributes?: LogAttributes) =>
    emit(SeverityNumber.INFO, 'INFO', message, attributes),
  warn: (message: string, attributes?: LogAttributes) =>
    emit(SeverityNumber.WARN, 'WARN', message, attributes),
  error: (message: string, attributes?: LogAttributes) =>
    emit(SeverityNumber.ERROR, 'ERROR', message, attributes),
}
