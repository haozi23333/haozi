/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
import React from 'react';
import {TagCloud} from 'react-tagcloud'
import './Tags.css'
import Link from "@docusaurus/core/lib/client/exports/Link";

function TagsListByLetter({tags}) {
    const data = tags.map(v => {
        return {
            value: v.name,
            count: v.count,
            to: v.slug
        }
    })
    return (
        <TagCloud
            minSize={24}
            maxSize={128}
            options={{
                hue: 'blue',
            }}
            tags={data}
            renderer={(tag, size, color) => {
                return (
                    <>
                        <Link to={tag.to}>
                              <span
                                  key={tag.value}
                                  style={{
                                      animation: 'blinker 3s linear infinite',
                                      animationDelay: `${Math.random() * 2}s`,
                                      fontSize: size,
                                      margin: '3px',
                                      padding: '3px',
                                      display: 'inline-block',
                                      color: color,
                                  }}
                              >
                                  {tag.value}
                                  <sup style={{ color: color, fontSize: size / 1.5, top: '-' + size/2 + 'px' }}>{tag.count}</sup>
                              </span>
                        </Link>
                    </>
                )
            }}
        />
    );
}

export default TagsListByLetter;
