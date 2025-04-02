# Planetarium

# Pre-requisites

- Install [Node.js](https://nodejs.org/en/)

# Getting started

- Clone the repository

```
git clone https://github.com/Kadah-Ne/Agility-Star-stuff
```

- Install dependencies

```
cd Agility-Star-stuff
npm install
```

- Build and run the project

```
npm start
```

Navigate to `http://localhost:8000`

## Project Structure

The folder structure of this app is explained below:

| Name                  | Description                                                                                      |
| --------------------- | ------------------------------------------------------------------------------------------------ |
| **node_modules**      | Contains all npm dependencies                                                                    |
| **public**            | Contains exposed files                                                                           |
| **public**/index.html | Entry point to express app                                                                       |
| **public**/**assets** | Contains images, sprites and ressources needed in the app                                        |
| **public**/**css**    | Contains styling                                                                                 |
| **public**/**js**     | Contains all the logic and the tests                                                             |
| server.js             | Express server file                                                                              |
| package.json          | Contains npm dependencies as well as [build scripts](#what-if-a-library-isnt-on-definitelytyped) |
| jest.setup.json       | Contains jest pre test code                                                                      |
| ject.config.json      | Contains jest configuration                                                                      |

## Testing

The tests are written in Jest using babel

```
"@babel/core": "^7.26.9",
"@babel/preset-env": "^7.26.9",
"babel-jest": "^29.7.0",
"jest": "^29.7.0",
"jest-environment-jsdom": "^29.7.0"
```

### Example application.spec.ts

```
import {describe, expect, test} from '@jest/globals';
import {sum} from './sum';

describe('sum module', () => {
  test('adds 1 + 2 to equal 3', () => {
    expect(sum(1, 2)).toBe(3);
  });
});
```

### Running tests using NPM Scripts

```
npm run test

```

# Common Issues

## There are no issues.
