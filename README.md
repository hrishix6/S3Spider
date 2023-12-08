<h1 style="display:flex; align-items:center; gap:5px; justify-content:center;">
    <img src="./client/public/icons/logo32.png" alt="logo">
    <span style="display:block;color:#D3500C">S3Spider</span>
</h1>
<p style="text-align:center">Self hosted , Simple UI for Amazon S3. Manage files in multiple accounts in one place</p>

<img src="./screens/buckets.PNG" alt="app ui">


## Motivation

This tool was built for internal marketing teams using s3 frequently for uploading and working with media. I was looking for simple solution where multiple users can access s3 easily without needing to create IAM user for each of them, We have multiple accounts. Surprisingly there aren't many tools available for this. Found S3browser(windows only client), ExpanDrive(Cross platform desktop app) but we didn't want to install any software on user's machine for security reasons, thus built this. I thought someone might find this helpful out there. S3Spider is a web app to manage files in s3, works with multiple accounts, has simplified user management with role based authorization. 

**Features**

- **No Software Installations**: It's a web app , no installations on user's machines. 

- **Secure AWS Credential Handling**: No credentials are exposed to users, everything is handled securely on backend.

- **Secure Authorization**: Simplified role based access can be assigned to users to specific accounts and what can they do with files.

- **Intuitive Design**: Designed with non-technical users in mind, S3Spider has user-friendly interface, making file
management a straightforward process.


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

## Screens

<figure>
  <figcaption style="text-align:center; font-weight:600; font-size: 1.3rem;">File browsing</figcaption>
  <img src="./screens/Files.PNG" alt="file browser">
</figure>

---

<figure>
  <figcaption style="text-align:center; font-weight:600; font-size: 1.3rem;">Available actions on files for different roles</figcaption>
  <img src="./screens/file_actions_for_users.png" alt="file actions for different roles">
</figure>

---

<figure>
<figcaption style="text-align:center; font-weight:600; font-size: 1.3rem;">User management</figcaption>
  <img src="./screens/user-mgmt.PNG" alt="user management">
</figure>

---

<figure>
  <figcaption style="text-align:center; font-weight:600; font-size: 1.3rem;">Account assignments</figcaption>
  <img src="./screens/accounts-mgmt.PNG" alt="account assignments">
</figure>


## Spec

[TODO](#)

## Core Feature implementations

**Done**

- Browse Buckets
- Browse Files
- Copy file
- Rename file
- Delete file
- Download file
- Download multiple files

**In Progress**
- Move files
- Upload file
- Upload folder
- Create bucket
- Create folder
- Copy folder
- Move folder

**Maybe**
- Delete Bucket
- Delete folder
- Share file (with presigned url)
- Calculate folder size ( is this even needed?)

## How to use

[TODO](#)

## License

MIT