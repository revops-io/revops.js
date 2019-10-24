# Example Auth Server
This is an example of how you might construct a server to retrieve an authorization token from RevOps. This may be necessary, when you want to access secured information from RevOps or perform certain operations. 

This server is only an example and should not be used in production.

## To Run the Example
The server may use either you public or secret key and is passed at start time as an environment variable. 

Your keys can be found in the Applications Dashboard page or on the API Key page in RevOps. 
```
$> KEY=sk_sandbox_<your-secret-key> npm start
OR
$> KEY=pk_sandbox_<your-secret-key> npm start
```