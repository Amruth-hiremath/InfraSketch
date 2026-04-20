// Architecture Linter Rules
// Each rule validates a specific best practice and returns warnings

const LINTER_RULES = [
  {
    id: 'public-rds',
    name: 'Public RDS Instance',
    severity: 'critical',
    description: 'RDS instance is not connected to a VPC, making it publicly accessible.',
    check: (nodes, edges) => {
      const warnings = [];
      const rdsNodes = nodes.filter((n) => n.data?.serviceType === 'rds');
      const vpcNodes = nodes.filter((n) => n.data?.serviceType === 'vpc');

      if (vpcNodes.length === 0 && rdsNodes.length > 0) {
        rdsNodes.forEach((rds) => {
          warnings.push({
            nodeId: rds.id,
            ruleId: 'public-rds',
            severity: 'critical',
            message: `RDS "${rds.data.label}" has no VPC — exposed to public internet.`,
          });
        });
        return warnings;
      }

      rdsNodes.forEach((rds) => {
        const connectedToVpc = edges.some(
          (e) =>
            (e.source === rds.id && vpcNodes.some((v) => v.id === e.target)) ||
            (e.target === rds.id && vpcNodes.some((v) => v.id === e.source))
        );
        if (!connectedToVpc) {
          warnings.push({
            nodeId: rds.id,
            ruleId: 'public-rds',
            severity: 'critical',
            message: `RDS "${rds.data.label}" is not connected to any VPC.`,
          });
        }
      });
      return warnings;
    },
  },

  {
    id: 'no-monitoring',
    name: 'No CloudWatch Monitoring',
    severity: 'warning',
    description: 'Architecture has no CloudWatch for monitoring and alerting.',
    check: (nodes) => {
      const hasCloudWatch = nodes.some((n) => n.data?.serviceType === 'cloudwatch');
      const hasCompute = nodes.some((n) =>
        ['ec2', 'lambda', 'fargate', 'elastic-beanstalk'].includes(n.data?.serviceType)
      );
      if (hasCompute && !hasCloudWatch) {
        return [{
          nodeId: null,
          ruleId: 'no-monitoring',
          severity: 'warning',
          message: 'No CloudWatch found. Add monitoring for your compute resources.',
        }];
      }
      return [];
    },
  },

  {
    id: 'public-s3',
    name: 'Potentially Public S3 Bucket',
    severity: 'warning',
    description: 'S3 bucket is not behind CloudFront or connected to IAM.',
    check: (nodes, edges) => {
      const warnings = [];
      const s3Nodes = nodes.filter((n) => n.data?.serviceType === 's3');
      const cfNodes = nodes.filter((n) => n.data?.serviceType === 'cloudfront');
      const iamNodes = nodes.filter((n) => n.data?.serviceType === 'iam');

      s3Nodes.forEach((s3) => {
        const hasCloudFront = edges.some(
          (e) =>
            (e.source === s3.id && cfNodes.some((c) => c.id === e.target)) ||
            (e.target === s3.id && cfNodes.some((c) => c.id === e.source))
        );
        const hasIAM = edges.some(
          (e) =>
            (e.source === s3.id && iamNodes.some((i) => i.id === e.target)) ||
            (e.target === s3.id && iamNodes.some((i) => i.id === e.source))
        );
        if (!hasCloudFront && !hasIAM) {
          warnings.push({
            nodeId: s3.id,
            ruleId: 'public-s3',
            severity: 'warning',
            message: `S3 "${s3.data.label}" has no CloudFront or IAM — may be publicly accessible.`,
          });
        }
      });
      return warnings;
    },
  },

  {
    id: 'lambda-no-iam',
    name: 'Lambda without IAM Role',
    severity: 'warning',
    description: 'Lambda function is not connected to an IAM role.',
    check: (nodes, edges) => {
      const warnings = [];
      const lambdaNodes = nodes.filter((n) => n.data?.serviceType === 'lambda');
      const iamNodes = nodes.filter((n) => n.data?.serviceType === 'iam');

      lambdaNodes.forEach((fn) => {
        const hasIAM = edges.some(
          (e) =>
            (e.source === fn.id && iamNodes.some((i) => i.id === e.target)) ||
            (e.target === fn.id && iamNodes.some((i) => i.id === e.source))
        );
        if (!hasIAM) {
          warnings.push({
            nodeId: fn.id,
            ruleId: 'lambda-no-iam',
            severity: 'warning',
            message: `Lambda "${fn.data.label}" has no IAM role attached.`,
          });
        }
      });
      return warnings;
    },
  },

  {
    id: 'single-az',
    name: 'Single Availability Zone',
    severity: 'warning',
    description: 'All resources are deployed in a single availability zone.',
    check: (nodes) => {
      const azs = new Set();
      nodes.forEach((n) => {
        if (n.data?.properties?.availabilityZone) {
          azs.add(n.data.properties.availabilityZone);
        }
      });
      if (nodes.length > 3 && azs.size <= 1) {
        return [{
          nodeId: null,
          ruleId: 'single-az',
          severity: 'warning',
          message: 'All resources are in a single AZ. Consider multi-AZ for high availability.',
        }];
      }
      return [];
    },
  },

  {
    id: 'orphan-nodes',
    name: 'Orphan Nodes',
    severity: 'info',
    description: 'Nodes that are not connected to any other service.',
    check: (nodes, edges) => {
      const warnings = [];
      const connectedIds = new Set();
      edges.forEach((e) => {
        connectedIds.add(e.source);
        connectedIds.add(e.target);
      });

      nodes.forEach((n) => {
        if (!connectedIds.has(n.id) && nodes.length > 1) {
          warnings.push({
            nodeId: n.id,
            ruleId: 'orphan-nodes',
            severity: 'info',
            message: `"${n.data.label}" is not connected to any other service.`,
          });
        }
      });
      return warnings;
    },
  },

  {
    id: 'alb-no-targets',
    name: 'ALB without Targets',
    severity: 'warning',
    description: 'Application Load Balancer is not connected to any compute targets.',
    check: (nodes, edges) => {
      const warnings = [];
      const albNodes = nodes.filter((n) => n.data?.serviceType === 'alb');
      const computeTypes = ['ec2', 'fargate', 'elastic-beanstalk', 'lambda'];
      const computeNodes = nodes.filter((n) => computeTypes.includes(n.data?.serviceType));

      albNodes.forEach((alb) => {
        const hasTarget = edges.some(
          (e) =>
            (e.source === alb.id && computeNodes.some((c) => c.id === e.target)) ||
            (e.target === alb.id && computeNodes.some((c) => c.id === e.source))
        );
        if (!hasTarget) {
          warnings.push({
            nodeId: alb.id,
            ruleId: 'alb-no-targets',
            severity: 'warning',
            message: `ALB "${alb.data.label}" has no compute targets attached.`,
          });
        }
      });
      return warnings;
    },
  },
];

/**
 * Run all linter rules against the current architecture
 */
export function runLinter(nodes, edges) {
  const allWarnings = [];
  for (const rule of LINTER_RULES) {
    const warnings = rule.check(nodes, edges);
    allWarnings.push(...warnings);
  }
  return allWarnings;
}

export default LINTER_RULES;
