<h1 style="display:flex; align-items:center; gap:5px; justify-content:center;">
    <img src="./client/public/icons/logo32.png" alt="logo">
    <span style="display:block;color:#D3500C">S3Spider</span>
</h1>
<p style="text-align:center">Self hosted , Simple UI for Amazon S3</p>

<img src="./screens/ui.jpg" alt="app ui">


## Motivation

Managing files on S3 bucket shouldn't be a cumbersome task, especially for non-technical users. Recognizing the limitations and challenges faced with existing solutions like S3Browser(windows client), I created S3Spider, an open-source web UI designed to interact with S3 without the need for software installations or complex AWS credentials management.

**Pain Points Addressed**

- **No Software Installations**: Traditional solutions often require users to install software on their machines. With S3Spider, you can eliminate the need for installation and provide a hassle-free, browser-based experience for uploading images directly to your S3 bucket.

- **Secure AWS Credential Handling**: Storing AWS credentials locally, can pose security risks. S3Spider alleviates this concern by providing a secure web interface that eliminates the need for saving AWS credentials on the user's machine.

- **Simplified User Onboarding**: Avoid the complexity of creating and managing IAM users for each staff member. S3Spider is designed to be user-friendly, eliminating the need for extensive training or navigating the AWS console.


## Key Features:

- **Web-Based Interface** : Access S3Spider directly from your web browser, eliminating the need for software installations and ensuring a seamless experience for your teams.

- **Secure Authorization**: Grant users access to the S3 bucket without exposing AWS credentials. S3Spider handles authentication securely. Simplified role based access can be assigned to users to specific accounts and what can they do
with files. 

- **Intuitive Design**: Designed with non-technical users in mind, S3Spider offers a user-friendly interface, making file
management a straightforward process.


## Spec

You can read the full specification [TODO].

## Built using

**Frontend**

- [vite](https://vitejs.dev/)
- [react](https://react.dev/)
- [tailwindcss](https://tailwindcss.com/)
- [shadcn ui](https://ui.shadcn.com/)

**Backend**

- [node](https://nodejs.org/en/)
- [express.js](https://expressjs.com/)
- [postgresql](https://www.postgresql.org/)
- [Kysely](https://kysely.dev/)
- [@aws-sdk/client-s3](https://www.npmjs.com/package/@aws-sdk/client-s3)


## How to setup

1. You have frontend  in `client` directory and backend in `server` directory, can be deployed any which way you need.
2. Sample `.env` files are added to show how you need to setup aws account credentials in backend.
3. Refer to `docker-compose.yml` to see how app is configured with cache, database etc. 
4. Once frontend and backend are deployed with database and optional caching setup, you need to add  backend and frontend domains wherever you deploy them in [allowed domains in CORS settings of buckets](https://docs.aws.amazon.com/AmazonS3/latest/userguide/enabling-cors-examples.html) you want users to interact with.




