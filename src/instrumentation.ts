import {
  WebTracerProvider,
  BatchSpanProcessor,
  ConsoleSpanExporter,
} from '@opentelemetry/sdk-trace-web'
import { ZoneContextManager } from '@opentelemetry/context-zone'
import { getWebAutoInstrumentations } from '@opentelemetry/auto-instrumentations-web'
import { registerInstrumentations } from '@opentelemetry/instrumentation'
import { OTLPTraceExporter } from '@opentelemetry/exporter-trace-otlp-http'
import {
  MeterProvider,
  PeriodicExportingMetricReader,
  ConsoleMetricExporter,
} from '@opentelemetry/sdk-metrics'
import { OTLPMetricExporter } from '@opentelemetry/exporter-metrics-otlp-http'
import {
  LoggerProvider,
  BatchLogRecordProcessor,
  ConsoleLogRecordExporter,
} from '@opentelemetry/sdk-logs'
import { OTLPLogExporter } from '@opentelemetry/exporter-logs-otlp-http'
import { resourceFromAttributes } from '@opentelemetry/resources'
import { metrics } from '@opentelemetry/api'
import { logs } from '@opentelemetry/api-logs'
import { ATTR_SERVICE_NAME, ATTR_SERVICE_VERSION } from '@opentelemetry/semantic-conventions'

const otlpEndpoint = import.meta.env.VITE_OTEL_EXPORTER_OTLP_ENDPOINT

const resource = resourceFromAttributes({
  [ATTR_SERVICE_NAME]: import.meta.env.VITE_OTEL_SERVICE_NAME ?? 'the-shop-storefront',
  [ATTR_SERVICE_VERSION]: import.meta.env.npm_package_version ?? '0.0.0',
  'deployment.environment': import.meta.env.VITE_APP_ENV ?? 'development',
})

if (import.meta.env.VITE_APP_ENV !== 'test') {
  const traceExporter = otlpEndpoint
    ? new OTLPTraceExporter({ url: `${otlpEndpoint}/v1/traces` })
    : new ConsoleSpanExporter()

  const tracerProvider = new WebTracerProvider({
    resource,
    spanProcessors: [new BatchSpanProcessor(traceExporter)],
  })
  tracerProvider.register({ contextManager: new ZoneContextManager() })

  registerInstrumentations({
    instrumentations: [
      getWebAutoInstrumentations({
        '@opentelemetry/instrumentation-document-load': { enabled: true },
        '@opentelemetry/instrumentation-fetch': { enabled: true },
        '@opentelemetry/instrumentation-xml-http-request': { enabled: false },
      }),
    ],
  })

  const metricExporter = otlpEndpoint
    ? new OTLPMetricExporter({ url: `${otlpEndpoint}/v1/metrics` })
    : new ConsoleMetricExporter()

  const meterProvider = new MeterProvider({
    resource,
    readers: [
      new PeriodicExportingMetricReader({ exporter: metricExporter, exportIntervalMillis: 30_000 }),
    ],
  })
  metrics.setGlobalMeterProvider(meterProvider)

  const logExporter = otlpEndpoint
    ? new OTLPLogExporter({ url: `${otlpEndpoint}/v1/logs` })
    : new ConsoleLogRecordExporter()

  const loggerProvider = new LoggerProvider({
    resource,
    processors: [new BatchLogRecordProcessor(logExporter)],
  })
  logs.setGlobalLoggerProvider(loggerProvider)

  window.addEventListener('beforeunload', () => {
    void tracerProvider.forceFlush()
    void meterProvider.forceFlush()
    void loggerProvider.forceFlush()
  })
}
