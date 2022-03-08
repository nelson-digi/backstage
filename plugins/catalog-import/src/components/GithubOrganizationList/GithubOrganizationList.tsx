/*
 * Copyright 2022 The Backstage Authors
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

import React from 'react';
import {
  Card,
  CardActionArea,
  CardContent,
  CardHeader,
  Grid,
  Typography,
} from '@material-ui/core';
import { Progress } from '@backstage/core-components';
import { useGithubOrganizations } from '../../hooks/useGithubOrganizations';

type GithubOrganizationListProps = {
  host: string;
  setOrganization: (organization: string) => void;
};

export const GithubOrganizationList = ({
  host,
  setOrganization,
}: GithubOrganizationListProps) => {
  const { organizations, loading } = useGithubOrganizations({ host });

  if (loading) {
    return <Progress />;
  }

  return (
    <Grid container>
      {organizations.map((org, index) => (
        <Grid item xs={8} key={index}>
          <Card raised>
            <CardActionArea onClick={() => setOrganization(org.login)}>
              <CardHeader
                avatar={
                  <img
                    src={org.avatar_url}
                    alt="avatar"
                    height="20"
                    width="20"
                    style={{ verticalAlign: 'middle' }}
                  />
                }
                title={org.login}
                titleTypographyProps={{ variant: 'h5' }}
              />
              <CardContent>
                <Typography>{org.description}</Typography>
              </CardContent>
            </CardActionArea>
          </Card>
        </Grid>
      ))}
    </Grid>
  );
};
