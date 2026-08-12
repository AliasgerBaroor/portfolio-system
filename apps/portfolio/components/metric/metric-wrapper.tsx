import { Metric } from "./metric";
import { ProjectMetric } from "./metric-types";

export function ProjectMetrics({
    metrics,
}: {
    metrics: ProjectMetric[];
}) {
    return (
        <div className="grid grid-cols-3 gap-4">
            {metrics.map((metric, id) => (
                <Metric
                    key={id}
                    metric={metric}
                />
            ))}
        </div>
    );
}