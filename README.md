# AVA
Project A.V.A., the Aritificial Verbal Assistant.

Test it out: https://ava-theta.vercel.app/

## Inspiration
The inspiration for creating AVA (Artificial Verbal Assistant) came when we had difficulty travelling to different countries and communicating with the locals.

## What it does
AVA translates from text, speech, and images! AVA can also speak back to you, to help you learn new languages!


## Set Up Locally
These steps will help with setting up your own AVA:
### Step 1. Clone, Fetch, or open a CodeSpace on Github
Start by either one of ways. Clone or Fetch this repo.
### Step 2. Download dependencies from node
On a terminal, change to the AVA directory.
```console
cd AVA
```
Once there, we will first go to the client directory, then download the node dependencies
```console
cd client &&
npm install
```
### Step 3. Download dependencies using pip/pip3
Now head over to the server director, from AVA
Then download the python dependencies with pip/pip3
```console
cd server &&
pip install -r requirements.txt
```

### Step 4. Running the Program
Once finished downloading, we can start running AVA. Begin by running the server component by changing server/src file.
```console
cd server
```
Now run the main.py file with python/python3
```console
python src/main.py
```
Note: The backend is setup to run on the deployed environment so it might not run, the frontend is setup to use the deployed version and some changes might be needed to run locally.

Your server should be running now. Now open up another terminal and change to the client/src file
```console
cd client
```
Now run the node env
```console
npm run dev
```
