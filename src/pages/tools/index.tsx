import React from 'react';
import Layout from '@theme/Layout';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import HomepageFeatures from '../../components/HomepageFeatures';
import Link from '@docusaurus/Link';


export default function Home(): JSX.Element {
  const {siteConfig} = useDocusaurusContext();
  return (
    <Layout>
      <main>
        <ul>
            <li>
              <Link to="/tool/CityCode">城市Code查询</Link>
            </li>
        </ul>
      </main>
    </Layout>
  );
}
