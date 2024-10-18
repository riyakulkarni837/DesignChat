# Design Chat

Design Chat is a simple chat app that allows a single user to chat with the [OpenAI ChatGPT API](https://platform.openai.com/docs/introduction). All of the user prompts and ChatGPT responses are logged to enable an audit trail of the conversation. 

Only authorized users are able to access the chat. These are simply encoded in an environment variable.

## Usage

To use, first clone this project.

Create a `.env.local` file in the root directory of the project and set the following environment variables. SESSION_PASSWORD and ALLOWED_USERS are needed for the basic login to work while OPENAI_API_KEY and TOGGLE_API_ON are used to access the OpenAI API. If you do not wish to access it then set TOGGLE_API_ON=False
```
SESSION_PASSWORD="SOME UNIQUE PASSWORD AT LEAST 36 CHARS LONG"
ALLOWED_USERS=[an array of user names] e.g ["MoonStar", "BrightLight"]
OPENAI_API_KEY="API KEY"
TOGGLE_API_ON=true

#optional variables
OPENAI_API_MODEL = "gpt-3.5-turbo-16k" # if not specified, default value "gpt-3.5-turbo-16k" will be used as model name
TOKEN_LIMIT = 15700 # # if not specified, default value 15700 will be used 
```

Register for an [OpenAI](https://openai.com/) account in order to create an API access key

Install the node dependencies from the package.json file:
`npm install`

To run the app locally:
`npm run dev`

To run under Docker
`docker build -t design-chat .`

`docker run -p 3000:3000 --name design-chat design-chat`

The outputs of the chat are logged to the stdout, to view these when running under a docker container can use
`docker logs -f design-chat &> output.log &`


## Deploy to Google Cloud Run

The application can be run using Google Cloud Run. To do this, you need to first:

- Register for a [Google Cloud account](https://cloud.google.com/)
- Install the [Google Cloud SDK](https://cloud.google.com/sdk/) onto your local machine
- Log into your account by entering `gcloud auth login` on your command line
- Create a new project in Google Cloud run
- Build a container image by running `gcloud builds submit --tag gcr.io/PROJECT_ID/design-chat --project PROJECT_ID` on your command line
- Now deploy the container image by entering `gcloud run deploy --image gcr.io/PROJECT_ID/design-chat --project PROJECT_ID --platform managed`. When prompted, press Enter to accept the default service name (design-chat), choose a region for the deployment and select y for unauthenticated invocations.
- Once its deployed, you will see the URL where you can access the website.

## Limitations

### Long response time
The OpenAI Chat API can take some time to return (>10s). A loading message is shown to the user but it does appear that nothing is happening.

This long response can cause problems for some hosting platforms (including AWS Amplify) as they expect a response within 10s and will send a HTTP 504 error code back to the browser if the response is too long. Choose a hosting platform that allows to set a longer wait time for the response (e.g. Google Cloud.)

### Authentication
The authentication is rudimentary and consists of a list of valid usernames in the environment variable.

### Logging
The chats are logged using the [Pino](https://getpino.io/#/) library. These are simply output to the server console. Depending on the hosting platform, these may end up in the platform logs. If running yourself, you will need to setup a mechanism to store these logs if so desired.


## Acknowledgements
This app is built using the [nextjs](https://nextjs.org/) framework.

The app makes heavy use of the [react-chatbot-kit](https://fredrikoseberg.github.io/react-chatbot-kit-docs/) for the chatbot element so kudos to the folks who developed it.

## License

[MIT](https://choosealicense.com/licenses/mit/)


