> Project still in development phase!


<h1 align="center">InfraSketch</h1>

<p align="center">
  <img src="https://drive.google.com/uc?export=view&id=1-25RZWIbCUVklhsvBqlQTdaIylMlyBDE" 
       alt="InfraSketch Banner" 
       width="450"/>
</p>

<p align="center">
  <!--Version-->
  <a href="https://github.com/amruth-hiremath/InfraSketch/releases">
  <img src="https://img.shields.io/badge/version-1.0.0-blue" />
  </a>
  <!-- Status -->
  <a href="https://github.com/amruth-hiremath/InfraSketch">
    <img src="https://img.shields.io/badge/build-passing-brightgreen" />
  </a>
  <a href="LICENSE">
    <img src="https://img.shields.io/badge/license-Academic%20Demo-blue" />
  </a>

  <!-- Tech Stack -->
  <a href="https://reactjs.org/">
    <img src="https://img.shields.io/badge/React-18-blue?logo=react" />
  </a>
  <a href="https://nodejs.org/">
    <img src="https://img.shields.io/badge/Node.js-18-green?logo=node.js" />
  </a>
  <a href="https://www.mongodb.com/atlas">
    <img src="https://img.shields.io/badge/MongoDB-Atlas-brightgreen?logo=mongodb" />
  </a>
  <a href="https://aws.amazon.com/">
    <img src="https://img.shields.io/badge/AWS-Supported-orange?logo=amazonaws" />
  </a>
  <a href="https://firebase.google.com/">
    <img src="https://img.shields.io/badge/Firebase-Auth-yellow?logo=firebase" />
  </a>

  <!-- Deployment -->
  <a href="https://vercel.com/">
    <img src="https://img.shields.io/badge/Deployed%20on-Vercel-black?logo=vercel" />
  </a>
  <a href="https://render.com/">
    <img src="https://img.shields.io/badge/Deployed%20on-Render-purple?logo=render" />
  </a>
</p>

InfraSketch is a full-stack web application for designing, validating, and managing AWS cloud architectures through an interactive visual interface. It consolidates diagramming, configuration, cost estimation, and validation into a single platform.

---

## Overview

Designing cloud architectures typically involves multiple disconnected tools:
- Diagramming tools for visualization
- Spreadsheets for cost estimation
- Manual review for validation

InfraSketch integrates these workflows into a unified system, enabling users to create architectures that are visually clear, structurally valid, and cost-aware.

---

## Features

### Interactive Architecture Canvas
- Drag-and-drop interface for AWS components
- Create and manage connections between services
- Smooth zooming and navigation

### Component Configuration
- Dynamic property editor for selected components
- Supports configuration such as region, instance type, and storage

### Cost Estimation
- Real-time estimation of monthly AWS costs
- Automatically updates based on selected components and configurations

### Architecture Validation
- Detects structural and security issues
- Example checks:
  - Publicly exposed databases
  - Misconfigured components

### Authentication
- Google Sign-In using Firebase Authentication
- Backend session handling with JWT

### Template System
- Save reusable architecture templates
- Load and reuse saved templates

### Sharing
- Toggle diagram visibility (public/private)
- Share architecture via unique links

### Export and Import
- Export diagrams as PNG
- Save and load architectures using JSON

---

## Supported AWS Services

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
- Application Load Balancer

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

## Tech Stack

### Frontend
- React.js
- React Flow
- Tailwind CSS

### Backend
- Node.js
- Express.js

### Database
- MongoDB Atlas

### Authentication
- Firebase Authentication (Google OAuth)
- JWT for backend session management

### Deployment
- Frontend: Vercel
- Backend: Render
- Database: MongoDB Atlas

---

## System Architecture
```text
Frontend (React + Vercel)
↓
Backend API (Express + Render)
↓
MongoDB Atlas
↓
Firebase Authentication
```

## Project Structure
```plaintext
InfraSketch/
│
├── client/ # React frontend
├── server/ # Express backend
└── README.md
```

## Getting Started

### Prerequisites
- Node.js (v18 or later)
- MongoDB Atlas account
- Firebase project (for authentication)

### 1. Clone the Repository
```bash
git clone https://github.com/your-username/InfraSketch.git
cd InfraSketch
```

### 2. Backend Setup
```bash
cd server
npm install
```

Create a `.env` file:
```env
PORT=5000
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
FIREBASE_SERVICE_ACCOUNT=your_firebase_service_account_json
NODE_ENV=development
```

Run the backend:
```bash
npm run dev
```

### 3. Frontend Setup
```bash
cd client
npm install
```

Create a `.env` file:
```env
VITE_API_BASE_URL=http://localhost:5000
```

Run the frontend:
```bash
npm run dev
```

## Deployment
InfraSketch is deployed using a cloud-native architecture:
- Frontend hosted on Vercel with automatic deployments
- Backend hosted on Render with CI/CD integration
- Database hosted on MongoDB Atlas

## Future Improvements
- Support for multi-cloud environments (Azure, GCP)
- Infrastructure-as-Code export (Terraform, CloudFormation)
- Real-time collaboration between users
- Version history for architectures
- Advanced cost optimization recommendations

## Author
[**Amruthesh C Hiremath**](https://github.com/amruth-hiremath)

## License
This project is for academic and demonstration purposes.
