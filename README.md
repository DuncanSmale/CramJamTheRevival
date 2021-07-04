
<h1 align="center">
  <br>
  <img width=12.5% src="https://user-images.githubusercontent.com/47757014/123698994-0908da80-d85f-11eb-9cee-e6ce7ae98ef9.png">
  <br>
  <img width=50% src="https://user-images.githubusercontent.com/47757014/123700806-3ce4ff80-d861-11eb-9772-7e920faf4986.png">
  <br>
</h1>
<h4 align="center">A minimal study group organization web application.</h4>
<h4 align="center"><a href="https://cramjam.azurewebsites.net/">CramJam</a></h4>

<p align="center">
  <a href="https://badge.fury.io/js/electron-markdownify">
    <img src="https://coveralls.io/repos/github/witseie-elen4010/2021-001-project/badge.svg?branch=master&t=l7nzHP"
         alt="Gitter">
  </a>
    <a href="https://badge.fury.io/js/electron-markdownify">
    <img src="https://www.travis-ci.com/witseie-elen4010/2021-001-project.svg?token=vQS41SKpq3nkq6xz142w&branch=master"
         alt="Gitter">
  </a>
</p>

<h2> About the project </h2>
<p>The CramJam project is a web application for organising and sharing study groups to allow students to connect with other students. It is already hard to meet people to form study groups at larger classes and the Covid-19 pandemic has made it worse. CramJam solves this problem.</p>

<p>CramJam allows students to create an account, join study groups, organize meetings and share notes and links.</p>
<h3> Built with </h3>
<ul>
  <li><a href="https://www.mongodb.com/">MongoDB</a> <img width=8% src="https://infinapps.com/wp-content/uploads/2018/10/mongodb-logo.png" align="center"></li>
  <li><a href="https://mongoosejs.com/">Mongoose</a> <img width=8% src="https://pbs.twimg.com/profile_images/946432748276740096/0TXzZU7W.jpg" align="center"></li>
  <li><a href="https://ejs.co/">EJS</a> <img width=8% src="https://cdn.filestackcontent.com/TyzZKw86QzSElYK6bfXK" align="center"></li>
  <li><a href="https://getbootstrap.com/">Bootstrap</a> <img width=5% src="https://upload.wikimedia.org/wikipedia/commons/thumb/b/b2/Bootstrap_logo.svg/2560px-Bootstrap_logo.svg.png" align="center"></li>
</ul>
<h2> Developers </h2>

Blake Denham - 1714988

Jonathan Taylor - 1665909

Victoria Bench - 1611349

Joshua Tobias - 1735006

Duncan Smale - 1619539

<h2> Usage </h2>

To use the CramJam application, you can either go to the <a href="https://cramjam.azurewebsites.net/">CramJam site hosted on Azure</a> or clone this repository, download and install a version of MongoDB for windows I recommend <a href="https://zarkom.net/blogs/how-to-install-mongodb-for-development-in-windows-3328">this tutorial</a>. After cloning and installing MongoDB, you must run the Mongo db instance and the run the web application.

To access the logs as an admin user, you must first login to the admin account using the details: `username: admin`, `password: admin`. And then navigate to `/log`. If you are using the local hosted version you will not have an admin account setup yet. To create one, either create a `.env` file and add the line `ADMIN_PASS='admin'` and then navigate to `localhost:3000/admin`, this will redirect you to the main page and create an admin account for you. An alternative is to run `node seeds/createAdmin.js`.

If you wish to access the Mongo Database, we have setup a Mongo account using a newly created email, the details for the account are: `email: cramjamapp@gmail.com`, `password: CramoJamo1234`. If you drop any of the collections, you might encounter errors, and if you drop the `studentprofiles` collection you will need to re-create the admin account.

The connection string for the MongoDB using MongoCompass is: `mongodb+srv://Admin:CramJam@cluster0.idoq1.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`.

<h2> Known Issues </h2>
The most prevalent issues is that GPS tracking is unable to access the users GPS location while on the Azure hosted site. However, this feature does work on the local version as demonstrated in the video.
