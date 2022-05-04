/*
 * Copyright 2021 The Backstage Authors
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

import { Entity } from '@backstage/catalog-model';
import { InputError } from '@backstage/errors';
import lodash from 'lodash';
import { RecursivePartial } from '../../util/RecursivePartial';
import { parseStringsParam } from './common';

function getPathArrayAndValue(input: Entity, field: string) {
  return field.split('.').reduce(
    ([pathArray, inputSubset], pathPart, index, fieldParts) => {
      if (Object.hasOwn(inputSubset, pathPart)) {
        return [pathArray.concat(pathPart), inputSubset[pathPart]];
      } else if (fieldParts[index + 1] !== undefined) {
        fieldParts[index + 1] = `${pathPart}.${fieldParts[index + 1]}`;
        return [pathArray, inputSubset];
      }

      return [pathArray, undefined];
    },
    [[] as string[], input as any],
  );
}

export function parseEntityTransformParams(
  params: Record<string, unknown>,
): ((entity: Entity) => Entity) | undefined {
  const fieldsStrings = parseStringsParam(params.fields, 'fields');
  if (!fieldsStrings) {
    return undefined;
  }

  const fields = fieldsStrings
    .map(s => s.split(','))
    .flat()
    .map(s => s.trim())
    .filter(Boolean);

  if (!fields.length) {
    return undefined;
  }

  if (fields.some(f => f.includes('['))) {
    throw new InputError('invalid fields, array type fields are not supported');
  }

  return input => {
    const output: RecursivePartial<Entity> = {};

    for (const field of fields) {
      const [pathArray, value] = getPathArrayAndValue(input, field);

      if (value !== undefined) {
        lodash.set(output, pathArray, value);
      }
    }

    return output as Entity;
  };
}
