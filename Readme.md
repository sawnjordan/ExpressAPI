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
