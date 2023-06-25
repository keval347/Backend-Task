
# backend_task 

this is app for student and teacher for assignment managing 
where student can get email for new assignment and updated assignment
student also can upload file and it can be reviewed by teacher
facilities to edit delete assignment is only given to teachers
 

## Authors

- Keval Luvani


## Acknowledgements

    I created a Front-end part also in this application  so user can easily enter data

    3 user are already there for this app 
    you can login with that or there is registration also available

    Teacher
    
    name :  keval luvani    
    email : kluvani22@gmail.com
    password : keval@123
    role :  teacher
    
    Students

    name : kremil goti
    email : kremilgoti@gmail.com    
    password : kremil@123
    role : student 

    name : keval scet
    email : 190420107529.co19s2@scet.ac.in
    password : keval@123
    role : student 


    


## Run Locally

i pushed my docker image on dockerhub

publish on Account :  docker4keval

image name: docker4keval/backend_task 

running docker image 

```bash
  docker run -p 3000:3000 docker4keval/backend_task
```

Note : you have to run exact command due to app container running on 3000 port 

after container run sucessfully go to browser on url

```bash
  localhost:3000
```
## API Reference


#### login page

```http
  GET /
```
**NOTE -** this is just to render html file where you can login with data 


#### POST login

```http
  POST /login
```

| Parameter | Type     | Description                       |
| :-------- | :------- | :-------------------------------- |
| `email`      | `email` | **Required**. register email id |
| `password`      | `string` | **Required** |
| `role`      | `string` | **Required** teacher or student  |


#### register page

```http
  GET /register
```
**NOTE -** this is just to render html file where you can register


#### POST register

```http
  POST /register
```

| Parameter | Type     | Description                       |
| :-------- | :------- | :-------------------------------- |
| `name`      | `string` | **Required** |
| `email`      | `email` | **Required**.valid email id |
| `password`      | `string` | **Required** |
| `confirmpassword`      | `string` | **Required** |
| `role`      | `string` | **Required** teacher or student  |


#### profile

```http
  GET /profile
```


#### logout

```http
  GET /logout
```


#### GET all Assignment

```http
  GET /assignment
```


#### ADD Assignment
```http
  POST /assignment/data/add
```
| Parameter | Type     | Description                       |
| :-------- | :------- | :-------------------------------- |
| `title`      | `string` | **Required** assignment title |
| `description`      | `string` | About Assignment |
| `score`      | `number` | **Required** 0 to 999|
| `duedate`      | `date` | **Required** yyyy-mm-dd|


#### UPDATE Assignment
```http
  POST /assignment/update
```
| Parameter | Type     | Description                       |
| :-------- | :------- | :-------------------------------- |
| `title`      | `string` | **Required** assignment title previously added |
| `description`      | `string` | About Assignment |
| `score`      | `number` | **Required** 0 to 999|
| `duedate`      | `date` | **Required** yyyy-mm-dd|


#### DELETE Assignment
```http
  GET /assignment/delete
```
| Parameter | Type     | Description                       |
| :-------- | :------- | :-------------------------------- |
| `title`      | `string` | **Required** assignment title previously added |


#### GET submitted Assignment
```http
  get /assignment/submitted?title={assignment_title}
```
**Note :** only useful at teacher side


#### Review submitted Assignment
```http
  POST /assignment/review
```
**Note :** only useful at teacher side

| Parameter | Type     | Description                       |
| :-------- | :------- | :-------------------------------- |
| `email`      | `email` | **Required**.valid email id |
| `title`      | `string` | **Required** assignment title |
| `score`      | `number` | **Required** 0 to 999|
| `graded_score`      | `number` | **Required** 0 to 999|











## folder structure
    auths : authenticatiion functions
    connections : 
            - connection.js for db connect
    mailer : 
            - mailer.js for mail to student 
    middleware : 
            - jwt token verify
    partials :  
            hbs file for partials view
    public : 
            - style.css
    routes : maps routing urls
    storage : uploded assignment files are here
    views : hbs files for view
    app.js : entry point of app
    Dockerfile : for Dockerization
            