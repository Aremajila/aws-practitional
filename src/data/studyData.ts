import { WeeklyModule, Flashcard, LabTask, QuizQuestion } from '../types';

export const INITIAL_MODULES: WeeklyModule[] = [
  // Month 1
  {
    id: 'w1',
    week: 1,
    month: 1,
    title: 'Cloud Computing Basics & Security Models',
    subtitle: 'Month 1 — Foundations',
    description: 'Understand basic cloud definitions, advantages of cloud computing (6 advantages), and the foundational AWS Shared Responsibility Model.',
    topics: [
      '6 Advantages of Cloud Computing (Trade capital expense for variable, economies of scale, stop guessing capacity, etc.)',
      'Deployment Models: Public, Private, Hybrid',
      'Service Models: IaaS, PaaS, SaaS',
      'AWS Shared Responsibility Model: Security OF the Cloud (AWS) vs Security IN the Cloud (Customer)',
      'AWS Customer Service & Abuse Team'
    ],
    completed: false,
    confidence: 0
  },
  {
    id: 'w2',
    week: 2,
    month: 1,
    title: 'AWS Global Infrastructure & High Availability',
    subtitle: 'Month 1 — Foundations',
    description: 'Learn the architectural backbone of AWS: Regions, Availability Zones, Edge Locations, and how they provide disaster recovery and speed.',
    topics: [
      'AWS Regions: Geographical isolation, compliance, and latency considerations',
      'Availability Zones (AZs): Physical data centers, redundant power, and ultra-low latency connections',
      'Edge Locations & Regional Edge Caches: For CloudFront content delivery',
      'High Availability vs Fault Tolerance vs Disaster Recovery',
      'AWS Local Zones and Wavelength Zones'
    ],
    completed: false,
    confidence: 0
  },
  {
    id: 'w3',
    week: 3,
    month: 1,
    title: 'Core Compute & Identity Access Management (IAM)',
    subtitle: 'Month 1 — Foundations',
    description: 'Master Amazon EC2 instances, basic compute pricing, and how to safely control access using AWS Identity and Access Management.',
    topics: [
      'IAM Users, Groups, Roles, Policies, and multi-factor authentication (MFA)',
      'Root User Security best practices (enable MFA, delete access keys)',
      'Amazon EC2: Instance types, Purchasing options (On-Demand, Spot, Reserved, Savings Plans)',
      'Amazon Elastic Container Service (ECS), Elastic Kubernetes Service (EKS), and AWS Fargate',
      'AWS Lambda: Serverless event-driven compute'
    ],
    completed: false,
    confidence: 0
  },
  {
    id: 'w4',
    week: 4,
    month: 1,
    title: 'Core Storage & Database Services',
    subtitle: 'Month 1 — Foundations',
    description: 'Differentiate between object storage, block storage, file storage, and structured SQL/NoSQL databases in the AWS Cloud.',
    topics: [
      'Amazon S3 (Simple Storage Service): Bucket structure, keys, object storage, and versioning',
      'Amazon EBS (Elastic Block Store) vs Amazon EFS (Elastic File System)',
      'Amazon RDS (Relational Database Service): Multi-AZ deployment and Read Replicas',
      'Amazon DynamoDB: Fully managed serverless NoSQL database',
      'Amazon Redshift (Data Warehousing) and Amazon ElastiCache (In-memory cache)'
    ],
    completed: false,
    confidence: 0
  },
  // Month 2
  {
    id: 'w5',
    week: 5,
    month: 2,
    title: 'Networking & Content Delivery',
    subtitle: 'Month 2 — Deeper Services + Hands-on',
    description: 'Deep dive into virtual networking with Amazon VPC, custom routing, security groups, public/private subnets, and Route 53 routing.',
    topics: [
      'Amazon VPC: CIDR blocks, Public and Private subnets',
      'Internet Gateways (IGW), NAT Gateways, and Route Tables',
      'Security Groups (Stateful, Instance level) vs Network ACLs (Stateless, Subnet level)',
      'Amazon Route 53: DNS record types, Routing policies (latency, geolocation, failover)',
      'Amazon CloudFront: Content delivery network (CDN) and edge caching'
    ],
    completed: false,
    confidence: 0
  },
  {
    id: 'w6',
    week: 6,
    month: 2,
    title: 'Storage Optimization & Data Management',
    subtitle: 'Month 2 — Deeper Services + Hands-on',
    description: 'Compare S3 storage classes to save costs, implement object lifecycle rules, configure automatic backups, and learn hybrid storage options.',
    topics: [
      'S3 Storage Classes: Standard, Intelligent-Tiering, Standard-IA, One Zone-IA, Glacier Instant/Flexible/Deep Archive',
      'S3 Lifecycle Policies: Auto-transitioning or deleting old objects',
      'Amazon EBS Volume types (SSD vs HDD, gp3 vs io2)',
      'AWS Backup: Centralized backup service',
      'AWS Storage Gateway: File, Volume, and Tape Gateway hybrid storage'
    ],
    completed: false,
    confidence: 0
  },
  {
    id: 'w7',
    week: 7,
    month: 2,
    title: 'Security, Monitoring & Compliance Services',
    subtitle: 'Month 2 — Deeper Services + Hands-on',
    description: 'Explore security defense-in-depth on AWS using KMS, Shield, WAF, GuardDuty, Macie, Inspector, CloudTrail, and AWS Artifact.',
    topics: [
      'AWS Key Management Service (KMS) & AWS Secrets Manager',
      'AWS Shield (DDoS protection) & AWS WAF (Web Application Firewall)',
      'Amazon GuardDuty (Intelligent threat detection) vs AWS Inspector (Software vulnerability scans)',
      'Amazon Macie: PII data discovery in S3 using ML',
      'AWS CloudTrail (User API auditing) vs Amazon CloudWatch (Resource metrics & logging)',
      'AWS Artifact: On-demand compliance reports and agreements'
    ],
    completed: false,
    confidence: 0
  },
  {
    id: 'w8',
    week: 8,
    month: 2,
    title: 'Billing, Cost Management & AWS Support',
    subtitle: 'Month 2 — Deeper Services + Hands-on',
    description: 'Understand how AWS bills customers, consolidate billing with AWS Organizations, set limits with Budgets, and explore the 4 support plans.',
    topics: [
      'AWS Billing Dashboard & AWS Payment Cryptography',
      'AWS Organizations: Consolidated billing and Service Control Policies (SCPs)',
      'AWS Budgets: Alert on cost/usage forecasts vs AWS Cost Explorer: Historic visual trends',
      'AWS Pricing Calculator: Estimating infrastructure configurations',
      'AWS Support Plans: Basic (Free), Developer ($29+), Business ($100+), Enterprise ($15,000+)',
      'AWS Trusted Advisor: automated recommendations across Cost, Performance, Security, Fault Tolerance, Limits'
    ],
    completed: false,
    confidence: 0
  },
  // Month 3
  {
    id: 'w9',
    week: 9,
    month: 3,
    title: 'AWS Well-Architected Framework & Cloud Adoption',
    subtitle: 'Month 3 — Consolidation',
    description: 'Review the architectural standards for cloud-native applications: the 6 pillars of the AWS Well-Architected Framework and Cloud Adoption Framework (CAF).',
    topics: [
      'Well-Architected Pillar 1: Operational Excellence (run and monitor systems)',
      'Well-Architected Pillar 2: Security (protect data and assets)',
      'Well-Architected Pillar 3: Reliability (recover from failures, scale dynamically)',
      'Well-Architected Pillar 4: Performance Efficiency (use resources resourcefully)',
      'Well-Architected Pillar 5: Cost Optimization (avoid unnecessary expenses)',
      'Well-Architected Pillar 6: Sustainability (minimize environmental impact)',
      'AWS Cloud Adoption Framework (CAF): Business, People, Governance, Platform, Security, Operations perspectives'
    ],
    completed: false,
    confidence: 0
  },
  {
    id: 'w10',
    week: 10,
    month: 3,
    title: 'Migration, Innovation & Specialized Services',
    subtitle: 'Month 3 — Consolidation',
    description: 'Discover migration services (Snow Family, DMS), managed deployment models, and artificial intelligence/machine learning tools on AWS.',
    topics: [
      'AWS Database Migration Service (DMS) & Schema Conversion Tool (SCT)',
      'AWS Snow Family: Snowcone, Snowball Edge, Snowmobile (physical data transport)',
      'AWS CloudFormation: Infrastructure as Code (IaC)',
      'Amazon SageMaker (ML modeling), Amazon Lex (chatbots), Amazon Rekognition (image recognition)',
      'AWS Outposts: Running AWS services on-premises',
      'AWS IQ & AWS Managed Services (AMS)'
    ],
    completed: false,
    confidence: 0
  },
  {
    id: 'w11',
    week: 11,
    month: 3,
    title: 'Practice Exam 1 & Weak-Area Target review',
    subtitle: 'Month 3 — Consolidation',
    description: 'Take a full-length, timed 65-question Practice Exam to replicate the actual CLF-C02 testing environment, followed by deep rationale analysis.',
    topics: [
      'Testing strategy and time management (90-minute limit)',
      'Understanding exam distractors (incorrect answers designed to look correct)',
      'Analyzing score report breakdowns by domain',
      'Re-reviewing week 1-10 modules rated 3 or below on confidence',
      'Drilling custom flashcards flagged as Hard'
    ],
    completed: false,
    confidence: 0
  },
  {
    id: 'w12',
    week: 12,
    month: 3,
    title: 'Practice Exam 2 & Exam-Day Readiness Verification',
    subtitle: 'Month 3 — Consolidation',
    description: 'Complete the final review loop, take Practice Exam 2, and verify that your automated readiness score is above 80% before sitting the real exam.',
    topics: [
      'Re-taking targeted domains with lowest historical scores',
      'Reviewing AWS whitepapers: Overview of AWS, AWS Pricing Overview',
      'Verifying the "Exam Readiness Score" dashboard metric is green',
      'Final confirmation of testing center guidelines or remote exam proctor setup',
      'Day-of-exam checklist: IDs, clean workspace, positive mindset'
    ],
    completed: false,
    confidence: 0
  }
];

export const INITIAL_FLASHCARDS: Flashcard[] = [
  {
    id: 'f1',
    domain: 'Security & Compliance',
    front: 'AWS Shared Responsibility Model',
    back: 'The boundary dividing what AWS secures (Security OF the Cloud, like hardware, physical servers, and hypervisors) and what the customer secures (Security IN the Cloud, like guest OS, data encryption, IAM policies, and application configurations).',
    reviewCount: 0
  },
  {
    id: 'f2',
    domain: 'Technology',
    front: 'Amazon EC2',
    back: 'Elastic Compute Cloud: Secure, resizable virtual servers (instances) in the cloud. Allows configuring CPU, memory, storage, and networking on-demand.',
    reviewCount: 0
  },
  {
    id: 'f3',
    domain: 'Technology',
    front: 'Amazon S3',
    back: 'Simple Storage Service: Object storage service offering industry-leading scalability, data availability, security, and performance. Stores files in "buckets" with a unique flat key structure.',
    reviewCount: 0
  },
  {
    id: 'f4',
    domain: 'Technology',
    front: 'Amazon VPC',
    back: 'Virtual Private Cloud: A logically isolated virtual network that you define in the AWS cloud. You control subnets, IP addressing, route tables, and gateways.',
    reviewCount: 0
  },
  {
    id: 'f5',
    domain: 'Security & Compliance',
    front: 'AWS IAM',
    back: 'Identity and Access Management: Securely manage access to AWS services and resources. Allows creating Users, Groups, Roles, Policies, and enforcing Multi-Factor Authentication (MFA).',
    reviewCount: 0
  },
  {
    id: 'f6',
    domain: 'Technology',
    front: 'AWS Lambda',
    back: 'A serverless, event-driven compute service that lets you run code for virtually any type of application or backend service without provisioning or managing servers. Charged only for the compute time you consume.',
    reviewCount: 0
  },
  {
    id: 'f7',
    domain: 'Technology',
    front: 'Amazon CloudFront',
    back: 'A fast, secure, programmable content delivery network (CDN) that delivers data, videos, applications, and APIs to customers globally with low latency and high transfer speeds using global Edge Locations.',
    reviewCount: 0
  },
  {
    id: 'f8',
    domain: 'Technology',
    front: 'Amazon Route 53',
    back: 'A highly available and scalable cloud Domain Name System (DNS) web service designed to route end users to internet applications by translating human-readable names into numeric IP addresses.',
    reviewCount: 0
  },
  {
    id: 'f9',
    domain: 'Technology',
    front: 'AWS Elastic Load Balancing (ELB)',
    back: 'Automatically distributes incoming application traffic across multiple targets, such as Amazon EC2 instances, containers, and IP addresses, in one or more Availability Zones to ensure high availability.',
    reviewCount: 0
  },
  {
    id: 'f10',
    domain: 'Technology',
    front: 'Amazon RDS',
    back: 'Relational Database Service: Makes it easy to set up, operate, and scale a relational SQL database (MySQL, PostgreSQL, MariaDB, Oracle, SQL Server, Aurora) in the cloud with automated backups and scaling.',
    reviewCount: 0
  },
  {
    id: 'f11',
    domain: 'Technology',
    front: 'Amazon DynamoDB',
    back: 'A fully managed, serverless, single-digit millisecond key-value and document NoSQL database designed for internet-scale applications that require highly consistent, rapid, predictable latency.',
    reviewCount: 0
  },
  {
    id: 'f12',
    domain: 'Technology',
    front: 'Amazon CloudWatch',
    back: 'A monitoring and management service that provides data and actionable insights for AWS, hybrid, and on-premises applications. Monitors operational metrics, logs, alarms, and resource CPU usage.',
    reviewCount: 0
  },
  {
    id: 'f13',
    domain: 'Security & Compliance',
    front: 'AWS CloudTrail',
    back: 'A service that monitors and records account activity across your AWS infrastructure, providing user API auditing, security analysis, and resource change tracking (logs who did what, when, and from where).',
    reviewCount: 0
  },
  {
    id: 'f14',
    domain: 'Cloud Concepts',
    front: 'AWS Well-Architected Framework',
    back: 'A set of design principles and architectural best practices structured across six pillars: Operational Excellence, Security, Reliability, Performance Efficiency, Cost Optimization, and Sustainability.',
    reviewCount: 0
  },
  {
    id: 'f15',
    domain: 'Billing & Pricing',
    front: 'AWS Support Plans',
    back: 'Four tiers of support: Basic (Developer forums, billing support), Developer ($29/mo, 1 business day response, tech assistance), Business ($100/mo, 1 hour urgent response, 24/7 access), Enterprise ($15k/mo, 15 min response, Technical Account Manager/TAM).',
    reviewCount: 0
  },
  {
    id: 'f16',
    domain: 'Security & Compliance',
    front: 'AWS Shield',
    back: 'A managed Distributed Denial of Service (DDoS) protection service that safeguards applications running on AWS. Basic is enabled for all customers automatically; Advanced provides financial protection and 24/7 response.',
    reviewCount: 0
  },
  {
    id: 'f17',
    domain: 'Security & Compliance',
    front: 'AWS WAF',
    back: 'Web Application Firewall: Helps protect web applications or APIs against common web exploits and bots that may affect availability, compromise security, or consume excessive resources (operates on OSI Layer 7).',
    reviewCount: 0
  },
  {
    id: 'f18',
    domain: 'Billing & Pricing',
    front: 'AWS Cost Explorer',
    back: 'A tool that lets you visualize, understand, and manage your AWS costs and usage over time. Provides interactive charts, breakdown filters (e.g. by service, region), and lets you project future expenses.',
    reviewCount: 0
  },
  {
    id: 'f19',
    domain: 'Technology',
    front: 'AWS Snowball Edge',
    back: 'A physical data migration and edge computing device with on-board storage and compute power. Used to physically transport petabytes of data into or out of AWS where internet speeds are insufficient.',
    reviewCount: 0
  },
  {
    id: 'f20',
    domain: 'Security & Compliance',
    front: 'AWS Trusted Advisor',
    back: 'An online tool that provides real-time guidance to help you provision your resources following AWS best practices. Checks cover 5 categories: Cost Optimization, Security, Fault Tolerance, Performance, and Service Limits.',
    reviewCount: 0
  }
];

export const INITIAL_LABS: LabTask[] = [
  {
    id: 'l1',
    title: 'Launch and Connect to an EC2 Linux Instance',
    description: 'Log into your AWS Free Tier account, select the EC2 console, launch a t2.micro Amazon Linux 2 AMI, configure a security group allowing port 22 (SSH) from your IP, download your private key (.pem), and use your terminal or EC2 Instance Connect to access the command line.',
    whyItMatters: 'EC2 is the foundation of all server compute on AWS. Knowing how security groups control traffic and how key pairs secure SSH access are crucial exam topics and practical DevOps skills.',
    completed: false,
    estimatedMinutes: 20
  },
  {
    id: 'l2',
    title: 'Create an S3 Bucket and Configure Access Control',
    description: 'Open the S3 console, create a bucket with a globally unique name, upload a sample index.html file, disable "Block all public access" for the bucket, and add a simple Bucket Policy that allows public "s3:GetObject" read-only access to verify you can open the file via HTTP.',
    whyItMatters: 'S3 hosts over 80% of data on AWS. Understanding object-level storage, bucket security settings, and how to write a simple IAM-style policy is heavily tested in Domain 2 (Security) and Domain 3 (Technology).',
    completed: false,
    estimatedMinutes: 15
  },
  {
    id: 'l3',
    title: 'Set Up an IAM User with a Managed Group and MFA',
    description: 'Go to the IAM console, create a new IAM group named "Admins", attach the "AdministratorAccess" AWS managed policy to it. Then, create a new IAM user with console access, place them in the Admin group, log in as that user, and activate Virtual MFA (using Google Authenticator or Duo).',
    whyItMatters: 'The root AWS account should never be used for daily tasks. Implementing the principle of least privilege, IAM groups, and forcing MFA is a central focus of AWS Security best practices.',
    completed: false,
    estimatedMinutes: 15
  },
  {
    id: 'l4',
    title: 'Design a Simple Custom VPC with Public/Private Subnets',
    description: 'Use the VPC Wizard (or configure manually) to create a VPC with CIDR 10.0.0.0/16. Provision one Public Subnet (10.0.1.0/24) attached to an Internet Gateway, and one Private Subnet (10.0.2.0/24) without public route table paths. Launch an EC2 instance in each and verify internet accessibility.',
    whyItMatters: 'A secure cloud architecture begins at the network level. Distinguishing what makes a subnet public (Internet Gateway route table entry) vs private is an absolute core network exam requirement.',
    completed: false,
    estimatedMinutes: 30
  },
  {
    id: 'l5',
    title: 'Create a Billing Alarm in CloudWatch',
    description: 'Go to the CloudWatch console (ensuring your billing alerts are enabled in billing preferences), create a billing alarm, configure it to trigger when estimated charges exceed $5.00 for the billing cycle, and set up an SNS topic to email you immediately when the threshold is crossed.',
    whyItMatters: 'Stop guessing capacity and avoid unexpected costs. Monitoring costs actively through CloudWatch billing alarms is the direct implementation of Cost Optimization principles under the AWS Well-Architected Framework.',
    completed: false,
    estimatedMinutes: 15
  }
];

export const QUIZ_QUESTIONS: QuizQuestion[] = [
  // Cloud Concepts (Domain 1)
  {
    id: 'q1',
    domain: 'Cloud Concepts',
    question: 'Which of the following describes the AWS cloud characteristic of "elasticity"?',
    options: [
      'The ability to pay for services using long-term contract discounts.',
      'The ability to dynamically scale resources up or down in response to real-time demand fluctuations.',
      'The physical durability of hardware storage drives across multiple geographical data centers.',
      'The capacity to easily migrate resources from on-premises environments into AWS.'
    ],
    correctAnswerIndex: 1,
    explanation: 'Elasticity is the ability to automatically scale computing resources out/in or up/down based on demand so you consume only what is needed, avoiding over-provisioning or under-provisioning.'
  },
  {
    id: 'q2',
    domain: 'Cloud Concepts',
    question: 'According to the AWS Shared Responsibility Model, which of the following is a responsibility of the customer?',
    options: [
      'Maintaining physical hypervisors that host virtualization services.',
      'Upgrading server hardware inside AWS Edge Locations.',
      'Configuring network security groups and rotating application credentials.',
      'Disposing of old solid-state drives used by S3 storage systems.'
    ],
    correctAnswerIndex: 2,
    explanation: 'The customer is responsible for security "IN" the cloud, which includes data encryption, configuring guest operating systems, IAM permissions, firewall security groups, and credentials management. AWS manages the hardware, physical facilities, and virtual host layers.'
  },
  {
    id: 'q3',
    domain: 'Cloud Concepts',
    question: 'Which of the following is one of the 6 advantages of cloud computing mentioned in AWS guidelines?',
    options: [
      'Trade variable expense for high fixed capital investments.',
      'Increase time-to-market by testing only in localized environments.',
      'Stop guessing capacity, instead utilizing elastic resources.',
      'Establish personalized physically-isolated data centers in every city.'
    ],
    correctAnswerIndex: 2,
    explanation: '"Stop guessing capacity" is one of the 6 advantages. The other 5 are: trade capital expense for variable expense, benefit from massive economies of scale, increase speed and agility, stop spending money running and maintaining data centers, and go global in minutes.'
  },
  {
    id: 'q4',
    domain: 'Cloud Concepts',
    question: 'What does the term "High Availability" primarily mean in system architecture?',
    options: [
      'The capability of a system to continue functioning even if some hardware or virtual component fails.',
      'The rate of data transfer between an on-premises database and cloud warehouses.',
      'The ability of a system to remain accessible to users with minimal downtime over a given period.',
      'The pricing tier where you get maximum customer support hours.'
    ],
    correctAnswerIndex: 2,
    explanation: 'High Availability (HA) measures the percentage of time a system is fully operational and accessible. It is closely related to reliability, but focuses on continuous accessibility without downtime.'
  },
  {
    id: 'q5',
    domain: 'Cloud Concepts',
    question: 'Which perspective of the AWS Cloud Adoption Framework (AWS CAF) focuses on building a secure cloud environment while meeting compliance requirements?',
    options: [
      'Governance perspective',
      'Security perspective',
      'Platform perspective',
      'Operations perspective'
    ],
    correctAnswerIndex: 1,
    explanation: 'The Security perspective of AWS CAF helps you structure selection of controls and processes to protect data, identities, and workloads in AWS while ensuring compliance requirements are satisfied.'
  },

  // Security & Compliance (Domain 2)
  {
    id: 'q6',
    domain: 'Security & Compliance',
    question: 'Which security best practice dictates that users should only be granted the minimum permissions necessary to perform their specific job functions?',
    options: [
      'Multi-factor authentication (MFA)',
      'The Principle of Least Privilege',
      'The Shared Security model',
      'Role-based infrastructure auditing'
    ],
    correctAnswerIndex: 1,
    explanation: 'The Principle of Least Privilege advises granting only the exact permissions needed to execute a task, and nothing more, which limits potential damage from compromised credentials.'
  },
  {
    id: 'q7',
    domain: 'Security & Compliance',
    question: 'Which AWS service provides intelligent, continuous threat monitoring, analyzing VPC flow logs and CloudTrail event logs to identify malicious activity?',
    options: [
      'Amazon GuardDuty',
      'AWS Inspector',
      'AWS Shield',
      'AWS Artifact'
    ],
    correctAnswerIndex: 0,
    explanation: 'Amazon GuardDuty is an intelligent, machine-learning-driven threat detection service that continuously monitors AWS accounts and workloads for suspicious behavior by parsing data sources like CloudTrail logs, VPC flow logs, and DNS query logs.'
  },
  {
    id: 'q8',
    domain: 'Security & Compliance',
    question: 'A company needs to download compliance reports, certification audits, and ISO agreements to satisfy a government regulator. Where should they look?',
    options: [
      'AWS Trusted Advisor console',
      'AWS Security Hub',
      'AWS License Manager',
      'AWS Artifact'
    ],
    correctAnswerIndex: 3,
    explanation: 'AWS Artifact is the central resource for on-demand compliance reports, audits, SOC agreements, and physical safety certificates from AWS security accreditations.'
  },
  {
    id: 'q9',
    domain: 'Security & Compliance',
    question: 'What is the main difference between an IAM User and an IAM Role?',
    options: [
      'IAM Users are temporary, while IAM Roles are permanent credentials.',
      'IAM Users represent specific individuals or applications with permanent credentials, whereas IAM Roles represent temporary privileges that can be assumed by any authorized entity.',
      'IAM Users have billing permissions, while IAM Roles are strictly forbidden from viewing cost data.',
      'IAM Users operate only inside custom VPCs, whereas IAM Roles are universal.'
    ],
    correctAnswerIndex: 1,
    explanation: 'An IAM User represents a permanent identity (person or application) with credentials like a password or access keys. An IAM Role does not have permanent credentials and is assumed temporarily by authorized users, services (like an EC2 instance), or external accounts.'
  },
  {
    id: 'q10',
    domain: 'Security & Compliance',
    question: 'Which of the following protects against Distributed Denial of Service (DDoS) attacks at the edge layer of an AWS deployment?',
    options: [
      'AWS Secrets Manager',
      'AWS WAF and AWS Shield',
      'AWS KMS and Amazon Inspector',
      'Amazon GuardDuty'
    ],
    correctAnswerIndex: 1,
    explanation: 'AWS Shield is specifically designed for DDoS protection (Layer 3 and 4). AWS WAF protects web applications at the application layer (Layer 7). They work in tandem at edge locations to secure the network.'
  },

  // Technology (Domain 3)
  {
    id: 'q11',
    domain: 'Technology',
    question: 'What is a key difference between Amazon EBS volumes and Amazon S3 storage?',
    options: [
      'EBS is serverless, while S3 requires manual provisioning of host servers.',
      'EBS is an object storage service, while S3 is a relational database backing block storage.',
      'EBS is block storage attached directly to a single EC2 instance for fast read/writes, while S3 is flat global object storage accessible over the internet via HTTP.',
      'EBS stores data in regional partitions, while S3 requires dedicated physical cables.'
    ],
    correctAnswerIndex: 2,
    explanation: 'EBS represents block-level virtual hard drives designed to attach directly to a running EC2 instance within an AZ. S3 is globally scoped object storage designed for massive amounts of unstructured data, where objects are accessed securely via simple web URLs.'
  },
  {
    id: 'q12',
    domain: 'Technology',
    question: 'An application needs a highly performant, fully-managed, serverless NoSQL database that can scale to millions of queries per second. Which service fits best?',
    options: [
      'Amazon Aurora',
      'Amazon RDS PostgreSQL',
      'Amazon DynamoDB',
      'Amazon Redshift'
    ],
    correctAnswerIndex: 2,
    explanation: 'Amazon DynamoDB is a fully managed key-value and document NoSQL database that offers single-digit millisecond latency at any scale. It is fully serverless, highly scalable, and reliable.'
  },
  {
    id: 'q13',
    domain: 'Technology',
    question: 'Which AWS service allows you to launch virtual infrastructure in a secure, isolated network partition, giving you complete control over subnets, IP ranges, and routing tables?',
    options: [
      'Amazon CloudFront',
      'AWS Direct Connect',
      'Amazon Route 53',
      'Amazon VPC'
    ],
    correctAnswerIndex: 3,
    explanation: 'Amazon VPC (Virtual Private Cloud) is the service used to define custom virtual networks. You provision your subnets, route tables, and gateways here to form the secure foundation of your cloud infrastructure.'
  },
  {
    id: 'q14',
    domain: 'Technology',
    question: 'Which architectural component automatically distributes incoming HTTP traffic across a group of virtual machines in multiple Availability Zones to prevent single-instance overload?',
    options: [
      'Amazon Route 53 DNS Failover',
      'Amazon CloudFront Distribution',
      'AWS Elastic Load Balancer (ELB)',
      'Amazon EC2 Auto Scaling Group'
    ],
    correctAnswerIndex: 2,
    explanation: 'An Elastic Load Balancer (ELB) distributes incoming application traffic across targets (such as EC2 instances or containers) in one or more Availability Zones, ensuring load is balanced and failed instances are bypassed.'
  },
  {
    id: 'q15',
    domain: 'Technology',
    question: 'A developer wants to define infrastructure configurations (like VPCs, S3 buckets, and EC2 resources) using a YAML script so that they can be provisioned consistently. Which service should they use?',
    options: [
      'AWS CodeDeploy',
      'AWS Systems Manager',
      'AWS CloudFormation',
      'AWS Elastic Beanstalk'
    ],
    correctAnswerIndex: 2,
    explanation: 'AWS CloudFormation is the primary Infrastructure as Code (IaC) tool on AWS. It allows developers to model and provision AWS resource stacks safely and repeatedly using JSON or YAML templates.'
  },
  {
    id: 'q16',
    domain: 'Technology',
    question: 'Which of the following is a key design principle of the Reliability pillar of the AWS Well-Architected Framework?',
    options: [
      'Deploy all computing workloads to on-premises Outposts.',
      'Test recovery procedures by creating simulated system failures.',
      'Stop spending money on security audits.',
      'Consolidate multiple applications onto a single massive EC2 instance.'
    ],
    correctAnswerIndex: 1,
    explanation: 'The Reliability pillar advises to "Test recovery procedures." In a traditional environment, failures are rarely tested. In the cloud, you can simulate and test how systems fail and recover automatically.'
  },
  {
    id: 'q17',
    domain: 'Technology',
    question: 'Which machine learning service is designed to easily generate human-like chatbots and voice assistants using natural language processing?',
    options: [
      'Amazon SageMaker',
      'Amazon Polly',
      'Amazon Lex',
      'Amazon Rekognition'
    ],
    correctAnswerIndex: 2,
    explanation: 'Amazon Lex is the fully managed service used to build conversational interfaces (chatbots) using voice and text (powering the same tech as Alexa).'
  },

  // Billing & Pricing (Domain 4)
  {
    id: 'q18',
    domain: 'Billing & Pricing',
    question: 'A startup wants to set up automated email notifications to alert them when their accumulated monthly AWS billing exceeds a set limit of $50.00. Which tool is best?',
    options: [
      'AWS Cost Explorer',
      'AWS Trusted Advisor',
      'AWS Budgets',
      'AWS Cost Category Dashboard'
    ],
    correctAnswerIndex: 2,
    explanation: 'AWS Budgets is the primary service used to set custom cost and usage limits and configure email alerts when actual or forecasted expenses exceed a chosen threshold.'
  },
  {
    id: 'q19',
    domain: 'Billing & Pricing',
    question: 'Which EC2 purchasing option provides the absolute deepest discount (up to 90% off) but can be terminated by AWS with a 2-minute notice if the capacity is needed elsewhere?',
    options: [
      'On-Demand Instances',
      'Reserved Instances',
      'Dedicated Hosts',
      'Spot Instances'
    ],
    correctAnswerIndex: 3,
    explanation: 'Spot Instances tap into unused AWS EC2 spare capacity. They offer massive discounts (up to 90%) but can be reclaimed by AWS if capacity drops, with a 2-minute interruption notice. Ideal for fault-tolerant workloads.'
  },
  {
    id: 'q20',
    domain: 'Billing & Pricing',
    question: 'Which AWS support plan is the lowest tier that guarantees 24/7 phone, email, and chat access to Cloud Support Engineers for technical assistance?',
    options: [
      'Developer Support Plan',
      'Business Support Plan',
      'Enterprise Support Plan',
      'Basic Support Plan'
    ],
    correctAnswerIndex: 1,
    explanation: 'The Business Support plan is the first tier that offers 24/7 access to Cloud Support Engineers via phone, email, and chat. The Developer plan only provides email access during business hours. Basic does not provide technical engineering support.'
  },
  {
    id: 'q21',
    domain: 'Billing & Pricing',
    question: 'A company with multiple departments wants to consolidate their billing across all corporate AWS accounts to receive volume pricing discounts. Which service enables this?',
    options: [
      'AWS Cost Explorer',
      'AWS Support Center',
      'AWS Organizations',
      'AWS Trusted Advisor'
    ],
    correctAnswerIndex: 2,
    explanation: 'AWS Organizations allows consolidating multiple separate AWS accounts into a single organizational unit. This enables centralized management, Service Control Policies (SCPs), and Consolidated Billing, which pools usage to hit volume pricing discounts.'
  },
  {
    id: 'q22',
    domain: 'Billing & Pricing',
    question: 'Which tool allows you to input your expected computing resources (EC2 specs, database storage, data transfers) to obtain a detailed, pre-purchase monthly cost estimation?',
    options: [
      'AWS Pricing Calculator',
      'AWS Budgets',
      'AWS License Manager',
      'AWS Billing Dashboard'
    ],
    correctAnswerIndex: 0,
    explanation: 'The AWS Pricing Calculator is a web-based planning tool that lets you estimate the monthly cost of AWS services based on detailed resource requirements before they are provisioned.'
  },
  {
    id: 'q23',
    domain: 'Billing & Pricing',
    question: 'Which of the following is checking cost, security, fault tolerance, performance, and service limits to provide optimization recommendations for FREE to all AWS customers?',
    options: [
      'AWS Systems Manager Console',
      'AWS Trusted Advisor',
      'AWS Cost Explorer',
      'AWS Support Center'
    ],
    correctAnswerIndex: 1,
    explanation: 'AWS Trusted Advisor scans your AWS infrastructure and provides prescriptive advice across 5 categories. Basic checks are free to all customers; full checks require Business/Enterprise plans.'
  },
  {
    id: 'q24',
    domain: 'Cloud Concepts',
    question: 'What is the "shared responsibility" security boundary for AWS Elastic Compute Cloud (EC2) guest operating systems?',
    options: [
      'AWS is responsible for patching the guest OS, while the customer configures the hypervisor.',
      'The guest OS is entirely managed and secured by AWS.',
      'The customer is responsible for patching and securing the guest OS, while AWS maintains the physical host security and virtualized hypervisor layer.',
      'Both AWS and the customer must patch the guest OS simultaneously using joint IAM roles.'
    ],
    correctAnswerIndex: 2,
    explanation: 'For EC2, the virtual machine OS is considered customer software. Thus, the customer is responsible for updates, patches, configurations, and firewalls. AWS secures the physical hosts and virtualization hardware.'
  },
  {
    id: 'q25',
    domain: 'Technology',
    question: 'Which Amazon S3 storage class offers the lowest cost of storage, but has retrieval times ranging from minutes to 12 hours, making it ideal for regulatory archives?',
    options: [
      'S3 Intelligent-Tiering',
      'S3 Standard-IA',
      'S3 Glacier Flexible Archive or S3 Glacier Deep Archive',
      'S3 One Zone-IA'
    ],
    correctAnswerIndex: 2,
    explanation: 'S3 Glacier classes are dedicated cold storage archives. S3 Glacier Deep Archive is the lowest-cost storage in AWS but requires hours of retrieval delay, making it perfect for records kept for legal or audit purposes.'
  }
];
