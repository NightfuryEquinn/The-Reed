# The-Reed

A simple POC for bassoonists to utilise AI audio analysis to improve on their skills
- Targeted audience: Malaysian (due to the lack of coaching and lessons)

### Proposed Architecture
![Architecture Diagram](/proposed.png)

- AWS Cognito (For user verification)
- AWS Lambda (For audio analysis invocation)
- AWS ECR (For storing AI model Docker image)
- AWS S3 (For storing audio uploads & analysis result)
- AWS Sagemaker AI (For performing analysis feedback based on audio file)

### Tech Stack (Monorepo)
- Mobile: Expo React Native
- API: NestJS API
- Backend: Docker Postgres

### Speculated Milestones
#### Phase 1
- Audio files upload
- Sagemaker analysis and feedbacks
- View upload history
- Profile management

#### Phase 2
- Record live in-app audio and upload
- Provide personalised practice lessons
- Categorised by breathing techniques, tonal exercises, and scales

#### Phase 3
- Music score generation for Bassoon
- Bookmark generated music score
- Monetisation

<br />

<sup>Going solo can only take you so far that you wish to have a team</sup>
