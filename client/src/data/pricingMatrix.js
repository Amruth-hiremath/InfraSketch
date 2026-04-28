// Hardcoded pricing matrix for AWS services
// Prices are approximate monthly costs in USD
// This is an initial version – can be replaced with live AWS Pricing API later

const PRICING_MATRIX = {
  ec2: {
    base: 0,
    modifiers: {
      instanceType: {
        't3.nano': 3.80,
        't3.micro': 7.59,
        't3.small': 15.18,
        't3.medium': 30.37,
        't3.large': 60.74,
        'm5.large': 69.12,
        'm5.xlarge': 138.24,
        'c5.large': 61.20,
        'c5.xlarge': 122.40,
        'r5.large': 91.80,
      },
      os: {
        'Amazon Linux 2': 0,
        'Ubuntu 22.04': 0,
        'Windows Server 2022': 25.00,
        'Red Hat Enterprise Linux': 12.00,
        'SUSE Linux': 8.00,
      },
    },
  },

  lambda: {
    base: 0,
    description: 'Pay per request + duration',
    modifiers: {
      memory: (val) => (val / 1024) * 0.0000166667 * 1000000, // per 1M invocations
    },
    fixedMonthly: 0.20, // base free tier estimate
  },

  'elastic-beanstalk': {
    base: 0,
    modifiers: {
      instanceType: {
        't3.micro': 7.59,
        't3.small': 15.18,
        't3.medium': 30.37,
        't3.large': 60.74,
        'm5.large': 69.12,
      },
    },
  },

  fargate: {
    base: 0,
    modifiers: {
      cpu: {
        0.25: 7.30,
        0.5: 14.60,
        1: 29.20,
        2: 58.40,
        4: 116.80,
      },
      memory: {
        0.5: 3.20,
        1: 6.40,
        2: 12.80,
        4: 25.60,
        8: 51.20,
        16: 102.40,
        30: 192.00,
      },
    },
  },

  lightsail: {
    base: 0,
    modifiers: {
      plan: {
        '$3.50/mo': 3.50,
        '$5/mo': 5.00,
        '$10/mo': 10.00,
        '$20/mo': 20.00,
        '$40/mo': 40.00,
        '$80/mo': 80.00,
        '$160/mo': 160.00,
      },
    },
  },

  s3: {
    base: 0,
    modifiers: {
      storageClass: {
        'Standard': 23.00,         // per TB
        'Intelligent-Tiering': 23.00,
        'Standard-IA': 12.50,
        'One Zone-IA': 10.00,
        'Glacier Instant': 4.00,
        'Glacier Flexible': 3.60,
        'Glacier Deep Archive': 0.99,
      },
    },
  },

  ebs: {
    base: 0,
    modifiers: {
      volumeType: {
        'gp3': 0.08,    // per GB/month
        'gp2': 0.10,
        'io2': 0.125,
        'io1': 0.125,
        'st1': 0.045,
        'sc1': 0.015,
      },
    },
    compute: (props) => {
      const perGB = PRICING_MATRIX.ebs.modifiers.volumeType[props.volumeType] || 0.08;
      return perGB * (props.sizeGB || 30);
    },
  },

  efs: {
    base: 0.30, // per GB-month standard
    modifiers: {
      performanceMode: {
        'General Purpose': 0,
        'Max I/O': 0,
      },
    },
    fixedMonthly: 6.00, // ~20GB estimate
  },

  glacier: {
    base: 0,
    modifiers: {
      tier: {
        'Instant Retrieval': 4.00,
        'Flexible Retrieval': 3.60,
        'Deep Archive': 0.99,
      },
    },
  },

  rds: {
    base: 0,
    modifiers: {
      instanceClass: {
        'db.t3.micro': 12.41,
        'db.t3.small': 24.82,
        'db.t3.medium': 49.64,
        'db.m5.large': 124.10,
        'db.m5.xlarge': 248.20,
        'db.r5.large': 175.20,
      },
      multiAZ: { true: 1.0, false: 0 }, // multiplier: doubles cost
    },
    compute: (props) => {
      let cost = PRICING_MATRIX.rds.modifiers.instanceClass[props.instanceClass] || 12.41;
      if (props.multiAZ) cost *= 2;
      cost += (props.storageGB || 20) * 0.115;
      return cost;
    },
  },

  dynamodb: {
    base: 0,
    modifiers: {
      capacityMode: {
        'On-Demand': 1.25, // per million writes
        'Provisioned': 0,
      },
    },
    compute: (props) => {
      if (props.capacityMode === 'Provisioned') {
        return (props.readUnits || 5) * 0.00065 * 730 + (props.writeUnits || 5) * 0.00065 * 730;
      }
      return 25.00; // on-demand estimate
    },
  },

  aurora: {
    base: 0,
    modifiers: {
      instanceClass: {
        'db.r5.large': 175.20,
        'db.r5.xlarge': 350.40,
        'db.r6g.large': 157.68,
        'db.r6g.xlarge': 315.36,
      },
    },
    compute: (props) => {
      if (props.serverless) return 43.80; // ACU estimate
      return PRICING_MATRIX.aurora.modifiers.instanceClass[props.instanceClass] || 175.20;
    },
  },

  elasticache: {
    base: 0,
    modifiers: {
      nodeType: {
        'cache.t3.micro': 12.24,
        'cache.t3.small': 24.48,
        'cache.t3.medium': 48.96,
        'cache.m5.large': 118.44,
        'cache.r5.large': 166.44,
      },
    },
    compute: (props) => {
      const base = PRICING_MATRIX.elasticache.modifiers.nodeType[props.nodeType] || 12.24;
      return base * (1 + (props.replicas || 0));
    },
  },

  redshift: {
    base: 0,
    modifiers: {
      nodeType: {
        'dc2.large': 180.00,
        'dc2.8xlarge': 3450.00,
        'ra3.xlplus': 275.40,
        'ra3.4xlarge': 1101.60,
        'ra3.16xlarge': 9912.00,
      },
    },
    compute: (props) => {
      const perNode = PRICING_MATRIX.redshift.modifiers.nodeType[props.nodeType] || 180.00;
      return perNode * (props.nodes || 1);
    },
  },

  vpc: { base: 0, fixedMonthly: 0 },
  cloudfront: { base: 0, fixedMonthly: 1.00 },
  route53: { base: 0.50, fixedMonthly: 0.50 },
  alb: { base: 0, fixedMonthly: 16.20 },

  iam: { base: 0, fixedMonthly: 0 },
  kms: { base: 1.00, fixedMonthly: 1.00 },
  shield: {
    base: 0,
    modifiers: {
      tier: {
        'Standard': 0,
        'Advanced': 3000.00,
      },
    },
  },

  cloudwatch: {
    base: 0,
    compute: (props) => {
      let cost = (props.dashboards || 0) * 3.00;
      cost += (props.alarms || 0) * 0.10;
      return cost;
    },
  },
  cloudformation: { base: 0, fixedMonthly: 0 },

  athena: {
    base: 0,
    compute: (props) => (props.dataScanTB || 1) * 5.00,
  },
  emr: {
    base: 0,
    compute: (props) => {
      const perInstance = { 'm5.xlarge': 67.08, 'm5.2xlarge': 134.16, 'c5.xlarge': 59.64, 'r5.xlarge': 92.28, 'r5.2xlarge': 184.56 };
      return (perInstance[props.instanceType] || 67.08) * (props.instanceCount || 3);
    },
  },
  kinesis: {
    base: 0,
    compute: (props) => (props.shardCount || 1) * 10.80,
  },

  sqs: { base: 0, fixedMonthly: 0.40 },
  sns: { base: 0, fixedMonthly: 0.50 },
  eventbridge: {
    base: 0,
    compute: (props) => (props.ruleCount || 1) * 1.00,
  },
};

export function calculateNodeCost(serviceId, properties = {}) {
  const pricing = PRICING_MATRIX[serviceId];
  if (!pricing) return 0;

  if (pricing.compute) {
    return pricing.compute(properties);
  }

  if (pricing.fixedMonthly !== undefined && !pricing.modifiers) {
    return pricing.fixedMonthly;
  }

  let cost = pricing.base || 0;
  if (pricing.modifiers) {
    for (const [key, modMap] of Object.entries(pricing.modifiers)) {
      if (typeof modMap === 'function') {
        cost += modMap(properties[key]);
      } else if (properties[key] !== undefined && modMap[properties[key]] !== undefined) {
        cost += modMap[properties[key]];
      }
    }
  }

  if (pricing.fixedMonthly && cost === 0) {
    cost = pricing.fixedMonthly;
  }

  return cost;
}

export function calculateTotalCost(nodes) {
  const perNodeCosts = {};
  let total = 0;

  // FIX 1: Ensure nodes array is valid
  if (!nodes || !Array.isArray(nodes)) return { totalMonthlyCost: total, perNodeCosts };

  for (const node of nodes) {
    // FIX 2: Ensure the node isn't null before trying to read .data
    if (!node || !node.data) continue; 

    const serviceId = node.data.serviceType || node.type;
    const props = node.data.properties || {};
    const cost = calculateNodeCost(serviceId, props);
    perNodeCosts[node.id] = { serviceId, cost };
    total += cost;
  }

  return { totalMonthlyCost: total, perNodeCosts };
}

export default PRICING_MATRIX;