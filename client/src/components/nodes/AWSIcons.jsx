// Inline SVG icons for all AWS services
// Clean, recognizable icons that work at small sizes

const AWS_ICONS_PATHS = {
  ec2: '/icons/EC2.svg',
  lambda: '/icons/Lambda.svg',
  'elastic-beanstalk': '/icons/Elastic Beanstalk.svg',
  fargate: '/icons/Fargate.svg',
  lightsail: '/icons/Lightsail.svg',
  s3: '/icons/Simple Storage Service.svg',
  ebs: '/icons/Elastic Block Store.svg',
  efs: '/icons/EFS.svg',
  glacier: '/icons/Simple Storage Service Glacier.svg',
  rds: '/icons/RDS.svg',
  dynamodb: '/icons/DynamoDB.svg',
  aurora: '/icons/Aurora.svg',
  elasticache: '/icons/ElastiCache.svg',
  redshift: '/icons/Redshift.svg',
  vpc: '/icons/Virtual Private Cloud.svg',
  cloudfront: '/icons/CloudFront.svg',
  route53: '/icons/Route 53.svg',
  alb: '/icons/Application Auto Scaling.svg',
  iam: '/icons/IAM Identity Center.svg',
  kms: '/icons/Key Management Service.svg',
  shield: '/icons/Shield.svg',
  cloudwatch: '/icons/CloudWatch.svg',
  cloudformation: '/icons/CloudFormation.svg',
  athena: '/icons/Athena.svg',
  emr: '/icons/EMR.svg',
  kinesis: '/icons/Kinesis.svg',
  sqs: '/icons/Simple Queue Service.svg',
  sns: '/icons/Simple Notification Service.svg',
  eventbridge: '/icons/EventBridge.svg',
};

const AWS_ICONS = Object.fromEntries(
  Object.entries(AWS_ICONS_PATHS).map(([key, path]) => [
    key,
    <img src={path} alt={`${key} icon`} style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
  ])
);

export default AWS_ICONS;
