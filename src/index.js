import React from "react";
import ReactDOM from "react-dom";

import {
  Appear,
  Box,
  CodePane,
  CodeSpan,
  Deck,
  FlexBox,
  FullScreen,
  Grid,
  Heading,
  Image,
  ListItem,
  Notes,
  OrderedList,
  Progress,
  Slide,
  Stepper,
  Text,
  UnorderedList,
  indentNormalizer,
} from "spectacle";

import workspacesImage from "./images/workspaces.png";
import hybridRouting from "./images/single-spa-routing.png";

// SPECTACLE_CLI_THEME_START
const theme = {
  fonts: {
    header: '"Open Sans Condensed", Helvetica, Arial, sans-serif',
    text: '"Open Sans Condensed", Helvetica, Arial, sans-serif',
  },
};
// SPECTACLE_CLI_THEME_END

// SPECTACLE_CLI_TEMPLATE_START
const template = () => (
  <FlexBox
    justifyContent="space-between"
    position="absolute"
    bottom={0}
    width={1}
  >
    <Box padding="0 1em">
      <FullScreen />
    </Box>
    <Box padding="1em">
      <Progress />
    </Box>
  </FlexBox>
);
// SPECTACLE_CLI_TEMPLATE_END

const formidableLogo =
  "https://avatars2.githubusercontent.com/u/5078602?s=280&v=4";

const singleSpaLogo = "https://single-spa.js.org/img/logo-white-bgblue.svg";

const reactLogo =
  "https://seeklogo.com/images/R/react-logo-7B3CE81517-seeklogo.com.png";

const angularjsLogo =
  "https://seeklogo.com/images/A/angular-logo-B76B1CDE98-seeklogo.com.png";

const maasLogo = "https://assets.ubuntu.com/v1/e1bdea10-MAAS+White.svg";

const proxyCodeBlock = indentNormalizer(`
const app = express();

const PROXY_PORT = 8400;
const UI_PORT = 8401;

// Proxy API endpoints to the server.
app.use(
  createProxyMiddleware(['/api'], {
    target: process.env.SERVER_URL,
  })
);

// Proxy to the single-spa root app.
app.use(
  createProxyMiddleware("/", {
    target: 'http://localhost:8401/',
  })
);

app.listen(PROXY_PORT);
`);

const react2angularCodeBlock = indentNormalizer(`
// 1. Create a react component
import { Component } from 'react'

const MyComponent = ({fooBar}) => (
  <div>
    <p>FooBar: {fooBar}</p>
  </div>
)

// 2. Expose it to AngularJS
import { react2angular } from 'react2angular'

angular
  .module('myModule', [])
  .component('myComponent', react2angular(MyComponent, ['fooBar']))

// 3. Use it in AngularJS code
<my-component
  foo-bar="3"
></my-component>
`);

const rootAppCodeBlock = indentNormalizer(`
import { registerApplication, start } from "single-spa";

registerApplication({
  name: "angularjs",
  app: () => import("@maas-ui/maas-ui-legacy"),
  activeWhen: (location) => location.pathname.startsWith('/l')
});

registerApplication({
  name: "react",
  app: () => import("@maas-ui/maas-ui"),
  activeWhen: (location) => location.pathname.startsWith('/r')
});

window.addEventListener("single-spa:app-change", (evt) => {
 // SingleSPA provides handlers for routing changes 
});

start();
`);

const registerAngularJS = indentNormalizer(`
import singleSpaAngularJS from "single-spa-angularjs";

const lifecycles = singleSpaAngularJS({
  angular,
  mainAngularModule: maasModule,
  uiRouter: true,
  preserveGlobal: false,
});

export const bootstrap = [setupWebsocket, lifecycles.bootstrap];

export const mount = (opts, mountedInstances, props) => {
 // Additional configuration on mount (e.g. setting up websocket connection) 
};

export const unmount = lifecycles.unmount;
`);
const registerReact = indentNormalizer(`
import singleSpaReact from "single-spa-react";

const reactLifecycles = singleSpaReact({
  React,
  ReactDOM,
  rootComponent,
  errorBoundary(err, info, props) {
    return (<div>A helpful error message.</div>);
  },
});

export const { bootstrap } = reactLifecycles;
export const mount = (props) => reactLifecycles.mount(props);
export const { unmount } = reactLifecycles;
`);

const importMapCodeBlock = indentNormalizer(`
  {'myApp': 'https://somecdn/myapp/v1.js'}
  // update in CI to ->
  {'myApp': 'https://somecdn/myapp/v2.js'}

   // App or components can be dynamically imported
   import {app} from "myApp"
`);

const Presentation = () => (
  <Deck theme={theme} template={template} transitionEffect="fade">
    <Slide>
      <FlexBox height="100%" flexDirection="column">
        <Heading margin="0px" fontSize="h1">
          <i>Migrating Legacy UIs with SingleSPA</i>
        </Heading>
        <FlexBox height="100%" flexDirection="row">
          <Image src={angularjsLogo} width={200} />
          <Text fontSize="150px">⇨</Text>
          <Image src={singleSpaLogo} width={200} />
          <Text fontSize="150px">⇨</Text>
          <Image src={reactLogo} width={200} />
        </FlexBox>
        <Heading margin="0px" fontSize="h3" color="beige">
          Kit Randel
          <br />
          kit@stacklet.io
        </Heading>
      </FlexBox>
    </Slide>

    <Slide>
      <Heading>MAAS@Canonical</Heading>
      <FlexBox>
        <Image
          src="https://assets.ubuntu.com/v1/952c8938-overview-of-kvms.png"
          width={800}
        ></Image>
      </FlexBox>
      <Notes>
        <ul>
          <li>
            A Canonical product, for deploying and managing bare metal machines
            in the datacentre.
          </li>
          <li>
            MAAS is comprised of several python services, an AngularJS frontend,
            cli tooling, and an http API.
          </li>
          <li>Realtime websockets</li>
        </ul>
      </Notes>
    </Slide>

    <Slide>
      <Heading>Motivations for migrating from AngularJS</Heading>
      <UnorderedList>
        <Appear elementNum={0}>
          <ListItem>
            ~60KLOC (es5 + html) pre-dateding the component paradigm
          </ListItem>
        </Appear>
        <Appear elementNum={1}>
          <ListItem>Massive monolithic controllers and templates</ListItem>
        </Appear>
        <Appear elementNum={2}>
          <ListItem>
            Hard to debug, test, maintain, and work on new features
          </ListItem>
        </Appear>
        <Appear elementNum={3}>
          <ListItem>
            Performance issues in views making heavy use of two way binding
          </ListItem>
        </Appear>
        <Appear elementNum={4}>
          <ListItem>AngularJS reaches end-of-life on July 1st 2021</ListItem>
        </Appear>
      </UnorderedList>
      <Notes>
        <ul>
          <li>
            Chose React over Angular, as we had more existing experience in the
            team with React, and determined that the migration path to Angular
            was not significantly easier than React.
          </li>
          <li>
            For anyone unfamiliar, AngularJS and Angular are similar in name
            only. Angular conceptually is a completely different framework.
          </li>
        </ul>
      </Notes>
    </Slide>

    <Slide>
      <Heading>Approach 1: Rewrite 💥</Heading>
      <FlexBox height="100%" flexDirection="row">
        <Image src={angularjsLogo} width={200} />
        <Text fontSize="150px">⇨</Text>
        <Image src={reactLogo} width={200} />
      </FlexBox>
      <Notes>
        <ul>
          <li>
            Joel Spolsky famously wrote that this is *always* a bad idea. At
            Canonical, we ignored this advice and rewrote one of our core
            products, Juju, transitioning from python to golang. I'll leave you
            to speak to Tim afterwards in the pub if you're curious whether this
            was a good call in the long term.
          </li>
          <li>Almost immediately dismissed this idea</li>
          <li>New features would have to be written twice</li>
          <li>Team not large enough for this to possibly work</li>
        </ul>
      </Notes>
    </Slide>

    <Slide>
      <Heading>Approach 2: In-situ</Heading>
      <CodePane language="javascript" autoFillHeight>
        {react2angularCodeBlock}
      </CodePane>
      <Notes>
        <ul>
          <li>
            Tools exist to allow the embeding of react components in an
            angularjs app like "react2angular". The opposite, "angular2react"
            also exists for anyone perverse enough to embed angularjs components
            in a react app.
          </li>
          <li>Good: Path of least resistence</li>
          <li>
            Bad: Requires angularjs code to use components and uni-directional
            data flow - possibly in angularjs, but a huge refactoring for code
            that would then be thrown away
          </li>
          <li>
            Bad: Didn't solve architectural problems which were a source of
            performance issues Better management of global state.
          </li>
        </ul>
      </Notes>
    </Slide>

    <Slide>
      <Heading>Approach 3: SingleSPA</Heading>
      <FlexBox>
        <Image width={800} src={hybridRouting}></Image>
        <UnorderedList>
          <ListItem>A 'meta' router</ListItem>
          <ListItem>
            Encapsulates SPAs as 'SingleSPA apps' that respond to lifecycle
            events like 'mount'
          </ListItem>
        </UnorderedList>
      </FlexBox>
    </Slide>

    <Slide>
      <Heading>Migrating to SingleSPA</Heading>
      <OrderedList>
        <ListItem>Migrate projects to monorepo</ListItem>
        <ListItem>Create a SingleSPA root app</ListItem>
        <ListItem>Create a shared root html template</ListItem>
        <ListItem>
          Register both AngularJS and React apps as SingleSPA apps
        </ListItem>
      </OrderedList>
    </Slide>

    <Slide>
      <Heading>Monorepo with yarn workspaces</Heading>
      <FlexBox>
        <Image width={800} src={workspacesImage}></Image>
      </FlexBox>
      <Notes>
        <ul>
          <li>
            While we opted to keep all our projects in a single monorepo,
            however singlespa does support using separate repos if you use
            SystemJS. In fact, this is recommended!
          </li>
        </ul>
      </Notes>
    </Slide>

    <Slide>
      <Heading>The SingleSPA root app</Heading>
      <CodePane language="javascript" autoFillHeight>
        {rootAppCodeBlock}
      </CodePane>
    </Slide>

    <Slide>
      <Heading>Registering the AngularJS app</Heading>
      <CodePane language="javascript" autoFillHeight>
        {registerAngularJS}
      </CodePane>
    </Slide>

    <Slide>
      <Heading>Registering the React app</Heading>
      <CodePane language="javascript" autoFillHeight>
        {registerReact}
      </CodePane>
    </Slide>

    <Slide>
      <Heading>Development app proxying</Heading>
      <FlexBox>
        <Image
          width="800"
          src="https://res.cloudinary.com/canonical/image/fetch/f_auto,q_auto,fl_sanitize,c_fill,w_1440/https://ubuntu.com/wp-content/uploads/9ca6/image.png"
        ></Image>
      </FlexBox>
      <Notes>
        Only necessary for our configuration, using SystemJS this isn't needed.
      </Notes>
    </Slide>

    <Slide>
      <Heading>Development app proxying</Heading>
      <CodePane language="javascript" autoFillHeight>
        {proxyCodeBlock}
      </CodePane>
    </Slide>

    <Slide>
      <Heading>SingleSPA cautions (for our configuration)</Heading>
      <OrderedList>
        <ListItem>
          Complex and somewhat strict requirements for webpack configuration
        </ListItem>
        <ListItem>
          Create-react-app (CRA) based react apps must be ejected or rewired
        </ListItem>
        <ListItem>
          Developmemt experience not ideal when running both apps, can be slow
          and lose HMR.
        </ListItem>
        <ListItem>Harder to retro-fit existing project</ListItem>
        <ListItem>
          Extremely flexible, supporting multiple configurations
        </ListItem>
      </OrderedList>
      <Notes>
        <ul>
          <li>
            We opted to rewire our CRA based react app, as generally we enjoyed
            the benefits of CRA and were happy to wear a bit more initial pain
            in reconfiguring webpack
          </li>
          <li>
            We improved our DX buy providing a different npm target which runs
            only the react app
          </li>
        </ul>
      </Notes>
    </Slide>

    <Slide>
      <Heading>Microfrontends with SingleSPA</Heading>
      <UnorderedList>
        <ListItem>
          Deploy microfrontends independently with SystemJS
          <CodePane language="javascript" autoFillHeight>
            {importMapCodeBlock}
          </CodePane>
        </ListItem>
        <ListItem>
          Use multiple frameworks on the same page without page refreshing
        </ListItem>
        <ListItem>
          Allows teams to work, experiment, QA and deploy on their own schedules
        </ListItem>
      </UnorderedList>

      <Notes>
        <UnorderedList>
          <ListItem>SystemJS allows you to import a bundle via URL</ListItem>
          <ListItem>
            This allows for an architecture where microfrontends can be deployed
            by different teams
          </ListItem>
          <ListItem>
            When a new build for a microfrontend is deployed, an import map is
            updated in CI, and the production can immediately lazy load the new
            code
          </ListItem>
          <ListItem>
            An advanced architecture suitable for large teams and projects
          </ListItem>
        </UnorderedList>
      </Notes>
    </Slide>

    <Slide>
      <Heading>Any questions?</Heading>
      <FlexBox>
        <Text>Kit Randel - kit@stacklet.io</Text>
      </FlexBox>
    </Slide>
  </Deck>
);

ReactDOM.render(<Presentation />, document.getElementById("root"));
