# Safka Preconfigured Nginx 🖥️ 

Safka preconfigured Nginx, painfully made to be as compatible with Docker and as easy to set-up on new computers, as possible. 

### nginx-bootstrap script 

IF YOU WANT TO USE DOMAINS AND CERTBOT, RUN THIS SCRIPT!!!

Comments from ./nginx-bootstrap script:
```bash
# In case you are setting your Docker environment up on a VPS, you need to run this script! If supplying bad arguments, it will complain and give you a small help print.
# Basically, this script does two things:
#   1. Uses string interpolation to smartly adjust your configs based on what arguments you give to the program
#   2. If you used to have old configs or you accidentally ran this script with typos or something, it backs them up and renames them in a unique, sortable way.
# This script will not be neccessary if you are not deploying this on a production PC. In that case, please use the "docker-compose.dev.yaml" file to build and run your docker containers!
```

### Contributors

* [Finnbyte](https://github.com/finnbyte)
* [Tembero11](https://github.com/Tembero11)


