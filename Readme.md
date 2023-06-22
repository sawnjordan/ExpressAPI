## Http Response COdes

= Server whenever sends the response to the client,
http response code willbe send to the client

    100-199 -> Not Needed

    200-299 -> Success Response Code
        200 => SUCCESS, OK
        201 => Created,
        204 => No Content

    300-399 -> Redirection Related Response codes
        301 => Permanent Redirection

    400-499
        400 => Bad Request
        401 => Unauthorized
        403 => Access Denied
        404 => Not Found
        405 => Method Not allowed
        408 => Request time out
        422 => Unprocessable Entity
        429 => Large payload

    500-599 -> Related to server error
        500 => Internal Server Error
        502 => Bad Gateway
        503 => Service unavailable
        504 => Gateway timeout

Middleware executes at diffferent level
->To manipulate the request before your action call
->To respond to the client/end the request
->Call next middleware/action call

    -> Garbage collector
    -> Handle routes

->Every middleware function accepts 3 parameters(compulsary)

a. Application Level Middleware
-> app.user(mount)
or
expressApplication.method(load) //this is always application level middleware
app.get("/", (req, res, next)=>{})

b. Routing Level Middleware
->mounted to express.Router()
-> app.use()

c. Custom Middlware
-> We normally mount custom middlwar to the route path

d. Third Party Middleware
=> multer ==>multipart/form-data

e. Bultin Middlware
express.json() => json content
express.static()
express.urlencoded()

f. Error Handling Middleware //sabai vanda last ma rakhna parcha
