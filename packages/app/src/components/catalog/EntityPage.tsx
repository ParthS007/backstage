/*
 * Copyright 2020 Spotify AB
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
import {
  Router as GitHubActionsRouter,
  isPluginApplicableToEntity as isGitHubActionsAvailable,
} from '@backstage/plugin-github-actions';
import {
  Router as CircleCIRouter,
  isPluginApplicableToEntity as isCircleCIAvailable,
} from '@backstage/plugin-circleci';
import { Router as ApiDocsRouter } from '@backstage/plugin-api-docs';
import { Router as SentryRouter } from '@backstage/plugin-sentry';
import { EmbeddedDocsRouter as DocsRouter } from '@backstage/plugin-techdocs';
import React from 'react';
import {
  AboutCard,
  EntityPageLayout,
  useEntity,
} from '@backstage/plugin-catalog';
import { Entity } from '@backstage/catalog-model';
import { Grid } from '@material-ui/core';
import { WarningPanel } from '@backstage/core';

const CICDSwitcher = ({ entity }: { entity: Entity }) => {
  // This component is just an example of how you can implement your company's logic in entity page.
  // You can for example enforce that all components of type 'service' should use GitHubActions
  switch (true) {
    case isGitHubActionsAvailable(entity):
      return <GitHubActionsRouter entity={entity} />;
    case isCircleCIAvailable(entity):
      return <CircleCIRouter entity={entity} />;
    default:
      return (
        <WarningPanel title="CI/CD switcher:">
          No CI/CD is available for this entity. Check corresponding
          annotations!
        </WarningPanel>
      );
  }
};

const OverviewContent = ({ entity }: { entity: Entity }) => (
  <Grid container spacing={3}>
    <Grid item>
      <AboutCard entity={entity} />
    </Grid>
  </Grid>
);

const ServiceEntityPage = ({ entity }: { entity: Entity }) => (
  <EntityPageLayout>
    <EntityPageLayout.Content
      path="/"
      title="Overview"
      element={<OverviewContent entity={entity} />}
    />
    <EntityPageLayout.Content
      path="/ci-cd/*"
      title="CI/CD"
      element={<CICDSwitcher entity={entity} />}
    />
    <EntityPageLayout.Content
      path="/sentry"
      title="Sentry"
      element={<SentryRouter entity={entity} />}
    />
    <EntityPageLayout.Content
      path="/api-status"
      title="Status"
      element={<StatusRouter entity={entity} />}
    />
    <EntityPageLayout.Content
      path="/api/*"
      title="API"
      element={<ApiDocsRouter entity={entity} />}
    />
    <EntityPageLayout.Content
      path="/docs/*"
      title="Docs"
      element={<DocsRouter entity={entity} />}
    />
  </EntityPageLayout>
);

const WebsiteEntityPage = ({ entity }: { entity: Entity }) => (
  <EntityPageLayout>
    <EntityPageLayout.Content
      path="/"
      title="Overview"
      element={<OverviewContent entity={entity} />}
    />
    <EntityPageLayout.Content
      path="/ci-cd/*"
      title="CI/CD"
      element={<CICDSwitcher entity={entity} />}
    />
    <EntityPageLayout.Content
      path="/sentry"
      title="Sentry"
      element={<SentryRouter entity={entity} />}
    />
    <EntityPageLayout.Content
      path="/docs/*"
      title="Docs"
      element={<DocsRouter entity={entity} />}
    />
  </EntityPageLayout>
);
const DefaultEntityPage = ({ entity }: { entity: Entity }) => (
  <EntityPageLayout>
    <EntityPageLayout.Content
      path="/*"
      title="Overview"
      element={<OverviewContent entity={entity} />}
    />
    <EntityPageLayout.Content
      path="/docs/*"
      title="Docs"
      element={<DocsRouter entity={entity} />}
    />
  </EntityPageLayout>
);

/*
export function Route({
  element = <Outlet />
}: RouteProps): React.ReactElement | null {
  return element;
}
*/

export const EntityPage = () => {
  return (
    <Routes>
      <RefRoute
        path="/service"
        routeRef={<ServiceEntityPage entity={entity} />}
      />
      <RefRoute
        path="/website"
        routeRef={<WebsiteEntityPage entity={entity} />}
      />
      <RefRoute
        path="/:derp"
        routeRef={<DefaultEntityPage entity={entity} />}
      />
    </Routes>
  );
  // const { entity } = useEntity();
  // switch (entity?.spec?.type) {
  //   case 'service':
  //     return <ServiceEntityPage entity={entity} />;
  //   case 'website':
  //     return <WebsiteEntityPage entity={entity} />;
  //   default:
  //     return <DefaultEntityPage entity={entity} />;
  // }
};

//AppRouter.tsx
import PluginRouter from 'plugin';

export default (
  <Routes>
    <PluginRouter path="/my-plugin" />
  </Routes>
);
// plugin/router.tsx
export default (
  <Routes>
    <Route></Route>
  </Routes>
);

const RoutesStructure = (
  <>
    <Route />
    <Route />
    <Route>
      <Route />
      <Route>
        <Route />
      </Route>
    </Route>
  </>
);

// App

const routingTable = [
  {
    refs: [componentsRouteRef],
    path: '/components',
  },
  {
    refs: [componentsRouteRef, statusPageRouteRef],
    path: '/status',
  },
  {
    refs: [apiDocsRouteRef],
    path: '/apis',
  },
  {
    refs: [apiDocsRouteRef, statusPageRouteRef],
    path: '/api-status',
  },
];

// Plugins

useLink(catalogRouteRef); // /catalog
useLink(catalogRouteRef, statusPageRouteRef); // /catalog/status
useLink(apiDocsRouteRef); // /apis
useLink(apiDocsRouteRef, statusPageRouteRef); // /apis/api-status