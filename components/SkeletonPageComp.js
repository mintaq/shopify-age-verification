import React from "react";
import {
  Card,
  TextContainer,
  Layout,
  SkeletonBodyText,
  SkeletonDisplayText,
  SkeletonPage,
} from "@shopify/polaris";

export default class SkeletonPageComp extends React.Component {
  render() {
    return (
      <SkeletonPage primaryAction secondaryActions={1}>
        <Layout>
          <Layout.Section>
            <Card sectioned>
              <SkeletonBodyText />
            </Card>
            <Card sectioned>
              <TextContainer>
                <SkeletonDisplayText size="large" />
                <SkeletonBodyText />
              </TextContainer>
            </Card>
            <Card sectioned>
              <TextContainer>
                <SkeletonDisplayText size="large" />
                <SkeletonBodyText />
              </TextContainer>
            </Card>
            <Card sectioned>
              <TextContainer>
                <SkeletonDisplayText size="large" />
                <SkeletonBodyText />
              </TextContainer>
            </Card>
            <Card sectioned>
              <TextContainer>
                <SkeletonDisplayText size="large" />
                <SkeletonBodyText />
              </TextContainer>
            </Card>
          </Layout.Section>
        </Layout>
      </SkeletonPage>
    );
  }
}
