> Project still in development phase!

# InfraSketch

An interactive, drag-and-drop cloud architecture designer built specifically for AWS.

## Overview

InfraSketch is a visual tool that enables developers to design AWS architectures using a drag-and-drop interface. It allows customization of component properties, validates designs against security best practices, and provides real-time monthly cost estimates before writing any Infrastructure as Code (IaC).

### The Problem
System architecture design is often fragmented across multiple tools:
- Diagrams created in tools like Draw.io  
- Cost estimation handled in spreadsheets  
- AWS rules checked manually  

InfraSketch consolidates these workflows into a single platform, ensuring architectures are visually clear, structurally sound, and financially predictable.

---

## Tech Stack

- **Frontend:** React.js, React Flow, Tailwind CSS  
- **Backend:** Node.js, Express (REST API)  
- **Database:** MongoDB (for storing graph structures and user data)  
- **Authentication:** Google oAuth - session-based authentication  

---

## Core Features

### Interactive Canvas
- Drag-and-drop workspace for AWS components  
- Ability to create connections between components  

### Property Inspector
- Sidebar for editing selected component attributes  
- Supports configuration such as region, instance type, and storage  

### Real-Time Cost Calculator
- Dynamically estimates monthly AWS costs  
- Updates based on selected components and configurations  

### Architecture Linter
- Validates architecture for structural and security issues  
- Example: flags publicly exposed databases  

### Export Options
- Export diagrams as high-resolution PNG  
- Save and reload architecture using JSON  

---

## Supported AWS Components

### Compute
- EC2  
- Lambda  
- Elastic Beanstalk  
- Fargate  
- Lightsail  

### Storage
- S3  
- EBS  
- EFS  
- Glacier  

### Database
- RDS  
- DynamoDB  
- Aurora  
- ElastiCache  
- Redshift  

### Networking and CDN
- VPC  
- CloudFront  
- Route 53  
- Application Load Balancer (ALB)  

### Security and Identity
- IAM  
- KMS  
- Shield  

### Management and Governance
- CloudWatch  
- CloudFormation  

### Analytics
- Athena  
- EMR  
- Kinesis  

### Integration
- SQS  
- SNS  
- EventBridge  

---

## Node Customization

When a component is selected, the sidebar displays configurable properties.

### Global Properties
- Custom name or label  
- AWS region (e.g., `us-east-1`, `ap-south-1`)  
- Availability Zone  

### Component-Specific Examples

- **EC2**
  - Instance type (e.g., `t2.micro`, `m5.large`)  
  - Operating system  
  - Used in cost calculation  

- **S3**
  - Storage class  
  - Versioning toggle  
  - Used in validation rules  

- **RDS**
  - Database engine  
  - Storage capacity  
  - Used in cost calculation  

- **VPC**
  - CIDR block configuration  

---
