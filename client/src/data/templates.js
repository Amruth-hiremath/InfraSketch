const N = (id, type, x, y, label) => ({
  id,
  type: "awsService",
  position: { x, y },
  data: {
    serviceType: type,
    label: label || type.toUpperCase(),
  },
});

export const ARCHITECTURE_TEMPLATES = [

  // 1️⃣ Serverless SaaS
  {
    id: "serverless-saas",
    name: "Serverless SaaS",
    description: "Fully serverless scalable backend",
    viewport: { x: 0, y: 0, zoom: 0.7 },

    nodes: [
      N("r53","route53",100,250),
      N("cf","cloudfront",350,250),

      N("l1","lambda",650,150),
      N("l2","lambda",650,350),

      N("ddb","dynamodb",950,250),
      N("s3","s3",950,400),

      N("cw","cloudwatch",650,550),
      N("sns","sns",400,550),
    ],

    edges: [
      {id:"e1",source:"r53",target:"cf",type:"custom"},
      {id:"e2",source:"cf",target:"l1",type:"custom"},
      {id:"e3",source:"cf",target:"l2",type:"custom"},
      {id:"e4",source:"l1",target:"ddb",type:"custom"},
      {id:"e5",source:"l2",target:"ddb",type:"custom"},
      {id:"e6",source:"l2",target:"s3",type:"custom"},
      {id:"e7",source:"l1",target:"cw",type:"custom"},
      {id:"e8",source:"l2",target:"sns",type:"custom"},
    ]
  },

  // 2️⃣ 3-tier production
  {
    id: "3tier",
    name: "3-Tier Production App",
    description: "Classic scalable backend",
    viewport: { x: 0, y: 0, zoom: 0.7 },

    nodes: [
      N("alb","alb",150,250),

      N("ec1","ec2",500,150),
      N("ec2","ec2",500,350),

      N("cache","elasticache",800,250),
      N("db","rds",1100,250),

      N("cw","cloudwatch",500,550),
      N("iam","iam",800,550),
    ],

    edges: [
      {id:"e1",source:"alb",target:"ec1",type:"custom"},
      {id:"e2",source:"alb",target:"ec2",type:"custom"},
      {id:"e3",source:"ec1",target:"cache",type:"custom"},
      {id:"e4",source:"ec2",target:"cache",type:"custom"},
      {id:"e5",source:"cache",target:"db",type:"custom"},
      {id:"e6",source:"ec1",target:"cw",type:"custom"},
      {id:"e7",source:"ec2",target:"cw",type:"custom"},
    ]
  },

  // 3️⃣ Data pipeline
  {
    id: "data-pipeline",
    name: "Streaming Data Pipeline",
    description: "Real-time analytics system",
    viewport: { x: 0, y: 0, zoom: 0.7 },

    nodes: [
      N("kinesis","kinesis",100,250),
      N("lambda","lambda",400,250),
      N("s3","s3",700,250),

      N("athena","athena",700,400),
      N("redshift","redshift",1000,250),

      N("sns","sns",400,450),
      N("cw","cloudwatch",700,600),
    ],

    edges: [
      {id:"e1",source:"kinesis",target:"lambda",type:"custom"},
      {id:"e2",source:"lambda",target:"s3",type:"custom"},
      {id:"e3",source:"s3",target:"athena",type:"custom"},
      {id:"e4",source:"s3",target:"redshift",type:"custom"},
      {id:"e5",source:"lambda",target:"sns",type:"custom"},
      {id:"e6",source:"lambda",target:"cw",type:"custom"},
    ]
  },

  // 4️⃣ Microservices
  {
    id: "microservices",
    name: "Microservices (Event Driven)",
    description: "Async architecture with queues",
    viewport: { x: 0, y: 0, zoom: 0.7 },

    nodes: [
      N("alb","alb",150,250),

      N("svc1","fargate",500,150),
      N("svc2","fargate",500,350),

      N("queue","sqs",800,250),
      N("db","dynamodb",1100,250),

      N("sns","sns",800,450),
      N("cw","cloudwatch",500,550),
    ],

    edges: [
      {id:"e1",source:"alb",target:"svc1",type:"custom"},
      {id:"e2",source:"alb",target:"svc2",type:"custom"},
      {id:"e3",source:"svc1",target:"queue",type:"custom"},
      {id:"e4",source:"svc2",target:"queue",type:"custom"},
      {id:"e5",source:"queue",target:"db",type:"custom"},
      {id:"e6",source:"svc2",target:"sns",type:"custom"},
      {id:"e7",source:"svc1",target:"cw",type:"custom"},
    ]
  },

  // 5️⃣ Static + Backend
  {
    id: "static-backend",
    name: "Static + API Backend",
    description: "Frontend + serverless backend",
    viewport: { x: 0, y: 0, zoom: 0.7 },

    nodes: [
      N("r53","route53",100,250),
      N("cf","cloudfront",350,250),

      N("s3","s3",650,150),
      N("lambda","lambda",650,350),

      N("ddb","dynamodb",950,350),
      N("cw","cloudwatch",650,550),
    ],

    edges: [
      {id:"e1",source:"r53",target:"cf",type:"custom"},
      {id:"e2",source:"cf",target:"s3",type:"custom"},
      {id:"e3",source:"cf",target:"lambda",type:"custom"},
      {id:"e4",source:"lambda",target:"ddb",type:"custom"},
      {id:"e5",source:"lambda",target:"cw",type:"custom"},
    ]
  },

  // 6️⃣ CI/CD Pipeline 🔥
  {
    id: "cicd",
    name: "CI/CD Pipeline",
    description: "Build, deploy, monitor pipeline",
    viewport: { x: 0, y: 0, zoom: 0.7 },

    nodes: [
      N("repo","s3",100,250,"Code Storage"),
      N("build","lambda",400,250,"Build"),

      N("deploy","ec2",700,250,"Deploy Target"),
      N("artifact","s3",400,400,"Artifacts"),

      N("cw","cloudwatch",700,500),
      N("sns","sns",400,550),
    ],

    edges: [
      {id:"e1",source:"repo",target:"build",type:"custom"},
      {id:"e2",source:"build",target:"deploy",type:"custom"},
      {id:"e3",source:"build",target:"artifact",type:"custom"},
      {id:"e4",source:"deploy",target:"cw",type:"custom"},
      {id:"e5",source:"cw",target:"sns",type:"custom"},
    ]
  },

  // 7️⃣ ML Pipeline
  {
    id: "ml-pipeline",
    name: "ML Pipeline",
    description: "Train + store + analyze",
    viewport: { x: 0, y: 0, zoom: 0.7 },

    nodes: [
      N("s3","s3",100,250,"Dataset"),
      N("emr","emr",400,250,"Training"),

      N("lambda","lambda",700,250,"Inference"),
      N("ddb","dynamodb",1000,250),

      N("cw","cloudwatch",700,450),
      N("sns","sns",400,550),
    ],

    edges: [
      {id:"e1",source:"s3",target:"emr",type:"custom"},
      {id:"e2",source:"emr",target:"lambda",type:"custom"},
      {id:"e3",source:"lambda",target:"ddb",type:"custom"},
      {id:"e4",source:"lambda",target:"cw",type:"custom"},
      {id:"e5",source:"cw",target:"sns",type:"custom"},
    ]
  },

  // 8️⃣ Multi-region failover 🌍
  {
    id: "multi-region",
    name: "Multi-Region Failover",
    description: "Highly available architecture",
    viewport: { x: 0, y: 0, zoom: 0.7 },

    nodes: [
      N("r53","route53",100,250),

      N("ec1","ec2",500,150,"Primary"),
      N("ec2","ec2",500,350,"Secondary"),

      N("db1","rds",900,150,"Primary DB"),
      N("db2","rds",900,350,"Replica DB"),

      N("cw","cloudwatch",500,550),
    ],

    edges: [
      {id:"e1",source:"r53",target:"ec1",type:"custom"},
      {id:"e2",source:"r53",target:"ec2",type:"custom"},
      {id:"e3",source:"ec1",target:"db1",type:"custom"},
      {id:"e4",source:"ec2",target:"db2",type:"custom"},
      {id:"e5",source:"ec1",target:"cw",type:"custom"},
    ]
  },

];