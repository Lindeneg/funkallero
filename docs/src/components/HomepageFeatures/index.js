import React from 'react';
import clsx from 'clsx';
import styles from './styles.module.css';

const FeatureList = [
    {
        title: 'Opinionated but flexible',
        Svg: require('@site/static/img/agree.svg').default,
    },
    {
        title: 'Strong type safety',
        Svg: require('@site/static/img/strong.svg').default,
    },
    {
        title: 'Powered by Express',
        Svg: require('@site/static/img/love.svg').default,
    },
];

function Feature({ Svg, title, description }) {
    return (
        <div className={clsx('col col--4')}>
            <div className="text--center">
                <Svg className={styles.featureSvg} role="img" />
            </div>
            <div className="text--center padding-horiz--md">
                <h3>{title}</h3>
                <p>{description}</p>
            </div>
        </div>
    );
}

export default function HomepageFeatures() {
    return (
        <section className={styles.features}>
            <div className="container">
                <div className="row">
                    {FeatureList.map((props, idx) => (
                        <Feature key={idx} {...props} />
                    ))}
                </div>
            </div>
        </section>
    );
}
