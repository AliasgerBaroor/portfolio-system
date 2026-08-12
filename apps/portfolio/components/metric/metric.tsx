import { Typography } from "@workspace/ui/components/typography";
import type { ProjectMetric } from "./metric-types";

interface MetricProps {
    metric: ProjectMetric;
}

export function Metric({ metric }: MetricProps) {
    return (
        <div>
            <Typography
                variant="body-sm"
                className="text-secondary-foreground"
            >
                {metric.name}
            </Typography>

            <Typography variant="heading-sm">
                {metric.value}
                {metric.unit && ` ${metric.unit}`}
            </Typography>
        </div>
    );
}