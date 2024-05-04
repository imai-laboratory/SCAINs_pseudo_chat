# SCAIN extraction

## Installation
Install the packages via the following command: 
```shell
$ pipenv install
```

## Setup
### Download and extract dataset
Download and extract dataset via the following command: 
```shell
$ pipenv run setup
```

### Set OpenAI API key
Set your OpenAI API key as the environment variable in the .env file: 
```.env
OPENAI_API_KEY=<your OpenAI API key>
```

## Extraction
Extract SCAINs via the following command:
```shell
$ pipenv run extraction
```
Set values of `DIALOGUE_START` and `DIALOGUE_END` properly to avoid model overload.
