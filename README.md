# PriorWise - AI Patent/Prior Art Search for Confluence
![Confluence](https://img.shields.io/badge/confluence-%23172BF4.svg?style=for-the-badge&logo=confluence&logoColor=white) ![NodeJS](https://img.shields.io/badge/node.js-6DA55F?style=for-the-badge&logo=node.js&logoColor=white)

![logo](./priorwise.jpg)


## Requirements

See [Set up Forge](https://developer.atlassian.com/platform/forge/set-up-forge/) for instructions to get set up.

## Quick start

- Install to your Atlassian Confluence environment by followiing [this link](https://developer.atlassian.com/console/install/2a4cc90e-1bf5-412f-ad9b-bf4f0f86254b?signature=32e0eae444ce56f9eaafce643b936a0af77c3c4dfeecf1a02b926aceb5089971429e2975be2adb3eeac6c6640da015ddcad55281c31c9cddae7c75080b730d4c&product=confluence)

**OR TO BUILD AND DEPLOY YOURSELF:**

- Request a PQAI API token [here](https://projectpq.ai/get-involved/)

- Set the PQAI API Key as follows:
``````
forge variables set --encrypt PQAI_API_KEY your-key
export FORGE_USER_VAR_PQAI_API_KEY=your-key
``````

- Build and deploy the app by running:
```
forge deploy
```

- Install the app in an Atlassian site by running:
```
forge install
```

- To get logs and other debug information for the app run `forge tunnel` to proxy invocations locally (Note: you will need Docker installed):
```
forge tunnel
```