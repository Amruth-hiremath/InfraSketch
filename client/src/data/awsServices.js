// AWS Services catalog – 28 services across 8 categories
// Each service has metadata, default properties, and a property schema for the inspector

export const AWS_CATEGORIES = [
  { id: 'compute', label: 'Compute', color: '#f97316' },
  { id: 'storage', label: 'Storage', color: '#22c55e' },
  { id: 'database', label: 'Database', color: '#3b82f6' },
  { id: 'networking', label: 'Networking', color: '#a855f7' },
  { id: 'security', label: 'Security', color: '#ef4444' },
  { id: 'management', label: 'Management', color: '#64748b' },
  { id: 'analytics', label: 'Analytics', color: '#06b6d4' },
  { id: 'integration', label: 'Integration', color: '#ec4899' },
];

export const AWS_REGIONS = [
  'us-east-1', 'us-east-2', 'us-west-1', 'us-west-2',
  'eu-west-1', 'eu-west-2', 'eu-central-1',
  'ap-south-1', 'ap-southeast-1', 'ap-northeast-1',
];

export const AVAILABILITY_ZONES = ['a', 'b', 'c', 'd'];

const AWS_SERVICES = [
  // ── Compute ──────────────────────────────────────────
  {
    id: 'ec2',
    name: 'EC2',
    fullName: 'Elastic Compute Cloud',
    category: 'compute',
    description: 'Virtual servers in the cloud',
    defaultProperties: {
      instanceType: 't3.micro',
      os: 'Amazon Linux 2',
      region: 'us-east-1',
      availabilityZone: 'a',
    },
    propertySchema: [
      {
        key: 'instanceType', label: 'Instance Type', type: 'select',
        options: ['t3.nano', 't3.micro', 't3.small', 't3.medium', 't3.large', 'm5.large', 'm5.xlarge', 'c5.large', 'c5.xlarge', 'r5.large'],
      },
      {
        key: 'os', label: 'Operating System', type: 'select',
        options: ['Amazon Linux 2', 'Ubuntu 22.04', 'Windows Server 2022', 'Red Hat Enterprise Linux', 'SUSE Linux'],
      },
    ],
  },
  {
    id: 'lambda',
    name: 'Lambda',
    fullName: 'AWS Lambda',
    category: 'compute',
    description: 'Serverless compute service',
    defaultProperties: {
      runtime: 'Node.js 20.x',
      memory: 128,
      timeout: 3,
      region: 'us-east-1',
      availabilityZone: 'a',
    },
    propertySchema: [
      {
        key: 'runtime', label: 'Runtime', type: 'select',
        options: ['Node.js 20.x', 'Python 3.12', 'Java 21', 'Go 1.x', '.NET 8', 'Ruby 3.3'],
      },
      { key: 'memory', label: 'Memory (MB)', type: 'number', min: 128, max: 10240, step: 64 },
      { key: 'timeout', label: 'Timeout (sec)', type: 'number', min: 1, max: 900 },
    ],
  },
  {
    id: 'elastic-beanstalk',
    name: 'Elastic Beanstalk',
    fullName: 'AWS Elastic Beanstalk',
    category: 'compute',
    description: 'Deploy and scale web apps',
    defaultProperties: {
      platform: 'Node.js',
      instanceType: 't3.small',
      region: 'us-east-1',
      availabilityZone: 'a',
    },
    propertySchema: [
      {
        key: 'platform', label: 'Platform', type: 'select',
        options: ['Node.js', 'Python', 'Java', '.NET', 'PHP', 'Ruby', 'Go', 'Docker'],
      },
      {
        key: 'instanceType', label: 'Instance Type', type: 'select',
        options: ['t3.micro', 't3.small', 't3.medium', 't3.large', 'm5.large'],
      },
    ],
  },
  {
    id: 'fargate',
    name: 'Fargate',
    fullName: 'AWS Fargate',
    category: 'compute',
    description: 'Serverless containers',
    defaultProperties: {
      cpu: 0.25,
      memory: 0.5,
      region: 'us-east-1',
      availabilityZone: 'a',
    },
    propertySchema: [
      {
        key: 'cpu', label: 'vCPU', type: 'select',
        options: [0.25, 0.5, 1, 2, 4],
      },
      {
        key: 'memory', label: 'Memory (GB)', type: 'select',
        options: [0.5, 1, 2, 4, 8, 16, 30],
      },
    ],
  },
  {
    id: 'lightsail',
    name: 'Lightsail',
    fullName: 'Amazon Lightsail',
    category: 'compute',
    description: 'Simple virtual private servers',
    defaultProperties: {
      plan: '$3.50/mo',
      os: 'Amazon Linux 2',
      region: 'us-east-1',
      availabilityZone: 'a',
    },
    propertySchema: [
      {
        key: 'plan', label: 'Plan', type: 'select',
        options: ['$3.50/mo', '$5/mo', '$10/mo', '$20/mo', '$40/mo', '$80/mo', '$160/mo'],
      },
      {
        key: 'os', label: 'Operating System', type: 'select',
        options: ['Amazon Linux 2', 'Ubuntu 22.04', 'Windows Server 2022', 'Debian', 'FreeBSD'],
      },
    ],
  },

  // ── Storage ──────────────────────────────────────────
  {
    id: 's3',
    name: 'S3',
    fullName: 'Simple Storage Service',
    category: 'storage',
    description: 'Object storage built to retrieve any amount of data',
    defaultProperties: {
      storageClass: 'Standard',
      versioning: false,
      encryption: true,
      region: 'us-east-1',
      availabilityZone: 'a',
    },
    propertySchema: [
      {
        key: 'storageClass', label: 'Storage Class', type: 'select',
        options: ['Standard', 'Intelligent-Tiering', 'Standard-IA', 'One Zone-IA', 'Glacier Instant', 'Glacier Flexible', 'Glacier Deep Archive'],
      },
      { key: 'versioning', label: 'Versioning', type: 'toggle' },
      { key: 'encryption', label: 'Encryption', type: 'toggle' },
    ],
  },
  {
    id: 'ebs',
    name: 'EBS',
    fullName: 'Elastic Block Store',
    category: 'storage',
    description: 'Block-level storage volumes',
    defaultProperties: {
      volumeType: 'gp3',
      sizeGB: 30,
      region: 'us-east-1',
      availabilityZone: 'a',
    },
    propertySchema: [
      {
        key: 'volumeType', label: 'Volume Type', type: 'select',
        options: ['gp3', 'gp2', 'io2', 'io1', 'st1', 'sc1'],
      },
      { key: 'sizeGB', label: 'Size (GB)', type: 'number', min: 1, max: 16384 },
    ],
  },
  {
    id: 'efs',
    name: 'EFS',
    fullName: 'Elastic File System',
    category: 'storage',
    description: 'Managed file storage for EC2',
    defaultProperties: {
      performanceMode: 'General Purpose',
      throughputMode: 'Bursting',
      region: 'us-east-1',
      availabilityZone: 'a',
    },
    propertySchema: [
      {
        key: 'performanceMode', label: 'Performance Mode', type: 'select',
        options: ['General Purpose', 'Max I/O'],
      },
      {
        key: 'throughputMode', label: 'Throughput Mode', type: 'select',
        options: ['Bursting', 'Provisioned', 'Elastic'],
      },
    ],
  },
  {
    id: 'glacier',
    name: 'Glacier',
    fullName: 'S3 Glacier',
    category: 'storage',
    description: 'Long-term archive storage',
    defaultProperties: {
      tier: 'Flexible Retrieval',
      region: 'us-east-1',
      availabilityZone: 'a',
    },
    propertySchema: [
      {
        key: 'tier', label: 'Retrieval Tier', type: 'select',
        options: ['Instant Retrieval', 'Flexible Retrieval', 'Deep Archive'],
      },
    ],
  },

  // ── Database ─────────────────────────────────────────
  {
    id: 'rds',
    name: 'RDS',
    fullName: 'Relational Database Service',
    category: 'database',
    description: 'Managed relational database',
    defaultProperties: {
      engine: 'PostgreSQL',
      instanceClass: 'db.t3.micro',
      storageGB: 20,
      multiAZ: false,
      region: 'us-east-1',
      availabilityZone: 'a',
    },
    propertySchema: [
      {
        key: 'engine', label: 'Engine', type: 'select',
        options: ['PostgreSQL', 'MySQL', 'MariaDB', 'Oracle', 'SQL Server'],
      },
      {
        key: 'instanceClass', label: 'Instance Class', type: 'select',
        options: ['db.t3.micro', 'db.t3.small', 'db.t3.medium', 'db.m5.large', 'db.m5.xlarge', 'db.r5.large'],
      },
      { key: 'storageGB', label: 'Storage (GB)', type: 'number', min: 20, max: 65536 },
      { key: 'multiAZ', label: 'Multi-AZ', type: 'toggle' },
    ],
  },
  {
    id: 'dynamodb',
    name: 'DynamoDB',
    fullName: 'Amazon DynamoDB',
    category: 'database',
    description: 'Managed NoSQL key-value database',
    defaultProperties: {
      capacityMode: 'On-Demand',
      readUnits: 5,
      writeUnits: 5,
      region: 'us-east-1',
      availabilityZone: 'a',
    },
    propertySchema: [
      {
        key: 'capacityMode', label: 'Capacity Mode', type: 'select',
        options: ['On-Demand', 'Provisioned'],
      },
      { key: 'readUnits', label: 'Read Capacity Units', type: 'number', min: 1, max: 40000 },
      { key: 'writeUnits', label: 'Write Capacity Units', type: 'number', min: 1, max: 40000 },
    ],
  },
  {
    id: 'aurora',
    name: 'Aurora',
    fullName: 'Amazon Aurora',
    category: 'database',
    description: 'MySQL/PostgreSQL-compatible relational DB',
    defaultProperties: {
      engine: 'Aurora PostgreSQL',
      instanceClass: 'db.r5.large',
      serverless: false,
      region: 'us-east-1',
      availabilityZone: 'a',
    },
    propertySchema: [
      {
        key: 'engine', label: 'Engine', type: 'select',
        options: ['Aurora MySQL', 'Aurora PostgreSQL'],
      },
      {
        key: 'instanceClass', label: 'Instance Class', type: 'select',
        options: ['db.r5.large', 'db.r5.xlarge', 'db.r6g.large', 'db.r6g.xlarge'],
      },
      { key: 'serverless', label: 'Serverless v2', type: 'toggle' },
    ],
  },
  {
    id: 'elasticache',
    name: 'ElastiCache',
    fullName: 'Amazon ElastiCache',
    category: 'database',
    description: 'In-memory caching service',
    defaultProperties: {
      engine: 'Redis',
      nodeType: 'cache.t3.micro',
      replicas: 0,
      region: 'us-east-1',
      availabilityZone: 'a',
    },
    propertySchema: [
      {
        key: 'engine', label: 'Engine', type: 'select',
        options: ['Redis', 'Memcached'],
      },
      {
        key: 'nodeType', label: 'Node Type', type: 'select',
        options: ['cache.t3.micro', 'cache.t3.small', 'cache.t3.medium', 'cache.m5.large', 'cache.r5.large'],
      },
      { key: 'replicas', label: 'Read Replicas', type: 'number', min: 0, max: 5 },
    ],
  },
  {
    id: 'redshift',
    name: 'Redshift',
    fullName: 'Amazon Redshift',
    category: 'database',
    description: 'Cloud data warehousing',
    defaultProperties: {
      nodeType: 'dc2.large',
      nodes: 1,
      region: 'us-east-1',
      availabilityZone: 'a',
    },
    propertySchema: [
      {
        key: 'nodeType', label: 'Node Type', type: 'select',
        options: ['dc2.large', 'dc2.8xlarge', 'ra3.xlplus', 'ra3.4xlarge', 'ra3.16xlarge'],
      },
      { key: 'nodes', label: 'Number of Nodes', type: 'number', min: 1, max: 128 },
    ],
  },

  // ── Networking ───────────────────────────────────────
  {
    id: 'vpc',
    name: 'VPC',
    fullName: 'Virtual Private Cloud',
    category: 'networking',
    description: 'Isolated cloud network',
    defaultProperties: {
      cidrBlock: '10.0.0.0/16',
      enableDnsHostnames: true,
      region: 'us-east-1',
      availabilityZone: 'a',
    },
    propertySchema: [
      { key: 'cidrBlock', label: 'CIDR Block', type: 'text' },
      { key: 'enableDnsHostnames', label: 'DNS Hostnames', type: 'toggle' },
    ],
  },
  {
    id: 'cloudfront',
    name: 'CloudFront',
    fullName: 'Amazon CloudFront',
    category: 'networking',
    description: 'Global content delivery network',
    defaultProperties: {
      priceClass: 'PriceClass_All',
      httpVersion: 'HTTP/2',
      region: 'us-east-1',
      availabilityZone: 'a',
    },
    propertySchema: [
      {
        key: 'priceClass', label: 'Price Class', type: 'select',
        options: ['PriceClass_All', 'PriceClass_200', 'PriceClass_100'],
      },
      {
        key: 'httpVersion', label: 'HTTP Version', type: 'select',
        options: ['HTTP/1.1', 'HTTP/2', 'HTTP/3'],
      },
    ],
  },
  {
    id: 'route53',
    name: 'Route 53',
    fullName: 'Amazon Route 53',
    category: 'networking',
    description: 'Scalable DNS and domain registration',
    defaultProperties: {
      recordType: 'A',
      routingPolicy: 'Simple',
      region: 'us-east-1',
      availabilityZone: 'a',
    },
    propertySchema: [
      {
        key: 'recordType', label: 'Record Type', type: 'select',
        options: ['A', 'AAAA', 'CNAME', 'MX', 'TXT', 'NS'],
      },
      {
        key: 'routingPolicy', label: 'Routing Policy', type: 'select',
        options: ['Simple', 'Weighted', 'Latency', 'Failover', 'Geolocation'],
      },
    ],
  },
  {
    id: 'alb',
    name: 'ALB',
    fullName: 'Application Load Balancer',
    category: 'networking',
    description: 'Layer 7 load balancing',
    defaultProperties: {
      scheme: 'Internet-facing',
      algorithm: 'Round Robin',
      region: 'us-east-1',
      availabilityZone: 'a',
    },
    propertySchema: [
      {
        key: 'scheme', label: 'Scheme', type: 'select',
        options: ['Internet-facing', 'Internal'],
      },
      {
        key: 'algorithm', label: 'Algorithm', type: 'select',
        options: ['Round Robin', 'Least Outstanding Requests'],
      },
    ],
  },

  // ── Security ─────────────────────────────────────────
  {
    id: 'iam',
    name: 'IAM',
    fullName: 'Identity & Access Management',
    category: 'security',
    description: 'User access and encryption key management',
    defaultProperties: {
      policyType: 'Custom',
      mfaEnabled: true,
      region: 'us-east-1',
      availabilityZone: 'a',
    },
    propertySchema: [
      {
        key: 'policyType', label: 'Policy Type', type: 'select',
        options: ['Custom', 'AWS Managed', 'Inline'],
      },
      { key: 'mfaEnabled', label: 'MFA Enabled', type: 'toggle' },
    ],
  },
  {
    id: 'kms',
    name: 'KMS',
    fullName: 'Key Management Service',
    category: 'security',
    description: 'Managed encryption keys',
    defaultProperties: {
      keyType: 'Symmetric',
      keyUsage: 'Encrypt/Decrypt',
      region: 'us-east-1',
      availabilityZone: 'a',
    },
    propertySchema: [
      {
        key: 'keyType', label: 'Key Type', type: 'select',
        options: ['Symmetric', 'Asymmetric'],
      },
      {
        key: 'keyUsage', label: 'Key Usage', type: 'select',
        options: ['Encrypt/Decrypt', 'Sign/Verify'],
      },
    ],
  },
  {
    id: 'shield',
    name: 'Shield',
    fullName: 'AWS Shield',
    category: 'security',
    description: 'DDoS protection',
    defaultProperties: {
      tier: 'Standard',
      region: 'us-east-1',
      availabilityZone: 'a',
    },
    propertySchema: [
      {
        key: 'tier', label: 'Tier', type: 'select',
        options: ['Standard', 'Advanced'],
      },
    ],
  },

  // ── Management ───────────────────────────────────────
  {
    id: 'cloudwatch',
    name: 'CloudWatch',
    fullName: 'Amazon CloudWatch',
    category: 'management',
    description: 'Monitoring and observability',
    defaultProperties: {
      dashboards: 1,
      alarms: 0,
      logRetention: 30,
      region: 'us-east-1',
      availabilityZone: 'a',
    },
    propertySchema: [
      { key: 'dashboards', label: 'Dashboards', type: 'number', min: 0, max: 100 },
      { key: 'alarms', label: 'Alarms', type: 'number', min: 0, max: 5000 },
      {
        key: 'logRetention', label: 'Log Retention (days)', type: 'select',
        options: [1, 3, 7, 14, 30, 60, 90, 180, 365],
      },
    ],
  },
  {
    id: 'cloudformation',
    name: 'CloudFormation',
    fullName: 'AWS CloudFormation',
    category: 'management',
    description: 'Infrastructure as Code',
    defaultProperties: {
      templateFormat: 'YAML',
      stackPolicy: false,
      region: 'us-east-1',
      availabilityZone: 'a',
    },
    propertySchema: [
      {
        key: 'templateFormat', label: 'Template Format', type: 'select',
        options: ['YAML', 'JSON'],
      },
      { key: 'stackPolicy', label: 'Stack Policy', type: 'toggle' },
    ],
  },

  // ── Analytics ────────────────────────────────────────
  {
    id: 'athena',
    name: 'Athena',
    fullName: 'Amazon Athena',
    category: 'analytics',
    description: 'Query data in S3 with SQL',
    defaultProperties: {
      dataScanTB: 1,
      workgroup: 'primary',
      region: 'us-east-1',
      availabilityZone: 'a',
    },
    propertySchema: [
      { key: 'dataScanTB', label: 'Data Scanned (TB/mo)', type: 'number', min: 0, max: 1000 },
      { key: 'workgroup', label: 'Workgroup', type: 'text' },
    ],
  },
  {
    id: 'emr',
    name: 'EMR',
    fullName: 'Amazon EMR',
    category: 'analytics',
    description: 'Big data processing with Spark/Hadoop',
    defaultProperties: {
      instanceType: 'm5.xlarge',
      instanceCount: 3,
      region: 'us-east-1',
      availabilityZone: 'a',
    },
    propertySchema: [
      {
        key: 'instanceType', label: 'Instance Type', type: 'select',
        options: ['m5.xlarge', 'm5.2xlarge', 'c5.xlarge', 'r5.xlarge', 'r5.2xlarge'],
      },
      { key: 'instanceCount', label: 'Instance Count', type: 'number', min: 1, max: 100 },
    ],
  },
  {
    id: 'kinesis',
    name: 'Kinesis',
    fullName: 'Amazon Kinesis',
    category: 'analytics',
    description: 'Real-time data streaming',
    defaultProperties: {
      shardCount: 1,
      retentionHours: 24,
      region: 'us-east-1',
      availabilityZone: 'a',
    },
    propertySchema: [
      { key: 'shardCount', label: 'Shard Count', type: 'number', min: 1, max: 500 },
      {
        key: 'retentionHours', label: 'Retention (hours)', type: 'select',
        options: [24, 48, 72, 168, 8760],
      },
    ],
  },

  // ── Integration ──────────────────────────────────────
  {
    id: 'sqs',
    name: 'SQS',
    fullName: 'Simple Queue Service',
    category: 'integration',
    description: 'Managed message queue',
    defaultProperties: {
      queueType: 'Standard',
      visibilityTimeout: 30,
      region: 'us-east-1',
      availabilityZone: 'a',
    },
    propertySchema: [
      {
        key: 'queueType', label: 'Queue Type', type: 'select',
        options: ['Standard', 'FIFO'],
      },
      { key: 'visibilityTimeout', label: 'Visibility Timeout (sec)', type: 'number', min: 0, max: 43200 },
    ],
  },
  {
    id: 'sns',
    name: 'SNS',
    fullName: 'Simple Notification Service',
    category: 'integration',
    description: 'Pub/sub messaging',
    defaultProperties: {
      topicType: 'Standard',
      protocol: 'HTTPS',
      region: 'us-east-1',
      availabilityZone: 'a',
    },
    propertySchema: [
      {
        key: 'topicType', label: 'Topic Type', type: 'select',
        options: ['Standard', 'FIFO'],
      },
      {
        key: 'protocol', label: 'Protocol', type: 'select',
        options: ['HTTPS', 'HTTP', 'Email', 'SMS', 'Lambda', 'SQS'],
      },
    ],
  },
  {
    id: 'eventbridge',
    name: 'EventBridge',
    fullName: 'Amazon EventBridge',
    category: 'integration',
    description: 'Serverless event bus',
    defaultProperties: {
      busType: 'Custom',
      ruleCount: 1,
      region: 'us-east-1',
      availabilityZone: 'a',
    },
    propertySchema: [
      {
        key: 'busType', label: 'Event Bus Type', type: 'select',
        options: ['Default', 'Custom', 'Partner'],
      },
      { key: 'ruleCount', label: 'Rules', type: 'number', min: 1, max: 300 },
    ],
  },
];

export default AWS_SERVICES;

export const getServiceById = (id) => AWS_SERVICES.find((s) => s.id === id);
export const getServicesByCategory = (category) => AWS_SERVICES.filter((s) => s.category === category);
